import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dropbox } from 'dropbox';

import { AuthService } from '../auth.service';
import { DbxAuth } from '../configs';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
    dbxAuth: DbxAuth;
    subscription: Subscription;

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
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
