import { CarInterface } from 'interfaces/car';
import { CopInterface } from 'interfaces/cop';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface GameInterface {
  id?: string;
  score: number;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  car?: CarInterface[];
  cop?: CopInterface[];
  user?: UserInterface;
  _count?: {
    car?: number;
    cop?: number;
  };
}

export interface GameGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
}
