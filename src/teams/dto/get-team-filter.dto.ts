import { TeamStatus } from '../team-status.enum';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class GetTeamFilterDto {

  @IsOptional()
  @IsIn([TeamStatus.COMPLETED, TeamStatus.OPENED])
  status: TeamStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
