import { Injectable } from '@nestjs/common';
import { env } from 'src/config/env';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly saltRounds = 10;
  private pepper: string;

  constructor() {
    this.pepper = env().bcrypt.pepper || '';
  }

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password + this.pepper, this.saltRounds);
  }

  async compare(plainText: string, hashedPassword: string) {
    return await bcrypt.compare(plainText + this.pepper, hashedPassword);
  }
}
