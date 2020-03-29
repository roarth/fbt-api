import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { Team, TeamStatus } from './teams.model';
import { CreateTeamDto } from './dto/create-team.dto';

@Controller('teams')
export class TeamsController {

  constructor(private teamsService: TeamsService) {}

  @Get()
  getAllTeams() {
    return this.teamsService.getAllTeams();
  }

  @Get('/:id')
  getTeamById(@Param('id') id: string): Team {
    return this.teamsService.getTeamById(id);
  }

  @Post()
  createTeam(@Body() createTeamDto: CreateTeamDto): Team {
    return this.teamsService.createTeam(createTeamDto);
  }

  @Patch('/:id/status')
  updateTeamStatus(
    @Param('id') id: string,
    @Body('status') status: TeamStatus
  ): Team {
    return this.teamsService.updateTeamStatus(id, status);
  }

  @Delete('/:id')
  deleteTeam(@Param('id') id: string): void {
    this.teamsService.deleteTeam(id);
  }
}
