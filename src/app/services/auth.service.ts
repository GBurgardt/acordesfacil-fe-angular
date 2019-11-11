import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DefaultResponse } from '../models/defaultRespond.model';
import { Suggestion } from '../models/suggestion.model';
import { Chord } from '../models/chord.model';
import { Favorite } from '../models/favorite.model';

@Injectable()
export class AuthService {

    constructor(
        private httpClient: HttpClient
    ) { } 


    getSuggestions = (search: string, page: number): Promise<Suggestion[]> => 
        this.httpClient.get<DefaultResponse>(
            `${environment.WS_URL}/google?search=${search}&start=${page * 10}`
        ).toPromise().then(
            resp => resp.body
        )

    

    getTab = (href: string): Promise<{ laCuerdaId: string, pre: string }> => 
        this.httpClient.get<DefaultResponse>(
            `${environment.WS_URL}/${href}`
        ).toPromise().then(
            resp => resp.body
        )

    getTabByLaCuerdaIdAndNote = (laCuerdaId: string, tone): Promise<{ laCuerdaId: string, pre: string, chgnot: string, chordline: string, offset: string }> => 
        this.httpClient.get<DefaultResponse>(
            `${environment.WS_URL}/cuerda/${laCuerdaId}/${tone}`
        ).toPromise().then(
            resp => resp.body
        )

    getQuantityTab = (href: string): Promise<number> => 
        this.httpClient.get<DefaultResponse>(
            `${environment.WS_URL}/quantity/${href}`
        ).toPromise().then(
            resp => resp.body
        )

    getPatternByChordName = (chordName: string): Promise<Chord[]> => 
        this.httpClient.get<Chord[]>(
            `https://api.uberchord.com/v1/chords/${
                
                    chordName.includes('b') ?
                        `${String(chordName[0]).toUpperCase()}${chordName.substring(1)}` :
                        `${chordName[0]}_${chordName.substring(1)}` 

            }`
        ).toPromise()

    createUser = (username: string): Promise<any> => 
        this.httpClient.post<DefaultResponse>(
            `${environment.WS_URL}/user`,
            { username }
        ).toPromise()

    createFavorite = (username: string, href: string, description: string): Promise<any> => 
        this.httpClient.post<DefaultResponse>(
            `${environment.WS_URL}/favorite`,
            { username, href, description }
        ).toPromise()

    deleteFavorite = (href: string, username: string): Promise<any> => 
        this.httpClient.request<DefaultResponse>(
            'delete',
            `${environment.WS_URL}/favorite`,
            {
                body: { href, username }
            }
        ).toPromise()


    
    getFavorites = (username: string): Promise<Favorite[]> => 
        this.httpClient.get<DefaultResponse>(
            `${environment.WS_URL}/favorite/user/${username}`
        ).toPromise().then(
            resp => resp.body
        )

    getUserByUsername = (username: string): Promise<any[]> => 
        this.httpClient.get<DefaultResponse>(
            `${environment.WS_URL}/user/${username}`
        ).toPromise().then(
            resp => resp.body
        )
}