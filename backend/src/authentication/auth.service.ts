import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const user = await this.usersService.create(email, password);
    const token = await this.jwtService.signAsync({ sub: user.id, email: user.email });
    return { token };
  }

  async login(email: string, password: string) {
    console.log('JWT secret:', process.env.JWT_SECRET);
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new UnauthorizedException('Invalid email or password');
    const token = await this.jwtService.signAsync({ sub: user.id, email: user.email });
    return { token };
  }
}
