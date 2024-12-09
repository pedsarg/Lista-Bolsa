// gerenciador.js
import express from 'express';
import con from './conexao.js';


function dadosDoLogin(username){
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM usuario WHERE username = ?', [username],(err,rows) =>{
            if(err){
                return reject(err);
            }

            if (rows.length > 0){
                const { username, password} = rows[0];
                return resolve({username, password});
            }else{
                return resolve (null);
            }
        });
    });
}


function verificarUsernameEmail(username, email){
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM usuario WHERE username = ? OR email = ?', [username, email],(err,rows) =>{
            if(err){
                return reject(err);
            }

            if(rows.length === 0 ){
                return resolve(null);
            }else{
                return resolve(1);
            }
        });
    });
}


function gravarCadastro(username, password, email){
    return new Promise((resolve, reject) => {
        con.query('INSERT INTO usuario SET ?', {username, password, email},(err,rows) => {
            if(err){
                return reject(err);
            }
            return resolve(1);
        });
    });
}   


function buscarID(username){
    return new Promise((resolve,reject) => {
        con.query('SELECT id FROM usuario WHERE username = ?', [username],(err,rows) => {
            if(err){
                return reject(err);
            }
            
            if(rows.length > 0){
                const { id } = rows[0];
                return resolve(id);
            }else{
                return resolve(null);
            }
        });
    });
}


async function gravarAcoesFavoritas(codigoPapel, username) {
    try {
        const idUsuario = await buscarID(username);
        console.log(`ID do usuário encontrado: ${idUsuario}`);
        return new Promise((resolve, reject) => {
            con.query(
                'INSERT INTO acoesFavoritas SET ?',
                { idUsuario, codigoPapel },
                (err, rows) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(true);
                }
            );
        });
    } catch (error) {
        console.error('Erro ao gravar ações favoritas:', error.message);
        throw error;
    }
}


  function gravarPostagens(username, dataPostagem, titulo, conteudo) {

    // Convertendo a data para o formato adequado para o MySQL (YYYY-MM-DD HH:MM:SS)
    const dataFormatada = formatarDataParaMySQL(dataPostagem);

    return new Promise((resolve, reject) => {
        con.query(
            'INSERT INTO postagens (username, dataPostagem, titulo, conteudo) VALUES (?, ?, ?, ?)', 
            [username, dataFormatada, titulo, conteudo], 
            (err, rows) => {
                if (err) {
                    return reject(err);
                }

                return resolve('Postagem gravada com sucesso!');
            }
        );
    });
}

// Função para formatar a data no formato YYYY-MM-DD HH:MM:SS
function formatarDataParaMySQL(data) {
    const partes = data.split(' '); // Divide data e hora
    const dataParte = partes[0].split('/'); // Divide dia/mês/ano

    // Formata a data para YYYY-MM-DD e retorna no formato completo
    return `${dataParte[2]}-${dataParte[1]}-${dataParte[0]}`;
}

function buscarPostagens() {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM postagens', (err, rows) => {
            if (err) {
                return reject(err);
            }

            if (rows.length > 0) {
                console.log('Postagens encontradas:');
                rows.forEach(postagem => {
                    console.log(`Username: ${postagem.username}`);
                    console.log(`Data da Postagem: ${postagem.dataPostagem}`);
                    console.log(`Título: ${postagem.titulo}`);
                    console.log(`Conteúdo: ${postagem.conteudo}`);
                    console.log('-----------------------------------');
                });
                return resolve(rows);
            } else {
                console.log('Nenhuma postagem encontrada.');
                return resolve([]);
            }
        });
    });
}


function buscarTodosCodigosPapel() {
    return new Promise((resolve, reject) => {
        // Array para armazenar todos os códigos
        const codigosPapel = [];

        // Consulta para obter todas as tabelas do banco de dados
        con.query('SHOW TABLES', (err, tables) => {
            if (err) {
                return reject(err);
            }

            const tabelaNomes = tables.map((row) => Object.values(row)[0]); // Extrai os nomes das tabelas
            const promessas = [];

            tabelaNomes.forEach((tabela) => {
                // Consulta para verificar se a tabela contém a coluna 'codigoPapel'
                const consultaColunas = `SHOW COLUMNS FROM ${tabela} LIKE 'codigoPapel'`;

                promessas.push(
                    new Promise((resolveTabela) => {
                        con.query(consultaColunas, (err, colunas) => {
                            if (err) {
                                return resolveTabela(null); // Ignora tabelas problemáticas
                            }

                            if (colunas.length > 0) {
                                // Tabela contém a coluna 'codigoPapel'
                                con.query(`SELECT codigoPapel FROM ${tabela}`, (err, rows) => {
                                    if (!err && rows.length > 0) {
                                        rows.forEach((row) => {
                                            codigosPapel.push(row.codigoPapel);
                                        });
                                    }
                                    resolveTabela(true);
                                });
                            } else {
                                resolveTabela(false);
                            }
                        });
                    })
                );
            });

            // Aguarda todas as promessas serem resolvidas
            Promise.all(promessas)
                .then(() => {
                    console.log('Códigos de Papel encontrados:', codigosPapel);
                    resolve(codigosPapel); // Retorna o array completo
                })
                .catch((erro) => reject(erro));
        });
    });
}


function gravarDadosAcao(codigoPapel, dados) {
    return new Promise((resolve, reject) => {
        const {
            changePercent = 0,
            price: valor,
            eps: lucroAcao,
            pe: ipl,
            volume,
            open: abertura,
            previousClose: prevFechamento,
            change: variacaoDiariaReal,
            dayHigh: maiorValorDia,
            dayLow: menorValorDia,
            priceAvg50: media
        } = dados;

        const ultimaAtualizacao = new Date();

        // Formata os valores decimais para garantir precisão
        const valorFormatado = parseFloat(valor).toFixed(2);
        const aberturaFormatada = parseFloat(abertura).toFixed(2);
        const prevFechamentoFormatado = parseFloat(prevFechamento).toFixed(2);
        const maiorValorDiaFormatado = parseFloat(maiorValorDia).toFixed(2);
        const menorValorDiaFormatado = parseFloat(menorValorDia).toFixed(2);
        const mediaFormatada = parseFloat(media).toFixed(2);

        con.query(
            `INSERT INTO acoesFavoritas 
            (codigoPapel, ultimaAtualizacao, variacaoDiaria, valor, lucroAcao, ipl, volume, abertura, prevFechamento, variacaoDiariaReal, maiorValorDia, menorValorDia, media) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            ultimaAtualizacao = VALUES(ultimaAtualizacao), 
            variacaoDiaria = VALUES(variacaoDiaria), 
            valor = VALUES(valor), 
            lucroAcao = VALUES(lucroAcao), 
            ipl = VALUES(ipl), 
            volume = VALUES(volume), 
            abertura = VALUES(abertura), 
            prevFechamento = VALUES(prevFechamento), 
            variacaoDiariaReal = VALUES(variacaoDiariaReal), 
            maiorValorDia = VALUES(maiorValorDia), 
            menorValorDia = VALUES(menorValorDia), 
            media = VALUES(media)`,
            [
                codigoPapel,
                ultimaAtualizacao,
                changePercent,
                valorFormatado,
                lucroAcao,
                ipl,
                volume,
                aberturaFormatada,
                prevFechamentoFormatado,
                variacaoDiariaReal,
                maiorValorDiaFormatado,
                menorValorDiaFormatado,
                mediaFormatada
            ],
            (err, result) => {
                if (err) {
                    console.error(`Erro ao gravar ou atualizar os dados de ${codigoPapel}:`, err);
                    return reject(err);
                }

                console.log(`Dados de ${codigoPapel} gravados ou atualizados com sucesso!`);
                resolve(result);
            }
        );
    });
}

function buscarDadosAcoesFavoritas(idUsuario) {
    const query = `
        SELECT * FROM acoesFavoritas
        WHERE idUsuario = ?;
    `;

    return new Promise((resolve, reject) => {
        con.query(query, [idUsuario], (err, results) => {
            if (err) {
                console.error('Erro ao buscar ações favoritas:', err);
                return reject(err);
            }
            resolve(results);
        });
    });
}



// Exportando a função
export {dadosDoLogin, verificarUsernameEmail, gravarCadastro, gravarAcoesFavoritas, gravarPostagens, buscarPostagens, buscarTodosCodigosPapel, gravarDadosAcao, buscarDadosAcoesFavoritas, buscarID};

