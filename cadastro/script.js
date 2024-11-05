let novaAcao = document.querySelector('#novaAcaoFav');
let addAcao = document.querySelector('#addAcao');
let listaAcoes = document.querySelector('#listaAcoes');

console.log(novaAcao);

novaAcao.addEventListener('keypress',(e) => {

    //Se a tecla 13 (tecla enter) for pressionada
    if(e.keyCode == 13){
        let acao ={
            nome: novaAcao.value,
            id:gerarId(),
        }
        adicionarAcao(acao);
    }
});

addAcao.addEventListener('click',(e) => {
    if(e.keyCode === 13){
        let acao ={
            nome: novaAcao,
            id:gerarId(),
        }
        adicionarAcao(acao);
    }
});

function gerarId() {
    return Math.floor(Math.random() * 3000);
}

function adicionarAcao(acao){
    let li = criarTag(acao);
    listaAcoes.appendChild(li);
    novaAcao.value = '';
}

function criarTag(acao){
    let li = document.createElement('li');
    let span = document.createElement('span');
    span.classList.add('textoAcao');
    span.innerHTML = acao.nome;

    let div = document.createElement('div');
    let removerAcao = document.createElement('button');
    removerAcao.classList.add('removerAcao');
    removerAcao.innerHTML = '<i class="fa fa-trash"></i>';
    removerAcao.setAttribute('onclick','excluir('+acao.id+')');

    div.appendChild(removerAcao);

    li.appendChild(span);
    li.appendChild(div);
    return li;
}

function excluir(idAcao){
    alert(idAcao);
}