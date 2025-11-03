import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { FilterRoomsDto } from './dto/filter-rooms.dto';
import { Hotel } from 'src/hotels/entities/hotel.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,

    @InjectRepository(Hotel)
    private readonly hotelsRepository: Repository<Hotel>,
  ) {}
  async create(hotelId: string, createRoomDto: CreateRoomDto) {
    const hotel = await this.hotelsRepository.findOne({
      where: { id: hotelId },
    });
    if (!hotel) throw new NotFoundException('Hotel Not Found With that ID ');
    const room = this.roomsRepository.create({
      ...createRoomDto,
      hotelId,
    });
    return this.roomsRepository.save(room);
  }

  async findAll(filters: FilterRoomsDto) {
    const {
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filters;

    const query = this.roomsRepository.createQueryBuilder('rooms');

    if (minPrice)
      query.andWhere('rooms.pricePerNight >= :minPrice', { minPrice });
    if (maxPrice)
      query.andWhere('rooms.pricePerNight <= :maxPrice', { maxPrice });

    query.orderBy(`rooms.${sortBy}`, sortOrder);

    query.skip((page - 1) * limit).take(limit);

    const [rooms, total] = await query.getManyAndCount();

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: rooms,
    };
  }

  async findOne(id: string) {
    const room = await this.roomsRepository.findOne({
      where: { id },
    });
    if (!room) throw new NotFoundException('Room not found with that ID');
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomsRepository.findOne({ where: { id } });
    if (!room) throw new NotFoundException('Room not found with that ID');

    const updatedRoom = this.roomsRepository.merge(room, updateRoomDto);
    return this.roomsRepository.save(updatedRoom);
  }

  async remove(id: string) {
    const room = await this.findOne(id);
    this.roomsRepository.remove(room);
  }
}
