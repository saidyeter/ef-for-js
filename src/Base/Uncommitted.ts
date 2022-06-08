import { ChangeKindEnum } from "./ChangeKindEnum";


export type Uncommitted<T> = {
    Data: T
    ChangeKind: ChangeKindEnum
};



export interface DbTable{
    Columns: DbColumn[]
}


export interface DbColumn{
    Name: string
    Type: string
    IsKey?: boolean

}
