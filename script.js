
'use strict';

/* ==========================================
   PORTAFOLIO DIGITAL
   JAVASCRIPT COMPLETO

   PERILLA ORIGINAL:
   - Se mueve con el mouse.
   - Gira en sentido horario.
   - Gira en sentido antihorario.
   - Permite seleccionar los 6 encargos.
   ========================================== */


/* ==========================================
   1. LEER DATOS DE LAS PLANTILLAS HTML
   ========================================== */

function dato(template, selector, atributo) {

  const elemento = template.content.querySelector(
    selector
  );

  if (!elemento) return '';

  if (atributo) {
    return (
      elemento.getAttribute(atributo) || ''
    ).trim();
  }

  return elemento.textContent.trim();

}


/* ==========================================
   2. GUARDAR LOS SEIS ENCARGOS

   Las URL se obtienen directamente
   de las plantillas en index.html.
   ========================================== */

const encargos = Array.from(
  { length: 6 },
  (_, i) => {

    const plantilla = document.getElementById(
      `encargo-${i + 1}`
    );

    return {

      imagen: dato(
        plantilla,
        '.foto-encargo',
        'src'
      ),

      video: dato(
        plantilla,
        '.video-encargo',
        'src'
      ),

      p5: dato(
        plantilla,
        '.p5-encargo',
        'src'
      ),

      permisosP5:
        dato(
          plantilla,
          '.p5-encargo',
          'allow'
        ) || 'camera; microphone; fullscreen',

      titulo: dato(
        plantilla,
        '.titulo-dato'
      ),

      textoIzquierdo: dato(
        plantilla,
        '.texto-izquierdo-dato'
      ),

      textoDerecho: dato(
        plantilla,
        '.texto-derecho-dato'
      ),

      linkJP5: dato(
        plantilla,
        '.link-jp5-dato',
        'href'
      ),

      linkWiki: dato(
        plantilla,
        '.link-wiki-dato',
        'href'
      )

    };

  }
);


/* ==========================================
   3. ADAPTAR EL ESCENARIO AL NAVEGADOR
   ========================================== */

const escenario = document.getElementById(
  'escenario'
);

function adaptarPantalla() {

  const escala = Math.min(
    window.innerWidth / 1366,
    window.innerHeight / 768
  );

  escenario.style.transform =
    `scale(${escala})`;

  escenario.style.left =
    `${(window.innerWidth - 1366 * escala) / 2}px`;

  escenario.style.top =
    `${(window.innerHeight - 768 * escala) / 2}px`;

}

window.addEventListener(
  'resize',
  adaptarPantalla
);

adaptarPantalla();


/* ==========================================
   4. ESTADO DEL PORTAFOLIO
   ========================================== */

let actual = 0;

let transicionEnCurso = false;

let arrastrandoPerilla = false;

const panelMiniatura = document.getElementById(
  'imagen-grande'
);

const panelDetalle = document.getElementById(
  'imagen-detalle'
);


/* ==========================================
   5. CAMBIO DE PANTALLAS
   ========================================== */

function mostrar(id) {

  document.querySelectorAll('.diapositiva')
    .forEach(elemento => {

      elemento.classList.toggle(
        'activa',
        elemento.id === id
      );

    });

}


/* ==========================================
   6. DETENER PROYECTOS Y VIDEOS
   ========================================== */

function detenerContenido() {

  panelDetalle.querySelectorAll('video')
    .forEach(video => video.pause());

  /* Eliminar el iframe detiene el p5.js */

  panelDetalle.replaceChildren();

}


/* ==========================================
   7. BOTÓN ENCARGOS
   ========================================== */

document.getElementById('abrir-imagen')
  .addEventListener('click', evento => {

    evento.preventDefault();

    mostrar('imagen-escrita');

  });


/* ==========================================
   8. FLECHAS DE REGRESO
   ========================================== */

/* RUEDA -> INICIO */

document.getElementById('volver-inicio')
  .addEventListener('click', () => {

    if (transicionEnCurso) return;

    detenerContenido();

    mostrar('inicio');

  });


/* DETALLE -> RUEDA */

document.getElementById('volver-rueda')
  .addEventListener('click', () => {

    if (transicionEnCurso) return;

    detenerContenido();

    mostrar('imagen-escrita');

  });


/* ==========================================
   9. ELEMENTOS SVG DE LA RUEDA
   ========================================== */

const NS = 'http://www.w3.org/2000/svg';

const grupo = document.getElementById(
  'sectores-rueda'
);

const defs = document.getElementById(
  'clips-rueda'
);

const sectores = [];

function svg(tag) {

  return document.createElementNS(
    NS,
    tag
  );

}


/* ==========================================
   10. COORDENADAS DE LOS SECTORES
   ========================================== */

function polar(radio, grados) {

  const angulo = grados * Math.PI / 180;

  return [
    260 + radio * Math.cos(angulo),
    260 + radio * Math.sin(angulo)
  ];

}


/* ==========================================
   11. MOSTRAR MINIATURA
   ========================================== */

function mostrarFoto(panel, src) {

  panel.replaceChildren();

  if (!src) return;

  const img = document.createElement('img');

  img.src = src;

  img.alt = 'Miniatura del encargo';

  panel.appendChild(img);

}


/* ==========================================
   12. SELECCIONAR ENCARGO

   RESTAURADA LA FUNCIÓN ORIGINAL.

   La aguja recupera sus posiciones
   originales para los seis encargos.
   ========================================== */

function seleccionar(i) {

  if (transicionEnCurso) return;

  actual = i;

  sectores.forEach((elemento, numero) => {

    elemento.classList.toggle(
      'seleccionado',
      numero === i
    );

  });

  document.getElementById('aguja')
    .style.transform =
    `rotate(${30 + i * 60}deg)`;

  mostrarFoto(
    panelMiniatura,
    encargos[i].imagen
  );

}


/* ==========================================
   13. GENERAR LOS SEIS SECTORES
   ========================================== */

for (let i = 0; i < 6; i++) {

  const a = polar(
    250,
    -90 + i * 60
  );

  const b = polar(
    250,
    -30 + i * 60
  );

  const forma = `
    M260 260
    L${a[0]} ${a[1]}
    A250 250 0 0 1 ${b[0]} ${b[1]}
    Z
  `;


  /* GRUPO DEL SECTOR */

  const g = svg('g');

  g.classList.add('sector');

  g.setAttribute('tabindex', '0');

  g.setAttribute('role', 'button');

  g.setAttribute(
    'aria-label',
    `Abrir Encargo ${i + 1}`
  );


  /* PATRÓN DE IMAGEN */

  const patron = svg('pattern');

  patron.id = `patron-encargo-${i}`;

  patron.setAttribute('x', '0');
  patron.setAttribute('y', '0');

  patron.setAttribute('width', '520');
  patron.setAttribute('height', '520');

  patron.setAttribute(
    'patternUnits',
    'userSpaceOnUse'
  );


  /* MINIATURA */

  const img = svg('image');

  img.setAttribute(
    'href',
    encargos[i].imagen
  );

  img.setAttribute('x', '0');
  img.setAttribute('y', '0');

  img.setAttribute('width', '520');
  img.setAttribute('height', '520');

  img.setAttribute(
    'preserveAspectRatio',
    'xMidYMid slice'
  );

  patron.appendChild(img);

  defs.appendChild(patron);


  /* DIBUJAR SECTOR */

  const path = svg('path');

  path.classList.add(
    'contorno-sector'
  );

  path.setAttribute('d', forma);

  path.setAttribute(
    'fill',
    `url(#patron-encargo-${i})`
  );

  g.appendChild(path);


  /* SELECCIÓN CON EL MOUSE */

  g.addEventListener('mouseenter', () => {

    if (
      !transicionEnCurso &&
      !arrastrandoPerilla
    ) {

      seleccionar(i);

    }

  });


  /* NAVEGACIÓN CON TECLADO */

  g.addEventListener('focus', () => {

    if (!transicionEnCurso) {

      seleccionar(i);

    }

  });


  /* ABRIR ENCARGO CON CLIC */

  g.addEventListener('click', () => {

    abrirDetalle(i);

  });


  /* ABRIR CON ENTER O ESPACIO */

  g.addEventListener('keydown', evento => {

    if (
      evento.key === 'Enter' ||
      evento.key === ' '
    ) {

      evento.preventDefault();

      abrirDetalle(i);

    }

  });


  grupo.appendChild(g);

  sectores.push(g);

}


/* ==========================================
   14. PERILLA ORIGINAL

   GIRAR CON EL MOUSE EN AMBOS SENTIDOS
   ========================================== */

const perilla = document.getElementById(
  'perilla'
);


/* CALCULAR EL ÁNGULO DEL MOUSE */

function elegirSegunPuntero(evento) {

  const rectangulo = perilla.getBoundingClientRect();

  const centroX =
    rectangulo.left + rectangulo.width / 2;

  const centroY =
    rectangulo.top + rectangulo.height / 2;

  const angulo = (
    Math.atan2(
      evento.clientY - centroY,
      evento.clientX - centroX
    ) * 180 / Math.PI + 90 + 360
  ) % 360;

  const indice = Math.floor(
    angulo / 60
  ) % 6;

  seleccionar(indice);

}


/* COMENZAR A ARRASTRAR */

perilla.addEventListener('pointerdown', evento => {

  if (transicionEnCurso) return;

  arrastrandoPerilla = true;

  perilla.setPointerCapture(
    evento.pointerId
  );

  elegirSegunPuntero(evento);

});


/* MOVER EN AMBOS SENTIDOS */

perilla.addEventListener('pointermove', evento => {

  if (arrastrandoPerilla) {

    elegirSegunPuntero(evento);

  }

});


/* TERMINAR ARRASTRE */

for (const tipo of [
  'pointerup',
  'pointercancel',
  'lostpointercapture'
]) {

  perilla.addEventListener(tipo, () => {

    arrastrandoPerilla = false;

  });

}


/* ==========================================
   15. TEXTOS CON FORMA CIRCULAR
   ========================================== */

function mostrarTextoConForma(id, texto) {

  const contenedor = document.getElementById(id);

  contenedor.replaceChildren();


  /* FORMAS INVISIBLES */

  for (const nombre of [
    'forma-exterior',
    'forma-interior'
  ]) {

    const span = document.createElement('span');

    span.className = nombre;

    span.setAttribute(
      'aria-hidden',
      'true'
    );

    contenedor.appendChild(span);

  }


  /* CONTENIDO DEL TEXTO */

  const contenido = document.createElement('span');

  contenido.className = 'texto-contenido';

  contenido.textContent = texto;

  contenedor.appendChild(contenido);

  contenedor.scrollTop = 0;

}


/* ==========================================
   16. ENLACES WIKI Y P5.JS

   SE CONSERVAN LAS URL ORIGINALES
   DEFINIDAS EN INDEX.HTML.
   ========================================== */

function asignarEnlace(id, url) {

  const enlace = document.getElementById(id);

  const direccion = (url || '').trim();

  if (/^https?:\/\//i.test(direccion)) {

    enlace.href = direccion;

    enlace.target = '_blank';

    enlace.rel = 'noopener noreferrer';

    enlace.removeAttribute('aria-disabled');

    enlace.style.pointerEvents = 'auto';

  } else {

    enlace.removeAttribute('href');

    enlace.setAttribute(
      'aria-disabled',
      'true'
    );

    enlace.style.pointerEvents = 'none';

  }

}


/* ==========================================
   17. CARGAR PROYECTO INTERACTIVO

   PRIORIDAD:
   1. P5.JS
   2. VIDEO
   3. FOTO
   ========================================== */

function cargarProyecto(item) {

  panelDetalle.replaceChildren();


  /* PROYECTO P5.JS */

  if (item.p5) {

    const iframe = document.createElement(
      'iframe'
    );

    iframe.title =
      `Proyecto p5.js: ${item.titulo}`;

    iframe.allow = item.permisosP5;

    iframe.setAttribute(
      'allowfullscreen',
      ''
    );

    iframe.referrerPolicy =
      'strict-origin-when-cross-origin';

    iframe.src = item.p5;

    panelDetalle.appendChild(iframe);


  /* VIDEO */

  } else if (item.video) {

    const video = document.createElement(
      'video'
    );

    video.src = item.video;

    video.controls = true;

    video.playsInline = true;

    panelDetalle.appendChild(video);


  /* FOTOGRAFÍA */

  } else {

    mostrarFoto(
      panelDetalle,
      item.imagen
    );

  }

}


/* ==========================================
   18. ABRIR ENCARGO
   ========================================== */

function abrirDetalle(i) {

  if (transicionEnCurso) return;

  seleccionar(i);

  const item = encargos[i];


  /* TÍTULO */

  document.getElementById('titulo-encargo')
    .textContent = item.titulo;


  /* TEXTOS */

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


  /* FOTO DURANTE LA ANIMACIÓN */

  mostrarFoto(
    panelDetalle,
    item.imagen
  );

  transicionEnCurso = true;


  /* CREAR ESCENA DEL LIBRO */

  const escena = document.createElement(
    'div'
  );

  escena.className = 'libro-escena';

  const hoja = document.createElement(
    'div'
  );

  hoja.className = 'libro-hoja';


  /* CARA DELANTERA */

  const frente = document.querySelector(
    '.marco-derecho'
  ).cloneNode(true);

  frente.classList.add(
    'libro-cara'
  );


  /* ELIMINAR IDENTIFICADORES DUPLICADOS */

  frente.querySelectorAll('[id]')
    .forEach(elemento => {

      elemento.removeAttribute('id');

    });


  Object.assign(frente.style, {
    left: '0',
    top: '0',
    width: '100%',
    height: '100%'
  });


  /* CARA TRASERA */

  const detras = frente.cloneNode(true);

  detras.classList.add(
    'libro-cara-trasera'
  );


  /* ARMAR LIBRO */

  hoja.appendChild(frente);

  hoja.appendChild(detras);

  escena.appendChild(hoja);

  escenario.appendChild(escena);


  /* MOSTRAR PANTALLA DE DETALLE */

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


  /* TERMINAR ANIMACIÓN DEL LIBRO */

  hoja.addEventListener(
    'animationend',
    evento => {

      if (
        evento.animationName !== 'abrir-libro'
      ) {
        return;
      }

      escena.remove();

      detalle.classList.remove(
        'detalle-entrando'
      );


      /* CARGAR P5.JS, VIDEO O FOTO */

      cargarProyecto(item);

      transicionEnCurso = false;

    },
    { once: true }
  );

}


/* ==========================================
   19. ESTADO INICIAL
   ========================================== */

seleccionar(0);

sectores[0].classList.remove(
  'seleccionado'
);


/* ==========================================
   20. BOTÓN WIKI PRINCIPAL
   ========================================== */

const botonWiki = document.getElementById(
  'abrir-wiki'
);

if (
  botonWiki &&
  /^https?:\/\//i.test(
    botonWiki.getAttribute('href') || ''
  )
) {

  botonWiki.target = '_blank';

  botonWiki.rel = 'noopener noreferrer';

}
