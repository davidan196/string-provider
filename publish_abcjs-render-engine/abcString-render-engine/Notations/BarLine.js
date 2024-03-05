import { NewLine } from '../utils';
import { Notation } from './Notation.abstract';
import { BarlineType } from '../Enums/BarlineType';
import { SymbolSpacer } from '../constant';
import { NotationType } from '../Enums/NotationType';
export class BarLine extends Notation {
    constructor(type = BarlineType.SingleBarline, hasNewlineInEnd = false, repeatsNumber = 0) {
        super();
        this.type = type;
        this.hasNewlineInEnd = hasNewlineInEnd;
        this.repeatsNumber = repeatsNumber;
        this.ntype = NotationType.BarLine;
    }
    static deserialize(seriInfo) {
        return new BarLine(...seriInfo.state);
    }
    toJSON() {
        return {
            ntype: this.ntype,
            state: [this.type, this.hasNewlineInEnd, this.repeatsNumber],
        };
    }
    toAbcString() {
        return (SymbolSpacer + // 防止粘滞到一起出现非预期的展示
            (this.type === BarlineType.SingleBarline
                ? '|'
                : this.type === BarlineType.DoubleBarline
                    ? '||'
                    : this.type === BarlineType.ThickThin_DoubleBarline
                        ? '[|'
                        : this.type === BarlineType.ThinThick_DoubleBarline
                            ? '|]'
                            : this.type === BarlineType.RepeatedSetion_Start
                                ? '|:'
                                : this.type === BarlineType.RepeatedSetion_End
                                    ? ':|'
                                    : this.type === BarlineType.RepeatedSetion_StartAndEnd
                                        ? '::'
                                        : '|') +
            (this.repeatsNumber ? this.repeatsNumber : '') +
            (this.hasNewlineInEnd ? NewLine : ''));
    }
    query(param) {
        if (!param.ichar_end) {
            return false;
        }
        return (
        // 因为abcjs选中回调中 不包括分割符号
        this.ibegin + SymbolSpacer.length === param.ichar_start &&
            // 因为abcjs选中回调中 不包括换行符，所以带换行符的符号要比实际少1，但是内部索引操作还是正常使用
            this.iend + (this.hasNewlineInEnd ? -1 : 0) === param.ichar_end);
    }
    setNewlineInEnd() {
        this.hasNewlineInEnd = true;
        this.updateInStave();
    }
    setBarlineType(newtype) {
        this.type = newtype;
        this.updateInStave();
    }
    setRepeatsNumber(serialNumber) {
        this.repeatsNumber = serialNumber;
        this.updateInStave();
    }
}
//# sourceMappingURL=BarLine.js.map