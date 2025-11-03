import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { FilterRoomsDto } from "./dto/filter-rooms.dto"

@Controller('api/v1/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post(':hotelId')
  create(
    @Param('hotelId', new ParseUUIDPipe()) hotelId,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    return this.roomsService.create(hotelId, createRoomDto);
  }

  @Get()
  findAll(@Query() filters: FilterRoomsDto) {
    return this.roomsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roomsService.remove(id);
  }
}
