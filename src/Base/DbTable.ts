import { SqlDataType } from "./Adapter";

export interface DbTable {
    Columns: DbColumn[];
    KeyColumn: DbColumn;
}

export interface DbColumn {
    Name: string
    Type: SqlDataType
}
