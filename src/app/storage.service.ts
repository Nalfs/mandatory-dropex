import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private favorites = false;
    private favoritesBehavior: BehaviorSubject<any>;

    constructor() {
        this.favoritesBehavior = new BehaviorSubject(this.favorites);
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
}
