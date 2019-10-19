import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
    selector: 'app-tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {

    tab: string;

    constructor(
        private authService: AuthService,
        private utilsService: UtilsService,
        private route: ActivatedRoute
    ) { }

    async ngOnInit() {
        const { href } = await this.utilsService.getParams(this.route.params);
        this.tab = await this.authService.getTab(href);
    };

}
