import { NoteKey } from '../Enums/NoteKey';
import { SequenceNoteKey, ChordNoteIntervalMap } from '../constant';
import { NoteAccidental } from '../Enums/NoteAccidental';
import { Notation } from './Notation.abstract';
import { ChordType } from '../Enums/ChordType';
import { Note } from './Note';
import { NotationType } from '../Enums/NotationType';
import { NoteDuration } from '../Enums/NoteDuration';
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
    constructor(rootkey = NoteKey.C1, duration = NoteDuration.Quarter, chordType = ChordType.Major, hasTie = false, hasEndBlankSpace = false, lyrics = '') {
        super();
        this.rootkey = rootkey;
        this.duration = duration;
        this.chordType = chordType;
        this.hasTie = hasTie;
        this.hasEndBlankSpace = hasEndBlankSpace;
        this.lyrics = lyrics;
        this.ntype = NotationType.ChordNote;
        const i_sequence = SequenceNoteKey.indexOf(rootkey);
        if (i_sequence === -1) {
            throw 'invalid rootkey.';
        }
    }
    toAbcString() {
        return (this.generateChordString(this.rootkey, this.duration, this.chordType) +
            (this.hasTie ? '-' : '') +
            (this.hasEndBlankSpace ? ' ' : ''));
    }
    toJSON() {
        return {
            ntype: this.ntype,
            state: [this.rootkey, this.duration, this.chordType, this.hasEndBlankSpace, this.lyrics],
        };
    }
    pitchUp() {
        const note_pitchUp = tryPitchUpKey(this.rootkey, 1, ChordNoteIntervalMap[this.chordType]);
        if (this.rootkey === note_pitchUp) {
            return;
        }
        this.rootkey = note_pitchUp;
        this.updateInStave();
    }
    pitchDown() {
        const note_pitchDown = tryPitchDownKey(this.rootkey, 1);
        if (this.rootkey === note_pitchDown) {
            return;
        }
        this.rootkey = note_pitchDown;
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
        this.updateInStave();
    }
    setChordType(type) {
        this.chordType = type;
        this.updateInStave();
    }
    generateChordString(rootkey, duration, chordType) {
        // 1. build notes
        const notes = [];
        notes.push(new Note(rootkey, duration)); // Root note. 只会会以第一个Note的时值为准
        if (chordType == ChordType.Major) {
            const third = new Note(tryPitchUpKey(rootkey, 2)); // Third note
            const fifth = new Note(tryPitchUpKey(rootkey, 4)); // Fifth note
            notes.push(third);
            notes.push(fifth);
        }
        else if (chordType == ChordType.Minor) {
            const third = new Note(tryPitchUpKey(rootkey, 2)); // Third note
            third.setAccidential(NoteAccidental.Flat);
            const fifth = new Note(tryPitchUpKey(rootkey, 4)); // Fifth note
            notes.push(third);
            notes.push(fifth);
        }
        else if (chordType == ChordType.Suspended4) {
            const third = new Note(tryPitchUpKey(rootkey, 3)); // Third note
            const fifth = new Note(tryPitchUpKey(rootkey, 4)); // Fifth note
            notes.push(third);
            notes.push(fifth);
        }
        else if (chordType == ChordType.Double3) {
            const second = new Note(tryPitchUpKey(rootkey, 2)); // Second note
            notes.push(second);
        }
        else if (chordType == ChordType.Double4) {
            const second = new Note(tryPitchUpKey(rootkey, 3)); // Second note
            notes.push(second);
        }
        else if (chordType == ChordType.Double5) {
            const second = new Note(tryPitchUpKey(rootkey, 4)); // Second note
            notes.push(second);
        }
        // 2. to abcstring
        let notesStr = '';
        notes.map((note, i) => {
            notesStr += note.toAbcString();
        });
        return `[${notesStr}]`;
    }
}
function tryPitchUpKey(key, interval, prelimit = 0) {
    const i_sequence = SequenceNoteKey.indexOf(key);
    if (i_sequence === -1) {
        console.warn('key is invalid .');
        return key;
    }
    else if (i_sequence + prelimit === SequenceNoteKey.length - 1) {
        console.warn('key is already at top.');
        return key;
    }
    const key_pitchUp = SequenceNoteKey[i_sequence + interval];
    if (!key_pitchUp) {
        console.warn('can not pitch up anymore.', key + ' + ' + interval);
        return key;
    }
    return key_pitchUp;
}
function tryPitchDownKey(key, interval) {
    const i_sequence = SequenceNoteKey.indexOf(key);
    if (i_sequence === -1) {
        console.warn('key is invalid.');
        return key;
    }
    else if (i_sequence === 0) {
        console.warn('key is already at bottom.');
        return key;
    }
    const key_pitchDown = SequenceNoteKey[i_sequence - interval];
    if (!key_pitchDown) {
        console.warn('can not pitch down anymore.', key + ' + ' + interval);
        return key;
    }
    return key_pitchDown;
}
//# sourceMappingURL=ChordNote_obsolete.js.map