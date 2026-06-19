import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }
  
  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.userService.getOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    console.log(dto);
    
    return this.userService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateEmployeeDto) {
    return this.userService.update(Number(id), dto);
  }
}
