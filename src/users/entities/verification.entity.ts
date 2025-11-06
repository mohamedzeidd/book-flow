import { VerificationReason } from 'src/global/constants/user.constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'verifications' })
export class Verification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  verificationExpireAt: Date;

  @Column()
  verificationReason: VerificationReason;

  @Column()
  verificationCode: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.verification, { onDelete: 'CASCADE' })
  user: User;
}
