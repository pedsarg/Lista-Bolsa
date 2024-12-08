import express from 'express';
import cors from 'cors';

const app = express();
const port = 3002;

app.use(cors());

// Middleware para lidar com JSON
app.use(express.json());

// Endpoint para receber a postagem
app.post('/api/postar', (req, res) => {
  const { titulo, mensagem, dataHora, usuario } = req.body;

  console.log('Título:', titulo);
  console.log('Mensagem:', mensagem);
  console.log('Data:', dataHora);
  console.log('Usuário:', usuario);

  // Aqui você pode salvar os dados em um banco de dados ou processá-los
  res.json({ message: 'Postagem recebida com sucesso!' });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
