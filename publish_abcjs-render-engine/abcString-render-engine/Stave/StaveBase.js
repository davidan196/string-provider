import { NotationType } from '../Enums/NotationType';
import { InfoField } from '../Notations/InfoField';
import { InfoFiledType } from '../Enums/InfoFieldType';
import { Note } from '../Notations/Note';
import { BarLine } from '../Notations/BarLine';
import { RestNote } from '../Notations/RestNote';
import { ChordNote } from '../Notations/ChordNote';
import { InlineInfoField } from '../Notations/InlineInfoField';
import { SlursBoundary } from '../Notations/Boundaries/SlursBoundary';
/**
 * @description
 * a. 添加的任何 Notation 及变化可能引起 abcstring 变化
 */
export class StaveBase {
    constructor() {
        this.id = new InfoField(InfoFiledType.reference_number, '1');
        this.title = new InfoField(InfoFiledType.title, 'untitled');
        this.composer = new InfoField(InfoFiledType.composer, 'anonymous');
        this.tempo = new InfoField(InfoFiledType.tempo, '60');
        this.metre = new InfoField(InfoFiledType.metre, '4/4');
        this.key = new InfoField(InfoFiledType.key, 'C');
        /**
         * @public 不建议修改
         * @summary 固定值，整个库都是以这个默认来做；如果变动其他关于时值的值都要变化
         */
        this.unitNoteLength = new InfoField(InfoFiledType.note_unit_length, '1/64'); // 单位缩小四倍，时值数值要扩大四倍
        this._abcString = '';
        this.notations = [];
        this.stringIndexChangeSubscribers = [];
        this.abcstringChangeHandle = function () { };
    }
    get abcString() {
        return this._abcString;
    }
    set abcString(v) {
        this._abcString = v;
        this.abcstringChangeHandle(v);
    }
    /**
     * @param handle 不能含有更新字符串的操作，否则会造成循环更新
     */
    setStaveChangeHandle(handle) {
        this.abcstringChangeHandle = handle;
    }
    /**
     * @param ichar_start
     * @param ichar_end abcjs中的通常会大1, 表示[,) 结尾开区间
     */
    getNotation(ichar_start, ichar_end) {
        var queryParam = { ichar_start, ichar_end };
        return this.notations.filter(x => x.query(queryParam)).pop(); // 取得最后一个
    }
    addNotation(notation) {
        notation.addToStave(this.createOperateCommand());
    }
    insertNotationAfter(before, notation) {
        if (before instanceof SlursBoundary) {
            if (!before.isEnding) {
                before = before.getInner();
            }
        }
        notation.insertToStaveAfter(before, this.createOperateCommand());
    }
    insertNotationBefore(after, notation) {
        if (after instanceof SlursBoundary) {
            if (!after.isEnding) {
                after = after.getInner();
            }
        }
        notation.insertToStaveBefore(after, this.createOperateCommand());
    }
    /**
     * 从字符串区间中删除符号
     */
    deleteNotation(notation) {
        const iRemove = this.notations.indexOf(notation);
        if (iRemove == -1) {
            console.warn('不存在将删除的notation');
            return;
        }
        notation.removeInStave();
    }
    generationLyrics() {
        // 删除原有的歌词信息
        this.notations.map((v, i) => {
            if (v instanceof InfoField && v.fieldType == InfoFiledType.words_aftertune) {
                this.deleteNotation(v);
            }
        });
        // 添加进所有的歌词信息
        let lyrics = []; // 每一行的歌词内容集
        for (let i = 0; i < this.notations.length; i++) {
            const n = this.notations[i];
            const n_next = this.notations[i + 1];
            // a.记录下每个音符的lyric 到 lyrics, 空的用占位符号替代
            if (n instanceof Note || n instanceof ChordNote) {
                lyrics.push(n.lyrics || '*');
            }
            // b. 到换行处/终点 的时候就 添加进这一行的lyrics
            const isBarlineEnd = n instanceof BarLine && n.hasNewlineInEnd;
            const isLeftHandEnd = !n_next;
            const isRightHandEnd = n_next instanceof InfoField &&
                n_next.fieldType == InfoFiledType.voice &&
                n_next.getContent() === 'PianoLeftHand';
            if (isBarlineEnd || isLeftHandEnd || isRightHandEnd) {
                var lyricWords = lyrics.join(' ');
                var lyricsInfoField = new InfoField(InfoFiledType.words_aftertune, lyricWords);
                lyrics = []; // 重新记录下一行lyrics
                // 如果结尾是小节线才添加歌词，其他情况暂不加（用作编辑完成，再添加歌词的场景）
                if (n instanceof BarLine) {
                    n.hasNewlineInEnd || n.setNewlineInEnd(); // 手动换行
                    this.insertNotationAfter(n, lyricsInfoField);
                    i++;
                }
            }
        }
    }
    save() {
        return JSON.stringify(this.notations);
    }
    deserializeNotation(seriInfo) {
        if (seriInfo.ntype == NotationType.Note) {
            return Note.deserialize(seriInfo);
        }
        else if (seriInfo.ntype == NotationType.InfoField) {
            return InfoField.deserialize(seriInfo);
        }
        else if (seriInfo.ntype == NotationType.IninlineInfoField) {
            return InlineInfoField.deserialize(seriInfo);
        }
        else if (seriInfo.ntype == NotationType.BarLine) {
            return BarLine.deserialize(seriInfo);
        }
        else if (seriInfo.ntype == NotationType.RestNote) {
            return RestNote.deserialize(seriInfo);
        }
        else if (seriInfo.ntype == NotationType.ChordNote) {
            return ChordNote.deserialize(seriInfo);
        }
    }
    trySetStaveFieldFrom(notation) {
        if (!(notation instanceof InfoField))
            return;
        if (notation.fieldType == InfoFiledType.reference_number) {
            this.id = notation;
        }
        else if (notation.fieldType == InfoFiledType.title) {
            this.title = notation;
        }
        else if (notation.fieldType == InfoFiledType.composer) {
            this.composer = notation;
        }
        else if (notation.fieldType == InfoFiledType.tempo) {
            this.tempo = notation;
        }
        else if (notation.fieldType == InfoFiledType.metre) {
            this.metre = notation;
        }
        else if (notation.fieldType == InfoFiledType.note_unit_length) {
            this.unitNoteLength = notation;
        }
        else if (notation.fieldType == InfoFiledType.key) {
            this.key = notation;
        }
    }
    /**
     * 添加string index的变动通知，为了保持note的 索引正确
     * @field `string index` add,del,update 操作都可能会引起索引变化
     * @param subHandle
     */
    subscribeStringIndexChange(subHandle) {
        const that = this;
        that.stringIndexChangeSubscribers.push(subHandle);
        return function () {
            const i = that.stringIndexChangeSubscribers.indexOf(subHandle);
            that.stringIndexChangeSubscribers.splice(i, 1);
        };
    }
    /**
     * 分发 stringindexchange 的通知，为了保证低耦合，触发分发应该在该类执行
     * @param iend
     * @param iorg_end
     */
    triggleStringIndexChange(sender, iend, org_iend) {
        // dispatch to subscribers
        for (let index = 0; index < this.stringIndexChangeSubscribers.length; index++) {
            this.stringIndexChangeSubscribers[index](sender, { iend, org_iend });
        }
    }
    /**
     * 创建命令对象，解耦 notation 和 stave
     * @summary 添加的时候需维持 每个notation 对应一个 command，不然可能有一些奇怪的bug;
     */
    createOperateCommand() {
        const updateAbcString = (update_abcsting) => {
            const orgStr = this.abcString;
            const { newStaveAbcString, changesInfo } = update_abcsting(orgStr);
            this.abcString = newStaveAbcString;
            if (changesInfo && changesInfo.iend != changesInfo.org_iend) {
                // 删除的索引变化为 org_istar-1, 即iend - len
                this.triggleStringIndexChange(changesInfo.sender, changesInfo.iend, changesInfo.org_iend);
            }
        };
        const updateNotations = (update_notations) => {
            this.notations = update_notations(this.notations) || this.notations;
        };
        let unsubscribe;
        const subscribeAbcStringIndexChange = (subhandle) => {
            unsubscribe = this.subscribeStringIndexChange(subhandle);
            return unsubscribe;
        };
        const unsubscribeAbcStringIndexChange = () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
        return {
            updateAbcString,
            updateNotations,
            subscribeAbcStringIndexChange,
            unsubscribeAbcStringIndexChange,
        };
    }
}
StaveBase.abcversion = 'standard:v2.1';
//# sourceMappingURL=StaveBase.js.map