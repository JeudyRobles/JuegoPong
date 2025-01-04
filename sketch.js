let anchoCanvas = 800;
let altoCanvas = 400;
let jugadorY;
let computadoraY;
let pelotaX, pelotaY;
let velocidadPelotaX = 7;
let velocidadPelotaY = 5;
let anchoRaqueta = 10;
let altoRaqueta = 100;
let puntuacionJugador = 0;
let puntuacionComputadora = 0;
let fondo; // Variable para la imagen de fondo
let pelota; // Variable para la imagen de la pelota
let anguloPelota = 0; // Variable para el ángulo de rotación de la pelota
let raquetaSonido; // Variable para el sonido de la raqueta
let puntoSonido; // Variable para el sonido de punto

function preload() {
  fondo = loadImage('fondo3.png'); // Cargar la imagen de fondo
  pelota = loadImage('pelota1.png'); // Cargar la imagen de la pelota
  raquetaSonido = loadSound('raquetaSonido.wav'); // Cargar el sonido de la raqueta
  puntoSonido = loadSound('punto.mp3'); // Cargar el sonido de punto
}

function setup() {
  createCanvas(anchoCanvas, altoCanvas);
  jugadorY = altoCanvas / 2 - altoRaqueta / 2;
  computadoraY = altoCanvas / 2 - altoRaqueta / 2;
  pelotaX = anchoCanvas / 2;
  pelotaY = altoCanvas / 2;
}

function draw() {
  background(fondo); // Usar la imagen de fondo
  dibujarMarcos();
  dibujarRaquetas();
  dibujarPelota();
  moverPelota();
  moverComputadora();
  verificarColisiones();
  mostrarPuntuacion();
}

function dibujarMarcos() {
  fill(255); // Color blanco para los marcos
  rect(0, 0, anchoCanvas, 10); // Marco superior
  rect(0, altoCanvas - 10, anchoCanvas, 10); // Marco inferior
}

function dibujarRaquetas() {
  rect(20, jugadorY, anchoRaqueta, altoRaqueta);
  rect(anchoCanvas - 30, computadoraY, anchoRaqueta, altoRaqueta);
}

function dibujarPelota() {
  push(); // Guardar el estado de transformación actual
  translate(pelotaX, pelotaY); // Mover el origen de coordenadas al centro de la pelota
  rotate(anguloPelota); // Rotar la pelota según el ángulo
  imageMode(CENTER); // Dibujar la imagen desde el centro
  image(pelota, 0, 0, 35, 35); // Dibujar la imagen de la pelota con tamaño 40x40 píxeles
  pop(); // Restaurar el estado de transformación anterior
}

function moverPelota() {
  pelotaX += velocidadPelotaX;
  pelotaY += velocidadPelotaY;

  // Calcular la velocidad total de la pelota
  let velocidadTotal = sqrt(velocidadPelotaX * velocidadPelotaX + velocidadPelotaY * velocidadPelotaY);
  // Ajustar el ángulo de rotación de la pelota en función de su velocidad
  anguloPelota += velocidadTotal * 0.02; // Reducir el factor para que la pelota gire más lento

  if (pelotaY < 10 || pelotaY > altoCanvas - 10) {
    velocidadPelotaY *= -1;
  }

  if (pelotaX < 0) {
    puntuacionComputadora++;
    puntoSonido.play(); // Reproducir el sonido de punto
    narrarMarcador(); // Narrar el marcador
    reiniciarPelota();
  }

  if (pelotaX > anchoCanvas) {
    puntuacionJugador++;
    puntoSonido.play(); // Reproducir el sonido de punto
    narrarMarcador(); // Narrar el marcador
    reiniciarPelota();
  }
}

function moverComputadora() {
  computadoraY = constrain(computadoraY, 10, altoCanvas - altoRaqueta - 10);
  if (pelotaY < computadoraY + altoRaqueta / 2) {
    computadoraY -= 2;
  } else if (pelotaY > computadoraY + altoRaqueta / 2) {
    computadoraY += 2;
  }
}

function verificarColisiones() {
  let puntoImpacto;

  // Colisión con la raqueta del jugador
  if (pelotaX < 30 && pelotaY > jugadorY && pelotaY < jugadorY + altoRaqueta) {
    velocidadPelotaX *= -1;
    puntoImpacto = pelotaY - (jugadorY + altoRaqueta / 2);
    velocidadPelotaY = puntoImpacto * 0.1; // Ajusta el factor según la dificultad deseada
    raquetaSonido.play(); // Reproducir el sonido de la raqueta
  }

  // Colisión con la raqueta de la computadora
  if (pelotaX > anchoCanvas - 30 && pelotaY > computadoraY && pelotaY < computadoraY + altoRaqueta) {
    velocidadPelotaX *= -1;
    puntoImpacto = pelotaY - (computadoraY + altoRaqueta / 2);
    velocidadPelotaY = puntoImpacto * 0.1; // Ajusta el factor según la dificultad deseada
    raquetaSonido.play(); // Reproducir el sonido de la raqueta
  }
}

function reiniciarPelota() {
  pelotaX = anchoCanvas / 2;
  pelotaY = altoCanvas / 2;
  velocidadPelotaX *= -1;
  
  // Reposicionar las raquetas en el centro
  jugadorY = altoCanvas / 2 - altoRaqueta / 2;
  computadoraY = altoCanvas / 2 - altoRaqueta / 2;
}

function mostrarPuntuacion() {
  textSize(32);
  fill(0);
  text(puntuacionJugador, 50, 50);
  text(puntuacionComputadora, anchoCanvas - 100, 50);
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    jugadorY -= 50;
  } else if (keyCode === DOWN_ARROW) {
    jugadorY += 50;
  }
  jugadorY = constrain(jugadorY, 10, altoCanvas - altoRaqueta - 10);
}

function narrarMarcador() {
  let marcador = `${puntuacionJugador} a ${puntuacionComputadora}`;
  let narrador = new SpeechSynthesisUtterance(marcador);
  window.speechSynthesis.speak(narrador);
}
