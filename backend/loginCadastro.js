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

async function cadastro() {
    const usernameInput = "pedro03";
    const passwordInput = "1234";
    const emailInput = "ped03@gmail.com";
    const acaoFav = ["PETR4", "VALE3"];

    try {
        const verificadoUsernameEmail = await verificarUsernameEmail(usernameInput, emailInput);
        if (verificadoUsernameEmail) {
            console.log("Email ou username já existe!");
        } else {
            const senhaHash = await bcrypt.hash(passwordInput, 15);
            const statusCadastro = await gravarCadastro(usernameInput, senhaHash, emailInput);
            if (statusCadastro) {
                console.log("Cadastro realizado com sucesso!");
            } else {
                console.log("Erro ao realizar cadastro!");
            }
            const gravarAcoes = await gravarAcoesFavoritas(acaoFav, usernameInput);
            if (gravarAcoes) {
                console.log("Ações favoritas gravadas com sucesso!");
            } else {
                console.log("Erro ao gravar ações favoritas!");
            }
        }
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

// Chame a função cadastro() se necessário
// cadastro();

app.listen(port, () => {
    console.log("Servidor iniciado na porta 3010!");
});
