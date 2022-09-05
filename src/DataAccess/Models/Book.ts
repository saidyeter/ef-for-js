import { DbTable } from "../../Base/DbTable"

export type Book = {
    Id?: number
    PublishedAt: Date
    Name: string
    AuthorId: number
}

const nums = ["Id", "AuthorId"] 
export type BookTableNumbers = typeof nums[number]
export type BookTableStrings = "Name"
export type BookTableDates = "PublishedAt"

export const BookTable: DbTable = {
    TableName: 'book',
    Columns: [
        { Name: 'PublishedAt', Type: 'datetime' },
        { Name: 'Name', Type: 'nvarchar' },
        { Name: 'AuthorId', Type: 'int' },
    ],
    KeyColumn: { Name: 'Id', Type: 'int' },
}