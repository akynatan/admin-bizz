import { City } from './City';
import { UserSupervisor } from './UserSupervisor';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  user_id_rd: string;
  role: 'admin' | 'seller' | 'supervisor' | 'manager';
  city_id: string;
  city: City;
  manager_id: string;
  manager: User;
  avatar: string;
  supervisors: UserSupervisor[];
  created_at: Date;
  updated_at: Date;
}
