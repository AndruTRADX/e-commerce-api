import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { MongoIdPipe } from 'src/common/mongo-id.pipe';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Public()
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Public()
  @Get(':id')
  get(@Param('id', MongoIdPipe) id: string) {
    return this.categoriesService.findOneById(id);
  }

  @Public()
  @Get(':name/name')
  getByName(@Param('name') name: string) {
    return this.categoriesService.findOneByName(name);
  }

  @Roles(Role.MODERATOR)
  @Post()
  create(@Body() payload: CreateCategoryDto) {
    return this.categoriesService.create(payload);
  }

  @Roles(Role.MODERATOR)
  @Put(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, payload);
  }

  @Roles(Role.MODERATOR)
  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}
