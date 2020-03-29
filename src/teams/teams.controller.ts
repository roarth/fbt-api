import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { GetTeamFilterDto } from './dto/get-team-filter.dto';
import { TeamStatusValidationPipe } from './pipes/team-status-validation.pipe';
import { Team } from './team.entity';
import { TeamStatus } from './team-status.enum';

@Controller('teams')
export class TeamsController {

  constructor(private teamsService: TeamsService) {}

  @Get()
  getTeams(@Query(ValidationPipe) filterDto: GetTeamFilterDto): Promise<Team[]> {
    return this.teamsService.getTeams(filterDto);
  }

  @Get('/:id')
  getTeamById(@Param('id', new ParseUUIDPipe({version: '4'})) id: string): Promise<Team> {
    return this.teamsService.getTeamById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTeam(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamsService.createTeam(createTeamDto);
  }

  @Patch('/:id/status')
  updateTeamStatus(
    @Param('id', new ParseUUIDPipe({version: '4'})) id: string,
    @Body('status', TeamStatusValidationPipe) status: TeamStatus
  ): Promise<Team> {
    return this.teamsService.updateTeamStatus(id, status);
  }

  @Delete('/:id')
  deleteTeam(@Param('id', new ParseUUIDPipe({version: '4'})) id: string): Promise<void> {
    return this.teamsService.deleteTeam(id);
  }
}
