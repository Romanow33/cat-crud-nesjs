import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Role } from '../common/enums/role.enum';
import { AuthDecorator } from '../auth/decorators/auth.decorators';
import { ActiveUserInterface } from '../common/interfaces/userActive.interfaces';
import { ActiveUser } from 'src/common/decorators/activeUser.decorator';

@AuthDecorator(Role.USER)
@Controller('cats')

export class CatsController {
  constructor(private readonly catsService: CatsService) { }

  @Post()
  create(@Body() createCatDto: CreateCatDto, @ActiveUser() user: ActiveUserInterface) {
    return this.catsService.create(createCatDto, user);
  }

  @Get()
  findAll(@ActiveUser() user: ActiveUserInterface) {
    return this.catsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @ActiveUser() user: ActiveUserInterface) {
    return this.catsService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCatDto: UpdateCatDto, @ActiveUser() user: ActiveUserInterface) {
    const newCat = this.catsService.update(id, updateCatDto, user);
    return newCat
  }

  @Delete(':id')
  remove(@Param('id') id: number, @ActiveUser() user: ActiveUserInterface) {
    return this.catsService.remove(id, user);
  }
}