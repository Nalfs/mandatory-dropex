import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dropbox } from 'dropbox';

import { dropboxConfig, DbxAuth } from '../configs';
import { createObjFromParams } from '../utils';

import { AuthService } from '../auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
    dbxAuth: DbxAuth;
    subscription: Subscription;

    constructor(private authService: AuthService) { }

    ngOnInit() {
        // Get authentication from service
        this.subscription = this.authService.getAuth()
                                .subscribe((auth) => this.dbxAuth = auth);

        // If auth's not found
        if (!this.dbxAuth.isAuth) {
            console.log('authComp-before', 'You are not logged in!', this.dbxAuth); // For testing purpose
            // Get authorization response from Dropbox API
            // Create an object with its specific properties if token is found in URL
            const objParams = createObjFromParams();

            // Assign to this component property
            this.dbxAuth = {accessToken: objParams.access_token,
                            tokenType: objParams.token_type,
                            uid: objParams.uid,
                            accountId: objParams.account_id,
                            isAuth: objParams.access_token &&
                                    objParams.token_type &&
                                    objParams.uid &&
                                    objParams.account_id ? true : false
                        };

            // Set authentication into Auth-service
            if (this.dbxAuth.isAuth) {
                this.authService.storeAuth(this.dbxAuth);
            }
            console.log('authComp-after', 'You are here!', this.dbxAuth); // For testing purpose
        } else {
            console.log('authComp', 'You are logged in!', this.dbxAuth.isAuth); // For testing purpose
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    handleAuthorization() {
        const urlAuth = `https://www.dropbox.com/oauth2/authorize?`
                        + `client_id=${dropboxConfig.clientId}`
                        + `&redirect_uri=${dropboxConfig.redirectUri}`
                        + `&response_type=${dropboxConfig.responseType}`;

        // console.log(urlAuth); // For testing purpose
        window.location.href = urlAuth;
    }
}
