import { StaveCommand } from '../common';
import { NotationType } from '../Enums/NotationType';
export interface INotation {
    ntype: NotationType;
    /**
     * 在 `abcstring` 中的开始位置
     * 如果这个值为0则表示尚未添加到 stave 中
     * 任何一个 `INotation` 都应该有 ibegin和iend
     * 除了谱子标头信息部分其他的都是INotation
     */
    readonly ibegin: number;
    /**
     * 在 abcstring 中的结束位置
     */
    readonly iend: number;
    query(param: any): boolean;
    /**
     * 将"符号"写入"谱子"
     * 订阅"谱子"相关的变化，自己的变化也将通知到"谱子"
     * @param stave
     * @param command 更新到`stave`的命令对象，所有对`stave`的交互都是通过该对象
     */
    addToStave(command: StaveCommand): any;
    insertToStaveAfter(nbefore: INotation, command: StaveCommand): any;
    insertToStaveBefore(nafter: INotation, command: StaveCommand): any;
    updateInStave(): any;
    removeInStave(): any;
    toAbcString(): any;
}
