/**
 * @description `反序列化` 所有的状态应该可在构造函数内被还原；
 * 构造函数内的公共参数不应由外部变化，仅作只读访问
 */
export class Notation {
    constructor() {
        this._ibegin = 0;
        this._iend = 0;
        this.stringIndexChangeHandle = (sender, e) => {
            const isExceedThisEnd = this._ibegin > e.org_iend;
            if (sender == this || !isExceedThisEnd) {
                // 除去本身触发这个事件的，没超过需要更新的结尾索引的
                return;
            }
            // 更新在abcString中的索引
            const change = e.iend - e.org_iend;
            this._ibegin += change;
            this._iend += change;
        };
    }
    /**
     * gatter 只用来作hook,返回值不应该被改变
     */
    get ibegin() {
        return this._ibegin;
    }
    /**
     * gatter 只用来作hook,返回值不应该被改变
     */
    get iend() {
        return this._iend;
    }
    query(param) {
        return this.ibegin === param.ichar_start && this.iend === param.ichar_end;
    }
    addToStave(command) {
        if (this._command)
            return;
        this._command = command;
        this._command.subscribeAbcStringIndexChange(this.stringIndexChangeHandle);
        this._command.updateAbcString(this.createUpdateAbcStringHandle());
        this._command.updateNotations(narr => {
            narr.push(this);
            return narr;
        });
    }
    insertToStaveAfter(nbefore, command) {
        if (this._command)
            return;
        this._command = command;
        this._command.updateNotations(narr => {
            const iBefore = narr.indexOf(nbefore);
            if (iBefore == -1) {
                throw '将插入的 notation 不存在';
            }
            let forward = narr.slice(0, iBefore + 1);
            let backward = narr.slice(iBefore + 1);
            narr = forward.concat(this).concat(backward);
            return narr;
        });
        this._command.subscribeAbcStringIndexChange(this.stringIndexChangeHandle);
        this._command.updateAbcString(this.createUpdateAbcStringHandle(nbefore));
    }
    insertToStaveBefore(nafter, command) {
        if (this._command)
            return;
        let nbefore = null;
        this._command = command;
        this._command.updateNotations(narr => {
            const iAfter = narr.indexOf(nafter);
            nbefore = narr[iAfter - 1];
            if (iAfter == -1 || !nbefore) {
                throw 'notation 不存在, 将插入到notation前方的操作失败';
            }
            let forward = narr.slice(0, iAfter);
            let backward = narr.slice(iAfter);
            narr = forward.concat(this).concat(backward);
            return narr;
        });
        this._command.subscribeAbcStringIndexChange(this.stringIndexChangeHandle);
        this._command.updateAbcString(this.createUpdateAbcStringHandle(nbefore));
    }
    updateInStave() {
        if (!this._command)
            return;
        this._command.updateAbcString(this.createUpdateAbcStringHandle());
    }
    removeInStave() {
        if (!this._command)
            return;
        this.toAbcString = () => ''; // 删除即更新为空字符串
        this._command.updateNotations(narr => {
            const iRemove = narr.indexOf(this);
            if (iRemove == -1) {
                throw 'notation 未添加, 移除无效';
            }
            narr.splice(iRemove, 1);
            return narr;
        });
        this._command.updateAbcString(this.createUpdateAbcStringHandle());
        this._command.unsubscribeAbcStringIndexChange();
    }
    appendAbcStringHandle() {
        const notationStr = this.toAbcString();
        return abcstr => {
            this._ibegin = abcstr.length;
            this._iend = this._ibegin + notationStr.length - 1;
            return {
                newStaveAbcString: abcstr + notationStr,
            };
        };
    }
    insertAbcStringHandle(before) {
        const notationStr = this.toAbcString();
        // 插入到前一符号后
        return abcstr => {
            // a.拆分出前后字符串
            const forward = abcstr.substring(0, before.ibegin);
            const backend = abcstr.substring(before.iend + 1);
            // b.处理相关记录的索引
            const org_iend = before.iend;
            this._ibegin = before.iend + 1;
            this._iend = this._ibegin + notationStr.length - 1;
            return {
                newStaveAbcString: forward
                    .concat(before.toAbcString())
                    .concat(notationStr)
                    .concat(backend),
                changesInfo: { org_iend, iend: this.iend, sender: this },
            };
        };
    }
    updateAbcStringHandle() {
        const notationStr = this.toAbcString();
        // 已添加到 stave, 直接更新
        return abcstr => {
            // a.拆分出前后字符串
            const forward = abcstr.substring(0, this._ibegin);
            const backend = abcstr.substring(this._iend + 1);
            // b.处理相关记录的索引
            const org_iend = this._iend;
            this._iend = this._ibegin + notationStr.length - 1; // 删除的索引变化为 org_istar-1, 即iend - len 或 ibegin - 1
            return {
                newStaveAbcString: forward.concat(notationStr).concat(backend),
                changesInfo: { org_iend, iend: this.iend, sender: this },
            };
        };
    }
    createUpdateAbcStringHandle(before) {
        if (this._iend === 0) {
            // 尚未添加到 stave
            if (!before) {
                // 附加到最后
                return this.appendAbcStringHandle();
            }
            else {
                // 插入到前一符号后
                return this.insertAbcStringHandle(before);
            }
        }
        else {
            // 已添加到 stave, 直接更新
            return this.updateAbcStringHandle();
        }
    }
}
//# sourceMappingURL=Notation.abstract.js.map