import { DbTable } from "../../Base/DbTable"

export type Book = {
    Id?: number
    PublishedAt: Date
    Name: string
    AuthorId: number
}

const nums =["Id" , "AuthorId" ] as const
export type BookTableNumbers = typeof nums[number]
export type BookTableStrings = "Name" 
export type BookTableDates = "PublishedAt" 

export const BookTable: DbTable = {
    Columns: [
        
        { Name: 'PublishedAt', Type: 'datetime' },
        { Name: 'Name', Type: 'nvarchar' },
        { Name: 'AuthorId', Type: 'int' },
    ],
    KeyColumn : { Name: 'Id', Type: 'int' },
}