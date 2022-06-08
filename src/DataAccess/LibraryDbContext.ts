import { BaseDbSet } from "../Base/Helper";
import { Author, AuthorTableNumbers, AuthorTableStrings } from "./Models/Author";
import { Book, BookTableNumbers, BookTableStrings } from "./Models/Book";
import { Publisher, PublisherTableNumbers, PublisherTableStrings } from "./Models/Publisher";

const book = BaseDbSet<Book, BookTableStrings, BookTableNumbers>();
const author = BaseDbSet<Author, AuthorTableStrings, AuthorTableNumbers>();
const publisher = BaseDbSet<Publisher, PublisherTableStrings, PublisherTableNumbers>();

export default { book, author, publisher }