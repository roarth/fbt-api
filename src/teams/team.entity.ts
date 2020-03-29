import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TeamStatus } from './teams.model';

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

}
