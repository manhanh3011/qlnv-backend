import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { gql } from 'graphql-request';
import { graphQlClient } from 'src/common/graphql/client';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class UsersService {
  async create(dto: CreateEmployeeDto) {
    const mutation = gql`
            mutation CreateUser(input: CreateUserInput!){
                createUser(input: $input){
                    user{
                        id
                        employeeId
                        firstName
                        lastName
                        phone
                        email
                        address
                        gender
                        dateOfBirth
                        level
                        role
                        department
                        startDate
                        status
                    }
                }
            }
        `;

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

    return graphQlClient.request(mutation, variables);
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    const mutation = gql`
      mutation UpdateUser($id: Int!, $patch: UserPatch!) {
        updateUserById(input: { id: $id, userPatch: $patch }) {
          user {
            id
            employeeId
            firstName
            lastName
            phone
            email
            address
            gender
            dateOfBirth
            level
            role
            department
            startDate
            status
          }
        }
      }
    `;

    return graphQlClient.request(mutation, {
      id,
      patch: dto,
    });
  }
}
