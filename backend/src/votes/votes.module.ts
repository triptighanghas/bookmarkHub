import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './vote.entity';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { UsersModule } from '../users/user.module';
import { BookmarksModule } from '../bookmarks/bookmarks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote]),
    UsersModule,
    BookmarksModule,
  ],
  providers: [VotesService],
  controllers: [VotesController],
})
export class VotesModule {}
