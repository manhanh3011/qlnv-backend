import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { graphQlClient } from 'src/common/graphql/client';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {
  mutationCreateUser,
  mutationCreateUsersImportRaw,
  mutationDeleteUser,
  mutationUpdateUser,
  mutationUpdateUsersImportRaw,
} from 'src/graphql/user.mutation';
import {
  queryFindUserByEmail,
  queryFindUserByEmployeeId,
  queryGetUserById,
  queryGetUsers,
  queryGetUsersImportRawHistory,
  queryGetUsersImportRawPending,
  queryGetUsersPaging,
} from 'src/graphql/user.query';
import * as XLSX from 'xlsx';

@Injectable()
export class UsersService {
  async getAll() {
    return graphQlClient.request(queryGetUsers);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const result = await graphQlClient.request(queryGetUsersPaging, {
      first: limit,
      offset,
    });

    return {
      data: result.allUsers.nodes,
      pagination: {
        page,
        limit,
        total: result.allUsers.totalCount,
        totalPages: Math.ceil(result.allUsers.totalCount / limit),
      },
    };
  }

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
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      defval: null,
    });
    console.log(rows[0]);

    if (!rows.length) {
      throw new BadRequestException('NO_ROWS_FOUND');
    }

    for (let i = 0; i < rows.length; i += 50) {
      const chunk = rows.slice(i, i + 50);

      await Promise.all(
        chunk.map((row) =>
          this.createUsersImportRaw({
            employeeId: String(row.employeeId ?? ''),
            firstName: String(row.firstName ?? ''),
            lastName: String(row.lastName ?? ''),
            email: String(row.email ?? ''),
            phone: String(row.phone ?? ''),
            gender: String(row.gender ?? ''),
            dateOfBirth:
              typeof row.dateOfBirth === 'number'
                ? this.excelDateToString(row.dateOfBirth)
                : row.dateOfBirth,

            address: String(row.address ?? ''),
            department: String(row.department ?? ''),
            role: String(row.role ?? ''),
            level: String(row.level ?? ''),
            startDate:
              typeof row.startDate === 'number'
                ? this.excelDateToString(row.startDate)
                : row.startDate,

            status: String(row.status ?? 'ACTIVE'),
            isScanned: false,
            isValid: null,
            errorMessage: null,
            processedAt: null,
          }),
        ),
      );
    }

    return {
      message: 'IMPORT_FILE_UPLOADED',
      totalRows: rows.length,
    };
  }

  async createUsersImportRaw(data) {
    return graphQlClient.request(mutationCreateUsersImportRaw, {
      input: {
        usersImportRaw: data,
      },
    });
  }

  async getPendingImportRows() {
    const result = await graphQlClient.request(queryGetUsersImportRawPending, {
      first: 50,
    });
    return result.allUsersImportRaws.nodes;
  }

  async getImportHistory(page: number = 1, limit: number = 10, status = 'ALL') {
    const offset = (page - 1) * limit;
    const condition  = this.getImportHistoryCondition(status);

    const result = await graphQlClient.request(queryGetUsersImportRawHistory, {
      first: limit,
      offset,
      condition ,
    });

    const total = result.allUsersImportRaws.totalCount;

    return {
      data: result.allUsersImportRaws.nodes,
      summary: {
        total,
        valid: result.validRows.totalCount,
        invalid: result.invalidRows.totalCount,
        pending: result.pendingRows.totalCount,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private getImportHistoryCondition(status: string) {
    if (status === 'VALID') {
      return {
        isValid: true,
      };
    }

    if (status === 'INVALID') {
      return {
        isValid: false,       
      };
    }

    if (status === 'PENDING') {
      return {
        isScanned: false,
      };
    }

    return null;
  }

  async updateImportRawStatus(
    id: number,
    data: {
      isScanned: boolean;
      isValid: boolean;
      errorMessage: string | null;
      processedAt: Date;
    },
  ) {
    return graphQlClient.request(mutationUpdateUsersImportRaw, {
      id, patch: data
    });
  }

  async isEmployeeIdExits(employeeId: string) {
    const result = await graphQlClient.request(queryFindUserByEmployeeId, {
      employeeId
    });
    return result.allUsers.nodes.length > 0;
  }

  async isEmailExits(email: string) {
    const result = await graphQlClient.request(queryFindUserByEmail, {
      email,
    });
    return result.allUsers.nodes.length > 0;
  }

  async createUserFromImportRaw(row) {
    return this.create({
      employeeId: row.employeeId,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      phone: row.phone,
      gender: row.gender,
      dateOfBirth: new Date(row.dateOfBirth),
      address: row.address,
      department: row.department,
      role: row.role,
      level: row.level,
      startDate: new Date(row.startDate),
      status: row.status,
    });
  }
  
  private excelDateToString(excelDate: number): string {
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));

    return date.toISOString().split('T')[0];
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
