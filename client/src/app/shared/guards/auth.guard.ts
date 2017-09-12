import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {SocketService} from '../services/socket.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private socketService: SocketService,
              private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.socketService
        .isConnected()
        .map(
          (response) => {
            if (!response) {
              this.router.navigate(['/']);
            }
            return response;
          }
        );
  }
}
