import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatroomMessagesComponent } from './chatroom-messages.component';

describe('ChatroomMessagesComponent', () => {
  let component: ChatroomMessagesComponent;
  let fixture: ComponentFixture<ChatroomMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatroomMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatroomMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
