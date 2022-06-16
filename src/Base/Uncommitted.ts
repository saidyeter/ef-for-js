import { ChangeKindEnum } from "./ChangeKindEnum";


export interface Uncommitted<T> {
    Data: T
    ChangeKind: ChangeKindEnum
};

