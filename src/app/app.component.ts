import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './services/local-storage.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Favorite } from './models/favorite.model';
import { BehaviorSubject } from 'rxjs';
import { FavoritesModes } from './constanst/favoriteModes';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    // necesario para alcanzar FavoritesModes en la vista
    FavoritesModes: any = FavoritesModes;

    username: string;

    isLoggedIn: boolean = false;
    isMenuOpen: boolean = false;

    favorites: BehaviorSubject<any[]> = new BehaviorSubject([]);

    favoritesMode: string = FavoritesModes.CANCIONES;

    constructor(
        public localStorageService: LocalStorageService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        if (this.localStorageService.getObject('username')) {
            this.isLoggedIn = true;
            this.searchFavorites();
        }

    }

    onClickEntrar = () =>
        this.authService.getUserByUsername(this.username)
            .then(
                resp => {
                    if (resp) {
                        this.localStorageService.setObject('username', this.username);
                        this.isLoggedIn = true;
                        this.searchFavorites();
                    } else {
                        this.authService.createUser(this.username)
                            .then(
                                resp => 
                                    this.authService.getUserByUsername(this.username)
                                        .then(
                                            resp => {
                                                if (resp) {
                                                    this.localStorageService.setObject('username', this.username);
                                                    this.isLoggedIn = true;
                                                    this.searchFavorites();
                                                }
                                            }
                                        )
                                
                            )
                            .catch(
                                err => this.isLoggedIn = false
                            )
                    }
                }
            )
            .catch(
                err => this.isLoggedIn = false
            )


    changeFavoriteMode = () => {
        this.favoritesMode = this.favoritesMode === FavoritesModes.CANCIONES ?
            FavoritesModes.ARTISTAS : FavoritesModes.CANCIONES;

        const actualFavorites = this.localStorageService.getFavoritesAsync().value;

        if (this.favoritesMode === FavoritesModes.CANCIONES) {
            this.searchFavorites();
        } else {
            const newFavorites = actualFavorites
                .map(
                    song => ({
                        artist: song.description.substring(0, song.description.indexOf(','))
                    })
                )
                .reduce(
                    (acum, a) => acum.some(artAcum => artAcum.artist === a.artist) ? acum : acum.concat(a),
                    []
                )
                .map(
                    (artistObject, ind) => ({
                        artist: artistObject.artist,
                        menuOpen: false,
                        songs: actualFavorites
                            .filter(
                                song => {
                                    const songArtist = song.description.substring(0, song.description.indexOf(','));
    
                                    return songArtist === artistObject.artist
                                }
                            )
                    })
                );
    
            this.localStorageService.updateFavorites(
                newFavorites
            );
        }
    }
    

    searchFavorites = () => 
        this.authService.getFavorites(
            this.localStorageService.getObject('username')
        ).then(
            favorites => this.localStorageService.updateFavorites(favorites)
        )

    onClickFavorite = (fav, favModeItem = FavoritesModes.CANCIONES) => {

        if (favModeItem === FavoritesModes.CANCIONES) {
            this.isMenuOpen = false;
    
            this.router.navigate(['', fav.href])
        } else {
            fav.menuOpen = !fav.menuOpen;
        }

    }
}
