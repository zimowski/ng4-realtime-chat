import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {AppRoutingModule} from './app.routing.module';
import {AuthGuard} from './shared/guards/auth.guard';
import {ChatRoutingModule} from './chat/chat.routing.module';
import {ChatModule} from './chat/chat.module';
import {HttpModule} from '@angular/http';
import {AuthService} from "./shared/services/auth.service";
import {SocketService} from "./shared/services/socket.service";
import {AppConfigModule} from "./app.config";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    ChatRoutingModule,
    ChatModule
  ],
  providers: [
    AppConfigModule,
    AuthGuard,
    AuthService,
    SocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
