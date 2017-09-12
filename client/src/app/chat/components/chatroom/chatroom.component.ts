import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../shared/services/auth.service';
import {SocketService} from '../../../shared/services/socket.service';
import {UserModel} from '../../../shared/models/user.model';
import {MdDialog, MdSidenav, MdSnackBar} from '@angular/material';
import {DialogUploadImageComponent} from '../../../shared/components/dialog-upload-image/dialog-upload-image.component';
import {isNull} from 'util';
import {RoomModel} from '../../../shared/models/room.model';
import {RoomMessageModel} from '../../../shared/models/room-message.model';
import {RoomUserModel} from '../../../shared/models/room-user.model';
import {MessageModel} from '../../../shared/models/message.model';
import {AppConfigModule} from '../../../app.config';
import {SocketReceiveModel} from '../../../shared/models/socket-receive.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav') sidenav: MdSidenav;
  public user: UserModel;
  public rooms: RoomModel[] = [];
  public roomList: RoomModel[] = [];
  public selectedRoom: RoomModel;
  public roomMessages: RoomMessageModel[] = [];
  public roomUsers: RoomUserModel[] = [];
  public showChatroomsList: boolean;
  private isAlive = true;


  // Show/hide navigation on window resize
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.sideNavChangeBechavior(event.target.innerWidth > 500);
  }

  constructor(private authService: AuthService,
              private socketService: SocketService,
              private dialog: MdDialog,
              private snackBar: MdSnackBar,
              private appConfig: AppConfigModule) {
    // User data
    this.user = this.authService.tokenPayload();
  }

  public ngOnInit(): void {
    // Join to room 'Global'
    this.joinToRoom(this.appConfig.defaultChatroom);

    // Watching for requests
    this.socketService
      .roomListener()
      .takeWhile(() => this.isAlive)
      .subscribe((response: SocketReceiveModel) => {
        // List active rooms
        if (response.type === 'list') {
          this.rooms = response.data;
        }

        // Join to room
        if (response.type === 'subscribe') {
          this.roomList.push(response.data);
          this.selectedRoom = response.data;
        }

        // Fill chat on user connect to room
        if (response.type === 'fillChat') {
          this.roomMessages[response.room] = response.data;
        }

        // New message
        // Add do room messages
        if (response.type === 'message') {
          this.roomMessages[response.room].push(<MessageModel>response.data);
        }

        // User join to chat
        // Add to room users list
        if (response.type === 'join') {
          if (!this.roomUsers[response.room]) {
            this.roomUsers[response.room] = [];
          }
          this.roomUsers[response.room].push(response.data);
          this.roomUsers[response.room].sort(
            function(a, b) {
              const first = a.username.toLowerCase();
              const second = b.username.toLowerCase();
              return first < second ? -1 : first > second ? 1 : 0;
            }
          );
        }

        // User left from chat
        // Delete from room users list
        if (response.type === 'leave') {
          this.roomUsers[response.room] = this.roomUsers[response.room].filter(
            (item) => item.uuid !== response.data.uuid
          );
        }
      });
  }

  public ngOnDestroy(): void {
    // Unsubscribe observables
    this.isAlive = false;
  }

  public ngAfterViewInit() {
    // Change bechavior navigation on start
    if (window.innerWidth < 500) {
      this.sideNavChangeBechavior(false);
    }
  }

  // Change bechavior navigation (users list)
  // On small device - slide
  // Bigger width than 500px - Static navigation
  private sideNavChangeBechavior(opened: boolean): void {
    if (!opened) {
      this.sidenav.mode = 'push';
      this.sidenav.close();
    } else {
      this.sidenav.mode = 'side';
      this.sidenav.open();
    }
  }

  // Logoff
  public signout(): void {
    this.authService.signout();
  }

  // Send message to room users
  public sendMessage(message: String): void {
    this.socketService
      .emitter('room', {
        type: 'message',
        room: this.selectedRoom.key,
        data: message
      });
  }

  // Change profile photo dialog
  public changeProfileImageDialogOpen(): void {
    const dialogRef = this.dialog.open(DialogUploadImageComponent, {
      data: { profile: this.user }
    });

    dialogRef.afterClosed()
      .takeWhile(() => this.isAlive)
      .subscribe(result => {
        const res = JSON.parse(result);
        if (result && res.status) {
          this.snackBar.open('Image changed succesfully', null, {
            duration: 2000
          });
        } else if (!isNull(result)) {
          this.snackBar.open(res.response || 'Upload image error', null, {
            duration: 2000
          });
        }
      });
  }

  // Join to room
  public joinToRoom(data: RoomModel): void {
    // Subscribe room
    this.socketService.emitter('room', {
      type: 'subscribe',
      room: data.key
    });
    // Request to get last 100 messages in joined room
    this.socketService.emitter('room', {
      type: 'fill',
      room: data.key
    });
    this.setRoom(data);
  }

  // Left from room
  public leftFromRoom(data: RoomModel): void {
    if (this.selectedRoom.key === data.key) {
      this.setRoom(this.appConfig.defaultChatroom);
    }

    this.roomList = this.roomList.filter(
      (room: RoomModel) => room.key !== data.key
    );

    this.socketService.emitter('room', {
      type: 'leave',
      room: data.key
    });
  }

  // Set room
  public setRoom(data: RoomModel): void {
    this.selectedRoom = data;
    this.appConfig.setTitle(`Room ${data.name}`);
  }
}
