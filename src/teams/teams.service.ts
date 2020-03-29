import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamRepository } from './team.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { TeamStatus } from './team-status.enum';
import { GetTeamFilterDto } from './dto/get-team-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TeamsService {

  constructor(
    @InjectRepository(TeamRepository)
    private teamRepository: TeamRepository,
  ) {}

  async getTeams(
    filterDto: GetTeamFilterDto,
    user: User
  ): Promise<Team[]> {
    return this.teamRepository.getTeams(filterDto, user);
  }

  async getTeamById(
    id: string,
    user: User
  ): Promise<Team> {
    const found = await this.teamRepository.findOne({ where: { id, leaderId: user.id } });

    if(!found) {
      throw new NotFoundException(`Team with id "${id}" does not exists`);
    }

    return found;
  }

  async createTeam(
    createTeamDto: CreateTeamDto,
    user: User
  ): Promise<Team> {
   return this.teamRepository.createTeam(createTeamDto, user);
  }

  async deleteTeam(
    id: string,
    user: User
  ): Promise<void> {
    const result = await this.teamRepository.delete({ id, leaderId: user.id });

    if(result.affected === 0) {
      throw new NotFoundException(`Team with id "${id}" does not exists`);
    }
  }

  async updateTeamStatus(
    id: string,
    status: TeamStatus,
    user: User
  ): Promise<Team> {
    const team = await this.getTeamById(id, user);
    team.status = status;
    await team.save();

    return team;
  }
}
