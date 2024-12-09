import express from 'express';
import axios from 'axios';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { dadosDoLogin, verificarUsernameEmail, gravarCadastro, gravarAcoesFavoritas } from './gerenciadorBancoDeDados/gerenciador.js';
import fs from 'fs';

const app = express();
const port = 3010;
const filePath = './statusLogin.json';

let originalData = {}; // Variável global para armazenar os dados originais

app.use(cors());
app.use(express.json()); // Para permitir que o corpo da requisição seja analisado como JSON

// Função para ler o arquivo JSON e armazenar os dados originais
const readFileAndStoreOriginalData = () => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log('Erro ao ler o arquivo:', err);
            return;
        }

        try {
            const jsonData = data ? JSON.parse(data) : {}; // Caso o arquivo esteja vazio, inicializa um objeto vazio
            originalData = JSON.parse(JSON.stringify(jsonData)); // Armazenar os dados originais
        } catch (err) {
            console.log('Erro ao analisar JSON:', err);
            originalData = {}; // Se o arquivo estiver vazio ou corrompido, inicia um objeto vazio
        }
    });
};

// Função para verificar se o arquivo JSON está vazio e inicializá-lo se necessário
const initializeJsonFile = () => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        if (data.trim() === '') {
            fs.writeFileSync(filePath, JSON.stringify({ username: '', status: false }, null, 2), 'utf8');
        }
    } else {
        fs.writeFileSync(filePath, JSON.stringify({ username: '', status: false }, null, 2), 'utf8');
    }
};

// Função para atualizar o arquivo JSON com novos dados
const updateJsonFile = (newData) => {
    fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf8', (err) => {
        if (err) {
            console.log('Erro ao escrever no arquivo:', err);
        } else {
            console.log('Arquivo atualizado com sucesso!');
        }
    });
};

// Função para restaurar os dados originais quando o processo for interrompido
const restoreOriginalData = () => {
    console.log('Restaurando o arquivo para os valores originais...');
    if (Object.keys(originalData).length > 0) {
        updateJsonFile(originalData); // Usando a função de atualização para escrever os dados originais
    } else {
        console.log('Dados originais não encontrados!');
    }
};

// Definir o comportamento ao receber o sinal de interrupção (Ctrl+C)
process.on('SIGINT', () => {
    restoreOriginalData(); // Restaurar os dados ao encerrar o processo
    process.exit();
});

// Função de login
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
            //const hashPassword = await bcrypt.hash(passwordInput, 15);
            const senhasIguais = await bcrypt.compare(passwordInput, password);

            if (senhasIguais) {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.log('Erro ao ler o arquivo:', err);
                        return;
                    }

                    try {
                        const jsonData = JSON.parse(data);

                        // Atualizar os dados
                        jsonData.username = usernameInput;
                        jsonData.status = true;

                        // Atualizar o arquivo com os novos dados
                        updateJsonFile(jsonData);
                    } catch (err) {
                        console.log('Erro ao analisar JSON:', err);
                    }
                });

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



function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Função de cadastro
app.get('/api/cadastro', async (req, res) => {
    const usernameInput = req.query.username;
    const passwordInput = req.query.password;
    const emailInput = req.query.email;
    const acoesFavoritasInput = JSON.parse(req.query.acoesFavoritas);

    if (!usernameInput || !passwordInput || !emailInput) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    try {
        const verificadoUsernameEmail = await verificarUsernameEmail(usernameInput, emailInput);

        if (verificadoUsernameEmail) {
            return res.status(400).json({ error: "Email ou username já existe!" });
        } else {
            const senhaHash = await bcrypt.hash(passwordInput, 15);

            // Verificar ações antes de gravar no banco
            let acoesParaGravar = []; // Array para armazenar as ações que serão gravadas

            /*
            // Primeiro loop: Verificando todas as ações
            for (const acao of acoesFavoritasInput) {
                const url = `https://financialmodelingprep.com/api/v3/quote/${acao}.SA?apikey=eL0e2agL7ulQFbpiHLKxK2dtAtNuH7V8`;
                try {
                    const response = await axios.get(url);
                    const data = response.data;
            
                    if (!data || data.length === 0) {
                        console.error(`Símbolo inválido ou erro na API para a ação: ${acao}`);
                        continue;
                    }
            
                    acoesParaGravar.push(acao);
            
                    // Delay entre as requisições
                    await delay(1000); // 1 segundo de intervalo
            
                } catch (error) {
                    console.error(`Erro ao processar ação ${acao}:`, error.message);
                }
            }
*/
            const statusCadastro = await gravarCadastro(usernameInput, senhaHash, emailInput);
            if (statusCadastro) {
                // Atualizar o arquivo com os novos dados
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.log('Erro ao ler o arquivo:', err);
                        return;
                    }

                    try {
                        const jsonData = JSON.parse(data);

                        // Atualizar os dados
                        jsonData.username = usernameInput;
                        jsonData.status = true;

                        // Atualizar o arquivo com os novos dados
                        updateJsonFile(jsonData);
                    } catch (err) {
                        console.log('Erro ao analisar JSON:', err);
                    }
                });

                // Segundo loop: Gravando as ações no banco, após todas as verificações
                for (const acao of acoesFavoritasInput) {
                    try {
                        const gravarAcoes = await gravarAcoesFavoritas(acao, usernameInput);
                        if (!gravarAcoes) {
                            console.error(`Erro ao gravar ação favorita: ${acao}`);
                            return res.status(400).json({ error: `Erro ao gravar ação favorita: ${acao}` });
                        }
                    } catch (error) {
                        console.error(`Erro ao gravar a ação ${acao}:`, error.message);
                        return res.status(400).json({ error: `Erro ao gravar a ação: ${acao}` });
                    }
                }

                // Enviar resposta de sucesso apenas após todos os processos concluídos
                res.status(200).json({ status: true, message: 'Cadastro realizado com sucesso!' });
            } else {
                return res.status(400).json({ error: 'Erro ao realizar cadastro!' });
            }
        }

    } catch (error) {
        console.error('Erro:', error.message);
        res.status(500).json({ error: 'Banco de dados indisponível' });
    }
});


app.post('/api/logout', (req, res) => {
    restoreOriginalData(); // Chama a função para restaurar os dados
    res.status(200).json({ message: 'Logout realizado e dados restaurados.' });
});


// Inicializar a leitura do arquivo JSON para armazenar os dados originais
initializeJsonFile(); // Cria ou inicializa o arquivo caso esteja vazio ou não exista
readFileAndStoreOriginalData();

app.listen(port, () => {
    console.log("Servidor iniciado na porta 3010!");
});