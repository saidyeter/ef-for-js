import { DbAdapterConstructorArgument, MsSqlAdapter } from "../Base/Adapter";
import { BaseDbSet, TableSaveChanges } from "../Base/Core";
import { Author, AuthorTable, AuthorTableNumbers, AuthorTableStrings } from "./Models/Author";
import { Book, BookTable, BookTableNumbers, BookTableStrings } from "./Models/Book";
import { Publisher, PublisherTable, PublisherTableNumbers, PublisherTableStrings } from "./Models/Publisher";


function init(connectionInfo: DbAdapterConstructorArgument) {
    const adapter = new MsSqlAdapter(connectionInfo)

    const book = BaseDbSet<Book, BookTableStrings, BookTableNumbers>('book', adapter, BookTable);
    const author = BaseDbSet<Author, AuthorTableStrings, AuthorTableNumbers>('author', adapter, AuthorTable);
    const publisher = BaseDbSet<Publisher, PublisherTableStrings, PublisherTableNumbers>('publisher', adapter, PublisherTable);

    async function SaveChanges() : Promise<void>{
        await TableSaveChanges(book.Changes, 'book', BookTable, adapter)
        await TableSaveChanges(author.Changes, 'author', AuthorTable, adapter)
        await TableSaveChanges(publisher.Changes, 'publisher', PublisherTable, adapter)
    }

    return { book, author, publisher, SaveChanges }
}

export default { init }