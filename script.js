


/* ==========================================
   PORTAFOLIO DIGITAL

   FUNCIONES:
   - Navegación entre las 3 diapositivas
   - Lectura de contenidos desde HTML
   - Creación de los 6 sectores de la rueda
   - Selección y ampliación de sectores
   - Movimiento de la perilla
   - Visualización de fotos y videos
   - Transición de apertura de libro
   - Actualización de textos y enlaces

   IMPORTANTE:
   Las fotografías, los videos, los textos
   y los enlaces se editan en index.html.
   ========================================== */


/* ==========================================
   1. LEER LOS ENCARGOS DESDE HTML
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

    /* FOTOGRAFÍA DEL HTML */
    imagen: foto.getAttribute('src')?.trim() || '',

    /* VIDEO DEL HTML */
    video: video.getAttribute('src')?.trim() || '',

    /* TÍTULO DEL HTML */
    titulo: titulo.textContent.trim(),

    /* TEXTOS DEL HTML */
    textoIzquierdo: textoIzquierdo
      .textContent.trim(),

    textoDerecho: textoDerecho
      .textContent.trim(),

    /* ENLACES DEL HTML */
    linkJP5: linkJP5.getAttribute('href') || '',

    linkWiki: linkWiki.getAttribute('href') || ''

  };
}


/* CREAR UNA LISTA CON LOS SEIS ENCARGOS */

const encargos = [];

for (let i = 1; i <= 6; i++) {

  encargos.push(leerEncargo(i));

}


/* ==========================================
   2. ADAPTAR DIAPOSITIVAS A LA PANTALLA
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

window.addEventListener(
  'resize',
  adaptarPantalla
);

adaptarPantalla();


/* ==========================================
   3. CAMBIAR DE DIAPOSITIVA
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
   4. NAVEGACIÓN PRINCIPAL
   ========================================== */

/* ABRIR DIAPOSITIVA 2 */

document.getElementById('abrir-imagen')
  .addEventListener('click', evento => {

    evento.preventDefault();

    mostrar('imagen-escrita');

  });


/* REGRESAR AL INICIO */

document.querySelectorAll('.volver')
  .forEach(boton => {

    boton.addEventListener('click', () => {

      if (transicionEnCurso) return;

      /* DETENER VIDEOS ANTES DE SALIR */
      detenerVideos();

      mostrar('inicio');

    });

  });


/* ==========================================
   5. VARIABLES DE LA RUEDA
   ========================================== */

const NS = 'http://www.w3.org/2000/svg';

const grupo = document.getElementById(
  'sectores-rueda'
);

const clips = document.getElementById(
  'clips-rueda'
);

const sectores = [];

/* SECTOR ACTUAL */
let actual = 0;

/* CONTROL DE LA ANIMACIÓN */
let transicionEnCurso = false;


/* ==========================================
   6. CALCULAR COORDENADAS CIRCULARES
   ========================================== */

function coordenada(radio, grados) {

  const angulo = grados * Math.PI / 180;

  return [
    260 + radio * Math.cos(angulo),
    260 + radio * Math.sin(angulo)
  ];

}


/* ==========================================
   7. CREAR LOS SEIS SECTORES DE LA RUEDA
   ========================================== */

for (let i = 0; i < 6; i++) {

  /* CADA SECTOR OCUPA 60 GRADOS */

  const inicio = -90 + i * 60;

  const fin = inicio + 60;

  const p = coordenada(250, inicio);

  const q = coordenada(250, fin);


  /* CREAR FORMA DEL SECTOR */

  const forma =
    `M260 260
     L${p[0]} ${p[1]}
     A250 250 0 0 1 ${q[0]} ${q[1]}
     Z`;


  const sector = document.createElementNS(
    NS,
    'g'
  );

  sector.setAttribute('class', 'sector');

  sector.setAttribute('role', 'button');

  sector.setAttribute('tabindex', '0');

  sector.setAttribute(
    'aria-label',
    `Abrir Encargo ${i + 1}`
  );


  /* FONDO ROJO DEL SECTOR */

  const contorno = document.createElementNS(
    NS,
    'path'
  );

  contorno.setAttribute('d', forma);

  contorno.setAttribute('fill', '#7a1111');

  sector.appendChild(contorno);


  /* ======================================
     RECORTE CIRCULAR PARA LA FOTOGRAFÍA
     ====================================== */

  const clip = document.createElementNS(
    NS,
    'clipPath'
  );

  clip.setAttribute('id', `recorte-${i}`);

  const cp = document.createElementNS(
    NS,
    'path'
  );

  cp.setAttribute('d', forma);

  clip.appendChild(cp);

  clips.appendChild(clip);


  /* ======================================
     FOTOGRAFÍA DEL SECTOR

     Se obtiene desde index.html.

     Para los videos, puedes utilizar
     su fotografía como miniatura.
     ====================================== */

  if (encargos[i].imagen) {

    const foto = document.createElementNS(
      NS,
      'image'
    );

    foto.setAttribute(
      'href',
      encargos[i].imagen
    );

    foto.setAttribute('x', '10');

    foto.setAttribute('y', '10');

    foto.setAttribute('width', '500');

    foto.setAttribute('height', '500');

    foto.setAttribute(
      'preserveAspectRatio',
      'xMidYMid slice'
    );

    foto.setAttribute(
      'clip-path',
      `url(#recorte-${i})`
    );

    foto.setAttribute(
      'pointer-events',
      'none'
    );

    sector.appendChild(foto);

  }


  /* ======================================
     INTERACCIÓN DE LOS SECTORES
     ====================================== */

  /* AL PASAR EL CURSOR */
  sector.addEventListener(
    'mouseenter',
    () => seleccionar(i)
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

  /* ACCESIBILIDAD CON TECLADO */
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


  /* INCORPORAR EL SECTOR A LA RUEDA */

  grupo.appendChild(sector);

  sectores.push(sector);

}


/* ==========================================
   8. MOSTRAR FOTOGRAFÍA EN UN PANEL

   Utiliza un elemento <img> y la ruta
   que se escribió en HTML.
   ========================================== */

function mostrarImagen(panel, ruta) {

  /* ELIMINAR CONTENIDO ANTERIOR */
  panel.replaceChildren();

  if (!ruta) return;

  /* CREAR IMAGEN */
  const imagen = document.createElement('img');

  imagen.src = ruta;

  imagen.alt = 'Imagen del encargo seleccionado';

  panel.appendChild(imagen);

}


/* ==========================================
   9. MOSTRAR VIDEO EN UN PANEL

   El video es opcional.

   Si se está en la diapositiva 3,
   tendrá controles de reproducción.
   ========================================== */

function mostrarVideo(panel, ruta, controles = false) {

  panel.replaceChildren();

  if (!ruta) return;

  const video = document.createElement('video');

  video.src = ruta;

  video.controls = controles;

  video.playsInline = true;

  video.preload = 'metadata';

  /* NO REPRODUCIR AUTOMÁTICAMENTE */
  video.autoplay = false;

  panel.appendChild(video);

}


/* ==========================================
   10. SELECCIONAR UN SECTOR
   ========================================== */

function seleccionar(indice) {

  actual = indice;


  /* AUMENTAR SECTOR SELECCIONADO */

  sectores.forEach((sector, i) => {

    sector.classList.toggle(
      'seleccionado',
      i === indice
    );

  });


  /* GIRAR PERILLA */

  const angulo = -60 + indice * 60;

  document.getElementById('aguja')
    .style.transform =
    `rotate(${angulo + 90}deg)`;


  /* ======================================
     MOSTRAR CONTENIDO DERECHO

     PRIORIDAD:
     1. Fotografía, si existe.
     2. Video, si no hay fotografía.
     3. Fondo verde, si ambos están vacíos.

     Esto permite conservar una miniatura
     de fotografía para cada video.
     ====================================== */

  const panel = document.getElementById(
    'imagen-grande'
  );

  const item = encargos[indice];

  if (item.imagen) {

    mostrarImagen(panel, item.imagen);

  } else if (item.video) {

    mostrarVideo(panel, item.video, false);

  } else {

    panel.replaceChildren();

  }

}


/* ==========================================
   11. ACTUALIZAR ENLACES DEL ENCARGO
   ========================================== */

function asignarEnlace(id, url) {

  const enlace = document.getElementById(id);

  enlace.href = url || '#';

  enlace.onclick = url
    ? null
    : evento => evento.preventDefault();

}


/* ==========================================
   12. DETENER VIDEOS AL CAMBIAR DE PÁGINA
   ========================================== */

function detenerVideos() {

  document.querySelectorAll(
    '#escenario video'
  ).forEach(video => {

    video.pause();

  });

}


/* ==========================================
   13. ABRIR DETALLE CON ANIMACIÓN DE LIBRO

   DURACIÓN: 2 SEGUNDOS (DESDE CSS)

   Se copia el marco negro completo,
   junto con su fotografía o video.

   Luego la hoja gira 180 grados
   con una transición suave.
   ========================================== */

function abrirDetalle(indice) {

  /* EVITAR ANIMACIONES REPETIDAS */
  if (transicionEnCurso) return;

  seleccionar(indice);

  const item = encargos[indice];


  /* ======================================
     ACTUALIZAR CONTENIDO DE DIAPOSITIVA 3
     ====================================== */

  const panelDetalle = document.getElementById(
    'imagen-detalle'
  );

  /* SI HAY VIDEO, MOSTRARLO CON CONTROLES */
  if (item.video) {

    mostrarVideo(
      panelDetalle,
      item.video,
      true
    );

  /* SI NO HAY VIDEO, MOSTRAR LA FOTO */
  } else if (item.imagen) {

    mostrarImagen(
      panelDetalle,
      item.imagen
    );

  } else {

    panelDetalle.replaceChildren();

  }


  /* TÍTULO */
  document.getElementById('titulo-encargo')
    .textContent = item.titulo;


  /* TEXTOS */
  document.getElementById('texto-izquierda')
    .textContent = item.textoIzquierdo;

  document.getElementById('texto-derecha')
    .textContent = item.textoDerecho;


  /* ENLACES */
  asignarEnlace(
    'link-jp5',
    item.linkJP5
  );

  asignarEnlace(
    'link-wiki',
    item.linkWiki
  );


  /* ======================================
     CREAR ANIMACIÓN DE APERTURA
     ====================================== */

  transicionEnCurso = true;

  detenerVideos();

  const escenario = document.getElementById(
    'escenario'
  );

  /* ESCENA DEL LIBRO */
  const escenaLibro = document.createElement(
    'div'
  );

  escenaLibro.className = 'libro-escena';


  /* HOJA GIRATORIA */
  const hoja = document.createElement('div');

  hoja.className = 'libro-hoja';


  /* ======================================
     CARA FRONTAL

     Copiar el marco derecho COMPLETO:
     - Borde negro
     - Fondo verde
     - Fotografía o video
     ====================================== */

  const frontal = document.querySelector(
    '#imagen-escrita .marco-derecho'
  ).cloneNode(true);

  frontal.classList.add('libro-cara');

  /* QUITAR IDS REPETIDOS */
  frontal.querySelectorAll('[id]')
    .forEach(elemento => {

      elemento.removeAttribute('id');

    });

  frontal.style.left = '0';

  frontal.style.top = '0';

  frontal.style.width = '100%';

  frontal.style.height = '100%';


  /* ======================================
     CARA TRASERA

     Mantiene la misma imagen, video
     y marco negro.
     ====================================== */

  const trasera = frontal.cloneNode(true);

  trasera.classList.add(
    'libro-cara-trasera'
  );


  /* UNIR CARAS DE LA HOJA */
  hoja.appendChild(frontal);

  hoja.appendChild(trasera);


  /* INCORPORAR EL LIBRO AL ESCENARIO */
  escenaLibro.appendChild(hoja);

  escenario.appendChild(escenaLibro);


  /* ======================================
     MOSTRAR DIAPOSITIVA 3 DEBAJO

     La aparición gradual se controla
     desde estilos.css.
     ====================================== */

  const detalle = document.getElementById(
    'detalle'
  );

  detalle.classList.remove(
    'detalle-entrando'
  );

  /* REINICIAR ANIMACIÓN DE APARICIÓN */
  void detalle.offsetWidth;

  detalle.classList.add(
    'detalle-entrando'
  );

  mostrar('detalle');


  /* ======================================
     FINALIZACIÓN AUTOMÁTICA

     JavaScript espera a que termine
     la animación CSS de 2 segundos.
     ====================================== */

  hoja.addEventListener(
    'animationend',
    evento => {

      if (evento.animationName !== 'abrir-libro') {
        return;
      }

      /* RETIRAR HOJA TEMPORAL */
      escenaLibro.remove();

      /* MANTENER VISIBLE LA DIAPOSITIVA 3 */
      detalle.classList.remove(
        'detalle-entrando'
      );

      /* HABILITAR NUEVAS INTERACCIONES */
      transicionEnCurso = false;

    },
    { once: true }
  );

}


/* ==========================================
   14. CONFIGURACIÓN INICIAL
   ========================================== */

/* SELECCIONAR PRIMER ENCARGO */
seleccionar(0);

/* NO AMPLIAR HASTA INTERACTUAR */
sectores[0].classList.remove(
  'seleccionado'
);


/* ==========================================
   15. ACCESO DIRECTO A LAS DIAPOSITIVAS
   ========================================== */

const hash = location.hash.substring(1);

if (hash === 'imagen-escrita') {

  mostrar('imagen-escrita');

} else if (hash === 'detalle') {

  mostrar('imagen-escrita');

  abrirDetalle(0);

}
