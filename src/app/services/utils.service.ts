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

    getCurrentNroTab = (href): number => {
        if (href.includes('-')) {
            return Number(href.substring(
                href.indexOf('-') + 1,
                href.indexOf('-') + 2
            ))
        } else {
            return 1;
        }

    }

    getNombreByHref = (href) => href ?
        href
            .split('/')
            .map(
                (a, i) =>
                    i === 1 ?
                        a.includes('-') ?
                            a = a.substring(0, a.indexOf('-')) :
                            a : a
            )
            .map(
                a =>
                    a && a.length > 0 ?
                        `${a[0].toUpperCase()}${a.slice(1)}`
                            .replace(new RegExp('_', 'g'), ' ')
                        :
                        ''
            )
            .join(', ') : null


    toggleFullScreen = () => {
        var doc: any = window.document;
        var docEl: any = doc.documentElement;

        var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
        }
        else {
            cancelFullScreen.call(doc);
        }
    }

}
