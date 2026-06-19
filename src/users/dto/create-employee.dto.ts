import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender, Level, Status } from '../enum/employee.enum';

export class CreateEmployeeDto {
  @IsNotEmpty({ message: 'Mã nhân viên không được để trống' })
  @IsString({ message: 'Mã nhân viên phải là chuỗi' })
  employeeId!: string;

  @IsNotEmpty({ message: 'Họ và tên đệm không được để trống' })
  @IsString({ message: 'Họ và tên đệm phải là chuỗi' })
  firstName!: string;

  @IsNotEmpty({ message: 'Tên không được để trống' })
  @IsString({ message: 'Tên phải là chuỗi' })
  lastName!: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email!: string;

  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  phone!: string;

  @IsNotEmpty({ message: 'Giới tính không được để trống' })
  @IsEnum(Gender, {
    message: 'Giới tính phải là một trong các giá trị: MALE, FEMALE, OTHER',
  })
  gender!: Gender;

  @IsNotEmpty({ message: 'Ngày sinh không được để trống' })
  @Type(() => Date)
  @IsDate({ message: 'Ngày sinh phải là ngày hợp lệ' })
  dateOfBirth!: Date;

  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  address!: string;

  @IsNotEmpty({ message: 'Phòng ban không được để trống' })
  @IsString({ message: 'Phòng ban phải là chuỗi' })
  department!: string;

  @IsNotEmpty({ message: 'Chức vụ không được để trống' })
  @IsString({ message: 'Chức vụ phải là chuỗi' })
  role!: string;

  @IsNotEmpty({ message: 'Cấp bậc không được để trống' })
  @IsEnum(Level, {
    message:
      'Cấp bậc phải là một trong các giá trị: INTERN, FRESHER, JUNIOR, MIDDLE, SENIOR, LEADER, MANAGER',
  })
  level!: Level;

  @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
  @Type(() => Date)
  @IsDate({ message: 'Ngày bắt đầu phải là ngày hợp lệ' })
  startDate!: Date;

  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  @IsEnum(Status, {
    message: 'Trạng thái phải là một trong các giá trị: ACTIVE, INACTIVE',
  })
  status!: Status;
}
