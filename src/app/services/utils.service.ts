import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    constructor() { }

    getParams = (params: Observable<Params>): Promise<Params> =>
        new Promise(
            (resolve, reject) => 
                params.subscribe(
                    resp => resolve(resp)
                )
        )
}
