import { InfoFiledType } from '../Enums/InfoFieldType';
import { Notation } from './Notation.abstract';
import { NotationType } from '../Enums/NotationType';
import { NotationSerializeInfo } from '../common';
export declare class InfoField extends Notation {
    fieldType: InfoFiledType;
    protected content: string;
    ntype: NotationType;
    constructor(fieldType?: InfoFiledType, content?: string);
    static deserialize(seriInfo: NotationSerializeInfo): InfoField;
    toJSON(): {
        ntype: NotationType;
        state: string[];
    };
    setContent(setter: (string: any) => string): InfoField;
    setContent(setter: string): InfoField;
    getContent(): string;
    toAbcString(): string;
}
