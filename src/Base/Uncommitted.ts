import { ChangeKindEnum } from "./ChangeKindEnum";


export type Uncommitted<T> = {
    Data: T
    ChangeKind: ChangeKindEnum
};

