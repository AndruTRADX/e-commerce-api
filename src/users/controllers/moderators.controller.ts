import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ModeratorsService } from '../services/moderators.service';
import { CreateModeratorDto, UpdateModeratorDto } from '../dtos/moderator.dto';

@Controller('moderators')
export class ModeratorsController {
  constructor(private moderatorService: ModeratorsService) {}

  @Get()
  findAll() {
    return this.moderatorService.findAll();
  }
  @Get(':id')
  get(@Param('id') id: string) {
    return this.moderatorService.findById(id);
  }

  @Get(':email/email')
  getEmail(@Param('email') email: string) {
    return this.moderatorService.findByEmail(email);
  }

  @Post()
  create(@Body() payload: CreateModeratorDto) {
    return this.moderatorService.create(payload);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateModeratorDto) {
    return this.moderatorService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moderatorService.remove(id);
  }
}
