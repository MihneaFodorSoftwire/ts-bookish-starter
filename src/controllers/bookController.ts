import { Router, Response } from 'express';
import { Connection, Request} from 'tedious';
import { Book } from './book';

const config = {
    server: 'MAYFLY',
    authentication: {
        type: 'default' as const,
        options: {
            userName: 'testerPro',
            password: 'secret',
        },
    },
    options: {
        database: 'bookish',
        trustServerCertificate: true,
    },
};

class BookController {
    router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/:id', this.getBook.bind(this));
        this.router.post('/', this.createBook.bind(this));
        this.router.get('/', this.getAllBooks.bind(this));
    }

    getBook(req: Request, res: Response) {
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }

    createBook(req: Request, res: Response) {
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }

    getAllBooks(req: Request, res: Response) {
        const connection = new Connection(config);
        connection.connect();
        const books: Book[] = [];

        connection.on('connect', (err) => {
            console.log("here1");
            if (err) {
                console.error('Connection failed:', err);
                res.status(500).json('Connection error');
                return;
            }
            console.log("here2");
            const request = new Request('SELECT isbn, title, total_copies FROM book',
                (err) => {
                    if (err) {
                        console.error('Query failed:', err);
                    } else {
                        res.json(books);
                    }
                    connection.close();
                },
            );

            console.log("here3");
            request.on('row', (columns) => {
                const book = new Book(
                    columns[0].value,
                    columns[1].value,
                    columns[2].value,
                );
                books.push(book);
            });

            connection.execSql(request);
        });
        console.log("here4");
        books.push(new Book('1', 'Get scammed', 1));
        res.json(books);
    }
}

export default new BookController().router;
