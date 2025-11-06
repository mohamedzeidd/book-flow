import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { AuthenticationGuard } from 'src/global/logged-user/authentication.guard';

@Controller('/api/v1/hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthenticationGuard)
  create(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelsService.create(createHotelDto);
  }

  @Get()
  findAll() {
    return this.hotelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.hotelsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateHotelDto: UpdateHotelDto,
  ) {
    return this.hotelsService.update(id, updateHotelDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.hotelsService.remove(id);
  }
}
