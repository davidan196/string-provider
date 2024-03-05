import { NoteKey } from '../Enums/NoteKey';
import { SequenceNoteKey } from '../constant';
import { Notation } from './Notation.abstract';
import { Note } from './Note';
import { NotationType } from '../Enums/NotationType';
import { NoteDuration } from '../Enums/NoteDuration';
// Major Chord
const defualtChordNotes = () => [
    new Note(NoteKey.C3),
    new Note(NoteKey.E3),
    new Note(NoteKey.G3),
];
/**
 * a.默认新增是大三和弦，可以改变和弦的属性去调整和弦内音符的相对属性
 * b.节奏和音符装饰(Decorations)可以标志在[xxx]周围,但是具体到音符的符号(Accidential)必须要在
 * 音符内去附加;
 * @summary ！！选中的ChordNote的abcstring索引不会关联到位于之前的特殊符号，比如slurs
 * @todo
 * A. 添加`note`后如果设置`hasEndBlankSpace`空格，可能导致无法选中，因为不会截取到空格;
 * 但是其后`notation`，则会选中空格（先添加小节不影响使用）;
 */
export class ChordNote extends Notation {
    constructor(notes = defualtChordNotes(), duration = NoteDuration.Quarter, hasTie = false, hasEndBlankSpace = false, lyrics = '') {
        super();
        this.notes = notes;
        this.duration = duration;
        this.hasTie = hasTie;
        this.hasEndBlankSpace = hasEndBlankSpace;
        this.lyrics = lyrics;
        this.ntype = NotationType.ChordNote;
        if (!notes) {
            throw 'empty chord notes.';
        }
        if (notes.length < 2) {
            throw 'invalid chord notes less than 2.';
        }
        notes.map(note => note.setDuration(duration));
        overwriteNotesFunction.bind(this)(notes);
    }
    static deserialize(seriInfo) {
        const [notesState, ...chordState] = seriInfo.state;
        const notes = notesState.map(noteState => new Note(...noteState.state));
        return new ChordNote(notes, ...chordState);
    }
    toAbcString() {
        return generateChordString(this.notes) + (this.hasTie ? '-' : '') + (this.hasEndBlankSpace ? ' ' : '');
    }
    toJSON() {
        return {
            ntype: this.ntype,
            state: [this.notes, this.duration, this.hasEndBlankSpace, this.lyrics],
        };
    }
    pitchUp() {
        if (!tryPitchUpChordKey(this.notes, 1))
            return;
        this.updateInStave();
    }
    pitchDown() {
        if (!tryPitchDownChordKey(this.notes, 1))
            return;
        this.updateInStave();
    }
    /**
     * 设置延音线符号
     */
    setHasTieIs(is) {
        this.hasTie = is;
        this.updateInStave();
    }
    /**
     * 设置尾部空格(断开符尾)
     */
    setEndBlankSpaceIs(is) {
        this.hasEndBlankSpace = is;
        this.updateInStave();
    }
    setDuration(duration) {
        this.duration = duration;
        this.notes.map(note => note.setDuration(duration));
        this.updateInStave();
    }
}
function generateChordString(notes) {
    let notesStr = '';
    notes.forEach((note, i) => {
        notesStr += note.toAbcString();
    });
    return `[${notesStr}]`;
}
function tryPitchUpChordKey(notes, interval) {
    // 只看最后一个音是否可再升调
    const lastNote = notes[notes.length - 1];
    const key_pitchUp = SequenceNoteKey[SequenceNoteKey.indexOf(lastNote.key) + interval];
    if (!key_pitchUp) {
        console.warn('chord key is already at top.');
        return false;
    }
    notes.forEach((note, i) => {
        note.pitchUp();
    });
    return true;
}
function tryPitchDownChordKey(notes, interval) {
    // 只看第一个音是否可再降调
    const rootNote = notes[0];
    const key_pitchDown = SequenceNoteKey[SequenceNoteKey.indexOf(rootNote.key) - interval];
    if (!key_pitchDown) {
        console.warn('key is already at bottom.');
        return false;
    }
    notes.forEach((note, i) => {
        note.pitchDown();
    });
    return true;
}
/**
 * 重写和弦组成音符的方法；
 * 使可以达到组成音改变和弦同步变化的效果
 */
function overwriteNotesFunction(notes) {
    const chordNote = this;
    const overwriteFunctionsName = ['pitchUp', 'pitchDown', 'setAccidential'];
    const overwriteNote = (note) => {
        overwriteFunctionsName.forEach(funcName => {
            const orgFunc = note[funcName].bind(note);
            note[funcName] = function () {
                orgFunc(...arguments);
                chordNote.updateInStave();
            };
        });
    };
    notes.forEach(note => overwriteNote(note));
}
//# sourceMappingURL=ChordNote.js.map