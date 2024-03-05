import { InfoFiledType } from '../Enums/InfoFieldType';
import { NewLine } from '../utils';
import { Notation } from './Notation.abstract';
import { NotationType } from '../Enums/NotationType';
export class InfoField extends Notation {
    constructor(fieldType = InfoFiledType.reference_number, content = '') {
        super();
        this.fieldType = fieldType;
        this.content = content;
        this.ntype = NotationType.InfoField;
    }
    static deserialize(seriInfo) {
        return new InfoField(...seriInfo.state);
    }
    toJSON() {
        return {
            ntype: this.ntype,
            state: [this.fieldType, this.content]
        };
    }
    setContent(setter) {
        if (typeof setter === 'string') {
            setter;
            this.content = setter;
        }
        else if (typeof setter === 'function') {
            setter;
            this.content = setter(this.content);
        }
        this.updateInStave();
        return this;
    }
    getContent() {
        return this.content;
    }
    toAbcString() {
        return this.fieldType + this.content + NewLine;
    }
}
//# sourceMappingURL=InfoField.js.map