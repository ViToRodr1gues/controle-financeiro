let totalReceitas = 0;
let totalDespesas = 0;
let transacoes = []; 

function atualizarRelatorio() {
  document.getElementById('totalReceitas').innerText = `R$ ${totalReceitas.toFixed(2)}`;
  document.getElementById('totalDespesas').innerText = `R$ ${totalDespesas.toFixed(2)}`;
  
  let saldo = totalReceitas - totalDespesas;
  const saldoElement = document.getElementById('saldo');
  saldoElement.innerText = `R$ ${saldo.toFixed(2)}`;

  if (saldo < 0) {
    saldoElement.classList.add('saldo-negative');
    saldoElement.classList.remove('saldo');
  } else {
    saldoElement.classList.add('saldo');
    saldoElement.classList.remove('saldo-negative');
  }

  const transacoesTabela = document.getElementById('transacoes');
  transacoesTabela.innerHTML = '';
  transacoes.forEach(transacao => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${transacao.descricao}</td>
      <td>R$ ${transacao.valor.toFixed(2)}</td>
      <td>${transacao.tipo.charAt(0).toUpperCase() + transacao.tipo.slice(1)}</td>
    `;
    transacoesTabela.appendChild(tr);
  });
}

function carregarDados() {
  const dadosSalvos = localStorage.getItem('financasBarbearia');
  
  if (dadosSalvos) {
    const { totalReceitasSalvo, totalDespesasSalvo, transacoesSalvas } = JSON.parse(dadosSalvos);
    
    totalReceitas = totalReceitasSalvo;
    totalDespesas = totalDespesasSalvo;
    transacoes = transacoesSalvas;

    atualizarRelatorio();
  }
}

function salvarDados() {
  const dadosParaSalvar = {
    totalReceitasSalvo: totalReceitas,
    totalDespesasSalvo: totalDespesas,
    transacoesSalvas: transacoes
  };

  localStorage.setItem('financasBarbearia', JSON.stringify(dadosParaSalvar));
}

function registrarTransacao() {
  const descricao = document.getElementById('descricao').value.trim();
  const valor = parseFloat(document.getElementById('valor').value);
  const tipo = document.getElementById('tipo').value;

  if (!descricao || isNaN(valor) || valor <= 0) {
    alert('Por favor, preencha todos os campos corretamente.');
    return;
  }

  const transacao = { descricao, valor, tipo };

  if (tipo === 'receita') {
    totalReceitas += valor;
  } else {
    totalDespesas += valor;
  }

  transacoes.push(transacao);

  document.getElementById('descricao').value = '';
  document.getElementById('valor').value = '';
  
  atualizarRelatorio();
  salvarDados();
}

window.onload = carregarDados;

function gerarGraficoEvolucao() {
    const ctx = document.getElementById('graficoEvolucao').getContext('2d');
  
  
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const receitasPorMes = [1000, 1500, 1200, 1300, 1800, 1600, 1700, 1900, 1500, 1800, 2000, 2200];
    const despesasPorMes = [800, 700, 650, 750, 900, 950, 1000, 1100, 1200, 1300, 1100, 1400];
  
    const grafico = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [
          {
            label: 'Receitas',
            data: receitasPorMes,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Despesas',
            data: despesasPorMes,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  gerarGraficoEvolucao();
  