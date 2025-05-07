const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const path = require('path')
const { authToken } = require('./middleware/auth.js');


const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public'))) // servir frontend

const PORT = 3000
const USERS = [{ id: 1, username: 'lauan', password: '1234' }]

// rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body
  const user = USERS.find(u => u.username === username && u.password === password)

  if (!user) return res.status(401).json({ message: 'Credenciais inválidas!' })
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1m' })
  res.json({ token })
})

 // Rota de API para testar conteúdo da área protegida
 app.get('/protected', authToken, (req, res) => {
   res.json({ message: `Olá, ${req.user.username}. Você está autenticado!` });
 });

app.listen(PORT, () => {
  console.log(`App rodando na porta ${PORT}`)
})
