import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto';
import { UpdateParkingSpotDto } from './dto/update-parking-spot.dto';
import { ParkingSpotEntity } from 'src/core/entity/parking-spot.entity';
import { RedisCacheService } from 'src/common/redis/redis.service';
import { ParkingGateway } from '../../common/socket/parking.gateway';
import { FileService } from 'src/common/multer/multer.service';
import { ParikingImageEntity } from 'src/core/entity';

import { CommentsService } from '../comments/comments.service';
import { UserService } from '../users/user.service';
import { UserRoles } from 'src/common/database/Enums';

@Injectable()
export class ParkingSpotService {
  constructor(
    @InjectRepository(ParkingSpotEntity)
    private readonly parkingSpotRepo: Repository<ParkingSpotEntity>,
    @InjectRepository(ParikingImageEntity)
    private readonly parkingImageRepository: Repository<ParikingImageEntity>,
    private readonly redisService: RedisCacheService,
    private readonly parkingGateway: ParkingGateway,
    private readonly fileService: FileService,
    private readonly userService: UserService,
    private readonly commentService: CommentsService
  ) { }

  async create(dto: CreateParkingSpotDto) {
    try {
      const admin = await this.userService.findOneUser(dto.admin_id)

      if (admin.role !== UserRoles.parkingAdmin) {
        throw new BadRequestException('Invalid admin role');
      }
      const parkingSpot = this.parkingSpotRepo.create(dto);
      const createdSpot = await this.parkingSpotRepo.save(parkingSpot);
      return {
        status: 201,
        message: 'Parking spot successfully created',
        data: createdSpot,
      };
    } catch (error) {
      throw new InternalServerErrorException('Parking spot creation failed');
    }
  }

  async findAll() {
    try {
      const spots = await this.parkingSpotRepo.find();
      return {
        status: 200,
        message: 'Parking spots retrieved successfully',
        data: spots,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve parking spots',
      );
    }
  }

  async findOne(id: string) {
    try {
      const spot = await this.parkingSpotRepo.findOne({ where: { id } });
      if (!spot) {
        throw new NotFoundException(`Parking spot not found with ID: ${id}`);
      }
      return spot;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve parking spot');
    }
  }

  async update(id: string, dto: UpdateParkingSpotDto) {
    const spot = await this.findOne(id);
    Object.assign(spot, dto);
    try {
      const updatedSpot = await this.parkingSpotRepo.save(spot);
      return {
        status: 200,
        message: 'Parking spot successfully updated',
        data: updatedSpot,
      };
    } catch (error) {
      throw new InternalServerErrorException('Parking spot update failed');
    }
  }

  async remove(id: string) {
    const spot = await this.findOne(id);
    try {
      await this.parkingSpotRepo.remove(spot);
      return {
        status: 200,
        message: `Parking spot successfully deleted (ID: ${id})`,
        data: { id },
      };
    } catch (error) {
      throw new InternalServerErrorException('Parking spot deletion failed');
    }
  }

  async onModuleInit() {
    await this.loadAllParkingToRedis();
  }

  // ✅ Barcha parking joylarini Redisga yuklash
  async loadAllParkingToRedis() {
    const allParking = await this.parkingSpotRepo.find();
    const parkingData: Record<string, string> = {};

    for (const parking of allParking) {
      parkingData[`parking:${parking.id}:b_available_spots`] = String(
        parking.b_available_spots,
      );
      parkingData[`parking:${parking.id}:c_available_spots`] = String(
        parking.c_available_spots,
      );
    }

    await this.redisService.mset(parkingData);
  }

  // ✅ Admin joylarni yangilaganda Redisni va WebSocket-ni yangilash
  async updateAvailableSpots(
    parkingId: string,
    bSpots: number,
    cSpots: number,
  ) {
    await this.redisService.mset({
      [`parking:${parkingId}:b_available_spots`]: String(bSpots),
      [`parking:${parkingId}:c_available_spots`]: String(cSpots),
    });

    // WebSocket orqali barcha mijozlarga yangilangan ma'lumotni jo‘natish
    this.parkingGateway.sendUpdate(parkingId, bSpots, cSpots);
  }

  // ✅ Bitta parking joyini olish (Redisdan)
  async getAvailableSpots(parkingId: string) {
    const [bSpots, cSpots] = await Promise.all([
      this.redisService.get(`parking:${parkingId}:b_available_spots`),
      this.redisService.get(`parking:${parkingId}:c_available_spots`),
    ]);

    return { parkingId, bSpots: Number(bSpots), cSpots: Number(cSpots) };
  }

  // ✅ Barcha parking joylarini olish (Redisdan)
  async getAllAvailableSpots() {
    const keys = await this.redisService.getAllKeys(
      'parking:*:b_available_spots',
    );
    const parkingData = [];

    for (const key of keys) {
      const parkingId = key.split(':')[1];
      const [bSpots, cSpots] = await Promise.all([
        this.redisService.get(`parking:${parkingId}:b_available_spots`),
        this.redisService.get(`parking:${parkingId}:c_available_spots`),
      ]);

      parkingData.push({
        parkingId,
        bSpots: Number(bSpots),
        cSpots: Number(cSpots),
      });
    }
    return parkingData;
  }

  async getRatingWithParkingId(parkingId: string) {
    const parkingComments = (await this.commentService.findBySpotId(parkingId)).data;

    if (!parkingComments.length) {
      return {
        status: 200,
        message: 'Bu parking joyi uchun izohlar mavjud emas',
        data: [],
        rating: 0
      };
    }

    let rating = 0;
    parkingComments.forEach((element) => {
      rating += element.raiting;
    });

    const averageRating = rating / parkingComments.length;

    return {
      status: 200,
      message: 'Parking joyi reytingi muvaffaqiyatli olindi',
      data: parkingComments,
      rating: averageRating.toFixed(1) // O'rtacha reytingni bir o'nli raqamda qaytaradi
    };
  }


  async getParkingByRadius(longitude: string, latitude: string, radius: number) {
    const long = parseFloat(longitude);
    const lat = parseFloat(latitude);

    const spots = await this.parkingSpotRepo
      .createQueryBuilder('parking_spot_entity') // Entity decoratoridagi nomni ishlating
      .addSelect(`(
          6371 * acos(
            cos(radians(:lat)) * cos(radians(parking_spot_entity.latitude::float)) *
            cos(radians(parking_spot_entity.longitude::float) - radians(:long)) +
            sin(radians(:lat)) * sin(radians(parking_spot_entity.latitude::float))
          )
        )`, 'distance')
      .where(`(
          6371 * acos(
            cos(radians(:lat)) * cos(radians(parking_spot_entity.latitude::float)) *
            cos(radians(parking_spot_entity.longitude::float) - radians(:long)) +
            sin(radians(:lat)) * sin(radians(parking_spot_entity.latitude::float))
          )
        ) < :radius`, { radius })
      .orderBy('distance', 'ASC')
      .setParameters({ lat, long })
      .getRawMany();

    return {
      status: 200,
      message: 'Parking spots retrieved successfully',
      data: spots.map(spot => ({
        ...spot,
        distance: parseFloat(spot.distance).toFixed(2)
      })),
    };
  }

  async upload(file: Express.Multer.File, id: string) {
    try {
      const filePath = await this.fileService.saveFile(file);
      const dto = {
        parking_id: id,
        image: filePath,
      };

      const image = await this.parkingImageRepository.save(dto);
      console.log('qiziq');

      return {
        message: 'Success',
        status: 201,
        data: image,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  async deleteImage(fileName: string) {
    try {
      const filePath = 'static/' + fileName;
      await this.fileService.deleteFile(fileName);
      await this.parkingImageRepository.delete({ image: filePath });
      console.log('nega');

      return {
        message: 'Deleted',
        status: 200,
        data: {},
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }
}
