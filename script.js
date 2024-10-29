const ganhosPerdas = document.querySelector('#perdasGanhos');
const valorCompra = document.querySelector('#valorCompra');
const valorVenda = document.querySelector('#valorVenda');
const taxas = document.querySelector('#taxas');
const valorEntrada = document.querySelector('#valorEntrada'); // Ensure this matches your HTML
const valorSaida = document.querySelector('#valorSaida'); // Ensure this matches your HTML
const porcentagem = document.querySelector('#porcentagem'); // Ensure this matches your HTML
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

        const valorSaidaValue = (Number(qtdAcoes.value) * Number(valorVenda.value)); // Total revenue from selling
        console.log(result);
        
        const porcentagemValue = (result / totalEntrada) * 100; // Calculating percentage

        ganhosPerdas.innerHTML = `R$ ${result}`; // Using backticks
        valorEntrada.innerHTML = `R$ ${totalEntrada}`; // Correct ID used
        valorSaida.innerHTML = `R$ ${valorSaidaValue}`; // Using backticks
        porcentagem.innerHTML = `${porcentagemValue.toFixed(2)}%`; // Using backticks
    } else {
        aviso.innerHTML = 'Preencha todos os campos';
    }
}
