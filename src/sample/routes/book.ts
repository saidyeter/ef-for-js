import express from 'express';
import { MsSqlAdapter } from '../../Base/Adapter';
import { Book } from '../../DataAccess/Models/Book';
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



router.get<{ id: number }, { message?: string } | Book, {}, {}>('/book/:id', async (req, res) => {

    const id = req.params.id
    const result = await getBook(id)

    if (typeof result === 'object') {
        res.status(200).send(result)
    }
    else {
        res.status(500).send({ message: 'error : ' + result })
    }
})


interface GetBooksQueryParams {
    authorId?: number
    publishYear?: number
    nameContains?: string
}


router.get<{}, { message?: string } | Book[], {}, GetBooksQueryParams>('/book', async (req, res) => {

    const result = await getBooks(req.query)

    if (typeof result === 'object') {
        res.status(200).send(result)
    }
    else {
        res.status(500).send({ message: 'error : ' + result })
    }
})

interface AddBookRequest {
    name: string
    authorId: number,
    publishedAt: Date,
}

router.post<{}, { message: string }, AddBookRequest, {}>('/book', async (req, res) => {
    const book: Book = {
        Name: req.body.name,
        AuthorId: req.body.authorId,
        PublishedAt: req.body.publishedAt
    }
    const result = await addBook(book)

    if (result.length == 0) {
        res.status(200).send({ message: 'success' })
        return
    }

    res.status(500).send({
        message: 'error : ' + result
    })
})



interface PutBookRequest {
    name: string
    authorId: number,
    publishedAt: Date,
}

router.put<{ id: number }, { message: string }, PutBookRequest, {}>('/book/:id', async (req, res) => {

    const book: Book = {
        Id: req.params.id,
        Name: req.body.name,
        AuthorId: req.body.authorId,
        PublishedAt: req.body.publishedAt
    }
    const result = await updateBook(book)

    if (result.length == 0) {
        res.status(200).send({ message: 'success' })
        return
    }

    res.status(500).send({
        message: 'error : ' + result
    })
})


router.delete<{ id: number }, { message?: string }, {}, {}>('/book/:id', async (req, res) => {

    const id = req.params.id
    const result = await removeBook(id)


    if (result.length == 0) {
        res.status(200).send({ message: 'success' })
        return
    }

    res.status(500).send({
        message: 'error : ' + result
    })
})

async function getBook(id: number): Promise<Book | string> {
    try {
        const book =
            await db.book
                .Where()
                .EqualsNumber('Id', id)
                .GetFirst()

        if (book == undefined) return 'book couldnt find'

        return book
    } catch (error) {
        return JSON.stringify(error)
    }
}

async function getBooks(params: GetBooksQueryParams): Promise<Book[] | string> {
    try {
        let bookQuery = db.book.Where()
        if (params.authorId) {
            bookQuery = bookQuery.EqualsNumber('AuthorId', params.authorId)
        }
        if (params.nameContains) {
            bookQuery = bookQuery.Contains('Name', params.nameContains)
        }
        if (params.publishYear) {
            bookQuery = bookQuery.Year('PublishedAt', params.publishYear)
        }

        return await bookQuery.GetAll()
    } catch (error) {
        return JSON.stringify(error)
    }
}



async function addBook(book: Book): Promise<string> {
    try {
        const author =
            await db.author
                .Where()
                .EqualsNumber('Id', book.AuthorId)
                .GetFirst()

        if (author == undefined) return 'author undefined'

        db.book.Add(book)

        // console.log(db.book.Changes);

        await db.SaveChanges()

        return ''
    } catch (error) {
        return JSON.stringify(error)
    }
}


async function updateBook(book: Book): Promise<string> {
    try {
        const author =
            await db.author
                .Where()
                .EqualsNumber('Id', book.AuthorId)
                .GetFirst()
        if (author == undefined) return 'author undefined'

        db.book.Update(book)
        // console.log(db.book.Changes);

        await db.SaveChanges()
        return ''
    } catch (error) {
        return JSON.stringify(error)
    }
}



async function removeBook(id: number) {
    try {
        const book = await getBook(id)
        if (typeof book === 'string') {
            return book
        }

        db.book.Remove(book)
        console.log(db.book.Changes);
        await db.SaveChanges()
        return ''
    } catch (error) {
        return JSON.stringify(error)
    }
}




