// URL do JSON (pode ser um arquivo local ou uma API)
const jsonUrl = '../backend/statusLogin.json';
const userActions = document.getElementById('user-actions');


fetch(jsonUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao buscar o JSON: ' + response.status);
    }
    return response.json(); // Converte para objeto JavaScript
  })
  .then(data => {
    // Verifica se a propriedade "status" existe no JSON
    if ('status' in data) {
      if (data.status === true) {
        userActions.innerHTML = `
<div class="avatar-container">
    <img src="../Imagens/perfil.png" alt="Avatar" />
    <button id="logout-button">Logout</button>
</div>
        `;
                    // Adiciona funcionalidade ao botão de logout
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
                        console.log(data.message); // Exibe mensagem de sucesso
                        // Aqui você pode redirecionar o usuário para a página de login, por exemplo:
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
