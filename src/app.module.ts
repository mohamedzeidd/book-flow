import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgresModule } from './postgres/postgres.module';
import { ConfigModule } from '@nestjs/config';
import { env } from './config/env';
import { HotelsModule } from './hotels/hotels.module';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationMiddleware } from './global/logged-user/authentication.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true, load: [env] }),
    JwtModule.register({
      global: true,
      secret: env().jwt.secret,
    }),
    PostgresModule,
    HotelsModule,
    RoomsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}
