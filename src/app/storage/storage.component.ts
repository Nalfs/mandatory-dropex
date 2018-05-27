import { Component, OnInit, OnDestroy } from '@angular/core';
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
      dbx.filesListFolder({ path: '' })
        .then(response => {
          this.getEntries(response.entries);
        })
        .catch(error => {
          console.log(error);
        });
      // ------ End of your code ------
    }
  }
  getEntries(inEntries: Array<any>) {
    this.compEntries = inEntries;
    console.log('storageComp-get entries outside', this.compEntries);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
