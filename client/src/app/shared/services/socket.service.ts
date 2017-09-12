import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SocketReceiveModel} from '../models/socket-receive.model';
import {SocketEmitterModel} from '../models/socket-emitter.model';
import {AppConfigModule} from '../../app.config';

@Injectable()
export class SocketService {
  private apiUrl: String;
  private token: String;
  private socket: any;
  public connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private appConfig: AppConfigModule) {
    this.apiUrl = this.appConfig.apiUrl;
  }

  public isConnected(): Observable<boolean> {
      return this.connected;
  }

  public connect(token: String): void {
    if (!this.socket) {
      this.token = token;
      this.socket = io.connect(this.apiUrl, {
        query: {
          token: this.token
        }
      });
      this.socket.on('connect', () => this.connected.next(true));
      this.socket.on('disconnect', () => this.connected.next(false));
    }
  }

  public onConnect(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('connect', (response) => {
        console.log(response);
        observer.next(response);
      });
    });
  }

  public disconnect(): void {
    this.socket.disconnect();
    this.socket = null;
  }

  public onDisconnect(): Observable<String> {
    return new Observable(observer => {
      this.socket.on('disconnect', (response) => {
        observer.next(response);
      });
    });
  }

  public roomListener(): Observable<SocketReceiveModel> {
    return new Observable(observer => {
      this.socket.on('room', (data: SocketReceiveModel) => {
        observer.next(data);
      });
      return () => {
        this.socket.off(event);
      };
    });
  }

  public emitter(key, value: SocketEmitterModel): void {
    this.socket.emit(key, value);
  }
}
