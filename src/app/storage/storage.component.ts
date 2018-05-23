import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dropbox } from 'dropbox';

import { AuthService } from '../auth.service';
import { DbxAuth } from '../configs';

@Component({
    selector: 'app-storage',
    templateUrl: './storage.component.html',
    styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit, OnDestroy {
    dbxAuth: DbxAuth;
    subscription: Subscription;

    constructor(private authService: AuthService) { }

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

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
