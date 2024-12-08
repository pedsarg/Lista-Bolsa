import express from 'express';
import axios from 'axios';
import cors from 'cors';
import {buscarTodosCodigosPapel, gravarDadosAcao, buscarDadosAcoesFavoritas} from './gerenciadorBancoDeDados/gerenciador.js';

const app = express();
const port = 3000;
const port2 = 3001;

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

    const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}.SA?apikey=eL0e2agL7ulQFbpiHLKxK2dtAtNuH7V8`;

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
      const response = await axios.get(`https://financialmodelingprep.com/api/v3/historical-chart/5min/${symbol}.SA?apikey=WnaTrN0Et58snuOj9n0ofkVTnHubddqA`);
      res.json(response.data); // Envia os dados para o frontend
    } catch (error) {
      res.status(500).json({ error: 'Erro ao consumir a API' });
    }
});
  

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


app.get('/api/acoesFavoritas', async (req, res) => {
    try {
        // Chama a função que busca os dados da tabela
        const dadosAcoes = await buscarDadosAcoesFavoritas();

        // Imprime os dados no console
        console.log('Dados da tabela acoesFavoritas:');
        dadosAcoes.forEach((acao) => {
            console.log(`ID: ${acao.idAcao}`);
            console.log(`Código Papel: ${acao.codigoPapel}`);
            console.log(`Última Atualização: ${acao.ultimaAtualizacao}`);
            console.log(`Variação Diária: ${acao.variacaoDiaria}`);
            console.log(`Valor: ${acao.valor}`);
            console.log(`Lucro Ação: ${acao.lucroAcao}`);
            console.log(`IPL: ${acao.ipl}`);
            console.log(`Volume: ${acao.volume}`);
            console.log(`Abertura: ${acao.abertura}`);
            console.log(`Preço Fechamento: ${acao.prevFechamento}`);
            console.log(`Variação Diária Real: ${acao.variacaoDiariaReal}`);
            console.log(`Maior Valor do Dia: ${acao.maiorValorDia}`);
            console.log(`Menor Valor do Dia: ${acao.menorValorDia}`);
            console.log(`Média: ${acao.media}`);
            console.log('------------------------------');
        });

        // Responde ao cliente com os dados
        res.json(dadosAcoes);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar dados da tabela acoesFavoritas' });
    }
});






app.listen(port2, () => {
    console.log(`Servidor rodando na porta ${port2}`);
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});