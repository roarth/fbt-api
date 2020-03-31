import { Test } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { TeamRepository } from './team.repository';
import { GetTeamFilterDto } from './dto/get-team-filter.dto';
import { TeamStatus } from './team-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockUser = { id: 12, email: 'test@test.com' };
const mockTeamRepository = () => ({
  getTeams: jest.fn(),
  findOne: jest.fn(),
  createTeam: jest.fn(),
  delete: jest.fn()
});

describe('TeamsService', () => {
  let teamsService;
  let teamRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: TeamRepository, useFactory: mockTeamRepository },
      ],
    }).compile();

    teamsService = await module.get<TeamsService>(TeamsService);
    teamRepository = await module.get<TeamRepository>(TeamRepository);
  });

  describe('getTeams', () => {
    it('should get all teams from the repository', async () => {
      teamRepository.getTeams.mockResolvedValue('someValue');

      expect(teamRepository.getTeams).not.toHaveBeenCalled();
      const filters: GetTeamFilterDto = { status: TeamStatus.OPENED, search: 'Noux'};
      const result = await teamsService.getTeams(filters, mockUser);
      expect(teamRepository.getTeams).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTeamById', () => {
    it('should calls TeamRepository.findOne() and successfully retrieve and return the team', async () => {
      const mockTeam = { name: 'The Test Team', description: 'The Test Team description' };
      teamRepository.findOne.mockResolvedValue(mockTeam);

      const result = await teamsService.getTeamById(1, mockUser);
      expect(result).toEqual(mockTeam);

      expect(teamRepository.findOne).toHaveBeenCalledWith({ where: {
        id: 1,
        leaderId: mockUser.id
      }})
    });

    it('should throw an error as team is not found', () => {
      teamRepository.findOne.mockResolvedValue(null);
      expect(teamsService.getTeamById(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTeam', () => {
    it('should calls teamRepository.create() and returns the result', async () => {
      teamRepository.createTeam.mockResolvedValue('someTeam');
      expect(teamRepository.createTeam).not.toHaveBeenCalled();

      const createTeamDto = { name: 'Test Team', description: 'The Test Team description'};
      const result = await teamsService.createTeam(createTeamDto, mockUser);
      expect(teamRepository.createTeam).toHaveBeenCalledWith(createTeamDto, mockUser);
      expect(result).toEqual('someTeam');
    });
  });

  describe('deleteTeam', () => {
    it('should calls teamRepository.deleteTeam() to delete a Team', async () => {
      teamRepository.delete.mockResolvedValue({ affected: 1});
      expect(teamRepository.delete).not.toHaveBeenCalled();

      await teamsService.deleteTeam(1, mockUser);
      expect(teamRepository.delete).toHaveBeenCalledWith({ id: 1, leaderId: mockUser.id });
    });

    it('should throw an error as team is not found', () => {
      teamRepository.delete.mockResolvedValue({ affected: 0});
      expect(teamsService.deleteTeam(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTeamStatus', () => {
    it('should update a Team status', async () => {
      const save = jest.fn().mockResolvedValue(true);
      teamsService.getTeamById= jest.fn().mockResolvedValue({
        status: TeamStatus.OPENED,
        save
      });

      expect(teamsService.getTeamById).not.toHaveBeenCalled();
      const result = await teamsService.updateTeamStatus(1, TeamStatus.COMPLETED, mockUser);
      expect(teamsService.getTeamById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TeamStatus.COMPLETED);
    });
  });

});
