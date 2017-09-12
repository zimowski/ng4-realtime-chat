import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RoomModel} from '../../../shared/models/room.model';
import {AppConfigModule} from '../../../app.config';
import {isNull} from 'util';
import {flyInOutAnimation} from '../../../shared/animations/basic.animations';

@Component({
  selector: 'app-chatroom-room-list',
  templateUrl: './chatroom-room-list.component.html',
  styleUrls: ['./chatroom-room-list.component.scss'],
  animations: [flyInOutAnimation]
})
export class ChatroomRoomListComponent {
  // List all rooms
  @Input() list: RoomModel[] = [];
  // List of user joined rooms
  @Input() userRooms: RoomModel[] = [];
  @Output() onJoin: EventEmitter<RoomModel> = new EventEmitter<RoomModel>();
  @Output() onLeave: EventEmitter<RoomModel> = new EventEmitter<RoomModel>();
  @Output() onOpen: EventEmitter<RoomModel> = new EventEmitter<RoomModel>();
  // Default room from config
  public defaultChatroom: RoomModel;

  constructor(private appConfig: AppConfigModule) {
    this.defaultChatroom = this.appConfig.defaultChatroom;
  }

  // Check if user in room
  public isJoined(room: RoomModel): boolean {
    return this.userRooms.some((item: RoomModel) => {
      return item.key === room.key;
    });
  }

  // User join to chatroom
  public join(room: RoomModel, event: Event): void {
    if (!isNull(event)) {
      event.stopPropagation();
    }
    this.onJoin.emit(room);
  }

  // User leave from chatroom
  public leave(room: RoomModel, event: Event): void {
    event.stopPropagation();
    this.onLeave.emit(room);
  }

  // User open chatroom
  public open(room: RoomModel): void {
    if (!this.isJoined(room)) {
      this.join(room, null);
    } else {
      this.onOpen.emit(room);
    }
  }
}
