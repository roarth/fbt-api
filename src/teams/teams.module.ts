import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamRepository } from './team.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamRepository]),
  ],
  controllers: [TeamsController],
  providers: [TeamsService]
})
export class TeamsModule {}
