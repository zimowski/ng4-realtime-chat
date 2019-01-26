import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../shared/services/auth.service';
import {SocketService} from '../../../shared/services/socket.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/takeWhile';
import {AppConfigModule} from '../../../app.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public username: String = '';
  public password: String = '';
  private isAlive = true;

  constructor(private authService: AuthService,
              private socketService: SocketService,
              private router: Router,
              private snackBar: MatSnackBar,
              private appConfig: AppConfigModule) { }

  // Unsubscribe observables
  public ngOnDestroy(): void {
    this.isAlive = false;
  }

  // Set page title
  public ngOnInit(): void {
    this.appConfig.setTitle('Login');
  }

  // When user succesfully signup - authentication
  public loginAfterSignup(event: any): void {
    this.username = event.username;
    this.password = event.password;
    this.submit();
  }

  // User try authentication
  // If success - socket connect to server
  public submit(): void {
    this.authService
      .authenticate(this.username, this.password)
      .takeWhile(() => this.isAlive)
      .subscribe(
        (response) => {
          if (response.status) {
            this.socketService.connect(response.token);
            this.socketService.isConnected().subscribe((connectionStatus) => {
              if (connectionStatus) {
                sessionStorage.setItem('token', response.token);
                this.router.navigate(['/chatroom']);
              }
            });
          } else {
            this.snackBar.open(response.response || 'Authenticate error', null, {
              duration: 2000
            });
          }
        },
        (error) => {
          this.snackBar.open(error || 'Authenticate error', null, {
            duration: 2000
          });
        });
  }
}
