import dbAdapter from "./DataAccess/LibraryDbContext";

(async function () {

    // const a = {
    //     database: 'ef4js',
    //     server: 'localhost,1433',
    //     user: 'sa',
    //     password: 'MyPass@word'
    // }


    const conenctionString = 'Server=localhost,1433;Database=ef4js;User Id=sa;Password=MyPass@word;TrustServerCertificate=True;'

    const db = dbAdapter.init(conenctionString)

    const all = await db.book
    .Where()
    .GetAll()

    console.log('all',all);


    const first = await db.book
        .Where()
        .BiggerThen('AuthorId', 900)
        .GetFirst()

    console.log('first',first);

    if (first) {
        first.AuthorId = 899
        db.book.Remove(first)
    }

    db.book.Add({
        InsertedAt: new Date(),
        Name: 'Rain man',
        AuthorId: 45,
        PublisherId: 23,
    })

    await db.SaveChanges()
})()
