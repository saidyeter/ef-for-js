import { DbAdapter } from "../Base/Adapter";
import { BaseDbSet, TableSaveChanges } from "../Base/Core";
import { Author, AuthorTable, AuthorTableDates, AuthorTableNumbers, AuthorTableStrings } from "./Models/Author";
import { Book, BookTable, BookTableDates, BookTableNumbers, BookTableStrings } from "./Models/Book";
import { Publisher, PublisherTable, PublisherTableDates, PublisherTableNumbers, PublisherTableStrings } from "./Models/Publisher";


function init(adapter: DbAdapter) {
    const book = BaseDbSet<Book, BookTableStrings, BookTableNumbers, BookTableDates>('book', adapter, BookTable);
    const author = BaseDbSet<Author, AuthorTableStrings, AuthorTableNumbers, AuthorTableDates>('author', adapter, AuthorTable);
    const publisher = BaseDbSet<Publisher, PublisherTableStrings, PublisherTableNumbers, PublisherTableDates>('publisher', adapter, PublisherTable);

    async function SaveChanges(): Promise<void> {
        await TableSaveChanges(book.Changes, 'book', BookTable, adapter)
        await TableSaveChanges(author.Changes, 'author', AuthorTable, adapter)
        await TableSaveChanges(publisher.Changes, 'publisher', PublisherTable, adapter)
    }

    return { book, author, publisher, SaveChanges }
}

export default { init }