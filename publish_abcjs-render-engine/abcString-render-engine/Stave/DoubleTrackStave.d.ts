import { InfoField } from '../Notations/InfoField';
import { InlineInfoField } from '../Notations/InlineInfoField';
import { StaveBase } from './StaveBase';
import { INotation } from '../Notations/INotation';
/**
 *
 * @description
 * a. 添加的任何 Notation 都可能引起 abcstring 变化
 * b. 添加的 Notation 的变化都可能引起 abcstring 变化
 */
export declare class StaveDoubleTrack extends StaveBase {
    spacingStaves: InfoField;
    rightHandHeader: InfoField;
    leftHandHeader: InfoField;
    rightHand: InlineInfoField;
    leftHand: InlineInfoField;
    constructor();
    protected trySetStaveFieldFrom(notation: INotation): void;
    init(dataraw?: string): this;
    save(): string;
}
