import { NoteKey } from './Enums/NoteKey';
import { NoteDuration } from './Enums/NoteDuration';
import { ChordType } from './Enums/ChordType';
/**
 * 内容不会被abcjs展示，用来保证符号之间的分割而不会粘滞
 */
export declare const SymbolSpacer = "@";
export declare const SequenceNoteKey: NoteKey[];
export declare const NoteDurationNameMap: {
    0.0625: NoteDuration;
    0.125: NoteDuration;
    0.1875: NoteDuration;
    0.25: NoteDuration;
    0.375: NoteDuration;
    0.5: NoteDuration;
    1: NoteDuration;
};
export declare const ChordNoteIntervalMap: {
    [ChordType.Major]: number;
    [ChordType.Minor]: number;
    [ChordType.Augmented]: number;
    [ChordType.Diminished]: number;
    [ChordType.Suspended4]: number;
};
