import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TeamStatus } from '../team-status.enum';

export class TeamStatusValidationPipe implements PipeTransform {

  readonly allowedStatuses = [
    TeamStatus.OPENED,
    TeamStatus.COMPLETED,
  ];

  transform(value: any): any {
    value = value.toUpperCase();
    if(!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is an invalid status`)
    }
    return value;

  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
