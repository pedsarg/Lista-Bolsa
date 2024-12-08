import express from 'express';
import cors from 'cors';
import {gravarPostagens, buscarPostagens} from './gerenciadorBancoDeDados/gerenciador.js';

const app = express();
const port = 3002;

app.use(cors());

// Middleware para lidar com JSON
app.use(express.json());

// Endpoint para receber a postagem
app.post('/api/postar', (req, res) => {
  const { titulo, mensagem, dataHora, usuario } = req.body;

  gravarPostagens(usuario, dataHora, titulo, mensagem );

  // Aqui você pode salvar os dados em um banco de dados ou processá-los
  res.json({ message: 'Postagem recebida com sucesso!' });
});

// Endpoint para buscar postagens
app.get('/api/postagens', async (req, res) => {
  try {
      // Chama a função buscarPostagens
      const postagens = await buscarPostagens();
      
      // Retorna as postagens no formato JSON
      res.json(postagens);
  } catch (error) {
      // Caso haja algum erro, retorna um status 500 com a mensagem de erro
      console.error('Erro ao buscar postagens:', error);
      res.status(500).json({ error: 'Erro ao buscar postagens' });
  }
});


// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
