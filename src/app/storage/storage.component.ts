import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dropbox } from 'dropbox';

import { AuthService } from '../auth.service';
import { FileService } from '../file.service';
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

  constructor(private authService: AuthService, private fileService: FileService ) {}

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
        })
        .catch(error => {
          console.log(error);
        });
      // ------ End of your code ------
    }
  }
  downloadFile() {
    const dbx = new Dropbox({ accessToken: this.dbxAuth.accessToken });
    dbx.filesGetTemporaryLink({ path: '/Bok1.xlsx' })
      .then((response) => {
        console.log(response.link);
        this.fileService.downloadFile(response.link);
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
