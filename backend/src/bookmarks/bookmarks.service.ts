import { Injectable, BadRequestException, NotFoundException} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Bookmark } from './bookmark.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark) private repo: Repository<Bookmark>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(title: string, url: string, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (!/^https?:\/\//.test(url)) throw new BadRequestException('Invalid URL');
    const bookmark = this.repo.create({ title, url, user });
    return this.repo.save(bookmark);
  }

  async findAllWithVotes(userId?: number) {
    return this.repo.query(`
      SELECT b.id, b.title, b.url, b.created_at, u.email AS posted_by,
             COALESCE(SUM(v.value), 0) AS vote_count,
             MAX(CASE WHEN v.user_id = $1 THEN v.value ELSE NULL END) AS user_vote
      FROM bookmarks b
      JOIN users u ON b.user_id = u.id
      LEFT JOIN votes v ON v.bookmark_id = b.id
      GROUP BY b.id, u.email
      ORDER BY b.created_at DESC;
    `, [userId || null]);
  }
}
