import {
  Body,
  Controller,
  Delete,
  Get,
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

@Controller('teams')
@UseGuards(AuthGuard())
export class TeamsController {

  constructor(private teamsService: TeamsService) {}

  /**
   * Get Teams, with or without filter (search & status)
   * @param filterDto
   */
  @Get()
  getTeams(@Query(ValidationPipe) filterDto: GetTeamFilterDto): Promise<Team[]> {
    return this.teamsService.getTeams(filterDto);
  }

  /**
   * Get a Team by it's id
   * @param id
   */
  @Get('/:id')
  getTeamById(@Param('id', new ParseUUIDPipe({version: '4'})) id: string): Promise<Team> {
    return this.teamsService.getTeamById(id);
  }

  /**
   * Create a Team
   * @param createTeamDto
   */
  @Post()
  @UsePipes(ValidationPipe)
  createTeam(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamsService.createTeam(createTeamDto);
  }

  /**
   * Update a Team Status
   * @param id
   * @param status
   */
  @Patch('/:id/status')
  updateTeamStatus(
    @Param('id', new ParseUUIDPipe({version: '4'})) id: string,
    @Body('status', TeamStatusValidationPipe) status: TeamStatus
  ): Promise<Team> {
    return this.teamsService.updateTeamStatus(id, status);
  }

  /**
   * Delete a Team
   * @param id
   */
  @Delete('/:id')
  deleteTeam(@Param('id', new ParseUUIDPipe({version: '4'})) id: string): Promise<void> {
    return this.teamsService.deleteTeam(id);
  }
}
