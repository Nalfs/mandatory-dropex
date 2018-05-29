import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Dropbox } from 'dropbox';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { AuthService } from '../auth.service';
import { DbxAuth } from '../configs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})



export class UploadComponent implements OnInit {
    private dbxAuth: DbxAuth;
    private subscription: Subscription;
    @Input() currentPath;

    file = {
      name: ''
    };


    constructor(private authService: AuthService,
                private http: HttpClient,
                private router: Router) { }

  ngOnInit() {
    this.subscription = this.authService.getAuth()
                                        .subscribe((auth) => this.dbxAuth = auth);
      if (!this.dbxAuth.isAuth) {
           this.router.navigate(['/auth']);
                }
            }


  upload() {

    const path = (this.currentPath) ? this.currentPath : '/';
    const paths = this.file.name.split('\\');
    const filename = paths.pop();
    const payload = {
      path: `${path}${filename}`,
      mode: 'add',
      autorename: true,
      mute: false
        };
        console.log(payload.path, this.currentPath);
      let httpOptions;
          httpOptions = {
          headers: new HttpHeaders({
              'Authorization': 'Bearer ' + this.dbxAuth.accessToken,
              'Dropbox-API-Arg': JSON.stringify(payload),
              'Content-Type': 'application/octet-stream'
          })
        };

        console.log(httpOptions);
          const send = this.http.post('https://content.dropboxapi.com/2/files/upload', payload, httpOptions);
          send.subscribe((results: any) => {
            alert('Your upload was successfull.');
       },
        error => {
          console.error('error', error);
        });
        return send;

    }
}
