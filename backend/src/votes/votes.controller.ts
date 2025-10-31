import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { VotesService } from './votes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { VoteDto } from 'src/dto/vote.dto';

@Controller('votes')
@UseGuards(JwtAuthGuard)
export class VotesController {
  constructor(private service: VotesService) {}

  @Post()
  async vote(@Body() body: VoteDto, @Req() req) {
    return this.service.vote(req.user.sub, body.bookmarkId, body.value);
  }
}
