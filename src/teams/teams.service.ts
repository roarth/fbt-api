import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamRepository } from './team.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { TeamStatus } from './team-status.enum';
import { GetTeamFilterDto } from './dto/get-team-filter.dto';

@Injectable()
export class TeamsService {

  constructor(
    @InjectRepository(TeamRepository)
    private teamRepository: TeamRepository,
  ) {}

  async getTeams(filterDto: GetTeamFilterDto): Promise<Team[]> {
    return this.teamRepository.getTeams(filterDto);
  }

  async getTeamById(id: string): Promise<Team> {
    const found = await this.teamRepository.findOne(id);

    if(!found) {
      throw new NotFoundException(`Team with id ${id} does not exists`);
    }

    return found;
  }

  async createTeam(createTeamDto: CreateTeamDto): Promise<Team> {
   return this.teamRepository.createTeam(createTeamDto);
  }

  async deleteTeam(id: string): Promise<void> {
    const result = await this.teamRepository.delete(id);

    if(result.affected === 0) {
      throw new NotFoundException(`Team with id ${id} does not exists`);
    }
  }

  async updateTeamStatus(id: string, status: TeamStatus): Promise<Team> {
    const team = await this.getTeamById(id);
    team.status = status;
    await team.save();

    return team;
  }
}
