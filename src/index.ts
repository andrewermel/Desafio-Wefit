import express from 'express';
import cors from 'cors';
import profileRoutes from './routes/profileRoutes';
import { errorHandler } from './middlewares/errorHandler';

export const app = express();

const port = process.env.PORT || 4568;

app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  return res.send('pong');
});

app.use(profileRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Escutando na porta ${port}`);
  });
}

export default app;
