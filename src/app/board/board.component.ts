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
    public currentPath = getParamFromUrl('path');
    pathArray;
    link;
    backLink;
    goBack;
    parentFolder;

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.pathArray = this.getPathArr(this.currentPath);
        this.goBack = this.goBackFn(this.currentPath);
        this.subscription = this.authService.getAuth()
                                .subscribe((auth) => this.dbxAuth = auth);

        /* if (!this.dbxAuth.isAuth) {
            console.log('boardComp', 'You are not logged in!', this.dbxAuth.isAuth); // For testing purpose
            this.router.navigate(['/auth']);
        } else {
            console.log('boardComp', 'You are logged in!', this.dbxAuth.isAuth); // For testing purpose
            // Do stuff here
        } */
        console.log('boardComp', 'currentPath', this.currentPath); // For testing purpose
    }


    getPathArr(currentPath) {
        const newPathArr = currentPath.split('/');
        const arrThree = [];
        let lastValue = '';
        console.log('this is the: ', currentPath, newPathArr);
       let i;
        for (i = 0; i < newPathArr.length; i++) {
            if (newPathArr[i]) {
                lastValue += `/${newPathArr[i]}`;
            }
          arrThree.push({
               path: newPathArr[i],
               fullpath: lastValue
            });
            }
            return arrThree;
        }

    goBackFn(currentPath) {
        return this.parentFolder = this.pathArray.slice(0, -1);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
