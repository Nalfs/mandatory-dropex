import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dropbox } from 'dropbox';

import { AuthService } from '../auth.service';
import { StorageService } from '../storage.service';
import { DbxAuth } from '../configs';

import { Router } from '@angular/router';
import { getParamFromUrl } from '../utils';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
    private dbxAuth: DbxAuth;
    private subscription: Subscription;


    constructor(private authService: AuthService,
        private router: Router,
        private storageService: StorageService) {}

    ngOnInit() {
        this.subscription = this.authService.getAuth()
            .subscribe((auth) => this.dbxAuth = auth);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    showFavorites(event) {
        event.preventDefault();
        event.stopPropagation();
        this.storageService.activateShowFavorites();
    }

    showDeletes(event) {
        event.preventDefault();
        event.stopPropagation();
        this.storageService.activateShowDeletes();
    }
}
