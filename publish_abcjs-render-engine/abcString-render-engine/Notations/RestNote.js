import { Notation } from './Notation.abstract';
import { NotationType } from '../Enums/NotationType';
import { NoteDuration } from '../Enums/NoteDuration';
export class RestNote extends Notation {
    constructor(duration = NoteDuration.Quarter) {
        super();
        this.duration = duration;
        this.ntype = NotationType.RestNote;
    }
    static deserialize(seriInfo) {
        return new RestNote(...seriInfo.state);
    }
    toJSON() {
        return {
            ntype: this.ntype,
            state: [this.duration]
        };
    }
    toAbcString() {
        return 'z' + this.duration;
    }
}
//# sourceMappingURL=RestNote.js.map