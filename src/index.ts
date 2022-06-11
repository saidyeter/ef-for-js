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

    console.log(all);


    const first = await db.book
        .Where()
        .BiggerThen('PublisherId', 4)
        .GetFirst()

    console.log(first);

    db.book.Add({
        InsertedAt: new Date(),
        Name: 'Dice man',
        AuthorId: 12,
        PublisherId: 2,
    })

    await db.SaveChanges()
})()
