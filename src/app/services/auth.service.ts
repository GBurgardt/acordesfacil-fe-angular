import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DefaultResponse } from '../models/defaultRespond.model';
import { Suggestion } from '../models/suggestion.model';

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

    getTab = (href: string): Promise<string> => 
        this.httpClient.get<DefaultResponse>(
            `${environment.WS_URL}/${href}`
        ).toPromise().then(
            resp => resp.body
        )
}