import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { graphQlClient } from 'src/common/graphql/client';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {
  mutationCreateUser,
  mutationCreateUsersImportRaw,
  mutationDeleteUser,
  mutationUpdateUser,
} from 'src/graphql/user.mutation';
import { queryGetUserById, queryGetUsers, queryGetUsersPaging } from 'src/graphql/user.query';
import * as XLSX from 'xlsx';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  async getAll() {
    return graphQlClient.request(queryGetUsers);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const result = await graphQlClient.request(
      queryGetUsersPaging,
      {
        first: limit, offset
      }
    );

    return {
      data: result.allUsers.nodes,
      pagination: {
        page,
        limit,
        total: result.allUsers.totalCount,
        totalPages: Math.ceil(result.allUsers.totalCount / limit),
      }
    };
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

    try {
      return await graphQlClient.request(mutationCreateUser, variables);
    } catch (error) {
      this.handleGraphQlError(error);
    }
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    try {
      return await graphQlClient.request(mutationUpdateUser, {
        id,
        patch: dto,
      });
    } catch (error) {
      this.handleGraphQlError(error);
    }
  }

  async delete(id: number) {
    return graphQlClient.request(mutationDeleteUser, { id });
  }

  async importUsers(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('EMPTY_EXCEL_FILE');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      throw new BadRequestException('EMPTY_EXCEL_FILE');
    }

    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: null });

    if (!rows.length) {
      throw new BadRequestException('NO_ROWS_FOUND');
    }

    const importBatchId = randomUUID();

    for (let i = 0; i < rows.length; i += 50){
      const chunk = rows.slice(i, i + 50);

      await Promise.all(
        chunk.map((row, index) =>
          this.createUsersImportRaw({
            importBatchId,
            rowNumber: i + index + 2,
            rawData: row,
          }),
        ),
      );
    }

    return {
      message: 'IMPORT_FILE_UPLOADED',
      importBatchId,
      totalRows: rows.length,
    }
  }

  private createUsersImportRaw(payload: {
    importBatchId: string;
    rowNumber: number;
    rawData: Record<string, unknown>;
  }) {
    return graphQlClient.request(mutationCreateUsersImportRaw, {
      input: {
        usersImportRaw: {
          importBatchId: payload.importBatchId,
          rowNumber: payload.rowNumber,
          rawData: payload.rawData,
          status: 'PENDING',
        },
      },
    });
  }
  
  private handleGraphQlError(error: unknown): never {
    const message = error instanceof Error ? error.message : String(error);
    const normalizedMessage = message.toLowerCase();

    const isDuplicateError =
      normalizedMessage.includes('key') ||
      normalizedMessage.includes('unique') ||
      normalizedMessage.includes('duplicate') ||
      normalizedMessage.includes('already exists') ||
      normalizedMessage.includes('constraint');

    if (
      (normalizedMessage.includes('employeeid') ||
        normalizedMessage.includes('employee_id') ||
        normalizedMessage.includes('employee id') ||
        normalizedMessage.includes('employee')) &&
      isDuplicateError
    ) {
      throw new ConflictException('EMPLOYEE_ID_EXISTS');
    }

    if (normalizedMessage.includes('email') && isDuplicateError) {
      throw new ConflictException('EMAIL_EXISTS');
    }
    throw error;
  }
}
