import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { authToken } from './middleware/auth.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;
const USERS = [{ id: 1, username: 'lauan', password: '1234' }];

// rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ message: 'Credenciais inválidas!' });
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1m' });
  res.json({ token });
});

// rota protegida
app.get('/protected', authToken, (req, res) => {
  console.log(req.user);
  res.json({ message: `Olá, ${req.user.username}. Você está autenticado!` });
});

// rota da página de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(PORT, () => {
  console.log(`App rodando na porta ${PORT}`);
});
