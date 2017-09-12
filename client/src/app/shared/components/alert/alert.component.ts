import { Component, OnInit } from '@angular/core';
import {SocketService} from '../../services/socket.service';
import {AlertType} from '../../models/alert.enums';
import {AlertModel} from '../../models/alert.model';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  public alerts: AlertModel[] = [];

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.socketService
      .onDisconnect()
      .subscribe(() => {
        this.alerts.push({
          type: AlertType.CONNECTION_ERROR,
          message: 'Connection lost'
        });
      });

    this.socketService
      .onConnect()
      .subscribe(() => {
        this.alerts = this.alerts.filter(
          (alert) => alert.type !== AlertType.CONNECTION_ERROR
        );
      });
  }

}
