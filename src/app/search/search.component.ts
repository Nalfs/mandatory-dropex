import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dropbox } from 'dropbox';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { DbxAuth } from '../configs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  compMatches = [];
  dbxAuth: DbxAuth;
  subscription: Subscription;

  query;

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {


  }

  ngOnInit() {
      this.subscription = this.authService.getAuth()
                              .subscribe((auth) => this.dbxAuth = auth);
      if (this.dbxAuth.isAuth) {

          const dbx = new Dropbox({ accessToken: this.dbxAuth.accessToken });
          dbx.filesListFolder({ path: '' })
              .then(function (response) {
                  console.log(response);
              })
              .catch(function (error) {
                  console.log(error);
              });
      }
  }

  search(event) {
    this.router.navigate(['/search']);
    let httpOptions;
        httpOptions = {
        headers: new HttpHeaders({
            'Authorization': 'Bearer ' + this.dbxAuth.accessToken,
            'Content-Type': 'application/json',
        })
      };

      const payload = {
        'path': '',
        'query': this.query,
        'mode': 'filename_and_content'


      };
      if (this.dbxAuth.isAuth) {
        const tmp = this.http.post('https://api.dropboxapi.com/2/files/search', payload, httpOptions);
        tmp.subscribe((results: any) => {
          console.log(results);
          this.getMatches(results.matches);
     },
      error => {
        console.error('error', error);
      });
      return tmp;
  }
  }

  getMatches (obj: Array<any>) {
    this.compMatches = obj;
    console.log(this.compMatches);
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }
}
