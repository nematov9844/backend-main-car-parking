import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ParkingGateway {
  @WebSocketServer()
  server: Server;

  sendUpdate(parkingId: string, bSpots: number, cSpots: number) {
    this.server.emit(`parking_update:${parkingId}`, { bSpots, cSpots });
  }
}
