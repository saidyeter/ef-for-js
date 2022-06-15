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


    const year = await db.book
        .Where()
        .Year('InsertedAt',2022)
        .GetFirst()

    console.log('year', year);

    
})()
