let novaAcao = document.querySelector('#novaAcaoFav');
let addAcao = document.querySelector('#addAcao');
let listaAcoes = document.querySelector('#listaAcoes');
let avisoAcao = document.querySelector('#avisoAcao');
let aviso = document.querySelector('#aviso');
let acoesFavoritas = [];

avisoAcao.innerHTML = '';
aviso.innerHTML = '';

novaAcao.addEventListener('keypress', (e) => {
    if (e.keyCode == 13) {
        avisoAcao.innerHTML = '';
        let acao = {
            nome: novaAcao.value,
            id: gerarId(),
        };
        if (analisarConteudo(acao)) {
            acoesFavoritas.push(novaAcao.value);
            adicionarAcao(acao);
        }
    }
});

addAcao.addEventListener('click', (e) => {
    avisoAcao.innerHTML = '';
    let acao = {
        nome: novaAcao.value,
        id: gerarId(),
    };
    if (analisarConteudo(acao)) {
        acoesFavoritas.push(novaAcao.value);
        adicionarAcao(acao);
    }
});

function analisarConteudo(acao) {
    if (acao.nome.length == 0) {
        avisoAcao.textContent = 'Preencha o campo abaixo!';
        return false;
    }
    return true;
}

function gerarId() {
    return Math.floor(Math.random() * 3000);
}

function adicionarAcao(acao) {
    let li = criarTag(acao);
    listaAcoes.appendChild(li);
    novaAcao.value = '';
}

function criarTag(acao) {
    let li = document.createElement('li');
    li.id = acao.id;

    let span = document.createElement('span');
    span.classList.add('textoAcao');
    span.textContent = acao.nome;

    let div = document.createElement('div');
    let removerAcao = document.createElement('button');
    removerAcao.classList.add('removerAcao');
    removerAcao.innerHTML = '<i class="fa fa-trash"></i>';
    removerAcao.setAttribute('onclick', `excluir(${acao.id})`);

    div.appendChild(removerAcao);
    li.appendChild(span);
    li.appendChild(div);
    return li;
}

function excluir(idAcao) {
    let li = document.getElementById('' + idAcao + '');
    if (li) {
        listaAcoes.removeChild(li);
    }
}

async function validarCadastro() {
    console.log("inicio");
    const username = document.getElementById('username').value;
    const password = document.getElementById('senha').value;
    const email = document.getElementById('email').value;

    for(let i =0; i<acoesFavoritas.length;i++){
        console.log(`${acoesFavoritas[i]}`);
    }

    try {
        
        const acoesFavoritasJSON = JSON.stringify(acoesFavoritas);
        const response = await fetch(`http://localhost:3010/api/cadastro?username=${username}&password=${senha}&email=${email}&acoesFavoritas=${acoesFavoritasJSON}`);
        const data = await response.json();

        if (data.error) {
            aviso.textContent = data.error;
            aviso.style.color = 'red';
            aviso.style.display = 'block';
        }

        if (data.status) {
            aviso.textContent = 'Cadastro realizado com sucesso';
            aviso.style.color = 'green';
            aviso.style.display = 'block';
        }

    } catch (error) {
        aviso.textContent = 'Nao é possivel 2realizar o cadastro!';
        aviso.style.display = 'block';
    }
}
