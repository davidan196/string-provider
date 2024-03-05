import { Notation } from './Notation.abstract';
import { BarlineType } from '../Enums/BarlineType';
import { NotationType } from '../Enums/NotationType';
import { NotationSerializeInfo } from '../common';
export declare class BarLine extends Notation {
    type: BarlineType;
    hasNewlineInEnd: boolean;
    repeatsNumber: number;
    ntype: NotationType;
    constructor(type?: BarlineType, hasNewlineInEnd?: boolean, repeatsNumber?: number);
    static deserialize(seriInfo: NotationSerializeInfo): BarLine;
    toJSON(): {
        ntype: NotationType;
        state: (number | boolean)[];
    };
    toAbcString(): string;
    query(param: any): boolean;
    setNewlineInEnd(): void;
    setBarlineType(newtype: BarlineType): void;
    setRepeatsNumber(serialNumber: number): void;
}
