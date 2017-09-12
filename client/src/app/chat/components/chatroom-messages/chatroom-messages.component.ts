import {Component, Input} from '@angular/core';
import {UserModel} from '../../../shared/models/user.model';
import {AppConfigModule} from '../../../app.config';
import {AuthService} from '../../../shared/services/auth.service';
import {MessageModel} from '../../../shared/models/message.model';
import {flyInOutAnimation} from '../../../shared/animations/basic.animations';

@Component({
  selector: 'app-chatroom-messages',
  templateUrl: './chatroom-messages.component.html',
  styleUrls: ['./chatroom-messages.component.scss'],
  animations: [flyInOutAnimation]
})
export class ChatroomMessagesComponent {
  @Input() list: MessageModel[] = [];
  @Input() users: UserModel[] = [];
  public user: UserModel;
  public apiUrl: String;

  constructor(private appConfig: AppConfigModule,
              private authService: AuthService) {
    this.apiUrl = this.appConfig.apiUrl;
    this.user = this.authService.tokenPayload();
  }

  // Check user status in room
  public isOnline(user: String): boolean {
    if (!this.users) {
      return false;
    }
    return this.users.some((item: UserModel) => {
      return item.username === user;
    });
  }
}
