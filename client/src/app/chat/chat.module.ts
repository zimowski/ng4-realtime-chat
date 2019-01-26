import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import {ChatRoutingModule} from './chat.routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChatroomComponent} from './components/chatroom/chatroom.component';
import {SharedModule} from '../shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule, MatChipsModule, MatDialogModule, MatGridListModule, MatInputModule, MatListModule,
  MatMenuModule, MatProgressBarModule,
  MatSelectModule,
  MatSidenavModule, MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {DialogUploadImageComponent} from '../shared/components/dialog-upload-image/dialog-upload-image.component';
import { SignupComponent } from './components/signup/signup.component';
import { ChatroomListComponent } from './components/chatroom-list/chatroom-list.component';
import { ChatroomMessagesComponent } from './components/chatroom-messages/chatroom-messages.component';
import { ChatroomRoomListComponent } from './components/chatroom-room-list/chatroom-room-list.component';

@NgModule({
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BrowserAnimationsModule,
    // Angular material
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
    MatCardModule,
    MatTabsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatChipsModule,
    MatSelectModule,
    MatProgressBarModule
  ],
  exports: [
    ChatRoutingModule
  ],
  entryComponents: [DialogUploadImageComponent],
  declarations: [LoginComponent, ChatroomComponent, SignupComponent, ChatroomListComponent, ChatroomMessagesComponent, ChatroomRoomListComponent]
})
export class ChatModule { }
