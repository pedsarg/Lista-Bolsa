async function validarLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const aviso = document.querySelector('#aviso');

    // Limpa a mensagem de erro anterior
    aviso.style.display = 'none';
    aviso.innerHTML = '';

    // Exibe a bolinha de carregamento
    loading.style.display = 'block';
    try {
        const response = await fetch(`http://localhost:3010/api/login?username=${username}&password=${password}`);
        const data = await response.json();

        loading.style.display = 'none';

        if (data.error ) {
            aviso.innerHTML = data.error;
            aviso.style.color = 'red';
            aviso.style.display = 'block';
        }

        if(data.status){
            aviso.style.display = 'block';
            window.location.href = '../../PaginaInicial/index.html';
        }
    } catch (error) {
        loading.style.display = 'none';
        aviso.innerHTML = 'Não foi possível realizar o login';
        aviso.style.display = 'block';
    }
}