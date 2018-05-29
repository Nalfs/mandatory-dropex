import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/';

@Injectable({
    providedIn: 'root'
})
export class DropexService {

    paths = [];
    stream;

    constructor() {
        this.stream = new Observable<any>(() => {
        });
    }

    addPath(url) {
        this.paths.push(url);
        this.stream.next(url);
    }

    getCurrentPath() {
       // [‘’,‘halff’, ‘newmapp’];
       // === ‘/halff/newmapp’;

        return this.paths.join('/');
    }
}
