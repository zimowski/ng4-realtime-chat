import {UserModel} from './user.model';

export interface RoomUserModel {
  [index: string]: UserModel[];
}
