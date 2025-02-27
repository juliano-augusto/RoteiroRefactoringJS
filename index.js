const { readFileSync } = require('fs');

var Repositorio = require("./repositorio.js");
var ServicoCalculoFatura = require("./servico.js") ;
const { gerarFaturaStr, gerarFaturaHTML } = require('./apresentacao.js');

// main
const faturas = JSON.parse(readFileSync('./faturas.json'));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);
const faturaHTML = gerarFaturaHTML(faturas, calc);
console.log(faturaHTML);