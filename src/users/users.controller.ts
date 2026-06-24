import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // @Get()
  // getAll() {
  //   return this.userService.getAll();
  // }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.userService.getOne(Number(id));
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.userService.findAll(Number(page), Number(limit));
  }

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    console.log(dto);

    return this.userService.create(dto);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importUsers(
    @UploadedFile()
    file: Express.Multer.File
  ) {
    return this.userService.importUsers(file);
  } 
    
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateEmployeeDto) {
    return this.userService.update(Number(id), dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(Number(id));
  }
}
