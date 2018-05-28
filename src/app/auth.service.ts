import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DbxAuth } from './configs';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { storeCredentials, retrieveCredentials, clearCredentials } from './utils';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private dbxAuth: DbxAuth = {...this.dbxAuth, isAuth: false}; // Set initial value isAuth: false
    private objBehaviorSubject: BehaviorSubject<any>;

    constructor(private http: HttpClient) {
        this.objBehaviorSubject = new BehaviorSubject(this.dbxAuth);

        // Get back saved credentials
        const savedCredentials: DbxAuth = retrieveCredentials();
        if (savedCredentials) {
            this.storeAuth(savedCredentials);
        }
        // For testing purpose
        console.log('serviceComp-constructor-savedCredentials', savedCredentials);
    }

    getAuth(): BehaviorSubject<DbxAuth> {
        return this.objBehaviorSubject;
    }

    storeAuth(inDbxAuth: DbxAuth) {
        this.dbxAuth = inDbxAuth;
        storeCredentials(this.dbxAuth);
        return this.objBehaviorSubject.next(this.dbxAuth);
    }

    clearAuth() {
        this.dbxAuth = {};
        clearCredentials();
        return this.objBehaviorSubject.next(this.dbxAuth);
    }

}
