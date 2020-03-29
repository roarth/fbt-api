import { Injectable } from '@nestjs/common';
import { Team, TeamStatus } from './teams.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamsService {

  private teams = [];

  getAllTeams(): Team[] {
    return this.teams;
  }

  getTeamById(id: string): Team {
    return this.teams.find(team => team.id === id)
  }

  createTeam(createTeamDto: CreateTeamDto): Team {
    const { name, description } = createTeamDto;

    const team: Team = {
      id: uuidv4(),
      name,
      description,
      status: TeamStatus.OPENED
    };

    this.teams.push(team);
    return team;
  }
}
