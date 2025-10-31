import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './vote.entity';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { UsersModule } from '../users/user.module';
import { BookmarksModule } from '../bookmarks/bookmarks.module';
import { Bookmark } from 'src/bookmarks/bookmark.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote, Bookmark, User]),
    UsersModule,
    BookmarksModule,
  ],
  providers: [VotesService],
  controllers: [VotesController],
})
export class VotesModule {}
