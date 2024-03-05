import { NoteKey } from '../Enums/NoteKey';
import { NoteAccidental } from '../Enums/NoteAccidental';
import { Notation } from './Notation.abstract';
import { NotationType } from '../Enums/NotationType';
import { NoteDuration } from '../Enums/NoteDuration';
import { NotationSerializeInfo } from '../common';
export declare class Note extends Notation {
    key: NoteKey;
    protected duration: NoteDuration;
    protected accidental: NoteAccidental;
    hasTie: boolean;
    hasEndBlankSpace: boolean;
    lyrics: string;
    ntype: NotationType;
    constructor(key?: NoteKey, duration?: NoteDuration, accidental?: NoteAccidental, hasTie?: boolean, hasEndBlankSpace?: boolean, lyrics?: string);
    static deserialize(seriInfo: NotationSerializeInfo): Note;
    toAbcString(): string;
    toJSON(): {
        ntype: NotationType;
        state: (string | boolean)[];
    };
    pitchUp(): void;
    pitchDown(): void;
    setDuration(duration: NoteDuration): void;
    /**
     * 设置尾部空格(断开符尾)
     */
    setEndBlankSpaceIs(is: boolean): void;
    /**
     * 设置延音线符号
     */
    setHasTieIs(is: boolean): void;
    /**
     * 添加符号：升降，重升/降，自然
     */
    setAccidential(accidentalType: NoteAccidental): void;
}
