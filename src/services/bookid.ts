import poolPromise from '../database/db';
import { Book } from './book';
import sql from 'mssql';

export async function getBookById(id: number): Promise<Book | null> {
    const pool: any = await poolPromise;
    const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('SELECT isbn, title, id FROM book WHERE id = @id');

    if (result.recordset.length === 0) {
        return null;
    }

    const row = result.recordset[0];
    return new Book(row.isbn, row.title, row.id);
}
