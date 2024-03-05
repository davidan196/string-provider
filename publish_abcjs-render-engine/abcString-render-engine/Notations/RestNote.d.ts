import { Notation } from './Notation.abstract';
import { NotationType } from '../Enums/NotationType';
import { NoteDuration } from '../Enums/NoteDuration';
import { NotationSerializeInfo } from '../common';
export declare class RestNote extends Notation {
    duration: NoteDuration;
    ntype: NotationType;
    constructor(duration?: NoteDuration);
    static deserialize(seriInfo: NotationSerializeInfo): RestNote;
    toJSON(): {
        ntype: NotationType;
        state: NoteDuration[];
    };
    toAbcString(): string;
}
