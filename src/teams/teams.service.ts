import { Injectable, NotFoundException } from '@nestjs/common';
import { Team, TeamStatus } from './teams.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTeamDto } from './dto/create-team.dto';
import { GetTeamFilterDto } from './dto/get-team-filter.dto';

@Injectable()
export class TeamsService {

  private teams = [];

  getAllTeams(): Team[] {
    return this.teams;
  }

  getTeamsWithFilters(filterDto: GetTeamFilterDto): Team[] {
    const { status, search } = filterDto;

    let teams = this.getAllTeams();

    if(status) {
      teams = teams.filter(team => team.status === status);
    }

    if(search) {
      teams = teams.filter(team =>
        team.name.includes(search) ||
        team.description.includes(search),
      );
    }

    return teams;
  }

  getTeamById(id: string): Team {
    const found =  this.teams.find(team => team.id === id);

    if(!found) {
      throw new NotFoundException(`Task with id ${id} does not exists`);
    }

    return found;
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

  updateTeamStatus(id: string, status: TeamStatus): Team {
    const team = this.getTeamById(id);
    team.status = status;
    return team;
  }

  deleteTeam(id: string): void {
    const found = this.getTeamById(id);
    this.teams = this.teams.filter(team => team.id !== found.id);
  }
}
