const express = require('express');
const axios = require('axios');
const cors = require('cors');

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

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
