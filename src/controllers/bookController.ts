import { Router, Request, Response } from 'express';
import { Book, getAllBooks } from '../services/book';
import { getBookById } from '../services/bookid';
import { createBook } from '../services/createBook';

class BookController {
    router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/:id', this.getBook.bind(this));
        this.router.post('/', this.createBook.bind(this));
        this.router.get('/', this.getAllBooks.bind(this));
    }

    async getBook(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        try {
            const book = await getBookById(id);
            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }
            res.json(book);
        } catch (error) {
            console.error('Error fetching book:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async createBook(req: Request, res: Response) {
        const isbn = typeof req.query.isbn === 'string' ? req.query.isbn : '';
        const title =
            typeof req.query.title === 'string' ? req.query.title : '';
        const totalCopies =
            req.query.totalCopies && !isNaN(Number(req.query.totalCopies))
                ? parseInt(req.query.totalCopies as string)
                : 0;

        if (!isbn || !title || typeof totalCopies !== 'number') {
            return res.status(400).json({ error: 'Missing or invalid fields' });
        }

        try {
            const book = new Book(isbn, title, totalCopies);
            await createBook(book);
            res.status(201).json({ message: 'Book created successfully' });
        } catch (error) {
            console.error('Error creating book:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getAllBooks(req: Request, res: Response) {
        try {
            const books = await getAllBooks();
            res.json(books);
        } catch (error) {
            console.error('Error fetching books:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new BookController().router;
