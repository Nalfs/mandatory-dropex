import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 import { Observable } from 'rxjs/';


@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {}
  downloadFile(link) {
    this.http.get(link)
      .subscribe((success) => {
        console.log(success);
      },
      (error) => {
        console.log(error);
      });
  }
}
