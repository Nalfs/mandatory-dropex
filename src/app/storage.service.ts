import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private favorites = false;
    private favoritesBehavior: BehaviorSubject<any>;

    private deletes = false;
    private deletesBehavior: BehaviorSubject<any>;

    constructor() {
        this.favoritesBehavior = new BehaviorSubject(this.favorites);
        this.deletesBehavior = new BehaviorSubject(this.deletes);
    }

    showFavorites(): BehaviorSubject<any> {
        return this.favoritesBehavior;
    }

    activateShowFavorites() {
        this.favorites = true;
        return this.favoritesBehavior.next(this.favorites);
    }

    deactivateShowFavorites() {
        this.favorites = false;
        return this.favoritesBehavior.next(this.favorites);
    }

    showDeletes(): BehaviorSubject<any> {
        return this.deletesBehavior;
    }

    activateShowDeletes() {
        this.deletes = true;
        return this.deletesBehavior.next(this.deletes);
    }

    deactivateShowDeletes() {
        this.deletes = false;
        return this.deletesBehavior.next(this.deletes);
    }
}
