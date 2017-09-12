import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {PageNotFoundComponent} from '../shared/components/page-not-found/page-not-found.component';
import {AuthGuard} from '../shared/guards/auth.guard';
import {ChatroomComponent} from './components/chatroom/chatroom.component';

const chatRoutes: Route[] = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'chatroom', component: ChatroomComponent, canActivate: [AuthGuard] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(chatRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ChatRoutingModule {}
