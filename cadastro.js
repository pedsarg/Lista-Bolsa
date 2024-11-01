// cadastro.js
import bcrypt from 'bcrypt';
import {dadosDoLogin, verificarUsernameEmail, gravarCadastro, gravarAcoesFavoritas} from './gerenciadorBancoDeDados/gerenciador.js';


async function login() {
    const usernameInput = "pedro01";
    const passwordInput = "1234";

    try {
        const usuario = await dadosDoLogin(usernameInput);
        if (usuario) {
            const { username, password } = usuario;

            const senhasIguais = await bcrypt.compare(passwordInput,password);
            if (senhasIguais) {
                console.log("Login realizado com sucesso!");
            } else {
                console.log("Credenciais inválidas!");
            }
        } else {
            console.log("Usuário não encontrado!");
        }
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

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
            const gravarAcoes = await gravarAcoesFavoritas(acaoFav,usernameInput);
            if (gravarAcoes) {
                console.log("Ações favoritas gravadas com sucesso!");
            }else {
                console.log("Erro ao gravar ações favoritas!");
            }
        }
    } catch (error) {
        console.error('Erro:', error.message);
    }
}


login();
cadastro();

