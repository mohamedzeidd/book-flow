import { Roles } from 'src/global/constants/roles.constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Verification } from './verification.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ type: 'text', nullable: true })
  profileImage: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Roles, nullable: false })
  role: Roles;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  token: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Verification, (verification) => verification.user)
  @JoinColumn()
  verification: Verification;
}
