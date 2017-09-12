import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent {
  @Output() onSend: EventEmitter<String> = new EventEmitter<String>();
  public message: String;

  public sendMessage(): void {
    this.onSend.emit(this.message);
    this.message = '';
  }
}
