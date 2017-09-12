import {Injectable, OnDestroy} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {SocketService} from './socket.service';
import {UserModel} from '../models/user.model';
import {AppConfigModule} from '../../app.config';
import 'rxjs/add/operator/takeWhile';

@Injectable()
export class AuthService implements OnDestroy {
  private apiUrl: String;
  private isAlive = true;

  constructor(private http: Http,
              private router: Router,
              private socketService: SocketService,
              private appConfig: AppConfigModule) {
    this.apiUrl = this.appConfig.apiUrl;

    if (sessionStorage.getItem('token')) {
      this.verify(sessionStorage.getItem('token'))
        .takeWhile(() => this.isAlive)
        .subscribe((response: any) => {
          if (response.status) {
            this.socketService.connect(sessionStorage.getItem('token'));
            this.socketService.connected.next(true);
            this.router.navigate(['/chatroom']);
          } else {
            sessionStorage.clear();
          }
        }, () => {
          sessionStorage.clear();
        });
    }
  }

  public ngOnDestroy(): void {
    this.isAlive = false;
  }

  public authenticate(username: String, password: String): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/authenticate`, {
        username: username,
        password: password
      })
      .map((response: any) => response.json());
  }

  public verify(token: String): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/verify`, {
        token: token,
      })
      .map((response: any) => response.json());
  }

  public tokenPayload(): UserModel {
    const token = sessionStorage.getItem('token');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64)).data;
  }

  public signup(data: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/signup`, {
        data: data
      })
      .map((response: any) => response.json());
  }

  public signout(): void {
    sessionStorage.clear();
    this.socketService.disconnect();
    this.router.navigate(['/']);
  }
}
