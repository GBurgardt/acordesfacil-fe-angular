import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Favorite } from '../models/favorite.model';

@Injectable()
export class LocalStorageService {

    favoritesObservable: BehaviorSubject<any[]> = new BehaviorSubject([]);

    constructor() { }

    /**
     * Setear algo en el localStorage, puede ser un json
     */
    setObject = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    }


    /**
     * Obtener algo del localStorage
     */
    getObject = (key) => {
        var value = localStorage.getItem(key);
        return value && JSON.parse(value);
    }

    /**
     * Limpia el local storage
     */
    clearLocalStorage = () => {
        localStorage.clear();
    }

    getFavoritesAsync = () => this.favoritesObservable;
    // listenFavorites = () => this.favoritesObservable.asObservable();

    updateFavorites = (newFavorites: Favorite[] | any[]) => 
    { 
        console.log("newFavorites")
        console.log(newFavorites)
        console.log("newFavorites")
        this.favoritesObservable.next(newFavorites);
    }
}
