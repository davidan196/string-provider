import { InfoField } from './InfoField';
import { NotationType } from '../Enums/NotationType';
export class InlineInfoField extends InfoField {
    constructor() {
        super(...arguments);
        this.ntype = NotationType.IninlineInfoField;
    }
    static deserialize(seriInfo) {
        return new InlineInfoField(...seriInfo.state);
    }
    toAbcString() {
        return `[${this.fieldType + this.content}]`;
    }
}
//# sourceMappingURL=InlineInfoField.js.map