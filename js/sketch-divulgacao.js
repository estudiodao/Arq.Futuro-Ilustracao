// Código baseado nesses tutoriais:
// https://gorillasun.de/blog/an-algorithm-for-irregular-grids
// https://erraticgenerator.com/blog/video-export-from-p5js-sketch/


let humanes;
let infraestrutura;
let mobilidade
let natureza;
let elementos;
let fundos;

let paleta = ["#f6ece6","#2973c7","#72975c","#f8724d","#E7AC69"];
let paleta_semfundo = [];
let fundo_cor;

let contador;
let gravando;

function preload() {

  humanes = [];
  for(let i = 0; i < 15; i++ ) {
    let img_index = str(i + 1);
    img_index = img_index.padStart(2, '0');
    humanes[i] = loadImage("../elementos/AF-Elementos-Humanes-" + img_index + ".png");
  }
  
  infraestrutura = [];
  for(let i = 0; i < 25; i++ ) {
    let img_index = str(i + 1);
    img_index = img_index.padStart(2, '0');
    infraestrutura[i] = loadImage("../elementos/AF-Elementos-Infraestrutura-" + img_index + ".png");
  }

  mobilidade = [];
  for(let i = 0; i < 13; i++ ) {
    let img_index = str(i + 1);
    img_index = img_index.padStart(2, '0');
    mobilidade[i] = loadImage("../elementos/AF-Elementos-Mobilidade-" + img_index + ".png");
  }

  natureza = [];
  for(let i = 0; i < 7; i++ ) {
    let img_index = str(i + 1);
    img_index = img_index.padStart(2, '0');
    natureza[i] = loadImage("../elementos/AF-Elementos-Natureza-" + img_index + ".png");
  }

  elementos = [...humanes, ...infraestrutura, ...mobilidade, ...natureza];

  fundos = [];
  for(let i = 0; i < 10; i++ ) {
    let img_index = str(i + 1);
    img_index = img_index.padStart(2, '0');
    fundos[i] = loadImage("../elementos/AF-Elementos-Fundo_" + img_index + ".png");
  }

  // Inicializa o role do video
  HME.createH264MP4Encoder().then(enc => {
    encoder = enc;
    encoder.outputFilename = 'test';
    encoder.width = 1080;
    encoder.height = 1080;
    encoder.frameRate = 5;
    encoder.kbps = 50000; // video quality
    encoder.groupOfPictures = 10; // lower if you have fast actions.
    encoder.initialize();
  })

}

function setup() {
  
  createCanvas(1080, 1080);
  button = createButton('gravar')
  button.mousePressed(() => {
    contador = 0;
    gravando = true
  });

  fundo_cor = random(paleta);
  paleta_semfundo = paleta.filter(cor => cor != fundo_cor);

  elementos = shuffle(elementos);
  
  imageMode(CENTER);

  contador = 0;
  gravando = false;
  frameRate(5);

}

function draw() {

  if (gravando) {
    console.log('recording')
    encoder.addFrameRgba(drawingContext.getImageData(0, 0, encoder.width, encoder.height).data);
  }

  if(contador < elementos.length) {
    resetar();
    background(fundo_cor);
    draw_element(fundos, paleta_semfundo, 2160, 1080, 0);
    draw_element(elementos, paleta_semfundo, 800,800, 1);
    contador += 1;
  } else {

    if  (gravando) {

      recording = false
      recordedFrames = 0
      console.log('recording stopped')

      encoder.finalize()
      const uint8Array = encoder.FS.readFile(encoder.outputFilename);
      const anchor = document.createElement('a')
      anchor.href = URL.createObjectURL(new Blob([uint8Array], { type: 'video/mp4' }))
      anchor.download = encoder.outputFilename
      anchor.click()
      encoder.delete()


    }
    background(0);

  }
}

function resetar() {
  fundo_cor = random(paleta);
  paleta_semfundo = paleta.filter(cor => cor != fundo_cor);
}

function draw_element(a_elementos, a_paleta, largura, altura, inc) {
  tint(a_paleta[(contador+inc)%a_paleta.length]);
  image(a_elementos[(contador+inc)%a_elementos.length], width/2, height/2, largura, altura);
}