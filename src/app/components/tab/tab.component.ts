import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, ParamMap, Router, NavigationEnd } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';
import { ChordService } from 'src/app/services/chord.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
    selector: 'app-tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {

    tab: { pre: string, laCuerdaId: string } | { laCuerdaId: string, pre: string, chgnot: string, chordline: string, offset: string };
    href: string;
    nroTab: number;
    toneTab: number = 0;
    cantTabsVersions: number;
    isOptionsOpen: boolean = false;
    updateSpinner: boolean = false;

    @ViewChild('preElement', { static: false }) preElement: ElementRef;

    constructor(
        private localStorageService: LocalStorageService,
        private authService: AuthService,
        public utilsService: UtilsService,
        public chordService: ChordService,
        private route: ActivatedRoute,
        private router: Router,
        private rd: Renderer2
    ) { }

    showChords: boolean;
    isCurrentlyInFavs: boolean = false;

    async ngOnInit() {
        const { href } = await this.utilsService.getParams(this.route.params);
        await this.updateData(href);

        this.updateFavoriteState(href);

        // Cada vez que cambia la ruta, actualizo la data
        this.router.events.subscribe(
            (val) => {
                if (val instanceof NavigationEnd) {
                    const url = unescape(val.url);
                    if (url && url.length > 0) {
                        this.updateData(url.substring(1));
                        this.updateFavoriteState(href);
                    }
                }
            }
        );

    };

    updateFavoriteState = (href) => {
        // Chequeo si está en favoritos
        if (this.localStorageService.getObject('username')) {
            this.authService.getFavorites(
                this.localStorageService.getObject('username')
            ).then(
                favorites => favorites && favorites.length > 0 &&
                    favorites.some(
                        fav => fav.href === href
                    ) ? this.isCurrentlyInFavs = true :
                        this.isCurrentlyInFavs = false
            )
        }
    }

    updateData = async (href, tone = 0) => {
        this.updateSpinner = true;

        this.href = href;

        if (tone === 0) {
            this.tab = await this.authService.getTab(href);
        } else {
            this.tab = await this.authService.getTabByLaCuerdaIdAndNote(
                this.tab.laCuerdaId, tone
            );
        }

        // Desduzco nro de version por url
        this.nroTab = this.utilsService.getCurrentNroTab(href);
        // Traigo cant de versiones
        this.cantTabsVersions = await this.authService.getQuantityTab(href);
        // Inicializo eventos chords
        this.listenChordsEvents();

        this.updateSpinner = false;

        // Experimental: Pruebo poner en fullscreen el navegador del celular
        // this.utilsService.toggleFullScreen();
    }

    // "a" html elements click event
    listenChordsEvents = () => 
        [...this.preElement.nativeElement.childNodes]
            .filter(
                childNode => childNode && childNode.localName &&
                    childNode.localName === 'a'
            )
            .forEach(
                aNode => {
                    this.rd.listen(
                        aNode,
                        'mouseover',
                        e => this.onShowChord(aNode)
                    );

                    this.rd.listen(
                        aNode,
                        'click',
                        e => this.onShowChord(aNode, 'click')
                    );

                    this.rd.listen(
                        aNode,
                        'mouseleave',
                        e => this.showChords = false
                        
                    );
                }
            )

        
    onShowChord = (aNode, eventType = 'mouseover') => {
        this.showChords = eventType === 'click' ? 
            !this.showChords : true;

        const noteText = aNode.innerText;
        
        const finalNote = noteText[1] && noteText[1] === '#'?
            this.chordService.sharpToBemol(noteText) :
            noteText;

        this.authService.getPatternByChordName(finalNote)
            .then(
                resp => 
                    this.chordService.paintChord(
                        'song-chords', 
                        {
                            "voicings": resp
                                .map(
                                    chord => ({
                                        chord_name: chord.chordName,
                                        fingering: chord.fingering,
                                        strings: chord.strings
                                    })
                                )
                        }
                    )
                
            )
        
    }

    getVersionHref = (i) => {
        const newHref =
            this.href.includes('-') ?
                this.href
                    .substring(
                        0,
                        this.href.indexOf('-')
                    )
                    .concat(
                        i !== 0 ?
                            `-${i + 1}` :
                            ''
                    ) :
                this.href
                    .concat(
                        i !== 0 ?
                            `-${i + 1}` :
                            ''
                    )

        this.updateData(newHref).then(
            resp => {
                this.href.includes('-') ?
                    this.router.navigate(['/', `${this.href.substring(
                        0,
                        this.href.indexOf('-')
                    )}${
                        i + 1 === 1 ?
                            '' :
                            `-${i + 1}`
                        }`]) :
                    this.router.navigate(['/', `${this.href}${
                        i + 1 === 1 ?
                            '' :
                            `-${i + 1}`
                        }`
                    ]);

                this.isOptionsOpen = !this.isOptionsOpen;
            }
        )
    }


    addToFavorites = () =>
        this.authService.createFavorite(
            this.localStorageService.getObject('username'),
            this.href,
            this.utilsService.getNombreByHref(this.href)
        )
            .then(
                resp => {
                    this.isCurrentlyInFavs = true;

                    // Actualizo observable de favoritos
                    this.authService.getFavorites(
                        this.localStorageService.getObject('username')
                    ).then(
                        newFavorites => this.localStorageService.updateFavorites(newFavorites)
                    )

                }
            )
            .catch(
                err => 
                    err && err.message ?
                        alert(err.message) : 
                        alert('Error Desconocido')
                
            )

    removeToFavorites = () =>
        this.authService.deleteFavorite(
            this.href,
            this.localStorageService.getObject('username')
        )
            .then(
                resp => {
                    this.isCurrentlyInFavs = false;

                    // Actualizo observable de favoritos
                    this.authService.getFavorites(
                        this.localStorageService.getObject('username')
                    ).then(
                        newFavorites => this.localStorageService.updateFavorites(newFavorites)
                    )

                }
            )
            .catch(
                err => 
                    err && err.message ?
                        alert(err.message) : 
                        alert('Error Desconocido')
                
            )


    onClickBackTone = async() => {
        this.toneTab = this.toneTab - 1;

        await this.updateData(this.href, this.toneTab);
    }
    onClickNextTone = async() => {
        this.toneTab = this.toneTab + 1;

        await this.updateData(this.href, this.toneTab);
    }


}
