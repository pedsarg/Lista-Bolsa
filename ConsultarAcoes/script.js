async function getStockData() {
    const symbol = document.getElementById('symbol').value;
    const errorMessage = document.getElementById('error-message');
    const stockInfo = document.getElementById('stock-info');
    const loading = document.getElementById('loading');

    errorMessage.style.display = 'none';  // Esconder o erro no início
    stockInfo.style.display = 'none';     // Esconder as informações no início
    loading.style.display = 'block';      // Mostrar o "Carregando"

    try {
        const response = await fetch(`http://localhost:3000/api/stock?symbol=${symbol}`);
        const data = await response.json();

        if (!response.ok || !data || data.length === 0 || !data[0]) {
            throw new Error('Ação não encontrada. Verifique o nome do papel e tente novamente.');
        }

        // Preenchendo os dados da ação
        document.getElementById('stock-name').textContent = data[0].name;
        document.getElementById('stock-price').textContent = data[0].price;
        document.getElementById('stock-change').textContent = data[0].changesPercentage;
        document.getElementById('stock-dayHigh').textContent = data[0].dayHigh;
        document.getElementById('stock-dayLow').textContent = data[0].dayLow;

        // Exibir os dados e esconder o "Carregando"
        stockInfo.style.display = 'block';
        loading.style.display = 'none';

    } catch (error) {
        // Exibir a mensagem de erro abaixo da caixa de pesquisa
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
        loading.style.display = 'none';
    }
}
