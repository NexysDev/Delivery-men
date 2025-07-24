
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/delivery', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));

const UserSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String
});
const User = mongoose.model('User', UserSchema);

app.post('/api/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  const hashedPassword = await bcrypt.hash(senha, 10);
  try {
    const user = await User.create({ nome, email, senha: hashedPassword });
    res.status(201).json({ message: 'Usuário criado', user });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar usuário' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) return res.status(400).json({ error: 'Senha incorreta' });

    res.json({ message: 'Login bem-sucedido', user });
  } catch (error) {
    res.status(500).json({ error: 'Erro no login' });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
