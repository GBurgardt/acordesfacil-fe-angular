import { Injectable } from '@angular/core';

declare var SongPainter: any;

@Injectable({
    providedIn: 'root'
})
export class ChordService {

    constructor() { }

    paintChord = (elementId, songData) => {
        const songPainter: any = new SongPainter();
        songPainter.paintSong(`#${elementId}`, songData)
    }


    
    // Dada una nota retorna si tiene sostenido o no
    getIfSostenido = (n) => {
        const notes = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        const sharpCode = [true, false, true, true, false, true, true];

        return notes.some(
            (auxN, ind) =>
                n === auxN &&
                sharpCode[ind]
        );
    }

    getNextNote = n => {
        const normalizedN = n.toLowerCase().trim();
        const notes = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

        const nextIndex = notes.indexOf(normalizedN) + 1;
        const limitedNextIndex = nextIndex >= 7 ? 
            0 :
            nextIndex < 0 ?
                7 : nextIndex;

        return notes[limitedNextIndex]
    }

    sharpToBemol = sharpNote => {
        const mainNote = sharpNote[0];
        const nextMainNote = this.getNextNote(mainNote);
        // debugger;
        return `${nextMainNote}b${sharpNote[2] ? '_'+sharpNote[2] : ''}`;
    }

}


//const majorScale = [1, 0, 0, 1, 1, 0, -1] // major-menor-menor-major-major-menor-disminuido  