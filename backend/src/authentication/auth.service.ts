import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    this.logger.log(`Received registration request for ${email}`);
    const user = await this.usersService.create(email, password);
    this.logger.log(`User created successfully with id=${user.id}`);
    const token = await this.jwtService.signAsync({ sub: user.id, email: user.email });
    return { token };
  }

  async login(email: string, password: string) {
    this.logger.log(`Login attempt for ${email}`);
    console.log('JWT secret:', process.env.JWT_SECRET);
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.warn(`Login failed: User ${email} not found`);
      throw new UnauthorizedException('Invalid email or password');
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      this.logger.warn(`Login failed: Invalid password for ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }
    const token = await this.jwtService.signAsync({ sub: user.id, email: user.email });
    this.logger.log(`Login successful for ${email}`);
    return { message: 'Login successful', access_token: token };
  }
}
