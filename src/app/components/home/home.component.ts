import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Suggestion } from 'src/app/models/suggestion.model';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    
    suggestions: Suggestion[] = [];
    search: string = '';
    page: number = 0;

    constructor(private authService: AuthService) { }

    onClickSearch = async () => 
        this.suggestions = await this.authService.getSuggestions(this.search, this.page)

    onClickMore = async () => {
        this.page = this.page + 1;
        this.onClickSearch();
    }

}
