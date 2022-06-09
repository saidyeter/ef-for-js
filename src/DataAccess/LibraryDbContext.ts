import { BaseDbSet } from "../Base/Core";
import { Author, AuthorTableNumbers, AuthorTableStrings } from "./Models/Author";
import { Book, BookTableNumbers, BookTableStrings } from "./Models/Book";
import { Publisher, PublisherTableNumbers, PublisherTableStrings } from "./Models/Publisher";

const book = BaseDbSet<Book, BookTableStrings, BookTableNumbers>('book');
const author = BaseDbSet<Author, AuthorTableStrings, AuthorTableNumbers>('author');
const publisher = BaseDbSet<Publisher, PublisherTableStrings, PublisherTableNumbers>('publisher');

export default { book, author, publisher }