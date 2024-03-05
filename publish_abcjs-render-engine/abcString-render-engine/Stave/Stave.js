import { StaveBase } from './StaveBase';
/**
 * @description
 */
export class Stave extends StaveBase {
    constructor() {
        super();
    }
    init(dataraw = '[]') {
        var data = JSON.parse(dataraw);
        if (this.abcString) {
            return;
        }
        if (data.length) {
            for (const serialInfo of data) {
                const notation = this.deserializeNotation(serialInfo);
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
                this.key,
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
//# sourceMappingURL=Stave.js.map