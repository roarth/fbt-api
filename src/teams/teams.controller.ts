import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { Team } from './teams.model';
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
}
