import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {UserModel} from '../../models/user.model';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'app-dialog-upload-image',
  templateUrl: './dialog-upload-image.component.html',
  styleUrls: ['./dialog-upload-image.component.scss']
})
export class DialogUploadImageComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    url: '//localhost:3000/image-upload',
    itemAlias: 'profileImage',
    headers: [
      {
        name: 'token',
        value: sessionStorage.getItem('token')
      }
    ]
  });

  constructor(public dialogRef: MatDialogRef<DialogUploadImageComponent>,
              @Inject(MAT_DIALOG_DATA) public data: UserModel) {
  }

  public ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.dialogRef.close(response);
    };
  }

  public cancel(): void {
    this.dialogRef.close(null);
  }
}
