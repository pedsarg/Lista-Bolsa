const jsonUrl = '../backend/statusLogin.json';
const userActions = document.getElementById('user-actions');
let usuario = null; 

fetch(jsonUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao buscar o JSON: ' + response.status);
    }
    return response.json(); 
  })
  .then(data => {
    console.log(data); // Verifique o conteúdo de data
    if (data.username) {
      usuario = data.username; // Atribui o valor de data.username à variável usuario
      console.log('Usuário carregado:', usuario); // Verifique se usuario foi atribuído corretamente
    }

    if ('status' in data) {
      if (data.status === true) {
        userActions.innerHTML = `
<div class="avatar-container">
    <img src="../Imagens/perfil.png" alt="Avatar" />
    <button id="logout-button">Logout</button>
</div>
        `;
        const logoutButton = document.getElementById('logout-button');
        logoutButton.addEventListener('click', () => {
          fetch('http://localhost:3010/api/logout', {
            method: 'POST',
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Erro ao realizar logout');
            }
            return response.json();
          })
          .then(data => {
            console.log(data.message); 
          })
          .catch(error => {
            console.error('Erro:', error);
          });
        });
      } else if (data.status === false) {
        console.log('O status é false.');
      } else {
        console.log('O status não é true ou false, valor atual:', data.status);
      }
    } else {
      console.log('O JSON não possui a propriedade "status".');
    }

    // Agora que o usuário foi carregado, podemos chamar AtualizarAcoesFavoritas
    AtualizarAcoesFavoritas();
  })
  .catch(error => {
    console.error('Erro:', error);
  });

function AtualizarAcoesFavoritas() {
  if (usuario) {
      // Faz uma requisição para obter o ID do usuário baseado no username
      const url = `http://localhost:3000/api/buscarID?username=${usuario}`;
      fetch(url)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Erro ao buscar ID do usuário');
              }
              return response.json(); // Retorna o JSON com o ID
          })
          .then(data => {
              if (data && data.id) {
                  console.log('ID do usuário:', data.id);
                  obterAcoesFavoritasFrontend(data.id);
                  console.log(data.id); // Chama a função com o ID retornado
              } else {
                  console.error('Nenhum ID encontrado para o usuário');
              }
          })
          .catch(error => {
              console.error('Erro ao buscar ID:', error);
          });
  } else {
      console.log('Username não encontrado. Usando ID padrão.');
      obterAcoesFavoritasFrontend(9); // Chama com um ID padrão
  }
}

function obterAcoesFavoritasFrontend(idUsuario) {
  const url = `http://localhost:3000/api/acoesFavoritas?idUsuario=${idUsuario}`;
  console.log('Requisitando com a URL:', url);

  fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro na resposta da API: ' + response.status);
          }
          return response.json();
      })
      .then(data => {
          // Verifica se há dados e atualiza os elementos na página
          if (Array.isArray(data) && data.length > 0) {
              // Limpa o contêiner para não adicionar elementos repetidos
              const acoesFavoritasContainer = document.getElementById('acoes-favoritas-container');
              acoesFavoritasContainer.innerHTML = ''; // Limpa as ações anteriores

              // Para cada ação, cria um novo bloco
              data.forEach(acao => {
                  const acaoDiv = document.createElement('div');
                  acaoDiv.classList.add('acao'); // Adiciona uma classe para estilizar a ação

                  // Cria os elementos de título e valor para cada ação
                  const codigoPapel = document.createElement('h2');
                  codigoPapel.textContent = `${acao.codigoPapel}`;

                  const variacaoDiariaReal = document.createElement('h3');
                  variacaoDiariaReal.textContent = `${acao.variacaoDiariaReal}`;

                  // Adiciona os elementos à div da ação
                  acaoDiv.appendChild(codigoPapel);
                  acaoDiv.appendChild(variacaoDiariaReal);

                  // Adiciona a div da ação ao contêiner de ações favoritas
                  acoesFavoritasContainer.appendChild(acaoDiv);
              });
          } else {
              console.log('Nenhuma ação favorita encontrada.');
          }
      })
      .catch(error => {
          console.error('Erro ao obter ações favoritas:', error);
      });
}


function formatarData(dataPostagem) {
  const data = new Date(dataPostagem);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');  // Meses começam do 0, então somamos 1
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

function formatarData(dataPostagem) {
  const data = new Date(dataPostagem);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');  // Mes começa do zero
  const ano = data.getFullYear();
  
  return `${dia}/${mes}/${ano}`;  // Formato DD/MM/AAAA
}

function buscarPostagensFrontend() {
  fetch('http://localhost:3002/api/postagens')  // Endpoint que você criou no backend
    .then(response => response.json())
    .then(postagens => {
      const listaDePostagem = document.querySelector('.listaDePostagem');
      listaDePostagem.innerHTML = '';  // Limpar postagens existentes antes de adicionar novas

      if (postagens.length > 0) {
        console.log('Postagens encontradas:');

        // Pega as 3 últimas postagens
        const ultimasPostagens = postagens.slice(-3); 

        ultimasPostagens.forEach(postagem => {
          // Criando a nova div para a postagem
          const postagemDiv = document.createElement('div');
          postagemDiv.classList.add('postagem');

          // Criando o cabeçalho da postagem (título e dados)
          const cabecalhoDiv = document.createElement('div');
          cabecalhoDiv.classList.add('cabecalhoDaPostagem');

          const tituloPostagem = document.createElement('div');
          tituloPostagem.classList.add('tituloPostagem');
          const tituloLabel = document.createElement('label');
          tituloLabel.textContent = postagem.titulo;
          tituloPostagem.appendChild(tituloLabel);

          const dadosDiv = document.createElement('div');
          dadosDiv.classList.add('dadosDaPostagem');
          const usuarioDaPostagem = document.createElement('label');
          usuarioDaPostagem.textContent = postagem.username;
          const dataLabel = document.createElement('label');
          dataLabel.textContent = formatarData(postagem.dataPostagem);  // Formatar a data antes de exibir
          dadosDiv.appendChild(usuarioDaPostagem);
          dadosDiv.appendChild(dataLabel);

          cabecalhoDiv.appendChild(tituloPostagem);
          cabecalhoDiv.appendChild(dadosDiv);

          // Criando o conteúdo da postagem
          const conteudoDiv = document.createElement('div');
          conteudoDiv.classList.add('conteudo');
          const conteudoLabel = document.createElement('label');
          conteudoLabel.textContent = postagem.conteudo;
          conteudoDiv.appendChild(conteudoLabel);

          // Adicionando o cabeçalho e o conteúdo à div da postagem
          postagemDiv.appendChild(cabecalhoDiv);
          postagemDiv.appendChild(conteudoDiv);

          // Adicionando a nova postagem à lista
          listaDePostagem.appendChild(postagemDiv);
        });
      } else {
        console.log('Nenhuma postagem encontrada.');
      }
    })
    .catch(error => {
      console.error('Erro ao buscar postagens:', error);
    });
}

// Chama a função a cada 5 segundos para buscar as postagens mais recentes
setInterval(buscarPostagensFrontend, 5000);  // 5000ms = 5 segundos

// Executa imediatamente ao carregar a página
buscarPostagensFrontend();
