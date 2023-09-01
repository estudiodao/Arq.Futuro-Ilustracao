class Cell {
  constructor(x, y, w, h, elemento, tipo) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.tint_color = random(paleta_semfundo);
    this.img = elemento;
    this.tipo = tipo;
  }
}

function constructGrid(sizes, elementos) {

  elementos = shuffle(elementos);
  let index_counter = 0;
  for(let x = 0; x < grid_divisors_x - max(sizes) + 1; x++) {
    for(let y = 0; y < grid_divisors_y - max(sizes) + 1; y++) {
      
      let fits = true;
      let size = random(sizes);

      if(x + size > grid_divisors_x || y + size > grid_divisors_y) {
        fits = false;     
      }

      for(let xc = x; xc < x + size; xc++) {
        for(let yc = y; yc < y + size; yc++) {  
          if(bools[xc][yc] == false) {
            fits = false;
          }
        }
      }

      if(fits) {

        for(let xc = x; xc < x + size; xc++) {
          for(let yc = y; yc < y + size; yc++) {
            bools[xc][yc] = false;
          }
        }

        let wc = size * grid_spacing_x;
        let hc = size * grid_spacing_y;
        let xc = x * grid_spacing_x + wc / 2;
        let yc = y * grid_spacing_y + hc / 2;

        cell_infos.push(new Cell(xc, yc, wc, hc, elementos[index_counter % elementos.length], "cell_estruturada"));
        index_counter++;
      }
    }
  }
}

function aleatoria(qtd, min, max, elementos) {
  poissonSamples = generatePoissonDiskPoints(400);
  poissonSamples = shuffle(poissonSamples);
  elementos = shuffle(elementos);
  for(let i = 0; i < qtd; i++) {
    let pos_atual = poissonSamples[i%poissonSamples.length];
    let size = random(min, max);
    cell_infos.push(new Cell(pos_atual.x, pos_atual.y, size, size, elementos[i%elementos.length], "cell_aleatoria"));
  }
}

function malha() {
  let x = width/2;
  let y = height/2;
  let w = width;
  let h = height;
  cell_infos.push(new Cell(x, y, w, h, fundos));
}

function initializeGrid() {
  cell_infos = [];
  bools = [];
  for(let x = 0; x < grid_divisors_x; x++) {
    let column = [];
    for(let y = 0; y < grid_divisors_y; y++) {
      column.push(true);
    }
    bools.push(column);
  }
  
  if (checkbox_estruturada.checked()) {
    let elementos_todos = humanes.concat(infraestrutura, mobilidade, natureza);
    constructGrid([2, 1], elementos_todos);
    constructGrid([1], elementos_todos);
  }
  
  if (checkbox_aleatoria.checked()) {
    aleatoria(5, width/10, 800, infraestrutura);
    aleatoria(3, width/10, 800, mobilidade);
    aleatoria(5, width/10, 800, humanes);
  }
    
  cell_infos = shuffle(cell_infos);
  cell_infos.unshift(new Cell(width/2, height/2, width, height, fundos[floor(random(fundos.length))], "cell_fundo"));

}

function drawGrid() {
  cell_infos.forEach(c => {
    tint(c.tint_color);
    image(c.img, c.x, c.y, c.w, c.h);
  });
}

function resetGrid() {
  initializeGrid();
}