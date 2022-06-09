import { MsSqlAdapter } from "./Base/Adapter";
import { TableSaveChanges } from "./Base/Core";
import db from "./DataAccess/LibraryDbContext";
import { BookTable } from "./DataAccess/Models/Book";


db.book.Add({
    InsertedAt: new Date(),
    Name: 'Lord of the Rings',
    AuthorId: 23,
    PublisherId: 2,
})

console.log(db.book.Changes);

const some = db.book
    .Where()
    .BiggerThen('PublisherId', 25)
    .Contains('Name', 'ali')
    .GetAll()

console.log(some);

const adapter= new MsSqlAdapter('')
TableSaveChanges(db.book.Changes, 'book', BookTable,adapter)

db.book
    .Where()
    .GetAll()