import { EntityRepository, Repository } from 'typeorm';
import { Team } from './team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamStatus } from './team-status.enum';
import { GetTeamFilterDto } from './dto/get-team-filter.dto';
import { filter } from 'rxjs/operators';

@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {

  /**
   * Get All Team with or without filter
   * @param filterDto
   */
  async getTeams(filterDto: GetTeamFilterDto): Promise<Team[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('team');

    if(status) {
      query.andWhere('team.status = :status', { status})
    }

    if(search) {
      query.andWhere('(team.name LIKE :search OR team.description LIKE :search)', { search: `%${search}%`})
    }

    const teams = await query.getMany();
    return teams;
  }

  /**
   * Create a Team
   * @param createTeamDto
   */
  async createTeam(createTeamDto: CreateTeamDto): Promise<Team> {
    const { name, description } = createTeamDto;

    const team = new Team();
    team.name = name;
    team.description = description;
    team.status = TeamStatus.OPENED;
    await team.save();

    return team;
  }
}
