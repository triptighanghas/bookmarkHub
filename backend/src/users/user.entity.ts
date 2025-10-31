import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Bookmark } from '../bookmarks/bookmark.entity';
import { Vote } from '../votes/vote.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];
}
