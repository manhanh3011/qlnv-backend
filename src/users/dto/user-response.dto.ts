import { Gender, Level, Status } from '../enum/employee.enum';

export class EmployeeResponseDto {
  id!: number;
  employeeId!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  phone!: string;
  gender!: Gender;
  dateOfBirth!: Date;
  address!: string;
  department!: string;
  role!: string;
  level!: Level;
  startDate!: Date;
  status!: Status;
  createdAt!: Date;
  updatedAt!: Date;
}
