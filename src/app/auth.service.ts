import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DbxAuth } from './configs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private dbxAuth: DbxAuth = {...this.dbxAuth, isAuth: false}; // Set initial value isAuth: false
    private objBehaviorSubject: BehaviorSubject<any>;

    constructor() {
        this.objBehaviorSubject = new BehaviorSubject(this.dbxAuth);
    }

    getAuth(): BehaviorSubject<DbxAuth> {
        return this.objBehaviorSubject;
    }

    setAuth(inDbxAuth: DbxAuth) {
        this.dbxAuth = inDbxAuth;
        return this.objBehaviorSubject.next(this.dbxAuth);
    }

    clearAuth() {
        this.dbxAuth = {};
        return this.objBehaviorSubject.next(this.dbxAuth);
    }
}
