import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Dropbox } from 'dropbox';
import { DbxAuth } from './configs';
import { Router, Routes } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  private dbxAuth: DbxAuth;
  private subscription: Subscription;
  stream;
  dbx;

  constructor(
               private authService: AuthService,
               private activatedRoute: ActivatedRoute,
               private router: Router,
  ) {
    this.subscription = this.authService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));

    this.stream = new BehaviorSubject([]);
    this.dbx = new Dropbox({ accessToken: this.dbxAuth.accessToken });
  }

  getFiles(path) {
    console.log(decodeURI(path));
    if (path === '/') {
      path = '';
    }
    this.dbx.filesListFolder({path: decodeURI(path)})
    .then(response => {
      const entries = response.entries;
      this.stream.next(entries);
    });

  }
}
