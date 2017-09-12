import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatroomRoomListComponent } from './chatroom-room-list.component';

describe('ChatroomRoomListComponent', () => {
  let component: ChatroomRoomListComponent;
  let fixture: ComponentFixture<ChatroomRoomListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatroomRoomListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatroomRoomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
