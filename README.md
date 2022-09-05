# ef-for-js
ORM for JavaScript like dotnet Entity Framework 

> I created this project for learning TypeScript


## Library Usage
ef4js CLI expects a certain objects to represent db tables. That objects need to be `DbTable` type. Then CLI creates all types that ef4js needs.

Example object that represents table : 
````js
const BookTable: DbTable = {
    TableName: 'book',
    Columns: [
        { Name: 'PublishedAt', Type: 'datetime' },
        { Name: 'Name', Type: 'nvarchar' },
        { Name: 'AuthorId', Type: 'int' },
    ],
    KeyColumn: { Name: 'Id', Type: 'int' },
}
````
That means database has a table named `book`. `book` table has 4 colums. One of them is `KeyColumn` that is used for table primary key. 

ef4js CLI creates a db context. That db contexts contains `SaveChanges` method and dbsets which are generated from user-defined types.  
To use that db context, database adapter needs to be defined. (db adapter requires connection string or connection config object that is specific to database type)


````js
const conenctionString = 'Server=localhost,1433;Database=ef4js;User `Id`=sa;Password=MyPass@word;TrustServerCertificate=True;'
const adapter = new MsSqlAdapter(conenctionString)
const db = dbAdapter.init(adapter) // db or dbContext
````
With this, now you are able to access tables and `SaveChanges` method.

What is `SaveChanges` method?

When you add a new entity to table or update an entity or delete an entitiy, changes are saved on RAM until `SaveChanges` method runs. That means `SaveChanges` method will apply all changes you made.  
For example:
````js
const newBook: Book = {
    Name: 'Crime and Punishment',
    AuthorId: 1,
    PublishedAt: new Date("1866-02-10T11:22:33.000Z")
}

db.book.Add(book)
// now new book is stored in changes array and waits to save

await db.SaveChanges()
// now all changes applied. That means new book is inserted to table
````

In this example, you saw newBook is `Book` type. That type is generated from used-defined `DbTable` object. That `Book` type also has optional property called `Id` which is specified as `KeyColumn` in user-defined object. For new book entity `Id` will be assigned from database while inserting. So assigning value to `Id` is useless. But for updating an entity or deleting, you will need `Id`.   
Also in this example, `db.book` has `Add` method. The `Add` method is used for creating new entities. There are also other methods : `Update` and `Remove`
````js
const editedBook: Book = {
    Id: 23,
    Name: 'Crime and Punishment (en)',
    AuthorId: 1,
    PublishedAt: new Date("1866-02-10T11:22:33.000Z")
}

db.book.Update(book)


const deletionRequestedBook: Book = {
    Id: 23,
    Name: 'Crime and Punishment (en)',
    AuthorId: 1,
    PublishedAt: new Date("1866-02-10T11:22:33.000Z")
}

db.book.Remove(deletionRequestedBook)

await db.SaveChanges()
// now all changes applied. That means one book is updated and one book is removed
````
What about fetching data?

`Where` method comes in. When you want to get particular db records, you will need to filter. `Where` method creates an `IQueryable<T>` object.

````js
let bookQuery = db.book.Where()
````
`bookQuery` object is an `IQueryable<Book>` object. Which means you can filter using some methods depending to columns (and their types).  
Let's say you want to get all books that belongs to a particular author. To filter that, we use `AuthorId` column.  
`AuthorId` column type is an integer for table and number for TypeScript.  So for number type we can use `==`, `<` and `>` operators. To use those operators there are methods in ef4js: 

````js
bookQuery = bookQuery.EqualsNumber('AuthorId', 1)
````
Now we applied a condition to `bookQuery` object, and we are saying `AuthorId` is equals to 1. ef4js forces to use numeric props in `EqualsNumber` method. So if you write `bookQuery = bookQuery.EqualsNumber('Name', 1)`, TypeScript will give error and won't compile.  

To get all books that has marked 1 for `AuthorId` :
````js
const books = await bookQuery.GetAll()
````

Also `EqualsNumber` method returns an `IQueryable<Book>` object. That means you can chain all conditions:
````js
const rec = 
    await db.book
        .Where() 

        //date filter methods
        .Year('InsertedAt', 2022)
        .Month('InsertedAt', 6)
        .Day('InsertedAt', 11)
        .Hour('InsertedAt', 12)
        .Minute('InsertedAt', 49)
        .Second('InsertedAt', 11)

        //string filter methods
        .Contains('Name', 'em')
        .EndsWith('Name', 'or')
        .StartsWith('Name', 'Dune')

        // number filter methods
        .BiggerThenNumber('AuthorId', 1)
        .LessThenNumber('AuthorId', 10)
        .EqualsNumber('Id', 3)

        // get methods
        .GetFirst() // or .GetAll()
````



### TODO:

- Write tests
- Create ci pipeline to run tests on every push to main branch

- Make mysql db adapter
- Make postgresql db adapter
- Make oracle db adapter

- Seperate db adapters from base 

- Create cli tool to generate dbcontext code and model as described above

- Make npm package  for core and adapters, and upload to npmjs 
- Add installation section to readme

- Make mariadb db adapter
- Make sqlite db adapter


## License 
MIT License

Copyright (c) 2022 Said Yeter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


