import poolPromise from '../database/db'; // adjust the path if needed
import sql from 'mssql';
import { Book } from './book'; // reuse your Book class

export async function createBook(book: Book): Promise<void> {
    const pool: any = await poolPromise;
    await pool
        .request()
        .input('isbn', sql.VarChar(20), book.isbn)
        .input('title', sql.VarChar(100), book.title)
        .input('totalCopies', sql.Int, book.totalCopies).query(`
            INSERT INTO book (isbn, title, total_copies)
            VALUES (@isbn, @title, @totalCopies)
        `);
}