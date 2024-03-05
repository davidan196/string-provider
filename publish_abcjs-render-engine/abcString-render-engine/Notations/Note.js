import { NoteKey } from '../Enums/NoteKey';
import { SequenceNoteKey } from '../constant';
import { NoteAccidental } from '../Enums/NoteAccidental';
import { Notation } from './Notation.abstract';
import { NotationType } from '../Enums/NotationType';
import { NoteDuration } from '../Enums/NoteDuration';
export class Note extends Notation {
    constructor(key = NoteKey.C1, duration = NoteDuration.Quarter, accidental = NoteAccidental.None, hasTie = false, hasEndBlankSpace = false, lyrics = '') {
        super();
        this.key = key;
        this.duration = duration;
        this.accidental = accidental;
        this.hasTie = hasTie;
        this.hasEndBlankSpace = hasEndBlankSpace;
        this.lyrics = lyrics;
        this.ntype = NotationType.Note;
        const i_sequence = SequenceNoteKey.indexOf(key);
        if (isNaN(i_sequence)) {
            throw 'invalid key.';
        }
    }
    static deserialize(seriInfo) {
        return new Note(...seriInfo.state);
    }
    toAbcString() {
        // Tie须靠近note字符
        return (this.accidental +
            this.key +
            this.duration +
            (this.hasTie ? '-' : '') +
            (this.hasEndBlankSpace ? ' ' : ''));
    }
    toJSON() {
        return {
            ntype: this.ntype,
            state: [this.key, this.duration, this.accidental, this.hasTie, this.hasEndBlankSpace, this.lyrics],
        };
    }
    pitchUp() {
        const note_pitchUp = tryPitchUpKey(this.key, 1);
        if (this.key === note_pitchUp) {
            return;
        }
        this.key = note_pitchUp;
        this.updateInStave();
    }
    pitchDown() {
        const note_pitchDown = tryPitchDownKey(this.key, 1);
        if (this.key === note_pitchDown) {
            return;
        }
        this.key = note_pitchDown;
        this.updateInStave();
    }
    setDuration(duration) {
        this.duration = duration;
        this.updateInStave();
    }
    /**
     * 设置尾部空格(断开符尾)
     */
    setEndBlankSpaceIs(is) {
        this.hasEndBlankSpace = is;
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
     * 添加符号：升降，重升/降，自然
     */
    setAccidential(accidentalType) {
        this.accidental = accidentalType;
        this.updateInStave();
    }
}
function tryPitchUpKey(key, interval) {
    const i_sequence = SequenceNoteKey.indexOf(key);
    if (i_sequence === -1) {
        console.warn('key is invalid .');
        return key;
    }
    else if (i_sequence === SequenceNoteKey.length - 1) {
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
//# sourceMappingURL=Note.js.map