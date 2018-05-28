import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, BehaviorSubject } from 'rxjs';
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
}
