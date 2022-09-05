import express from 'express';
import { MsSqlAdapter } from '../../Base/Adapter';
import { Author } from '../../DataAccess/Models/Author';
import dbAdapter from "../../DataAccess/LibraryDbContext";


export interface TypedRequestBody<T> extends Express.Request {
    body: T
}

const conenctionString = 'Server=localhost,1433;Database=ef4js;User Id=sa;Password=MyPass@word;TrustServerCertificate=True;'

const adapter = new MsSqlAdapter(conenctionString)
const db = dbAdapter.init(adapter)


export const router = express.Router();




// credit : https://javascript.plainenglish.io/typed-express-request-and-response-with-typescript-7277aea028c

// app.get<Params,ResBody,ReqBody,ReqQuery,Locals>('/api/v1/dogs',
// (req,res) => { })



router.get<{ id: number }, { message?: string } | Author, {}, {}>('/Author/:id', async (req, res) => {

    const id = req.params.id
    const result = await getAuthor(id)

    if (typeof result === 'object') {
        res.status(200).send(result)
    }
    else {
        res.status(500).send({ message: 'error : ' + result })
    }
})


interface GetAuthorsQueryParams {
    origin?: string
    nameContains?: string
}


router.get<{}, { message?: string } | Author[], {}, GetAuthorsQueryParams>('/Author', async (req, res) => {

    const result = await getAuthors(req.query)

    if (typeof result === 'object') {
        res.status(200).send(result)
    }
    else {
        res.status(500).send({ message: 'error : ' + result })
    }
})

interface AddAuthorRequest {
    name: string
    origin: string
}

router.post<{}, { message: string }, AddAuthorRequest, {}>('/Author', async (req, res) => {
    const author: Author = {
        Name: req.body.name,
        Origin: req.body.origin,
    }
    const result = await addAuthor(author)

    if (result.length == 0) {
        res.status(200).send({ message: 'success' })
        return
    }

    res.status(500).send({
        message: 'error : ' + result
    })
})



interface PutAuthorRequest {
    name: string
    origin: string
}

router.put<{ id: number }, { message: string }, PutAuthorRequest, {}>('/Author/:id', async (req, res) => {

    const Author: Author = {
        Id: req.params.id,
        Name: req.body.name,
        Origin : req.body.origin
    }
    const result = await updateAuthor(Author)

    if (result.length == 0) {
        res.status(200).send({ message: 'success' })
        return
    }

    res.status(500).send({
        message: 'error : ' + result
    })
})


router.delete<{ id: number }, { message?: string }, {}, {}>('/Author/:id', async (req, res) => {

    const id = req.params.id
    const result = await removeAuthor(id)


    if (result.length == 0) {
        res.status(200).send({ message: 'success' })
        return
    }

    res.status(500).send({
        message: 'error : ' + result
    })
})

async function getAuthor(id: number): Promise<Author | string> {
    try {
        const Author =
            await db.author
                .Where()
                .EqualsNumber('Id', id)
                .GetFirst()

        if (Author == undefined) return 'Author couldnt find'

        return Author
    } catch (error) {
        return JSON.stringify(error)
    }
}

async function getAuthors(params: GetAuthorsQueryParams): Promise<Author[] | string> {
    try {
        let authorQuery = db.author.Where()
        if (params.nameContains) {
            authorQuery = authorQuery.Contains('Name', params.nameContains)
        }
        if (params.origin) {
            authorQuery = authorQuery.EqualsText('Origin', params.origin)
        }

        return await authorQuery.GetAll()
    } catch (error) {
        return JSON.stringify(error)
    }
}



async function addAuthor(author: Author): Promise<string> {
    try {

        //check exist
        db.author.Add(author)

        // console.log(db.Author.Changes);

        await db.SaveChanges()

        return ''
    } catch (error) {
        return JSON.stringify(error)
    }
}


async function updateAuthor(Author: Author): Promise<string> {
    try {


        //check exist
        db.author.Update(Author)
        // console.log(db.Author.Changes);

        await db.SaveChanges()
        return ''
    } catch (error) {
        return JSON.stringify(error)
    }
}



async function removeAuthor(id: number) {
    try {
        const result = await getAuthor(id)
        if (typeof result === 'string') {
            return result
        }

        db.author.Remove(result)
        // console.log(db.author.Changes);
        await db.SaveChanges()
        return ''
    } catch (error) {
        return JSON.stringify(error)
    }
}




