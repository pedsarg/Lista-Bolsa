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
        return new Promise((res, rej) => {
          con.query('INSERT INTO acoesFavoritas SET ?', { idUsuario, codigoPapel }, (err, rows) => {
            if (err) {
              return rej(err);
            } else {
              return res(true);
            }
          });
      });
  
      await Promise.all(promises);
  
      // Check for any errors during individual inserts
      if (promises.some((promise) => promise.catch)) {
        throw new Error("Failed to insert some favorite actions.");
      }
  
      return true;
    } catch (error) {
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


// Exportando a função
export {dadosDoLogin, verificarUsernameEmail, gravarCadastro, gravarAcoesFavoritas, gravarPostagens, buscarPostagens};

