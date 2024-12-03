import express from 'express';
import axios from 'axios';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { dadosDoLogin, verificarUsernameEmail, gravarCadastro, gravarAcoesFavoritas } from './gerenciadorBancoDeDados/gerenciador.js';

const app = express();
const port = 3010;

app.use(cors());
app.use(express.json()); // Para permitir que o corpo da requisição seja analisado como JSON

app.get('/api/login', async (req, res) => {
    const usernameInput = req.query.username;
    const passwordInput = req.query.password;

    if (!usernameInput || !passwordInput) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    try {
        const usuario = await dadosDoLogin(usernameInput);
        if (usuario) {
            const { username, password } = usuario;

            const senhasIguais = await bcrypt.compare(passwordInput, password);
            
            if (senhasIguais) {
                res.json({ status: `Login realizado com sucesso!` });
            } else {
                return res.status(400).json({ error: "Senha incorreta!" });
            }
        } else {
            return res.status(400).json({ error: "Usuário não encontrado!" });
        } 
    } catch (error) {
        return res.status(500).json({ error: "Banco de Dados está indisponível!" });
    }
});

app.get('/api/cadastro', async (req, res) => {
    const usernameInput = req.query.username;
    const passwordInput = req.query.password;
    const emailInput = req.query.email;
    const acoesFavoritasInput = JSON.parse(req.query.acoesFavoritas);

    if (!usernameInput || !passwordInput || !emailInput) {
        return res.status(400).json({ error: "Preencha todos os campos!"});
    }

    try {
        const verificadoUsernameEmail = await verificarUsernameEmail(usernameInput, emailInput);

        if (verificadoUsernameEmail) {
            return res.status(400).json({ error: "Email ou username já existe!" });
        } else {
            const senhaHash = await bcrypt.hash(passwordInput, 15);

            // Verificar ação antes de gravar no banco
            for (const acao of acoesFavoritasInput) {
                const url = `https://financialmodelingprep.com/api/v3/quote/${acao}.SA?apikey=eL0e2agL7ulQFbpiHLKxK2dtAtNuH7V8`;

                try {
                    const response = await axios.get(url);
                    const data = response.data;

                    // Verificando se a API retornou erro
                    if (!data || data.length === 0) {
                        return res.status(400).json({ error: `Símbolo inválido ou erro na API para a ação: ${acao}` });
                    }

                    const symbol = data[0]?.symbol;

                    // Gravar ação no banco
                    const gravarAcoes = await gravarAcoesFavoritas(acao, usernameInput);
                    if (!gravarAcoes) {
                        return res.status(400).json({ error: `Erro ao gravar ação favorita: ${acao}` });
                    }
                } catch (error) {
                    //AQUI
                    console.error(`Erro ao processar ação ${acao}:`, error.message);
                    return res.status(400).json({ error: `Erro ao buscar dados da API para a ação: ${acao}` });
                }

            }

            const statusCadastro = await gravarCadastro(usernameInput, senhaHash, emailInput);
            if (statusCadastro) {
                res.json({ status: 'Cadastro realizado com sucesso!' });
            } else {
                return res.status(400).json({ error: 'Erro ao realizar cadastro!' });
            }
        }

    } catch (error) {
        console.error('Erro:', error.message);
        res.status(500).json({ error: 'Banco de dados indisponível' });
    }
});

app.listen(port, () => {
    console.log("Servidor iniciado na porta 3010!");
});
