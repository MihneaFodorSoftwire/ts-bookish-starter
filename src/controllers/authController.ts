import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getUserByUsername, createUser } from '../services/user';

class AuthController {
    router: Router;

    constructor() {
        this.router = Router();
        this.router.post('/login', this.login.bind(this));
        this.router.post('/register', this.register.bind(this));
    }

    async login(req: Request, res: Response) {
        const name = typeof req.query.name === 'string' ? req.query.name : '';
        const password =
            typeof req.query.password === 'string' ? req.query.password : '';

        if (!name || !password) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        try {
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
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async register(req: Request, res: Response) {
        const name = typeof req.query.name === 'string' ? req.query.name : '';
        const password =
            typeof req.query.password === 'string' ? req.query.password : '';

        if (!name || !password) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        try {
            const existingUser = await getUserByUsername(name);
            if (existingUser) {
                return res
                    .status(409)
                    .json({ error: 'Username already exists' });
            }

            const newUser = await createUser(name, password);
            const token = jwt.sign(
                { id: newUser.id, name: newUser.name },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '1h' },
            );

            res.status(201).json({ token });
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new AuthController().router;
