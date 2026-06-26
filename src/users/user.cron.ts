import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from './users.service';

@Injectable()
export class UsersCron {
  private readonly logger = new Logger(UsersCron.name);

  constructor(private readonly userService: UsersService) {}

  // @Cron(CronExpression.EVERY_5_MINUTES)
  async handleImportUsers() {
    this.logger.log('Bắt đầu nhập người dùng bằng cron');
    await this.userService.processPendingImportUsers();

    // if (!rows.length) {
    //   this.logger.log('Không có hồ sơ nào đang chờ xử lý.');
    //   return;
    // }

    // this.logger.log(`Đã tìm thấy ${rows.length} bản ghi đang chờ xử lý`);

    // for (const row of rows) {
    //   try {
    //     await this.processRow(row);
    //   } catch (error) {
    //     this.logger.error(`Quá trình xử lí hàng ${row.id} thất bại`, error);
    //   }
    // }
  }

  //Xử lí từng record
  // private async processRow(row: any) {
  //   const errors: string[] = [];

  //   const dto = plainToInstance(CreateEmployeeDto, {
  //     employeeId: row.employeeId,
  //     firstName: row.firstName,
  //     lastName: row.lastName,
  //     email: row.email,
  //     phone: row.phone,
  //     gender: row.gender,
  //     dateOfBirth: row.dateOfBirth,
  //     address: row.address,
  //     department: row.department,
  //     role: row.role,
  //     level: row.level,
  //     startDate: row.startDate,
  //     status: row.status,
  //   });

  //   const dtoErrors = await this.validateImportRow(dto);

  //   errors.push(...dtoErrors);

  //   const duplicateErrors = await this.checkDuplicate(dto);

  //   errors.push(...duplicateErrors);

  //   if (errors.length) {
  //     await this.markImportFailed(row.id, errors);
  //     return;
  //   }
  //   await this.userService.create(dto);
  //   await this.markImportSuccess(row.id);
  // }

  // //validateDTO
  // private async validateImportRow(dto: CreateEmployeeDto): Promise<string[]> {
  //   const errors = await validate(dto);
  //   return errors.flatMap((error) => Object.values(error.constraints ?? {}));
  // }

  // //Check duplicate
  // private async checkDuplicate(dto: CreateEmployeeDto): Promise<string[]> {
  //   const errors: string[] = [];
  //   const employee = await this.userService.isEmployeeIdExits(dto.employeeId);

  //   if (employee) {
  //     errors.push('Mã nhân viên đã tồn tại');
  //   }

  //   const email = await this.userService.isEmailExits(dto.email);

  //   if (email) {
  //     errors.push('Email đã tồn tại');
  //   }
  //   return errors;
  // }

  // //Update Raw khi lỗi
  // private async markImportFailed(id: number, errors: string[]) {
  //   await this.userService.updateImportRawStatus(id, {
  //     isScanned: true,
  //     isValid: false,
  //     errorMessage: errors.join('; '),
  //     processedAt: new Date(),
  //   });
  // }

  // //Update Raw khi thành công
  // private async markImportSuccess(id: number) {
  //   await this.userService.updateImportRawStatus(id, {
  //     isScanned: true,
  //     isValid: true,
  //     errorMessage: null,
  //     processedAt: new Date(),
  //   });
  // }
}
