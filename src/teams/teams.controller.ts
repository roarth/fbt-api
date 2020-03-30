import {
  Body,
  Controller,
  Delete,
  Get, Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query, UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { GetTeamFilterDto } from './dto/get-team-filter.dto';
import { TeamStatusValidationPipe } from './pipes/team-status-validation.pipe';
import { Team } from './team.entity';
import { TeamStatus } from './team-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('teams')
@UseGuards(AuthGuard())
export class TeamsController {

  private logger = new Logger('TeamsController');

  constructor(private teamsService: TeamsService) {}

  /**
   * Get Teams, with or without filter (search & status)
   * @param filterDto
   * @param user
   */
  @Get()
  getTeams(
    @Query(ValidationPipe) filterDto: GetTeamFilterDto,
    @GetUser() user: User
  ): Promise<Team[]> {
    this.logger.verbose(`User "${user.email}" retrieving all Teams. Filters: ${JSON.stringify(filterDto)}`);
    return this.teamsService.getTeams(filterDto, user);
  }

  /**
   * Get a Team by it's id
   * @param id
   * @param user
   */
  @Get('/:id')
  getTeamById(
    @Param('id', new ParseUUIDPipe({version: '4'})) id: string,
    @GetUser() user: User
  ): Promise<Team> {
    return this.teamsService.getTeamById(id, user);
  }

  /**
   * Create a Team
   * @param createTeamDto
   * @param user
   */
  @Post()
  @UsePipes(ValidationPipe)
  createTeam(
    @Body() createTeamDto: CreateTeamDto,
    @GetUser() user: User
  ): Promise<Team> {
    this.logger.verbose(`User "${user.email}" creating a new Team. Data: ${JSON.stringify(createTeamDto)}`);
    return this.teamsService.createTeam(createTeamDto, user);
  }

  /**
   * Update a Team Status
   * @param id
   * @param status
   * @param user
   */
  @Patch('/:id/status')
  updateTeamStatus(
    @Param('id', new ParseUUIDPipe({version: '4'})) id: string,
    @Body('status', TeamStatusValidationPipe) status: TeamStatus,
    @GetUser() user: User
  ): Promise<Team> {
    return this.teamsService.updateTeamStatus(id, status, user);
  }

  /**
   * Delete a Team
   * @param id
   * @param user
   */
  @Delete('/:id')
  deleteTeam(
    @Param('id', new ParseUUIDPipe({version: '4'})) id: string,
    @GetUser() user: User
  ): Promise<void> {
    return this.teamsService.deleteTeam(id, user);
  }
}
