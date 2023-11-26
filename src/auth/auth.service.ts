import { Injectable, UnauthorizedException } from '@nestjs/common';
import { signInDTO } from './dto/sign-in.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/shared/config/prisma';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}
  public async validateUser({ email, password }: signInDTO) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user || !bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      isValidate: user.isValidated,
      isOng: user.isOng,
    };
    return {
      access_token: await this.jwt.signAsync(payload),
      user: payload,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${updateAuthDto} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
