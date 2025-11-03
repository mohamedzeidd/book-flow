import { Hotel } from 'src/hotels/entities/hotel.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum roomTypes {
  SINGLE = 'single',
  DOUBLE = 'double',
  SUITE = 'suite',
}

@Entity({ name: 'rooms' })
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hotelId: string;

  @Column({ type: 'enum', enum: roomTypes, default: roomTypes.SINGLE })
  type: roomTypes;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerNight: number;

  @Column({ default: true })
  available: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;
}
