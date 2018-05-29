import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/';

@Injectable({
    providedIn: 'root'
})
export class DropexService {

    paths = [];
    stream;
    observer;

    constructor() {
        this.stream = new Observable<any>((observer) => {
            this.observer = observer;
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
