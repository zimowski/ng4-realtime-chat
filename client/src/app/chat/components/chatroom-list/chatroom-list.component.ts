import {Component, Input} from '@angular/core';
import {RoomModel} from '../../../shared/models/room.model';
import {UserModel} from '../../../shared/models/user.model';
import {AppConfigModule} from '../../../app.config';
import {AuthService} from '../../../shared/services/auth.service';
import {flyInOutAnimation} from '../../../shared/animations/basic.animations';

@Component({
  selector: 'app-chatroom-list',
  templateUrl: './chatroom-list.component.html',
  styleUrls: ['./chatroom-list.component.scss'],
  animations: [flyInOutAnimation]
})
export class ChatroomListComponent {
  @Input() list: UserModel[] = [];
  public user: UserModel;
  public apiUrl: String;

  constructor(private appConfig: AppConfigModule,
              private authService: AuthService) {
    this.apiUrl = this.appConfig.apiUrl;
    this.user = this.authService.tokenPayload();
  }
}
