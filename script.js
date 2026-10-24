
/* ==========================================
   PORTAFOLIO DIGITAL

   FUNCIONES:
   - Leer fotografías, videos y p5.js del HTML
   - Mostrar las seis miniaturas
   - Girar la perilla
   - Sincronizar la imagen derecha
   - Abrir los encargos como un libro
   - Mostrar p5.js con permiso de cámara
   - Detener el contenido al salir
   ========================================== */


/* ==========================================
   1. LEER CONTENIDOS DESDE HTML
   ========================================== */

function leerEncargo(numero) {

  const plantilla = document.getElementById(
    `encargo-${numero}`
  );

  const contenido = plantilla.content;

  const foto = contenido.querySelector(
    '.foto-encargo'
  );

  const video = contenido.querySelector(
    '.video-encargo'
  );

  const p5 = contenido.querySelector(
    '.p5-encargo'
  );

  const titulo = contenido.querySelector(
    '.titulo-dato'
  );

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

    /* PERMISOS ESCRITOS EN EL HTML */
    permisosP5:
      p5.getAttribute('allow') ||
      'camera; microphone; fullscreen',

    titulo: titulo.textContent.trim(),

    textoIzquierdo:
      textoIzquierdo.textContent.trim(),

    textoDerecho:
      textoDerecho.textContent.trim(),

    linkJP5:
      linkJP5.getAttribute('href') || '',

    linkWiki:
      linkWiki.getAttribute('href') || ''

  };
}


/* LEER LOS SEIS ENCARGOS */

const encargos = [];

for (let i = 1; i <= 6; i++) {
  encargos.push(leerEncargo(i));
}


/* ==========================================
   2. ADAPTAR PANTALLA
   ========================================== */

function adaptarPantalla() {

  const escala = Math.min(
    window.innerWidth / 1366,
    window.innerHeight / 768
  );

  const escenario = document.getElementById(
    'escenario'
  );

  escenario.style.transform =
    `scale(${escala})`;

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
   4. MOSTRAR DIAPOSITIVAS
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
   5. NAVEGACIÓN
   ========================================== */

document.getElementById('abrir-imagen')
  .addEventListener('click', evento => {

    evento.preventDefault();

    mostrar('imagen-escrita');

  });


/* ==========================================
   6. DETENER CONTENIDO AL SALIR

   Al eliminar el iframe de p5.js,
   se cierra la página incrustada y
   se libera la captura de cámara
   iniciada por ese proyecto.
   ========================================== */

function detenerContenido() {

  document.querySelectorAll(
    '#escenario video'
  ).forEach(video => {

    video.pause();

  });

  const panelDetalle = document.getElementById(
    'imagen-detalle'
  );

  panelDetalle.replaceChildren();

}


/* FLECHAS DE REGRESO */

document.querySelectorAll('.volver')
  .forEach(boton => {

    boton.addEventListener('click', () => {

      if (transicionEnCurso) return;

      detenerContenido();

      mostrar('inicio');

    });

  });


/* ==========================================
   7. RUEDA SVG
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

  return document.createElementNS(
    NS,
    nombre
  );

}


function coordenada(radio, grados) {

  const angulo = grados * Math.PI / 180;

  return [
    260 + radio * Math.cos(angulo),
    260 + radio * Math.sin(angulo)
  ];

}


/* ==========================================
   8. CREAR LOS SEIS SECTORES CON FOTOS
   ========================================== */

for (let i = 0; i < 6; i++) {

  const inicio = -90 + i * 60;
  const fin = inicio + 60;

  const p = coordenada(250, inicio);
  const q = coordenada(250, fin);

  const forma =
    `M260 260
     L${p[0]} ${p[1]}
     A250 250 0 0 1 ${q[0]} ${q[1]}
     Z`;

  const sector = crearSVG('g');

  sector.setAttribute('class', 'sector');
  sector.setAttribute('role', 'button');
  sector.setAttribute('tabindex', '0');

  sector.setAttribute(
    'aria-label',
    `Abrir Encargo ${i + 1}`
  );

  /* FOTOGRAFÍA DE CADA SECTOR */

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

  /* INTERACCIONES */

  sector.addEventListener(
    'mouseenter',
    () => {

      if (!transicionEnCurso && !arrastrandoPerilla) {
        seleccionar(i);
      }

    }
  );

  sector.addEventListener(
    'focus',
    () => {

      if (!transicionEnCurso) {
        seleccionar(i);
      }

    }
  );

  sector.addEventListener(
    'click',
    () => abrirDetalle(i)
  );

  sector.addEventListener(
    'keydown',
    evento => {

      if (
        evento.key === 'Enter' ||
        evento.key === ' '
      ) {

        evento.preventDefault();
        abrirDetalle(i);

      }

    }
  );

  grupo.appendChild(sector);
  sectores.push(sector);

}


/* ==========================================
   9. MOSTRAR FOTOGRAFÍA
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
   10. MOSTRAR VIDEO
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
   11. MOSTRAR P5.JS CON PERMISO DE CÁMARA

   CAMBIO PRINCIPAL:

   Se agrega:
   allow="camera; microphone; fullscreen"

   Esto permite que el proyecto incrustado
   solicite acceso a esos dispositivos.

   No concede acceso automáticamente:
   la persona debe aceptar el permiso.
   ========================================== */

function mostrarP5(panel, ruta, permisos) {

  panel.replaceChildren();

  if (!ruta) return;

  const iframe = document.createElement('iframe');

  iframe.title = 'Proyecto interactivo p5.js';

  /* HABILITAR PERMISO DE CÁMARA */
  iframe.setAttribute(
    'allow',
    permisos || 'camera; microphone; fullscreen'
  );

  iframe.setAttribute('allowfullscreen', '');

  iframe.setAttribute('loading', 'eager');

  /* CONFIGURAR SRC DESPUÉS DE LOS PERMISOS */
  iframe.src = ruta;

  panel.appendChild(iframe);

}


/* ==========================================
   12. SELECCIONAR SECTOR

   Sincroniza miniatura, perilla
   y rectángulo derecho.
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

  /* GIRAR AGUJA */
  const giro = 30 + indice * 60;

  document.getElementById('aguja')
    .style.transform =
    `rotate(${giro}deg)`;

  /* ACTUALIZAR FOTOGRAFÍA DERECHA */
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
   13. ARRASTRAR LA PERILLA
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
   14. ENLACES
   ========================================== */

function asignarEnlace(id, url) {

  const enlace = document.getElementById(id);

  enlace.href = url || '#';

  enlace.onclick = url
    ? null
    : evento => evento.preventDefault();

}


/* ==========================================
   15. ABRIR DETALLE DEL ENCARGO

   SECUENCIA:
   1. Seleccionar la fotografía.
   2. Actualizar textos.
   3. Animar apertura de libro.
   4. Al finalizar, cargar p5.js con cámara.

   PRIORIDAD:
   p5.js -> video -> fotografía
   ========================================== */

function abrirDetalle(indice) {

  if (transicionEnCurso) return;

  seleccionar(indice);

  const item = encargos[indice];

  /* ACTUALIZAR TEXTOS */

  document.getElementById('titulo-encargo')
    .textContent = item.titulo;

  document.getElementById('texto-izquierda')
    .textContent = item.textoIzquierdo;

  document.getElementById('texto-derecha')
    .textContent = item.textoDerecho;

  /* ACTUALIZAR ENLACES */

  asignarEnlace('link-jp5', item.linkJP5);
  asignarEnlace('link-wiki', item.linkWiki);

  /* MOSTRAR FOTO TEMPORAL EN EL DETALLE */

  const panelDetalle = document.getElementById(
    'imagen-detalle'
  );

  mostrarImagen(panelDetalle, item.imagen);

  /* BLOQUEAR ANIMACIONES REPETIDAS */

  transicionEnCurso = true;

  /* CREAR ESCENA DE LIBRO */

  const escenario = document.getElementById(
    'escenario'
  );

  const escenaLibro = document.createElement('div');

  escenaLibro.className = 'libro-escena';

  const hoja = document.createElement('div');

  hoja.className = 'libro-hoja';

  /* COPIAR MARCO NEGRO Y MINIATURA */

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

  /* CREAR CARA TRASERA */

  const trasera = frontal.cloneNode(true);

  trasera.classList.add('libro-cara-trasera');

  hoja.appendChild(frontal);
  hoja.appendChild(trasera);

  escenaLibro.appendChild(hoja);
  escenario.appendChild(escenaLibro);

  /* MOSTRAR LA TERCERA DIAPOSITIVA */

  const detalle = document.getElementById(
    'detalle'
  );

  detalle.classList.remove('detalle-entrando');

  void detalle.offsetWidth;

  detalle.classList.add('detalle-entrando');

  mostrar('detalle');


  /* ======================================
     FINALIZAR APERTURA DE LIBRO

     Cuando termine la animación de 2s,
     cargar el proyecto p5.js.

     La cámara NO se inicia mientras
     la página está pasando.
     ====================================== */

  hoja.addEventListener('animationend', evento => {

    if (evento.animationName !== 'abrir-libro') {
      return;
    }

    escenaLibro.remove();

    detalle.classList.remove('detalle-entrando');

    /* P5.JS CON PERMISO DE CÁMARA */

    if (item.p5) {

      mostrarP5(
        panelDetalle,
        item.p5,
        item.permisosP5
      );

    /* VIDEO NORMAL */

    } else if (item.video) {

      mostrarVideo(
        panelDetalle,
        item.video,
        true
      );

    /* FOTOGRAFÍA */

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
   16. ESTADO INICIAL
   ========================================== */

seleccionar(0);

sectores[0].classList.remove(
  'seleccionado'
);


/* ==========================================
   17. ENLACES INTERNOS
   ========================================== */

const hash = location.hash.substring(1);

if (hash === 'imagen-escrita') {

  mostrar('imagen-escrita');

} else if (hash === 'detalle') {

  mostrar('imagen-escrita');
  abrirDetalle(0);

}

