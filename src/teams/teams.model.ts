export interface Team {
  id: string;
  name: string;
  description: string;
  status: TeamStatus
}

export enum TeamStatus {
  OPENED = 'OPENED',
  COMPLETED = 'COMPLETED',
}
