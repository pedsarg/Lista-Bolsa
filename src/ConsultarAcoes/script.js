
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
      fetch(`http://localhost:3000/api/stock?symbol=${symbol}`)
  ]);

      const data = await response.json();
      

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



      fetchLast7HoursData(symbol);


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

async function fetchLast7HoursData(symbol) {
    try {
      // Corrigir a URL para incluir o protocolo e o domínio corretos
      const response = await fetch(`http://localhost:3000/api/historicoData?symbol=${symbol}`);
      
      // Verifique se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error('Erro ao consumir a API');
      }
      
      const data = await response.json();
      
      // Extrair os valores 'close' em um array
      const closeValues = data.map(item => item.close);
      
      // Extrair as horas, removendo os minutos (pegando só a parte antes dos ":")
      const hours = data.map(item => item.date.split(':')[0]);
  
      // Gerar o gráfico de linha
      generateLineChart(hours, closeValues);
    } catch (error) {
      console.error('Erro ao consumir a API no frontend:', error);
    }
  }
  
  

  function generateLineChart(hours, closeValues) {
    const ctx = document.getElementById('lineChart').getContext('2d');
    
    new Chart(ctx, {
      type: 'line', // Tipo de gráfico: linha
      data: {
        labels: hours, // Horas no eixo X
        datasets: [{
          label: 'Preço de Fechamento',
          data: closeValues, // Valores de fechamento no eixo Y
          borderColor: 'rgba(75, 192, 192, 1)', // Cor da linha
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Cor de fundo da linha (opcional)
          fill: true, // Preencher abaixo da linha
          tension: 0.1, // Suavizar a linha
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Horas'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Preço de Fechamento'
            },
            beginAtZero: false
          }
        }
      }
    });
  }