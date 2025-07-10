import sql from 'mssql';
import { User } from './user';
import poolPromise from './db';
import bcrypt from 'bcrypt';

export async function getUserByUsername(name: string): Promise<User | null> {
    const pool: any = await poolPromise;
    const result = await pool
        .request()
        .input('name', sql.VarChar, name)
        .query('SELECT * FROM [user_name] WHERE name = @name');

    if (result.recordset.length === 0) return null;

    const userRow = result.recordset[0];
    return new User(userRow.id, userRow.name, userRow.password);
}

export async function getUserById(id: number): Promise<User | null> {
    const pool: any = await poolPromise;
    const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM [user_name] WHERE id = @id');

    if (result.recordset.length === 0) return null;

    const userRow = result.recordset[0];
    return new User(userRow.id, userRow.name, userRow.password);
}

export async function createUser(
    name: string,
    password: string,
): Promise<User> {
    const pool: any = await poolPromise;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool
        .request()
        .input('name', sql.VarChar, name)
        .input('password', sql.VarChar, hashedPassword)
        .query(
            `INSERT INTO [user_name] (name, password)
             OUTPUT INSERTED.id, INSERTED.name, INSERTED.password
             VALUES (@name, @password)`,
        );

    const row = result.recordset[0];
    return new User(row.id, row.name, row.password);
}
