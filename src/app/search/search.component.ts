import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dropbox } from 'dropbox';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

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
/*   userQueries; */
  query;

  constructor(private authService: AuthService, private http: HttpClient) {

   /*  this.userQueries = {
      queries: [{query: ''}]
    }; */
  }

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

    let httpOptions;
        httpOptions = {
        headers: new HttpHeaders({
            'Authorization': 'Bearer ' + this.dbxAuth.accessToken,
            'Content-Type': 'application/json',
        })
      };

     const payload = {
      queries: [{
        query: this.query,
        mode: {
          '.tag': 'field_name',
          'field_name': 'Security'
           },
          'logical_operator': 'or_operator'
          }],
          'template_filter': 'filter_none'
     };
     console.log(payload);
    const tmp = this.http.post('https://api.dropboxapi.com/2/file_properties/properties/search', payload, httpOptions);
    tmp.subscribe((results) => {
      console.log(results);
    },
    error => {
      console.error('error', error);
    });
    return tmp;
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }
}
