
/* ==========================================
   PORTAFOLIO DIGITAL
   ========================================== */

/* 1. LEER EL CONTENIDO DEL HTML */

function leerEncargo(numero) {
  const plantilla = document.getElementById(
    `encargo-${numero}`
  );

  const contenido = plantilla.content;

  const foto = contenido.querySelector('.foto-encargo');
  const video = contenido.querySelector('.video-encargo');
  const p5 = contenido.querySelector('.p5-encargo');

  const titulo = contenido.querySelector('.titulo-dato');
  const textoIzquierdo = contenido.querySelector(
    '.texto-izquierdo-dato'
  );
  const textoDerecho = contenido.querySelector(
    '.texto-derecho-dato'
  );

  const linkJP5 = contenido.querySelector(
    '.link-jp5-dato'
  );
  const linkWiki = contenido.querySelector(
    '.link-wiki-dato'
  );

  return {
    imagen: foto.getAttribute('src')?.trim() || '',
    video: video.getAttribute('src')?.trim() || '',
    p5: p5.getAttribute('src')?.trim() || '',

    permisosP5:
      p5.getAttribute('allow') ||
      'camera; microphone; fullscreen',

    titulo: titulo.textContent.trim(),

    textoIzquierdo: textoIzquierdo.textContent.trim(),
    textoDerecho: textoDerecho.textContent.trim(),

    linkJP5: linkJP5.getAttribute('href') || '',
    linkWiki: linkWiki.getAttribute('href') || ''
  };
}

const encargos = [];

for (let i = 1; i <= 6; i++) {
  encargos.push(leerEncargo(i));
}


/* ==========================================
   2. ADAPTAR EL ESCENARIO A LA PANTALLA
   ========================================== */

function adaptarPantalla() {
  const escala = Math.min(
    window.innerWidth / 1366,
    window.innerHeight / 768
  );

  const escenario = document.getElementById(
    'escenario'
  );

  escenario.style.transform = `scale(${escala})`;
  escenario.style.left =
    `${(window.innerWidth - 1366 * escala) / 2}px`;
  escenario.style.top =
    `${(window.innerHeight - 768 * escala) / 2}px`;
}

window.addEventListener('resize', adaptarPantalla);
adaptarPantalla();


/* ==========================================
   3. VARIABLES GENERALES
   ========================================== */

let actual = 0;
let transicionEnCurso = false;
let arrastrandoPerilla = false;


/* ==========================================
   4. CAMBIO DE DIAPOSITIVA
   ========================================== */

function mostrar(id) {
  document.querySelectorAll('.diapositiva')
    .forEach(diapositiva => {
      diapositiva.classList.toggle(
        'activa',
        diapositiva.id === id
      );
    });
}


/* ==========================================
   5. ENTRAR A LA RUEDA
   ========================================== */

document.getElementById('abrir-imagen')
  .addEventListener('click', evento => {
    evento.preventDefault();
    mostrar('imagen-escrita');
  });


/* ==========================================
   6. DETENER VIDEO O PROYECTO P5.JS
   ========================================== */

function detenerContenido() {
  document.querySelectorAll('#escenario video')
    .forEach(video => video.pause());

  const panel = document.getElementById(
    'imagen-detalle'
  );

  /* Al eliminar el iframe se cierra
     esa instancia del proyecto p5.js. */
  panel.replaceChildren();
}


/* ==========================================
   7. FLECHAS DE REGRESO
   ========================================== */

/* DESDE LA RUEDA -> PANTALLA INICIAL */

document.getElementById('volver-inicio')
  .addEventListener('click', () => {
    if (transicionEnCurso) return;

    detenerContenido();
    mostrar('inicio');
  });


/* DESDE EL ENCARGO -> RUEDA */

document.getElementById('volver-rueda')
  .addEventListener('click', () => {
    if (transicionEnCurso) return;

    detenerContenido();

    /* Se conserva la selección de la rueda */
    mostrar('imagen-escrita');
  });


/* ==========================================
   8. CONSTRUIR LA RUEDA SVG
   ========================================== */

const NS = 'http://www.w3.org/2000/svg';

const grupo = document.getElementById(
  'sectores-rueda'
);

const definiciones = document.getElementById(
  'clips-rueda'
);

const sectores = [];

function crearSVG(nombre) {
  return document.createElementNS(NS, nombre);
}

function coordenada(radio, grados) {
  const angulo = grados * Math.PI / 180;

  return [
    260 + radio * Math.cos(angulo),
    260 + radio * Math.sin(angulo)
  ];
}


/* ==========================================
   9. CREAR LOS SEIS SECTORES
   ========================================== */

for (let i = 0; i < 6; i++) {
  const inicio = -90 + i * 60;
  const fin = inicio + 60;

  const p = coordenada(250, inicio);
  const q = coordenada(250, fin);

  const forma = `
    M260 260
    L${p[0]} ${p[1]}
    A250 250 0 0 1 ${q[0]} ${q[1]}
    Z
  `;

  const sector = crearSVG('g');

  sector.setAttribute('class', 'sector');
  sector.setAttribute('role', 'button');
  sector.setAttribute('tabindex', '0');
  sector.setAttribute(
    'aria-label',
    `Abrir Encargo ${i + 1}`
  );

  /* FOTO CORRESPONDIENTE AL SECTOR */

  let relleno = '#7a1111';

  if (encargos[i].imagen) {
    const patron = crearSVG('pattern');

    patron.setAttribute(
      'id',
      `patron-encargo-${i}`
    );
    patron.setAttribute(
      'patternUnits',
      'userSpaceOnUse'
    );
    patron.setAttribute('x', '0');
    patron.setAttribute('y', '0');
    patron.setAttribute('width', '520');
    patron.setAttribute('height', '520');

    const imagen = crearSVG('image');

    imagen.setAttribute(
      'href',
      encargos[i].imagen
    );
    imagen.setAttribute('x', '0');
    imagen.setAttribute('y', '0');
    imagen.setAttribute('width', '520');
    imagen.setAttribute('height', '520');
    imagen.setAttribute(
      'preserveAspectRatio',
      'xMidYMid slice'
    );

    patron.appendChild(imagen);
    definiciones.appendChild(patron);

    relleno = `url(#patron-encargo-${i})`;
  }

  const contorno = crearSVG('path');

  contorno.setAttribute(
    'class',
    'contorno-sector'
  );
  contorno.setAttribute('d', forma);
  contorno.setAttribute('fill', relleno);

  sector.appendChild(contorno);

  /* SELECCIONAR AL PASAR EL MOUSE */

  sector.addEventListener('mouseenter', () => {
    if (!transicionEnCurso && !arrastrandoPerilla) {
      seleccionar(i);
    }
  });

  /* SELECCIONAR CON TECLADO */

  sector.addEventListener('focus', () => {
    if (!transicionEnCurso) {
      seleccionar(i);
    }
  });

  /* ABRIR ENCARGO */

  sector.addEventListener('click', () => {
    abrirDetalle(i);
  });

  sector.addEventListener('keydown', evento => {
    if (
      evento.key === 'Enter' ||
      evento.key === ' '
    ) {
      evento.preventDefault();
      abrirDetalle(i);
    }
  });

  grupo.appendChild(sector);
  sectores.push(sector);
}


/* ==========================================
   10. MOSTRAR FOTOGRAFÍAS
   ========================================== */

function mostrarImagen(panel, ruta) {
  panel.replaceChildren();

  if (!ruta) return;

  const imagen = document.createElement('img');

  imagen.src = ruta;
  imagen.alt = 'Fotografía del encargo';

  panel.appendChild(imagen);
}


/* ==========================================
   11. MOSTRAR VIDEOS
   ========================================== */

function mostrarVideo(panel, ruta, controles = false) {
  panel.replaceChildren();

  if (!ruta) return;

  const video = document.createElement('video');

  video.src = ruta;
  video.controls = controles;
  video.playsInline = true;
  video.preload = 'metadata';
  video.autoplay = false;

  panel.appendChild(video);
}


/* ==========================================
   12. MOSTRAR P5.JS

   Conserva los permisos de cámara.
   ========================================== */

function mostrarP5(panel, ruta, permisos) {
  panel.replaceChildren();

  if (!ruta) return;

  const iframe = document.createElement('iframe');

  iframe.title = 'Proyecto interactivo p5.js';

  iframe.setAttribute(
    'allow',
    permisos || 'camera; microphone; fullscreen'
  );

  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('loading', 'eager');

  iframe.src = ruta;

  panel.appendChild(iframe);
}


/* ==========================================
   13. SELECCIONAR SECTOR

   Sincroniza:
   - Rueda
   - Perilla
   - Imagen del panel derecho
   ========================================== */

function seleccionar(indice) {
  if (transicionEnCurso) return;

  actual = indice;

  sectores.forEach((sector, i) => {
    sector.classList.toggle(
      'seleccionado',
      i === indice
    );
  });

  const giro = 30 + indice * 60;

  document.getElementById('aguja')
    .style.transform = `rotate(${giro}deg)`;

  const item = encargos[indice];
  const panel = document.getElementById(
    'imagen-grande'
  );

  if (item.imagen) {
    mostrarImagen(panel, item.imagen);
  } else if (item.video) {
    mostrarVideo(panel, item.video, false);
  } else {
    panel.replaceChildren();
  }
}


/* ==========================================
   14. ARRASTRAR LA PERILLA
   ========================================== */

const perilla = document.getElementById(
  'perilla'
);

function seleccionarDesdePerilla(evento) {
  const caja = perilla.getBoundingClientRect();

  const centroX = caja.left + caja.width / 2;
  const centroY = caja.top + caja.height / 2;

  const dx = evento.clientX - centroX;
  const dy = evento.clientY - centroY;

  const angulo =
    Math.atan2(dy, dx) * 180 / Math.PI;

  const anguloNormalizado =
    (angulo + 90 + 360) % 360;

  const indice =
    Math.floor(anguloNormalizado / 60) % 6;

  seleccionar(indice);
}

perilla.addEventListener('pointerdown', evento => {
  if (transicionEnCurso) return;

  arrastrandoPerilla = true;

  perilla.setPointerCapture(evento.pointerId);
  seleccionarDesdePerilla(evento);
});

perilla.addEventListener('pointermove', evento => {
  if (!arrastrandoPerilla) return;

  seleccionarDesdePerilla(evento);
});

function terminarArrastre() {
  arrastrandoPerilla = false;
}

perilla.addEventListener(
  'pointerup',
  terminarArrastre
);

perilla.addEventListener(
  'pointercancel',
  terminarArrastre
);

perilla.addEventListener(
  'lostpointercapture',
  terminarArrastre
);


/* ==========================================
   15. NUEVO: TEXTO ENTRE AMBAS CURVAS

   Se colocan dos elementos flotantes
   ANTES de las palabras:

   - forma-exterior
   - forma-interior

   Esto permite que shape-outside
   reserve espacio para ambas curvas.

   IMPORTANTE:
   El contenido es un span en línea.
   No debe ser display:block.
   ========================================== */

function mostrarTextoConForma(id, texto) {
  const contenedor = document.getElementById(id);

  contenedor.replaceChildren();

  /* FORMA DEL BORDE EXTERIOR */

  const formaExterior = document.createElement(
    'span'
  );

  formaExterior.className = 'forma-exterior';

  formaExterior.setAttribute(
    'aria-hidden',
    'true'
  );

  /* FORMA DEL CÍRCULO CENTRAL */

  const formaInterior = document.createElement(
    'span'
  );

  formaInterior.className = 'forma-interior';

  formaInterior.setAttribute(
    'aria-hidden',
    'true'
  );

  /* INSERTAR AMBAS FORMAS ANTES DEL TEXTO */

  contenedor.appendChild(formaExterior);
  contenedor.appendChild(formaInterior);

  /* INSERTAR TEXTO EN LÍNEA */

  const contenido = document.createElement(
    'span'
  );

  contenido.className = 'texto-contenido';
  contenido.textContent = texto;

  contenedor.appendChild(contenido);

  /* MOSTRAR INICIO DEL TEXTO */

  contenedor.scrollTop = 0;
}


/* ==========================================
   16. ENLACES
   ========================================== */

function asignarEnlace(id, url) {
  const enlace = document.getElementById(id);

  enlace.href = url || '#';

  enlace.onclick = url
    ? null
    : evento => evento.preventDefault();
}


/* ==========================================
   17. ABRIR UN ENCARGO

   1. Seleccionar fotografía
   2. Cargar título y textos
   3. Ejecutar la animación de libro
   4. Mostrar p5.js, video o foto
   ========================================== */

function abrirDetalle(indice) {
  if (transicionEnCurso) return;

  seleccionar(indice);

  const item = encargos[indice];

  /* TÍTULO */

  document.getElementById('titulo-encargo')
    .textContent = item.titulo;

  /* TEXTOS CON AMBAS CURVAS */

  mostrarTextoConForma(
    'texto-izquierda',
    item.textoIzquierdo
  );

  mostrarTextoConForma(
    'texto-derecha',
    item.textoDerecho
  );

  /* ENLACES */

  asignarEnlace(
    'link-jp5',
    item.linkJP5
  );

  asignarEnlace(
    'link-wiki',
    item.linkWiki
  );

  /* FOTO INICIAL DEL DETALLE */

  const panelDetalle = document.getElementById(
    'imagen-detalle'
  );

  mostrarImagen(panelDetalle, item.imagen);

  transicionEnCurso = true;

  /* ESCENA DE LIBRO */

  const escenario = document.getElementById(
    'escenario'
  );

  const escenaLibro = document.createElement(
    'div'
  );

  escenaLibro.className = 'libro-escena';

  const hoja = document.createElement('div');

  hoja.className = 'libro-hoja';

  /* COPIAR EL MARCO Y LA FOTOGRAFÍA */

  const frontal = document.querySelector(
    '#imagen-escrita .marco-derecho'
  ).cloneNode(true);

  frontal.classList.add('libro-cara');

  frontal.querySelectorAll('[id]')
    .forEach(elemento => {
      elemento.removeAttribute('id');
    });

  frontal.style.left = '0';
  frontal.style.top = '0';
  frontal.style.width = '100%';
  frontal.style.height = '100%';

  /* CARA POSTERIOR */

  const trasera = frontal.cloneNode(true);

  trasera.classList.add(
    'libro-cara-trasera'
  );

  hoja.appendChild(frontal);
  hoja.appendChild(trasera);

  escenaLibro.appendChild(hoja);
  escenario.appendChild(escenaLibro);

  /* MOSTRAR TERCERA DIAPOSITIVA */

  const detalle = document.getElementById(
    'detalle'
  );

  detalle.classList.remove(
    'detalle-entrando'
  );

  void detalle.offsetWidth;

  detalle.classList.add(
    'detalle-entrando'
  );

  mostrar('detalle');

  /* FINALIZAR LA APERTURA */

  hoja.addEventListener('animationend', evento => {
    if (evento.animationName !== 'abrir-libro') {
      return;
    }

    escenaLibro.remove();

    detalle.classList.remove(
      'detalle-entrando'
    );

    /* PRIORIDAD 1: P5.JS */

    if (item.p5) {
      mostrarP5(
        panelDetalle,
        item.p5,
        item.permisosP5
      );

    /* PRIORIDAD 2: VIDEO */

    } else if (item.video) {
      mostrarVideo(
        panelDetalle,
        item.video,
        true
      );

    /* PRIORIDAD 3: FOTOGRAFÍA */

    } else {
      mostrarImagen(
        panelDetalle,
        item.imagen
      );
    }

    transicionEnCurso = false;

  }, { once: true });
}


/* ==========================================
   18. ESTADO INICIAL
   ========================================== */

seleccionar(0);

sectores[0].classList.remove(
  'seleccionado'
);


/* ==========================================
   19. ACCESO MEDIANTE ENLACES INTERNOS
   ========================================== */

const hash = location.hash.substring(1);

if (hash === 'imagen-escrita') {
  mostrar('imagen-escrita');

} else if (hash === 'detalle') {
  mostrar('imagen-escrita');
  abrirDetalle(0);
}
