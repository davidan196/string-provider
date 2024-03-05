import { Notation } from './Notation.abstract';
import { Note } from './Note';
import { NotationType } from '../Enums/NotationType';
import { NoteDuration } from '../Enums/NoteDuration';
import { NotationSerializeInfo } from '../common';
/**
 * a.默认新增是大三和弦，可以改变和弦的属性去调整和弦内音符的相对属性
 * b.节奏和音符装饰(Decorations)可以标志在[xxx]周围,但是具体到音符的符号(Accidential)必须要在
 * 音符内去附加;
 * @summary ！！选中的ChordNote的abcstring索引不会关联到位于之前的特殊符号，比如slurs
 * @todo
 * A. 添加`note`后如果设置`hasEndBlankSpace`空格，可能导致无法选中，因为不会截取到空格;
 * 但是其后`notation`，则会选中空格（先添加小节不影响使用）;
 */
export declare class ChordNote extends Notation {
    notes: Note[];
    duration: NoteDuration;
    hasTie: boolean;
    hasEndBlankSpace: boolean;
    lyrics: string;
    ntype: NotationType;
    constructor(notes?: Note[], duration?: NoteDuration, hasTie?: boolean, hasEndBlankSpace?: boolean, lyrics?: string);
    static deserialize(seriInfo: NotationSerializeInfo): ChordNote;
    toAbcString(): string;
    toJSON(): {
        ntype: NotationType;
        state: (string | boolean | Note[])[];
    };
    pitchUp(): void;
    pitchDown(): void;
    /**
     * 设置延音线符号
     */
    setHasTieIs(is: boolean): void;
    /**
     * 设置尾部空格(断开符尾)
     */
    setEndBlankSpaceIs(is: boolean): void;
    setDuration(duration: NoteDuration): void;
}
