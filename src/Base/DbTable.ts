import { SqlDataType } from "./Adapter";

export interface DbTable {
    TableName: string;
    Columns: DbColumn[];
    KeyColumn: DbColumn;
}

export interface DbColumn {
    Name: string
    Type: SqlDataType
}
