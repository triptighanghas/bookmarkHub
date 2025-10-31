import { Module, MiddlewareConsumer,  NestModule} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/user.module';
import { AuthModule } from './authentication/auth.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { VotesModule } from './votes/votes.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { User } from './users/user.entity';
import { Bookmark } from './bookmarks/bookmark.entity';
import { Vote } from './votes/vote.entity';
import {ormConfig} from './configs/ormconfig';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(ormConfig),
    UsersModule,
    AuthModule,
    BookmarksModule,
    VotesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
