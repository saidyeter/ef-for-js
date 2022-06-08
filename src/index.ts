import db from "./DataAccess/LibraryDbContext";


db.book.Add({
    InsertedAt: new Date(),
    Name: 'Lord of the Rings',
    AuthorId: 23,
    PublisherId: 2,
})

db.book.Changes.forEach(b => {
    console.log(b);
    
});


const some = db.book.Where()
.BiggerThen('PublisherId',25)
.Contains('Name','ali')


console.log(some)

