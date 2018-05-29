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

      dbx.filesListFolder({ path: localPath })
        .then(response => {
          this.getEntries(response.entries);
          console.log(response.entries[0]['.tag']);
        })
        .catch(error => {
          console.log(error);
        });
      // ------ End of your code ------
    }
  }
  downloadFile() {
    const dbx = new Dropbox({ accessToken: this.dbxAuth.accessToken });
    const filepath = '/bok1.xlsx';
    dbx.filesDownload({ path: filepath})
      .then((data) => {
        console.log(data);
       // const theblob = new Blob([response.fileBlob], { type: 'application/octet-stream'});
        const fileurl = URL.createObjectURL((<any>data).fileBlob);
        const a = document.createElement('a');
        a.setAttribute('href', fileurl);
        a.setAttribute('download', 'bok1.xlsx');
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
