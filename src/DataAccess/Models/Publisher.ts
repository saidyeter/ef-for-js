import { DbTable } from "../../Base/DbTable"

export type Publisher = {
    Id: number
    InsertedAt: Date
    Name: string
}

export type PublisherTableNumbers = "Id" 
export type PublisherTableStrings = "Name" 
export type PublisherTableDates = "InsertedAt" 

export const PublisherTable: DbTable = {
    Columns: [
        { Name: 'InsertedAt', Type: 'datetime' },
        { Name: 'Name', Type: 'nvarchar' },
    ],
    KeyColumn : { Name: 'Id', Type: 'int' },
}