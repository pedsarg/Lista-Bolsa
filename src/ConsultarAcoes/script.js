async function getStockData() {
  const symbol = document.getElementById('codigoAcao').value;
  const errorMessage = document.getElementById('error-message');
  const stockInfo = document.getElementById('stock-info');
  const carregando = document.getElementById('carregando');

  const canvas = document.getElementById("chartCanvas");

  errorMessage.style.display = 'none';
  stockInfo.style.display = 'none';  
  carregando.style.display = 'block';
  try {
    const [response, historicoResponse] = await Promise.all([
      fetch(`http://localhost:3000/api/stock?symbol=${symbol}`),
      fetch(`http://localhost:3000/api/historicoData?symbol=${symbol}`)
  ]);

      const data = await response.json();
      const historicoData = await historicoResponse.json();

      if (!response.ok || !data || data.length === 0 || !data[0]) {
          throw new Error('Ação não encontrada. Verifique o nome do papel e tente novamente.');
      }

      // Preenchendo os dados da ação
      document.getElementById('stock-name').textContent = data[0].name;
      document.getElementById('stock-symbol').textContent = data[0].symbol;
      document.getElementById('stock-change').textContent = data[0].changesPercentage + " %";
      document.getElementById('stock-price').textContent = data[0].price;

      document.getElementById('stock-eps').textContent = data[0].eps;
      document.getElementById('stock-pe').textContent = data[0].pe;
      document.getElementById('stock-volume').textContent = data[0].volume;

      document.getElementById('stock-open').textContent = data[0].open;
      document.getElementById('stock-previousClose').textContent = data[0].previousClose;
      document.getElementById('stock-changesPercentage').textContent = data[0].change;
      document.getElementById('stock-dayHigh').textContent = data[0].dayHigh;
      document.getElementById('stock-dayLow').textContent = data[0].dayLow;
      document.getElementById('stock-priceAvg50').textContent = data[0].priceAvg50;

     /*
     const yesterday = new Date();
     yesterday.setDate(yesterday.getDate() - 1); 
     const yesterdayString = yesterday.toISOString().split('T')[0]; 

     const dadosDiaAnterior = historicoData.filter(item => item.date.startsWith(yesterdayString));

     const datas = dadosDiaAnterior.map(item => item.date.split(' ')[1]); // Extrai apenas o horário
     const closePrices = dadosDiaAnterior.map(item => item.close);
     const closePricesInt = closePrices.map(price => Math.floor(price));
     
     if (dadosDiaAnterior.length > 0) {
         console.log('Dados Históricos do Dia Anterior:', closePricesInt);
     } else {
         console.log('Nenhum dado histórico encontrado para o dia anterior.');
         carregando.style.display = 'none';
         return;
      }

      */
      if (data[0].changesPercentage > 0) {
          document.getElementById('stock-change').style.color = 'green';
      } else {
          document.getElementById('stock-change').style.color = 'red';
      }
      
      // Exibir os dados e esconder o "Carregando"
      stockInfo.style.display = 'block';
      carregando.style.display = 'none';

  } catch (error) {
      // Exibir a mensagem de erro abaixo da caixa de pesquisa
      errorMessage.textContent = error.message;
      errorMessage.style.display = 'block';
      carregando.style.display = 'none';
  }
}
