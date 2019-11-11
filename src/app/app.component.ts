import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './services/local-storage.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Favorite } from './models/favorite.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    username: string;

    isLoggedIn: boolean = false;
    isMenuOpen: boolean = false;

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


    searchFavorites = () => 
        this.authService.getFavorites(
            this.localStorageService.getObject('username')
        ).then(
            favorites => this.localStorageService.updateFavorites(favorites)
        )

    onClickFavorite = (fav) => {
        this.isMenuOpen = false;

        this.router.navigate(['', fav.href])
    }
}
