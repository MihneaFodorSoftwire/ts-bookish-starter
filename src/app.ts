import express from 'express';
import 'dotenv/config';

import healthcheckRoutes from './controllers/healthcheckController';
import bookRoutes from './controllers/bookController';
import authRoutes from './controllers/authController';

const port = process.env['PORT'] || 3000;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/healthcheck', healthcheckRoutes);
app.use('/books', bookRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
