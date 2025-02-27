const { readFileSync } = require('fs');

// função extraída
function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
    { style: "currency", currency: "BRL",
      minimumFractionDigits: 2 }).format(valor/100);
}

// função query
function getPeca(pecas, apre) {
  return pecas[apre.id];
}

// função extraída
function calcularCredito(pecas, apre) {
  let creditos = 0;
  creditos += Math.max(apre.audiencia - 30, 0);
  if (getPeca(pecas, apre).tipo === "comedia") 
     creditos += Math.floor(apre.audiencia / 5);
  return creditos;   
}

// nova função
function calcularTotalCreditos(pecas, apresentacoes){
  let totalCreditos = 0;
  for (let apre of apresentacoes) {
    totalCreditos += calcularCredito(pecas, apre);
  }
  return totalCreditos;
}

// função extraída
function calcularTotalApresentacao(pecas, apre) {
  let total = 0;
  switch (getPeca(pecas, apre).tipo) {
  case "tragedia":
    total = 40000;
    if (apre.audiencia > 30) {
      total += 1000 * (apre.audiencia - 30);
    }
    break;

  case "comedia":
    total = 30000;
    if (apre.audiencia > 20) {
      total += 10000 + 500 * (apre.audiencia - 20);
    }
    total += 300 * apre.audiencia;
    break;

  default:
    throw new Error(`Peça desconhecia: ${getPeca(pecas, apre).tipo}`);
  }
  return total;
}

// nova função
function calcularTotalFatura(pecas, apre){
  let totalFatura = 0;
  for (let ap of apre) {  
    totalFatura += calcularTotalApresentacao(pecas, ap);
  }
  return totalFatura;
}

function gerarFaturaStr (fatura, pecas) {
  
  // corpo principal 
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
  return faturaStr;
}

function gerarFaturaHTML(fatura, pecas){
  let faturaHTML = '<html>\n';
  faturaHTML += `<p> Fatura ${fatura.cliente} </p>\n`;
  faturaHTML +=  '<ul>\n';
  for (let apre of fatura.apresentacoes) {
    faturaHTML += `<li> ${getPeca(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos) </li>\n`;
  }
  faturaHTML += '</ul>\n';
  faturaHTML +=  `<p> Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))} </p>\n`;
  faturaHTML +=  `<p> Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} </p>\n`;
  faturaHTML += '</html>\n';
  return faturaHTML;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
const faturaHTML = gerarFaturaHTML(faturas, pecas);
console.log(faturaHTML);