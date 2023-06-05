//-------CONFIGURACION----
let AMP_MIN = 0.01; // umbral mínimo de amplitud. Señal que supera al ruido de fondo
let AMP_MAX = 0.1; // umbral máximo de amplitud. 
let FREC_MIN = 900;
let FREC_MAX = 1900;
let IMPRIMIR = false; //variable de monitoreo de lq info del sonido

//------CAMINANTE----
let c; // el caminante

//-----ENTRADA DE AUDIO----
let mic;

//-----AMPLITUD----
let amp; //variable donde cargo los valores de amplitud del sonido de entrada
let haySonido = false; // vaiable buleana que de define el ESTADO
let antesHabiaSonido = false; //memoria de la variable "haySonido". Guarda el valor de la variable en fotograma anterior


//----FRECUENCIA -----
let audioContext; //motor de audio del navegador
let frecuencia; //variable donde cargo los valores de frecuencia del sonido de entrada
let frecuenciaAnterior; //memoria de la variable "frecuencia". Guarda el valor de la variable en fotograma anterior
let difDeFrecuencia; // diferencia de frecuencia entre el fotograma actual y el anterior
const pichModel = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

//------CLASIFICADOR-----
let classifier;
const options = { probabilityThreshold: 0.9 };
let label;
let etiqueta;
const classModel = 'https://teachablemachine.withgoogle.com/models/tlwduv4b4/'; //url del modelo producido con Teachable Machine

//-------CAPAS-------
let figura; // capa para la figura
let colorDeFondo;

//--------TIEMPO-------
let marca; // marca en el momento en que empiezo a contar el tiempo
let tiempoActual; // hace cuántos milisegundos que hace que está corriendo el programa
let duracion = 200; // el umbral de duración a partir del cual considero un sonido corto o largo
let esSonidoLargo = false;


function setup() {
  //createCanvas(600, 600);
  createCanvas(windowWidth, windowHeight);

  c = new Caminante();

  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startPitch);

  //------CLASIFICADOR-----
  classifier.classify(gotResult);

  userStartAudio(); // esto lo utilizo porque en algunos navigadores se cuelga el audio. Esto hace un reset del motor de audio (audio context)

  figura = createGraphics(width, height);

  cambiarColorDeFondo();
}

function draw() {

  background(colorDeFondo);

  amp = mic.getLevel();

  haySonido = amp > AMP_MIN;
  difDeFrecuencia = frecuencia - frecuenciaAnterior;

  let empezoElSonido = haySonido && !antesHabiaSonido; // EVENTO


  if(empezoElSonido){
    c.saltar();
    marca = millis(); // tomo la marca de tiempo
  }

  if(haySonido){

    tiempoActual = millis(); 
    
    if(tiempoActual > marca + duracion){ // si el sonido es mas largo que el ubmral 
      c.actualizar(amp, frecuencia, difDeFrecuencia);
      c.mover();
      c.dibujar(figura);
    }
  }


  //--------CLASIFICADOR------
  if(label == 'shhh'){
    // background(255);
    figura.clear();
    label = '';
    console.log('resetea figura x shhhhhh');
  }else if(label == 'chasquido'){
    cambiarColorDeFondo();
    label = '';
  }


  antesHabiaSonido = haySonido; //guardo el estado anterior
  frecuenciaAnterior = frecuencia;

  //----- DIBUJO----
  image( figura , 0 , 0 );

  
  if(IMPRIMIR){
    imprimirData();
  }
}

//------FONDO-----
function cambiarColorDeFondo(){

  push();
  colorMode(HSB);
  let tinte = random(255);
  colorDeFondo = color (tinte, 30, 150);
  pop();
}

//-------VENTANA------
function windowResized() {
  	resizeCanvas(windowWidth, windowHeight);
}

//-------FRECUENCIA-----
function startPitch() {
  pitch = ml5.pitchDetection(pichModel, audioContext , mic.stream, modelLoaded);
}
function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
    if (frequency) {
      frecuencia = frequency;
    } else {
    }
    getPitch();
  })
}

//--------CLASIFICADOR-----
function preload() {
  // Load SpeechCommands18w sound classifier model
  classifier = ml5.soundClassifier(classModel + 'model.json', options);
}

function gotResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  //console.log(results);
  // Show the first label and confidence
  label = results[0].label;
  etiqueta = label;
}

//-------IMPRIMIR -------
function imprimirData(){

  background(255);
  push();
  textSize(16);
  fill(0);
  let texto;
  texto = 'amplitud: ' + amp;
  text(texto, 10, 20);

  texto = 'frecuencia: ' + frecuencia;
  text(texto, 10, 40);
  texto = 'dif de frecuencia: ' + difDeFrecuencia;
  text(texto, 10, 60);

  texto = 'clase: ' + etiqueta;
  text(texto, 10, 80);
  pop();

}