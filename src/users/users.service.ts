import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { graphQlClient } from 'src/common/graphql/client';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { mutationCreateUser, mutationUpdateUser } from 'src/graphql/user.mutation';
import { queryGetUserById, queryGetUsers } from 'src/graphql/user.query';

@Injectable()
export class UsersService {
  async getAll() {
    return graphQlClient.request(queryGetUsers)
  };

  async getOne(id: number) {
    return graphQlClient.request(queryGetUserById, { id });
  }

  async create(dto: CreateEmployeeDto) {
    const variables = {
      input: {
        user: {
          employeeId: dto.employeeId,
          firstName: dto.firstName,
          lastName: dto.lastName,
          gender: dto.gender,
          phone: dto.phone,
          email: dto.email,
          address: dto.address,
          dateOfBirth: dto.dateOfBirth,
          level: dto.level,
          role: dto.role,
          department: dto.department,
          startDate: dto.startDate,
          status: dto.status,
        },
      },
    };

    return graphQlClient.request(mutationCreateUser, variables);
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    return graphQlClient.request(mutationUpdateUser, {
      id,
      patch: dto,
    });
  }
}
