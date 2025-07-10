import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getUserByUsername, createUser } from './userController';
import bcrypt from 'bcrypt';

const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response) => {
    const name = typeof req.query.name === 'string' ? req.query.name : '';
    const password =
        typeof req.query.password === 'string' ? req.query.password : '';

    if (!name || !password) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const user = await getUserByUsername(name);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user.id, name: user.name },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' },
    );

    res.json({ token });
});

authRouter.post('/register', async (req: Request, res: Response) => {
    const name =
        typeof req.query.name === 'string' ? req.query.name : '';
    const password =
        typeof req.query.password === 'string' ? req.query.password : '';

    if (!name || !password) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const existingUser = await getUserByUsername(name);
    if (existingUser) {
        return res.status(409).json({ error: 'Username already exists' });
    }

    const newUser = await createUser(name, password);

    const token = jwt.sign(
        { id: newUser.id, name: newUser.name },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' },
    );

    res.status(201).json({ token });
});


export default authRouter;
