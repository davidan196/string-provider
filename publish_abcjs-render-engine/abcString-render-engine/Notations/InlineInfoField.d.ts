import { InfoField } from './InfoField';
import { NotationType } from '../Enums/NotationType';
import { NotationSerializeInfo } from '../common';
export declare class InlineInfoField extends InfoField {
    ntype: NotationType;
    static deserialize(seriInfo: NotationSerializeInfo): InlineInfoField;
    toAbcString(): string;
}
