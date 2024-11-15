function calcular() {
  const R1 = parseFloat(document.getElementById("R1").value);
  const R2 = parseFloat(document.getElementById("R2").value);
  const R3 = parseFloat(document.getElementById("R3").value);
  const R4 = parseFloat(document.getElementById("R4").value);
  const Vfuente = parseFloat(document.getElementById("Vfuente").value);

  if (isNaN(R1) || isNaN(R2) || isNaN(R3) || isNaN(R4) || isNaN(Vfuente)) {
    document.getElementById("resultado").innerText = "Por favor, ingrese todos los valores.";
    return;
  }

  // Resistencias en serie
  const Rs1 = R1 + R3;
  const Rs2 = R2 + R4;
  const Req = (Rs1 * Rs2) / (Rs1 + Rs2);

  // Corriente total
  const I = Vfuente / Req;

  // Corrientes parciales
  const I13 = Vfuente / Rs1;
  const I24 = Vfuente / Rs2;

  // Caídas de voltaje en cada resistencia
  const VR1 = I13 * R1;
  const VR2 = I24 * R2;
  const VR3 = I13 * R3;
  const VR4 = I24 * R4;

  // Cálculo de voltajes en puntos B y C
  const Vb = Vfuente * (R1 / (R1 + R3)); // Voltaje en el punto B
  const Vc = Vfuente * (R2 / (R2 + R4)); // Voltaje en el punto C
  const Vs = Vfuente * (R4 / (R3 + R4) - R2 / (R1 + R2));

  const Vbc = Math.abs(Vb - Vc);

  let mensaje = "Condiciones del circuito:\n";
  let cumpleCondiciones = true;

  if (Vs === 0) { 
    mensaje += "- El circuito cumple con el equilibrio del puente de Wheatstone.\n";
  } else {
    mensaje += "- El circuito NO cumple con el equilibrio del puente de Wheatstone.\n";
    cumpleCondiciones = false;
  }

  if (Rs1 === Rs2) {
    mensaje += "- La resistencia total de la rama R1+R3 es igual a la rama R2+R4.\n";
  } else {
    mensaje += "- La resistencia total de la rama R1+R3 NO es igual a la rama R2+R4.\n";
  }

  if (VR1 / VR2 === VR3 / VR4) {
    mensaje += "- El voltaje en las resistencias de las ramas es proporcional.\n";
  } else {
    mensaje += "- El voltaje en las resistencias de las ramas NO es proporcional.\n";
  }

  if (Vb === Vc) {
    mensaje += "- La suma de voltajes en las ramas opuestas es igual.\n";
  } else {
    mensaje += "- La suma de voltajes en las ramas opuestas NO es igual.\n";
  }

  if (I13 === I24) {
    mensaje += "- La corriente en ambas ramas es igual.\n";
  } else {
    mensaje += "- La corriente en ambas ramas NO es igual.\n";
  }

  if (R1 === R3 && R2 === R4) {
    mensaje += "- Las resistencias son simétricas (R1 = R3 y R2 = R4).\n";
  } else {
    mensaje += "- Las resistencias NO son simétricas (R1 ≠ R3 o R2 ≠ R4).\n";
  }

if (!cumpleCondiciones) {
  mensaje += "\nSugerencias para balancear el puente de Wheatstone:\n";
  const sugeridoR1 = (R3 / R4) * R2;
  const sugeridoR2 = (R4 / R3) * R1;
  const sugeridoR3 = (R1 / R2) * R4;
  const sugeridoR4 = (R2 / R1) * R3;
  
  const esDecimalValido = (num) => {
    return Number.isInteger(num) || (Math.round(num * 10) / 10 === num);
  };

  if (sugeridoR1 > 0 && sugeridoR1 !== R1 && esDecimalValido(sugeridoR1)) {
    mensaje += `- Ajuste R1 a ${sugeridoR1.toFixed(1)} Ω para lograr equilibrio.\n`;
  }
  if (sugeridoR2 > 0 && sugeridoR2 !== R2 && esDecimalValido(sugeridoR2)) {
    mensaje += `- Ajuste R2 a ${sugeridoR2.toFixed(1)} Ω para lograr equilibrio.\n`;
  }
  if (sugeridoR3 > 0 && sugeridoR3 !== R3 && esDecimalValido(sugeridoR3)) {
    mensaje += `- Ajuste R3 a ${sugeridoR3.toFixed(1)} Ω para lograr equilibrio.\n`;
  }
  if (sugeridoR4 > 0 && sugeridoR4 !== R4 && esDecimalValido(sugeridoR4)) {
    mensaje += `- Ajuste R4 a ${sugeridoR4.toFixed(1)} Ω para lograr equilibrio.\n`;
  }
  
    

  }
  console.log({R1, R2, R3, R4, Vfuente, VR1, VR2, VR3, VR4, Vb, Vc, Vfuente, Vs, I, I13, I24});

  document.getElementById("resultado").innerText = mensaje;

  dibujarCircuito(R1, R2, R3, R4, Vfuente, VR1, VR2, VR3, VR4, Vb, Vc, Vfuente, Vs, I, I13, I24);
}

function dibujarCircuito(R1, R2, R3, R4, Vfuente, VR1, VR2, VR3, VR4, Vb, Vc, Vfuente, Vs, I, I13, I24) {
  const canvas = document.getElementById("canvasCircuito");
  const ctx = canvas.getContext("2d");

  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dimensiones del canvas
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Colores
  const colorFuente = "#FF007F";
  const colorLinea = "#00FFFF";
  const colorTexto = "#FF007F";

  // Posiciones ajustadas para centrar el circuito y mantener la proporción de las líneas de la fuente
  const fuenteX = canvasWidth * 0.15;
  const fuenteY = canvasHeight * 0.3;
  const circuitoInicioX = canvasWidth * 0.35;
  const circuitoInicioY = canvasHeight * 0.2;
  const circuitoAncho = canvasWidth * 0.3;
  const circuitoAlto = canvasHeight * 0.6;

  // Dibujar la fuente
  ctx.fillStyle = colorFuente;
  ctx.fillRect(fuenteX, fuenteY, 30, 50); // Rectángulo de la fuente
  ctx.fillStyle = colorTexto;
  ctx.font = "16px Arial";
  ctx.fillText("V", fuenteX + 10, fuenteY + 25);

  // Líneas de conexión
  ctx.strokeStyle = colorLinea;
  ctx.lineWidth = 3;

  // Conexión de la fuente al circuito (ajuste de longitud de líneas)
  ctx.beginPath();
  ctx.moveTo(fuenteX + 15, fuenteY); // Punto superior de la fuente
  ctx.lineTo(fuenteX + 15, circuitoInicioY - 40); // Línea más larga hacia arriba
  ctx.lineTo(circuitoInicioX + 100, circuitoInicioY - 40); // Línea hacia la derecha
  ctx.lineTo(circuitoInicioX + 100, circuitoInicioY); // Conectar a la parte superior del circuito
  ctx.stroke();

  // Rama superior izquierda (R1)
  ctx.beginPath();
  ctx.moveTo(circuitoInicioX, circuitoInicioY);
  ctx.lineTo(circuitoInicioX, circuitoInicioY + circuitoAlto / 2);
  ctx.fillText(`I1 = ${I13.toFixed(2)}A`, circuitoInicioX - 70, circuitoInicioY +10);
  ctx.stroke();
  ctx.fillText(`R1 = ${R1}Ω`, circuitoInicioX - 80, circuitoInicioY + circuitoAlto / 4); // Valor de R1
  ctx.fillText(`VR1 = ${VR1.toFixed(2)}V`, circuitoInicioX - 95, circuitoInicioY + circuitoAlto / 4 + 20); // Caída de voltaje en R1
  ctx.fillText(`Vb = ${Vb.toFixed(2)}V`, circuitoInicioX - 95, circuitoInicioY + circuitoAlto / 2); 

  // Rama superior derecha (R2)
  ctx.beginPath();
  ctx.moveTo(circuitoInicioX + circuitoAncho, circuitoInicioY);
  ctx.lineTo(circuitoInicioX + circuitoAncho, circuitoInicioY + circuitoAlto / 2);
  ctx.fillText(`I2 = ${I24.toFixed(2)}A`, circuitoInicioX + circuitoAncho + 10, circuitoInicioY +10);
  ctx.stroke();
  ctx.fillText(`R2 = ${R2}Ω`, circuitoInicioX + circuitoAncho + 20, circuitoInicioY + circuitoAlto / 4); // Valor de R2
  ctx.fillText(`VR2 = ${VR2.toFixed(2)}V`, circuitoInicioX + circuitoAncho + 20, circuitoInicioY + circuitoAlto / 4 + 20); // Caída de voltaje en R2
  ctx.fillText(`Vc = ${Vc.toFixed(2)}V`, circuitoInicioX + circuitoAncho + 20, circuitoInicioY + circuitoAlto / 2);

  // Conexión entre R1 y R2 (parte superior)
  ctx.beginPath();
  ctx.moveTo(circuitoInicioX, circuitoInicioY);
  ctx.lineTo(circuitoInicioX + circuitoAncho, circuitoInicioY);
  ctx.stroke();

  // Línea de balance horizontal en el centro
  ctx.beginPath();
  ctx.moveTo(circuitoInicioX, circuitoInicioY + circuitoAlto / 2);
  ctx.lineTo(circuitoInicioX + circuitoAncho, circuitoInicioY + circuitoAlto / 2);
  ctx.stroke();
  ctx.fillText(`V = ${Vs.toFixed(2)}V`, circuitoInicioX + circuitoAncho / 2 - 30, circuitoInicioY + circuitoAlto / 2 - 10);

  // Rama inferior izquierda (R3)
  ctx.beginPath();
  ctx.moveTo(circuitoInicioX, circuitoInicioY + circuitoAlto / 2);
  ctx.lineTo(circuitoInicioX, circuitoInicioY + circuitoAlto);
  ctx.stroke();
  ctx.fillText(`R3 = ${R3}Ω`, circuitoInicioX - 80, circuitoInicioY + (3 * circuitoAlto) / 4); // Valor de R3
  ctx.fillText(`VR3 = ${VR3.toFixed(2)}V`, circuitoInicioX - 95, circuitoInicioY + (3 * circuitoAlto) / 4 + 20); // Caída de voltaje en R3

  // Rama inferior derecha (R4)
  ctx.beginPath();
  ctx.moveTo(circuitoInicioX + circuitoAncho, circuitoInicioY + circuitoAlto / 2);
  ctx.lineTo(circuitoInicioX + circuitoAncho, circuitoInicioY + circuitoAlto);
  ctx.stroke();
  ctx.fillText(`R4 = ${R4}Ω`, circuitoInicioX + circuitoAncho + 20, circuitoInicioY + (3 * circuitoAlto) / 4); // Valor de R4
  ctx.fillText(`VR4 = ${VR4.toFixed(2)}V`, circuitoInicioX + circuitoAncho + 20, circuitoInicioY + (3 * circuitoAlto) / 4 + 20); // Caída de voltaje en R4

  // Conexión entre R3 y R4 (parte inferior)
  ctx.beginPath();
  ctx.moveTo(circuitoInicioX, circuitoInicioY + circuitoAlto);
  ctx.lineTo(circuitoInicioX + circuitoAncho, circuitoInicioY + circuitoAlto);
  ctx.stroke();

  // Conexión del circuito de regreso a la fuente (línea inferior más larga)
  ctx.beginPath();
  ctx.moveTo(circuitoInicioX + 100, circuitoInicioY + circuitoAlto);
  ctx.lineTo(circuitoInicioX + 100, circuitoInicioY + circuitoAlto + 40);
  ctx.lineTo(fuenteX + 15, circuitoInicioY + circuitoAlto + 40); // Línea hacia la izquierda con espacio extra
  ctx.lineTo(fuenteX + 15, fuenteY + 50); // Línea hacia abajo
  ctx.stroke();
}
