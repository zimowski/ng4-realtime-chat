import {MessageModel} from './message.model';

export interface RoomMessageModel {
  [index: string]: MessageModel[];
}
