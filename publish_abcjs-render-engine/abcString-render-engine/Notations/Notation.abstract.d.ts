import { INotation } from './INotation';
import { StringsIndexChangeHandle, StaveCommand, UpdateAbcStringHandle, NotationSerializeInfo } from '../common';
import { NotationType } from '../Enums/NotationType';
/**
 * @description `反序列化` 所有的状态应该可在构造函数内被还原；
 * 构造函数内的公共参数不应由外部变化，仅作只读访问
 */
export declare abstract class Notation implements INotation {
    /**
     * gatter 只用来作hook,返回值不应该被改变
     */
    get ibegin(): number;
    /**
     * gatter 只用来作hook,返回值不应该被改变
     */
    get iend(): number;
    /**
     * 标志序列化前的类型
     */
    abstract ntype: NotationType;
    protected _ibegin: number;
    protected _iend: number;
    protected _command: StaveCommand;
    constructor();
    abstract toAbcString(): string;
    abstract toJSON(): NotationSerializeInfo;
    query(param: any): boolean;
    addToStave(command: StaveCommand): void;
    insertToStaveAfter(nbefore: INotation, command: StaveCommand): void;
    insertToStaveBefore(nafter: INotation, command: StaveCommand): void;
    updateInStave(): void;
    removeInStave(): void;
    protected stringIndexChangeHandle: StringsIndexChangeHandle;
    protected appendAbcStringHandle(): UpdateAbcStringHandle;
    protected insertAbcStringHandle(before: INotation): UpdateAbcStringHandle;
    protected updateAbcStringHandle(): UpdateAbcStringHandle;
    protected createUpdateAbcStringHandle(before?: INotation): UpdateAbcStringHandle;
}
