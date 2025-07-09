import { Router, Request, Response } from 'express';
import { getAllBooks } from './book';
import { getBookById } from './bookid';

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

    createBook(req: Request, res: Response) {
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
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
