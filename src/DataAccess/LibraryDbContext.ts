import { DbAdapter } from "../Base/Adapter";
import { BaseDbSet, TableSaveChanges } from "../Base/Core";
import { Author, AuthorTable, AuthorTableNumbers, AuthorTableDates, AuthorTableStrings } from "./Models/Author";
import { Book, BookTable, BookTableDates, BookTableNumbers, BookTableStrings } from "./Models/Book";

function init(adapter: DbAdapter) {
    const book = BaseDbSet<Book, BookTableStrings, BookTableNumbers, BookTableDates>(adapter, BookTable);
    const author = BaseDbSet<Author, AuthorTableStrings, AuthorTableNumbers, AuthorTableDates>(adapter, AuthorTable);

    async function SaveChanges(): Promise<void> {
        await TableSaveChanges(book.Changes, BookTable, adapter)
        await TableSaveChanges(author.Changes, AuthorTable, adapter)
    }

    return { book, author, SaveChanges }
}

export default { init }