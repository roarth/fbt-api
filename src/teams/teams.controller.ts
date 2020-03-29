import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { Team, TeamStatus } from './teams.model';
import { CreateTeamDto } from './dto/create-team.dto';
import { GetTeamFilterDto } from './dto/get-team-filter.dto';
import { TeamStatusValidationPipe } from './pipes/team-status-validation.pipe';

@Controller('teams')
export class TeamsController {

  constructor(private teamsService: TeamsService) {}

  @Get()
  getTeams(@Query(ValidationPipe) filterDto: GetTeamFilterDto) {
    if(Object.keys(filterDto).length) {
      return this.teamsService.getTeamsWithFilters(filterDto);
    } else {
      return this.teamsService.getAllTeams();
    }
  }

  @Get('/:id')
  getTeamById(@Param('id') id: string): Team {
    return this.teamsService.getTeamById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTeam(@Body() createTeamDto: CreateTeamDto): Team {
    return this.teamsService.createTeam(createTeamDto);
  }

  @Patch('/:id/status')
  updateTeamStatus(
    @Param('id') id: string,
    @Body('status', TeamStatusValidationPipe) status: TeamStatus
  ): Team {
    return this.teamsService.updateTeamStatus(id, status);
  }

  @Delete('/:id')
  deleteTeam(@Param('id') id: string): void {
    this.teamsService.deleteTeam(id);
  }
}
