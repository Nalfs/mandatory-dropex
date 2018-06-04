import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CanActivate, Router } from '@angular/router';

import { DbxAuth } from './configs';
import { storeCredentials,
         retrieveCredentials,
         clearCredentials
} from './utils';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private dbxAuth: DbxAuth = {...this.dbxAuth, isAuth: false}; // Set initial value isAuth: false
    private objBehaviorSubject: BehaviorSubject<any>;

    constructor(public router: Router) {
        this.objBehaviorSubject = new BehaviorSubject(this.dbxAuth);

        // Get back saved credentials
        const savedCredentials: DbxAuth = retrieveCredentials();
        if (savedCredentials) {
            this.storeAuth(savedCredentials);
        }
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

    canActivate(): boolean {
        if (!this.dbxAuth.isAuth) {
          this.router.navigate(['/auth']);
          console.log('boardComp', 'You are not logged in!');
          return false;
        }
        console.log('boardComp', 'You are not logged in!');
        return true;
      }
}
