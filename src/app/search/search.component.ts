import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, BehaviorSubject } from 'rxjs';
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

<<<<<<< HEAD
    // TESTING ONLY
    private dbxAuth: DbxAuth;
    private subscription: Subscription;

    constructor(private authService: AuthService, private http: HttpClient) { }

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

    search(event): BehaviorSubject<any> {
        console.log('Hello world');

        const searchUrl = 'https://api.dropboxapi.com/2/files/search';
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'Bearer ' + this.dbxAuth.accessToken
            })
        };
        const searchParams = {
            'path': '',
            'query': 'my-test',
            'mode': 'filename_and_content'
        };

        const behSearch = this.http
                                .post<any>(searchUrl, searchParams, httpOptions)
                                .subscribe(
                                    results => {
                                        console.log(results);
                                    },
                                    error => {
                                        console.log('Error for bad request', error);
                                    }
                            );

        return null;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
=======
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

     console.log(payload);
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

  getMatches (obj: Array<any>) {
    this.compMatches = obj;
    console.log(this.compMatches);
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }
>>>>>>> d5581c52e9ed33245f2a9d9f591c375ada5b5a5f
}
