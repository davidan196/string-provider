import { INotation } from '../INotation';
export interface IBoundary extends INotation {
    siblingBoundary: IBoundary;
    n_inner: INotation;
    link(sibling: IBoundary): any;
    getInner(): INotation;
}
