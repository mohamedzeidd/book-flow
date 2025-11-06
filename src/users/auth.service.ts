import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Verification } from './entities/verification.entity';
import { RegisterDto } from './dto/register.dto';
import { BcryptService } from 'src/global/bcrypt/bcrypt.service';
import { env } from 'src/config/env';
import { Roles } from 'src/global/constants/roles.constants';
import { VerificationReason } from 'src/global/constants/user.constants';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/global/logged-user/logged-user.interface';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    private readonly bcryptService: BcryptService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) throw new BadRequestException('Email already exists');

    const hashedPassword = await this.bcryptService.hash(registerDto.password);

    const verificationCode = this.generateVerificationCode();
    const verificationExpireAt = new Date(
      Date.now() + env().auth.activationCodeExpireIn * 1000,
    );

    return await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        const user = this.usersRepository.create({
          ...registerDto,
          password: hashedPassword,
          role: Roles.USER,
        });
        const savedUser = await entityManager.save(User, user);

        const verification = this.verificationRepository.create({
          user: savedUser,
          verificationCode,
          verificationExpireAt,
          verificationReason: VerificationReason.EMAIL_VERIFICATION,
        });
        await entityManager.save(Verification, verification);

        const accessToken = await this.generateAccessToken({
          id: savedUser.id,
          role: savedUser.role,
          isActive: savedUser.isActive,
        });

        const refreshToken = await this.generateRefreshToken(savedUser);
        await entityManager.update(User, savedUser.id, { token: refreshToken });

        return {
          accessToken,
          refreshToken,
          profile: await this.usersService.findLoggedUserById(savedUser.id),
          accessTokenExpiresAt: new Date(
            Date.now() + env().jwt.accessExpireIn * 1000,
          ),
          refreshTokenExpiresAt: new Date(
            Date.now() + env().jwt.refreshExpireIn * 1000,
          ),
        };
      },
    );
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) throw new BadRequestException('Invalid credentials');

    const isValidPassword = await this.bcryptService.compare(
      loginDto.password,
      user.password,
    );
    if (!isValidPassword) throw new BadRequestException('Invalid credentials');

    const accessToken = this.generateAccessToken({
      id: user.id,
      role: user.role,
      isActive: user.isActive,
    });
    let refreshToken = user.token;
    if (!refreshToken) refreshToken = await this.generateRefreshToken(user);
    await this.usersRepository.update(user.id, { token: refreshToken });

    return {
      accessToken,
      refreshToken,
      profile: await this.usersService.findLoggedUserById(user.id),
      accessWillExpireIn: new Date(
        Date.now() + env().jwt.accessExpireIn * 1000,
      ),
      refreshWillExpireIn: new Date(
        Date.now() + env().jwt.refreshExpireIn * 1000,
      ),
    };
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async generateAccessToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: env().jwt.accessExpireIn,
    });
  }

  private async generateRefreshToken({ id }: User) {
    return await this.jwtService.signAsync(
      { id },
      { expiresIn: env().jwt.refreshExpireIn },
    );
  }
}
