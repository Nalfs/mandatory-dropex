import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dropbox } from 'dropbox';

import { AuthService } from '../auth.service';
import { DbxAuth } from '../configs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  // TESTING ONLY
  dbxAuth: DbxAuth;
  subscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
      this.subscription = this.authService.getAuth()
                              .subscribe((auth) => this.dbxAuth = auth);

      if (this.dbxAuth.isAuth) {
          // ------ Beginning your code ------
          const dbx = new Dropbox({ accessToken: this.dbxAuth.accessToken });
          dbx.filesListFolder({ path: '' })
              .then(function (response) {
                  console.log(response);
              })
              .catch(function (error) {
                  console.log(error);
              });
          // ------ End of your code ------
      }
  }

  search(event) {
    console.log('Hello world');
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }
}
