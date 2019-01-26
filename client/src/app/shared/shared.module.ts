import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SocketService } from './services/socket.service';
import { AuthService } from './services/auth.service';
import { AlertComponent } from './components/alert/alert.component';
import { MessageFormComponent } from './components/message-form/message-form.component';
import { MatButtonModule, MatDialogModule, MatInputModule, MatToolbarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogUploadImageComponent } from './components/dialog-upload-image/dialog-upload-image.component';
import { FileSelectDirective } from 'ng2-file-upload';
import {flyInOutAnimation} from "./animations/basic.animations";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports: [
    PageNotFoundComponent,
    AlertComponent,
    MessageFormComponent,
    DialogUploadImageComponent
  ],
  declarations: [
    PageNotFoundComponent,
    AlertComponent,
    MessageFormComponent,
    DialogUploadImageComponent,
    FileSelectDirective
  ],
  providers: []
})
export class SharedModule { }
