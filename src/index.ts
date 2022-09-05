import { startServer } from "./sample";

startServer()
// import { MsSqlAdapter } from "./Base/Adapter";
// import dbAdapter from "./DataAccess/LibraryDbContext";

// (async function () {

//     // const a = {
//     //     database: 'ef4js',
//     //     server: 'localhost,1433',
//     //     user: 'sa',
//     //     password: 'MyPass@word'
//     // }

//     const conenctionString = 'Server=localhost,1433;Database=ef4js;User Id=sa;Password=MyPass@word;TrustServerCertificate=True;'
//     const adapter = new MsSqlAdapter(conenctionString)
//     const db = dbAdapter.init(adapter)

//     const rec = await db.book
//         .Where()
//         .Year('InsertedAt', 2022)
//         .Month('InsertedAt', 6)
//         .Day('InsertedAt', 11)
//         .Hour('InsertedAt', 12)
//         .Minute('InsertedAt', 49)
//         .Second('InsertedAt', 11)
//         .Contains('Name', 'em')
//         .EndsWith('Name', 'or')
//         .StartsWith('Name', 'Dune')
//         .BiggerThenNumber('AuthorId', 1)
//         .LessThenNumber('PublisherId', 10)
//         .EqualsNumber('Id', 3)

//         .GetFirst()

//     console.log('rec', rec);

//     // const newbook: Book = {
//     //     Name: 'LoTR',
//     //     InsertedAt: new Date(),
//     //     AuthorId: 23,
//     //     PublisherId: 14
//     // }
//     // db.book.Add(newbook)

//     // rec.AuthorId = 11
//     // db.book.Update(rec)

//     // db.SaveChanges()
// })()
