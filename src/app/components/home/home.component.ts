import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Suggestion } from 'src/app/models/suggestion.model';
import { SearchService } from 'src/app/services/search.service';
import { debounce, debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    
    suggestions: Suggestion[] = [];
    search: string = '';
    page: number = 0;

    isHelpOpen: boolean = false;

    constructor(
        private authService: AuthService,
        private searchService: SearchService
    ) { }

    ngOnInit() {
        this.searchService.getSubjectValue()
            .pipe(
                debounceTime(400)
            )
            .subscribe(
                value => {
                    this.search = value;
                    this.onClickSearch().then(
                        resp => resp
                    )
                }
            )
    }
    

    onClickSearch = async () =>
        this.search && this.search.length > 0 ?
            this.suggestions = await this.authService.getSuggestions(this.search, this.page) :
            null
    

    onClickMore = async () => {
        this.page = this.page + 1;
        this.onClickSearch();
    }

    onInputChange = val => 
        this.searchService.setNextValue(val)


}
