// Código baseado nesse tutorial:
// https://gorillasun.de/blog/an-algorithm-for-irregular-grids

// let base_url = "https://estudiodao.github.io/Arq.Futuro-Ilustracao/";
let base_url = "./";

let padding;
let grid_divisors_x;
let grid_divisors_y;
let grid_spacing_x;
let grid_spacing_y;

let cell_infos;
let bools;
let humanes;
let infraestrutura;
let mobilidade
let natureza;
let fundos;

let div_interface;
let checkbox_estruturada;
let checkbox_aleatoria;
let checkbox_elementos;
let button_resetar;
let button_salvar;
let radio_paleta;
let p_avisos;

let paleta_B = ["#f6ece6","#2973c7","#72975c","#f8724d","#E7AC69"];
let paleta = paleta_B;
let paleta_semfundo = [];
let fundo_cor;

let c;

function preload() {

  p_avisos = document.getElementById("avisos");

  humanes = [];
  for(let i = 0; i < 15; i++ ) {
    let img_index = str(i + 1);
    img_index = img_index.padStart(2, '0');
    humanes[i] = loadImage(base_url + "elementos/AF-Elementos-Humanes-" + img_index + ".png");
    p_avisos.innerText = "Carregando humanes " + img_index;
  }
  
  infraestrutura = [];
  for(let i = 0; i < 25; i++ ) {
    let img_index = str(i + 1);
    img_index = img_index.padStart(2, '0');
    infraestrutura[i] = loadImage(base_url + "elementos/AF-Elementos-Infraestrutura-" + img_index + ".png");
    p_avisos.innerText = "Carregando infraestrutura " + img_index;
  }

  mobilidade = [];
  for(let i = 0; i < 20; i++ ) {
    let img_index = str(i + 1);
    img_index = img_index.padStart(2, '0');
    mobilidade[i] = loadImage(base_url + "elementos/AF-Elementos-Mobilidade-" + img_index + ".png");
    p_avisos.innerText = "Carregando mobilidade " + img_index;
  }

  natureza = [];
  for(let i = 0; i < 7; i++ ) {
    let img_index = str(i + 1);
    img_index = img_index.padStart(2, '0');
    natureza[i] = loadImage(base_url + "elementos/AF-Elementos-Natureza-" + img_index + ".png");
    p_avisos.innerText = "Carregando natureza " + img_index;
  }

  fundos = [];
  for(let i = 0; i < 10; i++ ) {
    let img_index = str(i + 1);
    img_index = img_index.padStart(2, '0');
    fundos[i] = loadImage(base_url + "elementos/AF-Elementos-Fundo_" + img_index + ".png");
    p_avisos.innerText = "Carregando fundos " + img_index;
  }

  p_avisos.innerText = "";
}

function setup() {
  
  createCanvas(2000, 1000);

  padding = 0;

  grid_divisors_x = 8;
  grid_divisors_y = grid_divisors_x/2;

  grid_spacing_x = (width - padding*2) / grid_divisors_x;
  grid_spacing_y = (height - padding*2) / grid_divisors_y;

  div_interface = document.getElementById("interface");

  checkbox_estruturada = createCheckbox('Composição estruturada', true);
  checkbox_estruturada.changed(alternar_estruturada);
  checkbox_estruturada.parent(div_interface);

  checkbox_aleatoria = createCheckbox('Composição aleatória', true);
  checkbox_aleatoria.changed(alternar_aleatoria);
  checkbox_aleatoria.parent(div_interface);

  button_resetar = createButton('Atualizar');
  button_resetar.mousePressed(resetar);
  button_resetar.parent(div_interface);

  button_salvar = createButton('Salvar');
  button_salvar.mousePressed(salvar);
  button_salvar.parent(div_interface);

  fundo_cor = random(paleta);
  paleta_semfundo = paleta.filter(cor => cor != fundo_cor);
  initializeGrid();

  imageMode(CENTER);
}

function draw() {
  background(fundo_cor);
  drawGrid();
 }

function alternar_estruturada() {
  
}

function alternar_aleatoria() {

}

function salvar() {
  let date = new Date().toLocaleString();
  let name = "AF-Proposta-" + date;
  save(name + ".jpg")
}

function resetar() {
  fundo_cor = random(paleta);
  paleta_semfundo = paleta.filter(cor => cor != fundo_cor);
  resetGrid();
}