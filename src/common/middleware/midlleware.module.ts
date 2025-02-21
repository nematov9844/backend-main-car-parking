// import {
//   MiddlewareConsumer,
//   Module,
//   NestModule,
//   RequestMethod,
// } from '@nestjs/common';
// import { GuardService } from './auth.middleware';

// @Module({})
// export class MiddlewareModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(GuardService)
//       .exclude(
//         { path: 'auth/login', method: RequestMethod.POST },
//         { path: 'auth/register', method: RequestMethod.POST },
//       )
//       .forRoutes('*');
//   }
// }
