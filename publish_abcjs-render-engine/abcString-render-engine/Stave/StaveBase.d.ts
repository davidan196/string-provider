import { INotation } from '../Notations/INotation';
import { StringsIndexChangeHandle, StaveCommand, NotationSerializeInfo } from '../common';
import { InfoField } from '../Notations/InfoField';
import { Note } from '../Notations/Note';
import { BarLine } from '../Notations/BarLine';
import { RestNote } from '../Notations/RestNote';
import { ChordNote } from '../Notations/ChordNote';
/**
 * @description
 * a. 添加的任何 Notation 及变化可能引起 abcstring 变化
 */
export declare abstract class StaveBase {
    static readonly abcversion: string;
    get abcString(): string;
    set abcString(v: string);
    id: InfoField;
    title: InfoField;
    composer: InfoField;
    tempo: InfoField;
    metre: InfoField;
    key: InfoField;
    /**
     * @public 不建议修改
     * @summary 固定值，整个库都是以这个默认来做；如果变动其他关于时值的值都要变化
     */
    unitNoteLength: InfoField;
    protected _abcString: string;
    protected notations: INotation[];
    protected stringIndexChangeSubscribers: StringsIndexChangeHandle[];
    protected abcstringChangeHandle: (newString: string) => void;
    constructor();
    /**
     * @param handle 不能含有更新字符串的操作，否则会造成循环更新
     */
    setStaveChangeHandle(handle: (s: string) => void): void;
    /**
     * @param ichar_start
     * @param ichar_end abcjs中的通常会大1, 表示[,) 结尾开区间
     */
    getNotation(ichar_start: number, ichar_end: number): INotation;
    addNotation(notation: INotation): void;
    insertNotationAfter(before: INotation, notation: INotation): void;
    insertNotationBefore(after: INotation, notation: INotation): void;
    /**
     * 从字符串区间中删除符号
     */
    deleteNotation(notation: INotation): void;
    generationLyrics(): void;
    save(): string;
    protected deserializeNotation(seriInfo: NotationSerializeInfo): Note | InfoField | RestNote | BarLine | ChordNote;
    protected trySetStaveFieldFrom(notation: INotation): void;
    /**
     * 添加string index的变动通知，为了保持note的 索引正确
     * @field `string index` add,del,update 操作都可能会引起索引变化
     * @param subHandle
     */
    protected subscribeStringIndexChange(subHandle: StringsIndexChangeHandle): () => void;
    /**
     * 分发 stringindexchange 的通知，为了保证低耦合，触发分发应该在该类执行
     * @param iend
     * @param iorg_end
     */
    protected triggleStringIndexChange(sender: object, iend: number, org_iend: number): void;
    /**
     * 创建命令对象，解耦 notation 和 stave
     * @summary 添加的时候需维持 每个notation 对应一个 command，不然可能有一些奇怪的bug;
     */
    protected createOperateCommand(): StaveCommand;
}
