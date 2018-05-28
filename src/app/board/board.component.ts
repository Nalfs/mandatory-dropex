import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
    private dbxAuth: DbxAuth;
    private subscription: Subscription;
    private currentPath = getParamFromUrl('path');

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.subscription = this.authService.getAuth()
                                .subscribe((auth) => this.dbxAuth = auth);

        if (!this.dbxAuth.isAuth) {
            console.log('boardComp', 'You are not logged in!', this.dbxAuth.isAuth); // For testing purpose
            this.router.navigate(['/auth']);
        } else {
            console.log('boardComp', 'You are logged in!', this.dbxAuth.isAuth); // For testing purpose
            // Do stuff here
        }
        console.log('boardComp', 'currentPath', this.currentPath); // For testing purpose
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
