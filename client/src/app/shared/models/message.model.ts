export interface MessageModel {
  _id?: String;
  username: String;
  message: String;
  type: String;
  chatroom?: String;
  date: Date;
}
