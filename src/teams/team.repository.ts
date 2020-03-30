import { EntityRepository, Repository } from 'typeorm';
import { Team } from './team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamStatus } from './team-status.enum';
import { GetTeamFilterDto } from './dto/get-team-filter.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {

  private logger = new Logger('TeamRepository');

  /**
   * Get All Team with or without filter
   * @param filterDto
   * @param user
   */
  async getTeams(
    filterDto: GetTeamFilterDto,
    user: User
  ): Promise<Team[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('team');

    query.where('team.leaderId = :leaderId', { leaderId: user.id });

    if(status) {
      query.andWhere('team.status = :status', { status})
    }

    if(search) {
      query.andWhere('(team.name LIKE :search OR team.description LIKE :search)', { search: `%${search}%`})
    }

    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(`Failed to get Teams for user "${user.email}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Create a Team
   * @param createTeamDto
   * @param user
   */
  async createTeam(
    createTeamDto: CreateTeamDto,
    user: User
  ): Promise<Team> {
    const { name, description } = createTeamDto;

    const team = new Team();
    team.name = name;
    team.description = description;
    team.status = TeamStatus.OPENED;
    team.leader = user;

    try {
      await team.save();
    } catch (error) {
      this.logger.error(`Failed to create a Team for user "${user.email}". Data: ${JSON.stringify(createTeamDto)}`, error.stack);
      throw new InternalServerErrorException();
    }

    delete team.leader;

    return team;
  }
}
