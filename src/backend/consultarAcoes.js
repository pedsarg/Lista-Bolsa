import express from 'express';
import axios from 'axios';
import cors from 'cors';
import {buscarTodosCodigosPapel, gravarDadosAcao, buscarDadosAcoesFavoritas, buscarID} from './gerenciadorBancoDeDados/gerenciador.js';

const app = express();
const port = 3000;

app.use(cors());
// Rota para buscar os dados da ação
app.get('/api/stock', async (req, res) => {

    const symbol = req.query.symbol;
    //const key1 = "ABT1S8IBNGVWOKVD"
    //const key2 = "5FNAC3MOBFS609KU"

    //eL0e2agL7ulQFbpiHLKxK2dtAtNuH7V8

    if (!symbol) {
        return res.status(400).json({ error: "O parâmetro 'symbol' é obrigatório." });
    }

    const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}.SA?apikey=WnaTrN0Et58snuOj9n0ofkVTnHubddqA`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        // Verificando se a API retornou erro
        if (data["Error Message"]) {
            return res.status(400).json({ error: "Símbolo inválido ou erro na API" });
        }

        // Retornando os dados em formato JSON
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados da API' });
    }
});



app.get('/api/historicoData', async (req, res) => {
    const symbol = req.query.symbol; // Recebe o símbolo da ação da query string
    
    try {
        const response = await axios.get(`https://financialmodelingprep.com/api/v3/historical-chart/1hour/${symbol}.SA?apikey=WnaTrN0Et58snuOj9n0ofkVTnHubddqA`);
    
        // Filtra os últimos 7 valores
        const last7HoursData = response.data.slice(-7).map(item => ({
          close: item.close,
          date: item.date.split(' ')[1].slice(0, 5) // Extrai apenas o horário (HH:mm)
        }));
    
        res.json(last7HoursData); // Envia os dados filtrados para o frontend
      } catch (error) {
        res.status(500).json({ error: 'Erro ao consumir a API' });
      }
});
  


//atualiza os papeis
async function processarCodigosPapel() {
    try {
        const codigosPapel = await buscarTodosCodigosPapel();
        console.log('Processando os códigos de papel e consultando a API:');

        for (const codigo of codigosPapel) {
            const url = `https://financialmodelingprep.com/api/v3/quote/${codigo}.SA?apikey=eL0e2agL7ulQFbpiHLKxK2dtAtNuH7V8`;
            try {
                const response = await axios.get(url);
                const data = response.data[0]; // Obtém o primeiro item da resposta

                if (data) {
                    console.log(`Dados para ${codigo}:`, data);

                    // Chama a função para gravar os dados no banco
                    await gravarDadosAcao(codigo, data);
                } else {
                    console.log(`Nenhum dado encontrado para ${codigo}.`);
                }
            } catch (error) {
                console.error(`Erro ao buscar dados para ${codigo}:`, error.message);
            }
        }

        console.log('Todos os códigos processados e gravados com sucesso.');
    } catch (erro) {
        console.error('Erro ao processar os códigos de papel:', erro);
        throw erro;
    }
}


// Rota para o frontend chamar
app.post('/processar-codigos-papel', async (req, res) => {
    try {
        await processarCodigosPapel();

        res.status(200).send({ message: 'Códigos processados com sucesso!' });
    } catch (error) {
        console.error('Erro ao processar códigos de papel:', error.message);
        res.status(500).send({ error: 'Erro ao processar códigos de papel.' });
    }
});

// Rota para obter ações favoritas
app.get('/api/acoesFavoritas', async (req, res) => {
    const { idUsuario } = req.query;

    console.log('Requisição recebida para /api/acoesFavoritas'); // Log para verificar que a requisição chegou

    // Verifica se o idUsuario foi enviado
    if (!idUsuario) {
        console.log("Erro: 'idUsuario' não foi fornecido");
        return res.status(400).json({ error: "O parâmetro 'idUsuario' é obrigatório." });
    }

    console.log(`Recebido idUsuario: ${idUsuario}`); // Log para ver o valor de idUsuario

    try {
        // Chamando a função para buscar as ações favoritas
        console.log('Buscando ações favoritas para o idUsuario:', idUsuario);
        const acoesFavoritas = await buscarDadosAcoesFavoritas(idUsuario);
        
        // Verificando se a função retornou as ações
        if (!acoesFavoritas || acoesFavoritas.length === 0) {
            console.log(`Nenhuma ação favorita encontrada para o usuário ${idUsuario}`);
        }
        res.json(acoesFavoritas); // Envia os dados para o frontend
    } catch (error) {
        // Captura qualquer erro na função ou na consulta
        console.error('Erro ao obter ações favoritas:', error); // Log detalhado do erro
        res.status(500).json({ error: 'Erro ao obter ações favoritas' });
    }
});

app.get('/api/buscarID', async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: "O parâmetro 'username' é obrigatório." });
    }

    try {
        const id = await buscarID(username);

        if (id) {
            return res.json({ id });
        } else {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }
    } catch (error) {
        console.error('Erro ao buscar ID:', error);
        return res.status(500).json({ error: "Erro ao buscar o ID do usuário." });
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
