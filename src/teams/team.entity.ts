import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TeamStatus } from './team-status.enum';
import { User } from '../auth/user.entity';

@Entity()
export class Team extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  status: TeamStatus;

  @ManyToOne(type => User, user => user.teams, { eager: false } )
  leader: User;

  @Column()
  leaderId: string;

}
