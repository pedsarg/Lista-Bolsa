
const jsonUrl = '../backend/statusLogin.json';
const userActions = document.getElementById('user-actions');
let usuario = null;  // Use 'let' para permitir reatribuição

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
  })
  .catch(error => {
    console.error('Erro:', error);
  });


  function mostrarNovaPostagem() {
    var novaPostagem = document.querySelector('.novaPostagem');
    novaPostagem.style.display = novaPostagem.style.display === 'none' ? 'block' : 'none';
}

// Cancela a postagem, oculta a div e limpa os campos
function cancelarPostagem() {
    var novaPostagem = document.querySelector('.novaPostagem');
    var tituloInput = document.getElementById('titulo');
    var mensagemInput = document.getElementById('mensagem');

    // Oculta a div novaPostagem
    novaPostagem.style.display = 'none';

    // Limpa os campos de entrada
    tituloInput.value = '';
    mensagemInput.value = '';
}

// Função chamada ao clicar no botão "Postar"
function postar() {
  // Obtém os valores dos campos de input
  var titulo = document.getElementById('titulo').value;
  var mensagem = document.getElementById('mensagem').value;

  // Obtém a data e hora atual no formato dd/mm/yyyy hh:mm
  var data = new Date();
  var dia = String(data.getDate()).padStart(2, '0');
  var mes = String(data.getMonth() + 1).padStart(2, '0');
  var ano = data.getFullYear();
  var hora = String(data.getHours()).padStart(2, '0');
  var minuto = String(data.getMinutes()).padStart(2, '0');
  var dataHora = `${dia}/${mes}/${ano} ${hora}:${minuto}`;

  // Verifica se o usuário está definido
  if (!usuario) {
    alert('Você precisa estar logado para postar!');
    return;
  }

  // Cria o objeto com os dados
  const postagemData = {
    titulo: titulo,
    mensagem: mensagem,
    dataHora: dataHora,
    usuario: usuario
  };

  // Envia os dados ao backend
  fetch('http://localhost:3002/api/postar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postagemData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao enviar a postagem para o backend');
      }
      return response.json();
    })
    .then(data => {
      console.log('Resposta do backend:', data);
      alert('Postagem realizada com sucesso!');
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao realizar a postagem!');
    });

  // Opcionalmente, você pode esconder a div de nova postagem após o post
  cancelarPostagem();
}
