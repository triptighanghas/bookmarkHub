import { Controller, Get, Post, Body, UseGuards, Req, Logger } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { CreateBookmarkDto } from '../dto/create-bookmark.dto';

@Controller('bookmarks')
export class BookmarksController {
  private readonly logger = new Logger(BookmarksController.name);
  constructor(private service: BookmarksService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async getAll(@Req() req) {
    this.logger.log(`get bookmarks request received`);
    const userId = req.user?.sub || null;
    this.logger.log(userId ? `Authenticated user ${userId}` : `Anonymous request`);
    
    const bookmarks =  await this.service.findAllWithVotes(userId);
    this.logger.log(`Returned ${bookmarks.length} bookmarks`);
    return bookmarks;

  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateBookmarkDto, @Req() req) {
    this.logger.log(`User ${req.user.email} creating new bookmark: ${body.title}`);
    const bookmark =  await this.service.create(body.title, body.url, req.user.sub);
    this.logger.log(`Bookmark created successfully with id=${bookmark.id}`);
    return { message: 'Bookmark created successfully', bookmark };
  }
}
