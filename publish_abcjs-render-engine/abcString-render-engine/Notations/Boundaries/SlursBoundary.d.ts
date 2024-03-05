import { INotation } from '../INotation';
import { Notation } from '../Notation.abstract';
import { NotationType } from '../../Enums/NotationType';
import { IBoundary } from './IBoundary';
import { StaveCommand } from '../../common';
import { Stave } from '../../Stave/Stave';
/**
 * 圆滑线(Slur)
 * @description 必须俩个音符(Note)以上得才能 组成 Ties；
 * 不支持和弦(Chord) ,因为选中的和弦 的abcstring索引不会关联到之前的特殊符号
 */
export declare class SlursBoundary extends Notation implements IBoundary {
    n_inner: INotation;
    isEnding: boolean;
    ntype: NotationType;
    /**
     * 相关联的 "boundary"
     */
    siblingBoundary: IBoundary;
    /**
     * 实例成对的Unisons
     */
    static setBeginning(beginNote: INotation): {
        setEnding: (endNote: INotation) => {
            appendToStave: (stave: Stave) => void;
        };
    };
    /**
     * @param n_inner 将依附的`notation`: 最多只能依附一个begin和一个end,如果多重依附将会抛异常
     * @param isEnding 是否为结束边界
     */
    private constructor();
    toJSON(): {
        ntype: NotationType;
        state: boolean[];
    };
    toAbcString(): ")" | "(";
    getInner(): INotation;
    /**
     * 具有boundary 的 note; 选中索引会加上前缀或后缀
     */
    query(param: any): boolean;
    addToStave(command: StaveCommand): void;
    insertToStaveAfter(before: INotation, command: StaveCommand): void;
    updateInStave(): void;
    removeInStave(): void;
    /**
     * Boundary互调用 ; 实现关联逻辑
     * @param sibling 被动关联的Boundary
     */
    link(sibling: IBoundary): void;
}
