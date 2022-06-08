// import { DbTable } from "../../Base/Uncommitted"

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


// export const BookTable: DbTable = {
//     Columns: [
//         { Name: 'Id', Type: 'number' },
//         { Name: 'InsertedAt', Type: 'Date' },
//         { Name: 'Name', Type: 'string' },
//         { Name: 'AuthorId', Type: 'number' },
//         { Name: 'PublisherId', Type: 'number' }
//     ]
// }