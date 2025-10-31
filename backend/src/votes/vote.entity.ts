import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Bookmark } from '../bookmarks/bookmark.entity';

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Bookmark, (bookmark) => bookmark.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookmark_id' })
  bookmark: Bookmark;

  @Column()
  value: number;
}
