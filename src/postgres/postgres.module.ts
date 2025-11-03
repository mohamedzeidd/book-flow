import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { env } from 'src/config/env';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env().postgres.host,
      port: env().postgres.port,
      username: env().postgres.username,
      password: env().postgres.password,
      database: env().postgres.database,
      entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
      synchronize: env().environment === 'development' ? true : false,
    }),
  ],
})
export class PostgresModule {}
