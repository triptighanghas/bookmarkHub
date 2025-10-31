import { Controller, Post, Body, UseGuards, Req, Logger } from '@nestjs/common';
import { VotesService } from './votes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { VoteDto } from 'src/dto/vote.dto';

@Controller('votes')
@UseGuards(JwtAuthGuard)
export class VotesController {
  private readonly logger = new Logger(VotesController.name);

  constructor(private service: VotesService) {}

  @Post()
  async vote(@Body() body: VoteDto, @Req() req) {
    this.logger.log(
      `Vote request from userId=${req.user.sub} on bookmarkId=${body.bookmarkId} with value=${body.value}`
    );
    const result = await this.service.vote(req.user.sub, body.bookmarkId, body.value);
    this.logger.log(`Vote action result: ${result.message}`);
    return result;
  }
}
