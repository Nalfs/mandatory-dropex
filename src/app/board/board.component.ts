import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dropbox } from 'dropbox';

import { AuthService } from '../auth.service';
import { DbxAuth } from '../configs';

import { getParamFromUrl } from '../utils';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
    dbxAuth: DbxAuth;
    subscription: Subscription;
    currentPath = '';

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.subscription = this.authService.getAuth()
                                .subscribe((auth) => this.dbxAuth = auth);

        // For testing purpose
        if (!this.dbxAuth.isAuth) {
            console.log('boardComp', 'You are not logged in!', this.dbxAuth.isAuth);
        } else {
            console.log('boardComp', 'You are logged in!', this.dbxAuth.isAuth);
        }
        this.currentPath = getParamFromUrl('path');
        console.log('boardComp', 'currentPath', this.currentPath);
        // End of testing
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
