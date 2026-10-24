
/* ==========================================
   PORTAFOLIO DIGITAL

   Las fotografías, videos, textos y enlaces
   se obtienen desde index.html.

   No es necesario cambiar sus rutas aquí.
   ========================================== */


/* ==========================================
   1. LEER CONTENIDO DE LOS SEIS ENCARGOS
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


/* LISTA DE LOS SEIS ENCARGOS */

const encargos = [];

for (let i = 1; i <= 6; i++) {
  encargos.push(leerEncargo(i));
}


/* ==========================================
   2. ADAPTACIÓN DE PANTALLA
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
   3. NAVEGACIÓN
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


/* VARIABLES GENERALES */

let actual = 0;
let transicionEnCurso = false;
let arrastrandoPerilla = false;


/* BOTÓN IMAGEN ESCRITA */

document.getElementById('abrir-imagen')
  .addEventListener('click', evento => {

    evento.preventDefault();
    mostrar('imagen-escrita');

  });


/* VOLVER AL INICIO */

document.querySelectorAll('.volver')
  .forEach(boton => {

    boton.addEventListener('click', () => {

      if (transicionEnCurso) return;

      detenerVideos();
      mostrar('inicio');

    });
  });


/* ==========================================
   4. CONFIGURACIÓN DE LA RUEDA
   ========================================== */

const NS = 'http://www.w3.org/2000/svg';

const grupo = document.getElementById(
  'sectores-rueda'
);

const definiciones = document.getElementById(
  'clips-rueda'
);

const sectores = [];


/* FUNCIÓN PARA CREAR ELEMENTOS SVG */

function crearSVG(nombre) {
  return document.createElementNS(NS, nombre);
}


/* CALCULAR COORDENADAS */

function coordenada(radio, grados) {

  const angulo = grados * Math.PI / 180;

  return [
    260 + radio * Math.cos(angulo),
    260 + radio * Math.sin(angulo)
  ];
}


/* ==========================================
   5. CREAR LOS SEIS SECTORES CON IMÁGENES

   CAMBIO PRINCIPAL:

   Cada imagen se incorpora como un
   patrón SVG propio de su sector.

   Esto evita superposiciones y mantiene
   la fotografía dentro de su división.
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


  /* ======================================
     CREAR PATRÓN DE FOTOGRAFÍA

     Cada sector tiene su propia imagen,
     obtenida del HTML correspondiente.
     ====================================== */

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


  /* ======================================
     DIBUJAR EL SECTOR CON SU FOTO

     La propia forma circular recorta
     automáticamente el patrón de imagen.
     ====================================== */

  const contorno = crearSVG('path');

  contorno.setAttribute(
    'class',
    'contorno-sector'
  );

  contorno.setAttribute('d', forma);
  contorno.setAttribute('fill', relleno);

  sector.appendChild(contorno);


  /* ======================================
     EVENTOS DE LOS SECTORES
     ====================================== */

  /* AL PASAR EL CURSOR */
  sector.addEventListener(
    'mouseenter',
    () => {
      if (!transicionEnCurso && !arrastrandoPerilla) {
        seleccionar(i);
      }
    }
  );

  /* AL SELECCIONAR CON TECLADO */
  sector.addEventListener(
    'focus',
    () => seleccionar(i)
  );

  /* AL HACER CLIC */
  sector.addEventListener(
    'click',
    () => abrirDetalle(i)
  );

  /* ACTIVACIÓN MEDIANTE TECLADO */
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
   6. MOSTRAR IMAGEN EN RECTÁNGULO
   ========================================== */

function mostrarImagen(panel, ruta) {

  panel.replaceChildren();

  if (!ruta) return;

  const imagen = document.createElement('img');

  imagen.src = ruta;
  imagen.alt = 'Imagen del encargo seleccionado';

  panel.appendChild(imagen);
}


/* ==========================================
   7. MOSTRAR VIDEO
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
   8. SELECCIONAR SECTOR

   Esta función sincroniza:

   - Sector ampliado de la rueda
   - Posición de la perilla
   - Fotografía del rectángulo derecho
   ========================================== */

function seleccionar(indice) {

  if (transicionEnCurso) return;

  actual = indice;


  /* AMPLIAR EL SECTOR */

  sectores.forEach((sector, i) => {

    sector.classList.toggle(
      'seleccionado',
      i === indice
    );

  });


  /* ======================================
     GIRAR LA PERILLA

     Cada sector ocupa 60 grados.
     ====================================== */

  const giro = 30 + indice * 60;

  document.getElementById('aguja')
    .style.transform = `rotate(${giro}deg)`;


  /* ======================================
     ACTUALIZAR RECTÁNGULO DERECHO

     Se usa el mismo encargo que aparece
     dentro del sector de la rueda.
     ====================================== */

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
   9. GIRAR LA PERILLA CON EL MOUSE

   Puedes hacer clic o arrastrarla.

   El sector señalado se selecciona
   automáticamente.
   ========================================== */

const perilla = document.getElementById('perilla');


/* IDENTIFICAR SECTOR SEGÚN POSICIÓN DEL MOUSE */

function seleccionarDesdePerilla(evento) {

  const caja = perilla.getBoundingClientRect();

  const centroX = caja.left + caja.width / 2;
  const centroY = caja.top + caja.height / 2;

  const dx = evento.clientX - centroX;
  const dy = evento.clientY - centroY;

  const angulo =
    Math.atan2(dy, dx) * 180 / Math.PI;

  /* CONVERTIR ÁNGULO A UNO DE SEIS SECTORES */

  const anguloNormalizado =
    (angulo + 90 + 360) % 360;

  const indice =
    Math.floor(anguloNormalizado / 60) % 6;

  seleccionar(indice);
}


/* EMPEZAR A ARRASTRAR */

perilla.addEventListener('pointerdown', evento => {

  if (transicionEnCurso) return;

  arrastrandoPerilla = true;

  perilla.setPointerCapture(evento.pointerId);

  seleccionarDesdePerilla(evento);

});


/* GIRAR MIENTRAS SE ARRASTRA */

perilla.addEventListener('pointermove', evento => {

  if (!arrastrandoPerilla) return;

  seleccionarDesdePerilla(evento);

});


/* TERMINAR DE ARRASTRAR */

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
   10. ENLACES
   ========================================== */

function asignarEnlace(id, url) {

  const enlace = document.getElementById(id);

  enlace.href = url || '#';

  enlace.onclick = url
    ? null
    : evento => evento.preventDefault();
}


/* ==========================================
   11. DETENER VIDEOS
   ========================================== */

function detenerVideos() {

  document.querySelectorAll(
    '#escenario video'
  ).forEach(video => {
    video.pause();
  });

}


/* ==========================================
   12. ABRIR DETALLE DEL ENCARGO

   El marco negro y la fotografía giran
   juntos en 2 segundos, con una apertura
   suave de libro.
   ========================================== */

function abrirDetalle(indice) {

  if (transicionEnCurso) return;

  seleccionar(indice);

  const item = encargos[indice];


  /* FOTOGRAFÍA O VIDEO EN DIAPOSITIVA 3 */

  const panelDetalle = document.getElementById(
    'imagen-detalle'
  );

  if (item.video) {

    mostrarVideo(
      panelDetalle,
      item.video,
      true
    );

  } else if (item.imagen) {

    mostrarImagen(
      panelDetalle,
      item.imagen
    );

  } else {

    panelDetalle.replaceChildren();

  }


  /* TÍTULO Y TEXTOS */

  document.getElementById('titulo-encargo')
    .textContent = item.titulo;

  document.getElementById('texto-izquierda')
    .textContent = item.textoIzquierdo;

  document.getElementById('texto-derecha')
    .textContent = item.textoDerecho;


  /* ENLACES */

  asignarEnlace('link-jp5', item.linkJP5);
  asignarEnlace('link-wiki', item.linkWiki);


  /* INICIAR TRANSICIÓN */

  transicionEnCurso = true;

  detenerVideos();

  const escenario = document.getElementById(
    'escenario'
  );

  const escenaLibro = document.createElement(
    'div'
  );

  escenaLibro.className = 'libro-escena';

  const hoja = document.createElement('div');

  hoja.className = 'libro-hoja';


  /* ======================================
     COPIAR FOTOGRAFÍA Y MARCO NEGRO
     ====================================== */

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


  /* CARA TRASERA DEL LIBRO */

  const trasera = frontal.cloneNode(true);

  trasera.classList.add('libro-cara-trasera');


  /* CONSTRUIR LA HOJA */

  hoja.appendChild(frontal);
  hoja.appendChild(trasera);

  escenaLibro.appendChild(hoja);
  escenario.appendChild(escenaLibro);


  /* MOSTRAR DIAPOSITIVA 3 DETRÁS */

  const detalle = document.getElementById(
    'detalle'
  );

  detalle.classList.remove('detalle-entrando');

  void detalle.offsetWidth;

  detalle.classList.add('detalle-entrando');

  mostrar('detalle');


  /* FINALIZAR AL TERMINAR LA ANIMACIÓN */

  hoja.addEventListener('animationend', evento => {

    if (evento.animationName !== 'abrir-libro') {
      return;
    }

    escenaLibro.remove();

    detalle.classList.remove(
      'detalle-entrando'
    );

    transicionEnCurso = false;

  }, { once: true });

}


/* ==========================================
   13. ESTADO INICIAL

   Mostrar la primera imagen en el
   rectángulo derecho cuando se abra
   la segunda diapositiva.
   ========================================== */

seleccionar(0);

/* EVITAR QUE EL PRIMER SECTOR QUEDE
   AGRANDADO ANTES DE INTERACTUAR */

sectores[0].classList.remove('seleccionado');


/* ==========================================
   14. ACCESO DIRECTO POR ENLACES
   ========================================== */

const hash = location.hash.substring(1);

if (hash === 'imagen-escrita') {

  mostrar('imagen-escrita');

} else if (hash === 'detalle') {

  mostrar('imagen-escrita');
  abrirDetalle(0);

}
