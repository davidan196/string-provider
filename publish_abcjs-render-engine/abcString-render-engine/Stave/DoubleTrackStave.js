import { InfoField } from '../Notations/InfoField';
import { InfoFiledType } from '../Enums/InfoFieldType';
import { InlineInfoField } from '../Notations/InlineInfoField';
import { StaveBase } from './StaveBase';
import { InfoFiledContent } from '../Enums/InfoFiledContent';
/**
 *
 * @description
 * a. 添加的任何 Notation 都可能引起 abcstring 变化
 * b. 添加的 Notation 的变化都可能引起 abcstring 变化
 */
export class StaveDoubleTrack extends StaveBase {
    constructor() {
        super();
        this.spacingStaves = new InfoField(InfoFiledType.spacing_staves, InfoFiledContent.spacing_staves_PianoRightAndLeft);
        this.rightHandHeader = new InfoField(InfoFiledType.voice, InfoFiledContent.voice_righthand_header);
        this.leftHandHeader = new InfoField(InfoFiledType.voice, InfoFiledContent.voice_lefthand_header);
        this.rightHand = new InlineInfoField(InfoFiledType.voice, InfoFiledContent.voice_righthand);
        this.leftHand = new InlineInfoField(InfoFiledType.voice, InfoFiledContent.voice_lefthand);
    }
    trySetStaveFieldFrom(notation) {
        super.trySetStaveFieldFrom(notation);
        if (!(notation instanceof InfoField))
            return;
        if (notation.fieldType == InfoFiledType.voice) {
            if (notation instanceof InlineInfoField) {
                notation.getContent() == InfoFiledContent.voice_righthand && (this.rightHand = notation);
                notation.getContent() == InfoFiledContent.voice_lefthand && (this.leftHand = notation);
            }
            else {
                notation.getContent() == InfoFiledContent.voice_righthand && (this.rightHandHeader = notation);
                notation.getContent() == InfoFiledContent.voice_lefthand && (this.leftHandHeader = notation);
            }
        }
    }
    init(dataraw = '[]') {
        var data = JSON.parse(dataraw);
        if (this.abcString) {
            return;
        }
        if (data.length) {
            for (const nState of data) {
                const notation = this.deserializeNotation(nState);
                this.trySetStaveFieldFrom(notation);
                this.addNotation(notation);
            }
        }
        else {
            const headers = [
                this.id,
                this.title,
                this.composer,
                this.tempo,
                this.metre,
                this.unitNoteLength,
                this.spacingStaves,
                this.rightHandHeader,
                this.leftHandHeader,
                this.key,
                this.rightHand,
                this.leftHand
            ];
            for (const notation of this.notations.concat(headers)) {
                this.addNotation(notation);
            }
        }
        return this;
    }
    save() {
        return JSON.stringify(this.notations);
    }
}
//# sourceMappingURL=DoubleTrackStave.js.map