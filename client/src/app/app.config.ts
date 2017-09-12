import {Injectable} from '@angular/core';
import {RoomModel} from './shared/models/room.model';
import {Title} from '@angular/platform-browser';

@Injectable()
export class AppConfigModule {
  public apiUrl: String = 'http://localhost:3000';
  public defaultChatroom: RoomModel = {
    name: 'Global',
    key: 'global'
  };
  public pageTitle: String = 'Chat';

  constructor(private titleService: Title) {}

  public setTitle(title: string, addMainTitle: boolean = true) {
    this.titleService.setTitle(
      (addMainTitle) ? `${title} - ${this.pageTitle}` : title
    );
  }
}
