import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dropbox } from 'dropbox';

import { AuthService } from '../auth.service';
import { DbxAuth } from '../configs';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit, OnDestroy {
  @Input() path: string;
  storageSpace;
  imgUrl;
  private dbxAuth: DbxAuth;
  private subscription: Subscription;
  private compEntries: Array<any> = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.subscription = this.authService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));

    if (this.dbxAuth.isAuth) {
      // ------ Beginning your code ------
      const dbx = new Dropbox({ accessToken: this.dbxAuth.accessToken });
      const localPath = this.path ? '/' + this.path : '';
      dbx.usersGetSpaceUsage()
        .then(userInfo => {
          console.log(userInfo);
          this.storageSpace = (userInfo.used / 1024 / 1024 / 1024).toFixed(2);
        });

      dbx.filesListFolder({ path: localPath })
        .then(response => {
          this.getEntries(response.entries);
          /* dbx.filesGetThumbnail({ path: response.entries[10].path_display, format: 'jpeg', size: 'w64h64' })
            .then((result) => {
              console.log(result);
              const fileUrl = URL.createObjectURL(result.fileBlob);
              document.getElementById('bild').setAttribute('src', fileUrl);
            }); */
          console.log(response.entries[0]['.tag']);
        })
        .catch(error => {
          console.log(error);
        });
      // ------ End of your code ------
    }
  }

  previewFile(event) {
    console.log(event.target.innerText);
  }
  downloadFile(filepath, filename, event) {
    event.preventDefault();
    const dbx = new Dropbox({ accessToken: this.dbxAuth.accessToken });
    // const loca = filepath;
    dbx.filesDownload({ path: filepath})
      .then((data) => {
        console.log(data);
       // const theblob = new Blob([response.fileBlob], { type: 'application/octet-stream'});
        const fileurl = URL.createObjectURL((<any>data).fileBlob);
        const a = document.createElement('a');
        a.setAttribute('href', fileurl);
        a.setAttribute('download', filename);
        a.click();
        // window.open(url, '_blank');

        // this.fileService.downloadFile(response.link);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getEntries(inEntries: Array<any>) {
    this.compEntries = inEntries;
    console.log('storageComp-get entries outside', this.compEntries);
  }

  isImage(fileName: string) {
    const supportedImages = ['jpg', 'jpeg', 'png', 'tiff', 'tif', 'gif', 'bmp'];
    const fileEnding = fileName.split('.').pop();
    if (supportedImages.some(imgType => imgType === fileEnding)) {
      return true;
    }
  }
  getThumbnail(imagePath) {
    const dbx = new Dropbox({ accessToken: this.dbxAuth.accessToken });
    dbx.filesGetThumbnail({ path: imagePath, format: 'jpeg', size: 'w64h64' })
      .then((result) => {
        console.log(result);
        this.imgUrl = URL.createObjectURL(result.fileBlob);
        // document.getElementById('testbild').setAttribute('src', this.imgUrl);
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
