import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from './entities/hotel.entity';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelsRepository: Repository<Hotel>,
  ) {}

  async create(createHotelDto: CreateHotelDto) {
    const existingHotel = await this.hotelsRepository.findOne({
      where: { name: createHotelDto.name },
    });

    if (existingHotel)
      throw new BadRequestException('This hotel name already exists');

    const hotel = this.hotelsRepository.create(createHotelDto);

    return this.hotelsRepository.save(hotel);
  }

  findAll() {
    return this.hotelsRepository.find();
  }

  async findOne(id: string) {
    const hotel = await this.hotelsRepository.findOne({ where: { id } });

    if (!hotel) throw new NotFoundException('Hotel not found with that ID');
    return hotel;
  }

  async update(id: string, updateHotelDto: UpdateHotelDto) {
    const hotel = await this.hotelsRepository.findOne({ where: { id } });
    if (!hotel) throw new NotFoundException('Hotel not found with that ID');

    const updatedHotel = this.hotelsRepository.merge(hotel, updateHotelDto);
    return this.hotelsRepository.save(updatedHotel);
  }

  async remove(id: string) {
    const hotel = await this.hotelsRepository.findOne({ where: { id } });

    if (!hotel) throw new NotFoundException('Hotel not found with that ID');

    await this.hotelsRepository.remove(hotel);
  }
}
