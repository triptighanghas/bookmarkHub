import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateBookmarkDto } from '../dto/create-bookmark.dto';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private service: BookmarksService) {}

  @Get()
  async getAll(@Req() req) {
    const userId = req.user?.sub || null;
    return this.service.findAllWithVotes(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateBookmarkDto, @Req() req) {
    return this.service.create(body.title, body.url, req.user.sub);
  }
}
