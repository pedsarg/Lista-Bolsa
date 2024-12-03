const ganhosPerdas = document.querySelector('#perdasGanhos');
const valorCompra = document.querySelector('#valorCompra');
const valorVenda = document.querySelector('#valorVenda');
const taxas = document.querySelector('#taxas');
const valorEntrada = document.querySelector('#valorEntrada'); 
const valorSaida = document.querySelector('#valorSaida'); 
const porcentagem = document.querySelector('#porcentagem'); 
const aviso = document.querySelector('#aviso');

const calcGanhos = () => {
    if (qtdAcoes.value !== '' && valorCompra.value !== '' && valorVenda.value !== '') {
        if (taxas.value === '') {
            taxas.value = 0;
        }
        
        const totalEntrada = (Number(qtdAcoes.value) * Number(valorCompra.value));
        const result = (
            (Number(qtdAcoes.value) * Number(valorVenda.value)) - 
            totalEntrada - 
            Number(taxas.value)
        );

        const valorSaidaValue = (Number(qtdAcoes.value) * Number(valorVenda.value)); 
        console.log(result);
        
        const porcentagemString = (result / totalEntrada) * 100; 

        const porcentagemDeGanhos = Number(porcentagemString);

        ganhosPerdas.innerHTML = `R$ ${result}`; // Using backticks
        valorEntrada.innerHTML = `R$ ${totalEntrada}`; // Correct ID used
        valorSaida.innerHTML = `R$ ${valorSaidaValue}`; // Using backticks
        porcentagem.innerHTML = `${porcentagemDeGanhos.toFixed(2)}%`; // Using backticks
        

        if(porcentagemDeGanhos < 0){
            porcentagem.style.color = "red";
        }else{
            porcentagem.style.color = "green";
        }
    } else {
        aviso.innerHTML = 'Preencha todos os campos';
    }
}
