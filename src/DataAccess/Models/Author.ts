import { DbTable } from "../../Base/DbTable"

export type Author = {
    Id: number
    InsertedAt: Date
    Name: string
}

export type AuthorTableNumbers = "Id" 
export type AuthorTableStrings = "Name" 
export type AuthorTableDates = "InsertedAt" 

export const AuthorTable: DbTable = {
    Columns: [
        { Name: 'InsertedAt', Type: 'datetime' },
        { Name: 'Name', Type: 'nvarchar' },
    ],
    KeyColumn : { Name: 'Id', Type: 'int' },
}