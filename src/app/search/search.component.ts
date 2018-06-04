import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dropbox } from 'dropbox';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { DbxAuth } from '../configs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

    public compMatches = [];
    private dbxAuth: DbxAuth;
    private subscription: Subscription;
    public query;
    public matches = 0;
    public gotMatch = false;
    question;
    lastItem = [];
    lastSearch;
    showLastSearch = false;

  constructor(private authService: AuthService,
              private http: HttpClient,
              private router: Router) {


  }

  ngOnInit() {
    this.subscription = this.authService.getAuth()
                            .subscribe((auth) => this.dbxAuth = auth);

    /* if (!this.dbxAuth.isAuth) {
        this.router.navigate(['/auth']);
    } */

    if (sessionStorage.getItem('lastSearches') !== null) {
      this.showLastSearch = !this.showLastSearch;
      this.lastSearch = JSON.parse(sessionStorage.getItem('lastSearches'));
      console.log('this is' , this.lastSearch);
      this.lastSearch = this.lastSearch.slice(-3);
      console.log('this is second' , this.lastSearch[1].searchterm);
      /* let i;
       for (i = 0; i < this.lastSearch.length; i++) {
         console.log('boom', this.lastSearch[i].metadata.name);
       } */
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
      this.question = this.query;

      const payload = {
        'path': '',
        'query': this.query,
        'mode': 'filename_and_content'


      };

        const tmp = this.http.post('https://api.dropboxapi.com/2/files/search', payload, httpOptions);
        tmp.subscribe((results: any) => {
          console.log(results);
          this.getMatches(results.matches);
          const numbers = results.matches.length;
          this.matches = numbers;
          this.gotMatch = true;
     },
      error => {
        console.error('error', error);
      });
      return tmp;
  }

  getMatches (obj: Array<any>) {
    this.compMatches = obj;
    console.log(this.compMatches);
    const save = this.compMatches;
    save.forEach(function(e) { e.searchterm = this.question; }, this);
    console.log(save);
    sessionStorage.setItem('lastSearches', JSON.stringify(save));
  }

  downloadFile(filepath, filename, event) {
    event.preventDefault();
    const dbx = new Dropbox({ accessToken: this.dbxAuth.accessToken });

    dbx.filesDownload({ path: filepath})
      .then((data) => {
        console.log(data);
        const fileurl = URL.createObjectURL((<any>data).fileBlob);
        const a = document.createElement('a');
        a.setAttribute('href', fileurl);
        a.setAttribute('download', filename);
        a.click();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }
}
