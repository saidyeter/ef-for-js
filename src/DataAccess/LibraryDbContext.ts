import { DbAdapter } from "../Base/Adapter";
import { BaseDbSet, TableSaveChanges } from "../Base/Core";
import { Author, AuthorTable, AuthorTableNumbers, AuthorTableDates, AuthorTableStrings } from "./Models/Author";
import { Book, BookTable, BookTableDates, BookTableNumbers, BookTableStrings } from "./Models/Book";


function init(adapter: DbAdapter) {
    const book = BaseDbSet<Book, BookTableStrings, BookTableNumbers, BookTableDates>('book', adapter, BookTable);
    const author = BaseDbSet<Author, AuthorTableStrings, AuthorTableNumbers, AuthorTableDates>('author', adapter, AuthorTable);

    async function SaveChanges(): Promise<void> {
        await TableSaveChanges(book.Changes, 'book', BookTable, adapter)
        await TableSaveChanges(author.Changes, 'author', AuthorTable, adapter)
    }

    return { book, author, SaveChanges }
}

export default { init }