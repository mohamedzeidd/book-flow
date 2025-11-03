import { IsBoolean, IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';
import { roomTypes } from '../entities/room.entity';

export class CreateRoomDto {
  @IsEnum(roomTypes, {
    message: 'type should be: single , double , suite',
  })
  type: roomTypes;

  @IsString()
  description: string;

  @IsNumber()
  pricePerNight: number;

  @IsBoolean()
  available: boolean;
}
