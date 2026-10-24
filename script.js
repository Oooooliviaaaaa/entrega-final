
'use strict';

/* ==========================================
   1. LEER LOS DATOS DESDE EL HTML
   ========================================== */

function dato(template, selector, atributo) {

  const elemento = template.content.querySelector(selector);

  if (!elemento) return '';

  if (atributo) {
    return (
      elemento.getAttribute(atributo) || ''
    ).trim();
  }

  return elemento.textContent.trim();
}


/* LEER LOS SEIS ENCARGOS */

const encargos = Array.from(
  { length: 6 },
  (_, i) => {

    const t = document.getElementById(
      `encargo-${i + 1}`
    );

    return {
      imagen: dato(t, '.foto-encargo', 'src'),

      video: dato(t, '.video-encargo', 'src'),

      p5: dato(t, '.p5-encargo', 'src'),

      permisosP5:
        dato(t, '.p5-encargo', 'allow') ||
        'camera; microphone; fullscreen',

      titulo: dato(t, '.titulo-dato'),

      textoIzquierdo:
        dato(t, '.texto-izquierdo-dato'),

      textoDerecho:
        dato(t, '.texto-derecho-dato'),

      linkJP5:
        dato(t, '.link-jp5-dato', 'href'),

      linkWiki:
        dato(t, '.link-wiki-dato', 'href')
    };

  }
);


/* ==========================================
   2. ADAPTAR EL ESCENARIO AL NAVEGADOR
   ========================================== */

const escenario = document.getElementById(
  'escenario'
);

function adaptarPantalla() {

  const escala = Math.min(
    window.innerWidth / 1366,
    window.innerHeight / 768
  );

  escenario.style.transform = `scale(${escala})`;

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
   3. ESTADO DE LA INTERFAZ
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
   4. CAMBIAR ENTRE LAS TRES PANTALLAS
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
   5. DETENER CONTENIDOS AL REGRESAR
   ========================================== */

function detenerContenido() {

  panelDetalle.querySelectorAll('video')
    .forEach(video => video.pause());

  /* Eliminar un iframe también detiene
     esa instancia del proyecto p5.js. */

  panelDetalle.replaceChildren();

}


/* ==========================================
   6. BOTÓN ENCARGOS
   ========================================== */

document.getElementById('abrir-imagen')
  .addEventListener('click', evento => {

    evento.preventDefault();

    mostrar('imagen-escrita');

  });


/* ==========================================
   7. FLECHAS DE REGRESO
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
   8. ELEMENTOS SVG
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
   9. COORDENADAS DE LA RUEDA
   ========================================== */

function polar(radio, grados) {

  const angulo = grados * Math.PI / 180;

  return [
    260 + radio * Math.cos(angulo),
    260 + radio * Math.sin(angulo)
  ];

}


/* ==========================================
   10. MOSTRAR UNA FOTOGRAFÍA
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
   11. SELECCIONAR UN ENCARGO
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
   12. CREAR LOS SEIS SECTORES
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


  /* GRUPO SVG */

  const g = svg('g');

  g.classList.add('sector');

  g.setAttribute('tabindex', '0');

  g.setAttribute('role', 'button');

  g.setAttribute(
    'aria-label',
    `Abrir Encargo ${i + 1}`
  );


  /* PATRÓN CON LA MINIATURA */

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


  /* IMAGEN DEL PATRÓN */

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


  /* DIBUJAR EL SECTOR */

  const path = svg('path');

  path.classList.add('contorno-sector');

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


  /* SELECCIÓN CON EL TECLADO */

  g.addEventListener('focus', () => {

    if (!transicionEnCurso) {
      seleccionar(i);
    }

  });


  /* ABRIR ENCARGO */

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
   13. PERILLA ARRASTRABLE
   ========================================== */

const perilla = document.getElementById(
  'perilla'
);


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


perilla.addEventListener('pointerdown', evento => {

  if (transicionEnCurso) return;

  arrastrandoPerilla = true;

  perilla.setPointerCapture(
    evento.pointerId
  );

  elegirSegunPuntero(evento);

});


perilla.addEventListener('pointermove', evento => {

  if (arrastrandoPerilla) {
    elegirSegunPuntero(evento);
  }

});


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
   14. TEXTOS CON FORMA CIRCULAR
   ========================================== */

function mostrarTextoConForma(id, texto) {

  const contenedor = document.getElementById(id);

  contenedor.replaceChildren();


  /* FORMAS INVISIBLES PARA EL TEXTO */

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


  /* TEXTO DEL ENCARGO */

  const contenido = document.createElement('span');

  contenido.className = 'texto-contenido';

  contenido.textContent = texto;

  contenedor.appendChild(contenido);

  contenedor.scrollTop = 0;

}


/* ==========================================
   15. ENLACES EXTERNOS

   IMPORTANTE PARA GITHUB PAGES:

   Los enlaces se leen del HTML y se
   asignan directamente al elemento <a>.

   No se utiliza preventDefault()
   sobre los enlaces válidos.
   ========================================== */

function asignarEnlace(id, url) {

  const enlace = document.getElementById(id);

  const direccion = (url || '').trim();


  /* SOLO HABILITAR URLS HTTP O HTTPS */

  if (/^https?:\/\//i.test(direccion)) {

    enlace.href = direccion;

    enlace.target = '_blank';

    enlace.rel = 'noopener noreferrer';

    enlace.removeAttribute(
      'aria-disabled'
    );

    enlace.style.pointerEvents = 'auto';

  } else {

    /* SI NO EXISTE DIRECCIÓN,
       NO ABRIR UNA PÁGINA VACÍA */

    enlace.removeAttribute('href');

    enlace.setAttribute(
      'aria-disabled',
      'true'
    );

    enlace.style.pointerEvents = 'none';

  }

}


/* ==========================================
   16. CARGAR PROYECTOS P5.JS

   PRIORIDAD:
   1. P5.JS
   2. VIDEO
   3. FOTO
   ========================================== */

function cargarProyecto(item) {

  panelDetalle.replaceChildren();


  /* PROYECTO P5.JS */

  if (item.p5) {

    const iframe = document.createElement('iframe');

    iframe.title = `Proyecto p5.js: ${item.titulo}`;

    iframe.allow = item.permisosP5;

    iframe.setAttribute(
      'allowfullscreen',
      ''
    );

    iframe.referrerPolicy =
      'strict-origin-when-cross-origin';

    /* CONSERVAR LA DIRECCIÓN ORIGINAL */

    iframe.src = item.p5;

    panelDetalle.appendChild(iframe);


  /* VIDEO */

  } else if (item.video) {

    const video = document.createElement('video');

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
   17. ABRIR DETALLE DEL ENCARGO
   ========================================== */

function abrirDetalle(i) {

  if (transicionEnCurso) return;

  seleccionar(i);

  const item = encargos[i];


  /* TÍTULO */

  document.getElementById('titulo-encargo')
    .textContent = item.titulo;


  /* DESCRIPCIÓN IZQUIERDA */

  mostrarTextoConForma(
    'texto-izquierda',
    item.textoIzquierdo
  );


  /* DESCRIPCIÓN DERECHA */

  mostrarTextoConForma(
    'texto-derecha',
    item.textoDerecho
  );


  /* ENLACES ORIGINALES */

  asignarEnlace(
    'link-jp5',
    item.linkJP5
  );

  asignarEnlace(
    'link-wiki',
    item.linkWiki
  );


  /* FOTOGRAFÍA DURANTE LA ANIMACIÓN */

  mostrarFoto(
    panelDetalle,
    item.imagen
  );

  transicionEnCurso = true;


  /* ======================================
     CONSTRUIR EL LIBRO
     ====================================== */

  const escena = document.createElement('div');

  escena.className = 'libro-escena';


  const hoja = document.createElement('div');

  hoja.className = 'libro-hoja';


  /* CARA DELANTERA */

  const frente = document.querySelector(
    '.marco-derecho'
  ).cloneNode(true);

  frente.classList.add('libro-cara');


  /* EVITAR IDS DUPLICADOS */

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


  /* ARMAR LA ESCENA */

  hoja.appendChild(frente);

  hoja.appendChild(detras);

  escena.appendChild(hoja);

  escenario.appendChild(escena);


  /* ======================================
     ACTIVAR LA PANTALLA DE DETALLE
     ====================================== */

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


  /* ======================================
     AL TERMINAR EL GIRO DEL LIBRO
     ====================================== */

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


      /* CARGAR EL PROYECTO REAL */

      cargarProyecto(item);

      transicionEnCurso = false;

    },
    { once: true }
  );

}


/* ==========================================
   18. CONFIGURACIÓN INICIAL
   ========================================== */

seleccionar(0);

sectores[0].classList.remove(
  'seleccionado'
);


/* ==========================================
   19. ENLACE WIKI PRINCIPAL

   Se abre en otra pestaña.
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
