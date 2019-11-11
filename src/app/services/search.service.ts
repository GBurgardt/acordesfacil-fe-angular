import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    private currentSearch: BehaviorSubject<string> = new BehaviorSubject('');

    constructor() { }

    getPlainValue = () => this.currentSearch.getValue();

    setNextValue = (value: string) => {
        // debugger;
        this.currentSearch.next(value);
    }

    getSubjectValue = () => this.currentSearch.asObservable();
}
