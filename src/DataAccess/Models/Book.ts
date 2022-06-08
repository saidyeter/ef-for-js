// import { DbTable } from "../../Base/Uncommitted"

import { DbTable } from "../../Base/DbTable"

export type Book = {
    Id?: number
    InsertedAt: Date
    Name: string
    AuthorId: number
    PublisherId: number
}

const nums =["Id" , "AuthorId" , "PublisherId"] as const
export type BookTableNumbers = typeof nums[number]
export type BookTableStrings = "Name" 
export type BookTableDates = "InsertedAt" 


export const BookTable: DbTable = {
    Columns: [
        
        { Name: 'InsertedAt', Type: 'Date' },
        { Name: 'Name', Type: 'string' },
        { Name: 'AuthorId', Type: 'number' },
        { Name: 'PublisherId', Type: 'number' }
    ],
    KeyColumn : { Name: 'Id', Type: 'number' },
}