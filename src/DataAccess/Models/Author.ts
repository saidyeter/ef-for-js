import { Empty } from "../../Base/DbSet"
import { DbTable } from "../../Base/DbTable"

export type Author = {
    Id?: number
    Name: string
    Origin: string
}

export type AuthorTableNumbers = "Id"
export type AuthorTableStrings = "Name" | 'Origin'
export type AuthorTableDates = keyof Empty

export const AuthorTable: DbTable = {
    TableName: 'author',
    Columns: [
        { Name: 'Origin', Type: 'nvarchar' },
        { Name: 'Name', Type: 'nvarchar' },
    ],
    KeyColumn: { Name: 'Id', Type: 'int' },
}