import { GameInterface } from 'interfaces/game';
import { GetQueryInterface } from 'interfaces';

export interface CarInterface {
  id?: string;
  position: string;
  game_id?: string;
  created_at?: any;
  updated_at?: any;

  game?: GameInterface;
  _count?: {};
}

export interface CarGetQueryInterface extends GetQueryInterface {
  id?: string;
  position?: string;
  game_id?: string;
}
