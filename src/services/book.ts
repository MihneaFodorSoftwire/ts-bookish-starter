import poolPromise from '../database/db';

export class Book {
    isbn: string;
    title: string;
    totalCopies: number;
    constructor(isbn: string, title: string, totalCopies: number) {
        this.isbn = isbn;
        this.title = title;
        this.totalCopies = totalCopies;
    }
}

export async function getAllBooks(): Promise<Book[]> {
    const pool: any = await poolPromise;
    const result = await pool
        .request()
        .query('SELECT isbn, title, id FROM book');

    return result.recordset.map((row) => new Book(row.isbn, row.title, row.id));
}
