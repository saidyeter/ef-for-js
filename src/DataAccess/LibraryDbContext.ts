import { MsSqlAdapter } from "../Base/Adapter";
import { BaseDbSet, TableSaveChanges } from "../Base/Core";
import { Author, AuthorTable, AuthorTableNumbers, AuthorTableStrings } from "./Models/Author";
import { Book, BookTable, BookTableNumbers, BookTableStrings } from "./Models/Book";
import { Publisher, PublisherTable, PublisherTableNumbers, PublisherTableStrings } from "./Models/Publisher";

const adapter= new MsSqlAdapter('')

const book = BaseDbSet<Book, BookTableStrings, BookTableNumbers>('book',adapter,BookTable);
const author = BaseDbSet<Author, AuthorTableStrings, AuthorTableNumbers>('author',adapter,AuthorTable);
const publisher = BaseDbSet<Publisher, PublisherTableStrings, PublisherTableNumbers>('publisher',adapter,PublisherTable);

function SaveChanges(){
    TableSaveChanges(book.Changes, 'book', BookTable, adapter)
    TableSaveChanges(author.Changes, 'author', AuthorTable, adapter)
    TableSaveChanges(publisher.Changes, 'publisher', PublisherTable, adapter)
}

export default { book, author, publisher, SaveChanges }