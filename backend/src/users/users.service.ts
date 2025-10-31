import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async create(email: string, password: string): Promise<User> {
    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) {
      this.logger.warn(`Registration failed: Email ${email} already exists`);
      throw new BadRequestException('Email already exists');
    }
    const password_hash = await bcrypt.hash(password, 10);
    return this.usersRepo.save({ email, password_hash });
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: number) {
    return this.usersRepo.findOne({ where: { id } });
  }
}
