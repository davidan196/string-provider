import { Notation } from '../Notation.abstract';
import { NotationType } from '../../Enums/NotationType';
/**
 * 圆滑线(Slur)
 * @description 必须俩个音符(Note)以上得才能 组成 Ties；
 * 不支持和弦(Chord) ,因为选中的和弦 的abcstring索引不会关联到之前的特殊符号
 */
export class SlursBoundary extends Notation {
    /**
     * @param n_inner 将依附的`notation`: 最多只能依附一个begin和一个end,如果多重依附将会抛异常
     * @param isEnding 是否为结束边界
     */
    constructor(n_inner, isEnding) {
        super();
        this.n_inner = n_inner;
        this.isEnding = isEnding;
        this.ntype = NotationType.SlursBoundary;
        checkNoteBindingTies(this.n_inner, isEnding);
    }
    /**
     * 实例成对的Unisons
     */
    static setBeginning(beginNote) {
        const setEnding = function (endNote) {
            if (beginNote.iend >= endNote.iend) {
                console.warn(beginNote.iend, endNote.iend);
                throw '结束note位置不能大于等于开始note';
            }
            const begin = new SlursBoundary(beginNote, false);
            const end = new SlursBoundary(endNote, true);
            end.link(begin);
            return {
                appendToStave: function (stave) {
                    stave.addNotation(begin);
                    stave.addNotation(end);
                }
            };
        };
        return { setEnding };
    }
    toJSON() {
        return {
            ntype: this.ntype,
            state: [this.isEnding],
        };
    }
    toAbcString() {
        return this.isEnding ? ')' : '(';
    }
    getInner() {
        return this.n_inner;
    }
    /**
     * 具有boundary 的 note; 选中索引会加上前缀或后缀
     */
    query(param) {
        if (this.isEnding) {
            return this.iend === param.ichar_end;
        }
        else {
            return this.ibegin === param.ichar_start;
        }
    }
    addToStave(command) {
        if (this.isEnding) {
            super.insertToStaveAfter(this.n_inner, command);
        }
        else {
            super.insertToStaveBefore(this.n_inner, command);
        }
    }
    insertToStaveAfter(before, command) {
        throw 'no implement.';
    }
    updateInStave() {
        throw 'no implement.';
    }
    removeInStave() {
        uncheckNoteBindingTies(this.n_inner);
        super.removeInStave();
        this.removeInStave = function () { };
        // this.n_inner.removeInStave() // 不采用内联移除的方式可以 减少一些移除的bug
    }
    /**
     * Boundary互调用 ; 实现关联逻辑
     * @param sibling 被动关联的Boundary
     */
    link(sibling) {
        if (this.siblingBoundary === sibling) {
            return;
        }
        // combine Begin&End Method
        if (this.isEnding) {
            // 按照一定顺序删除,先end后begin（以修复一些bug）
            let rm_handle_end = this.removeInStave.bind(this);
            let rm_hendle_begin = sibling.removeInStave.bind(sibling);
            let removeInStave_linked = function () {
                rm_handle_end();
                rm_hendle_begin();
            };
            this.removeInStave = removeInStave_linked;
            sibling.removeInStave = removeInStave_linked;
        }
        this.siblingBoundary = sibling;
        sibling.link(this);
    }
}
// hack：记录note被依附Unison的flag
function checkNoteBindingTies(note, isEnding) {
    if (!note.__UnisonsBoundary_innner_flag) {
        note.__UnisonsBoundary_innner_flag = {}; // 实例一个对象防止解构异常
    }
    const { isBindBegin, isBindEnd } = note.__UnisonsBoundary_innner_flag;
    if ((isBindBegin && !isEnding) || (isBindEnd && isEnding)) {
        throw '不能在符号上重复添加Unisons';
    }
    note.__UnisonsBoundary_innner_flag[isEnding ? 'isBindEnd' : 'isBindBegin'] = true;
}
function uncheckNoteBindingTies(note) {
    note.__UnisonsBoundary_innner_flag && delete note.__UnisonsBoundary_innner_flag;
}
//# sourceMappingURL=SlursBoundary.js.map