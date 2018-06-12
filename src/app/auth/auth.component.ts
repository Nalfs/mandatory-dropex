import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { dropboxConfig, DbxAuth } from '../configs';
import { LocalStorageMethods, getAuthObj } from '../utils';

import { AuthService } from '../auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
    public dbxAuth: DbxAuth;
    private subscription: Subscription;

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
        // Get credentials from service and keep data updated
        this.subscription = this.authService.getAuth()
                                            .subscribe((auth) => this.dbxAuth = auth);

        // Begin authentication process if credentials not found
        if (!this.dbxAuth.isAuth) {
            const objParams = getAuthObj(); // Get authentication from URL and create auth object

            // Create and store dbxAuth object for this app
            this.dbxAuth = {accessToken: objParams.access_token,
                            tokenType: objParams.token_type,
                            uid: objParams.uid,
                            accountId: objParams.account_id,
                            isAuth: objParams.access_token &&
                                    objParams.token_type &&
                                    objParams.uid &&
                                    objParams.account_id ? true : false
                        };

            // Store credentials into Auth-service and into localStorage
            if (this.dbxAuth.isAuth) {
                this.authService.storeAuth(this.dbxAuth);
                this.router.navigate(['']); // Navigate the user to homepage
            }
        } else {
            this.router.navigate(['']); // Navigate the user to homepage
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
        window.location.href = urlAuth;
    }
}
