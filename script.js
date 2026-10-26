
'use strict';

/* ==========================================
   PORTAFOLIO DIGITAL IE 2026
   JAVASCRIPT COMPLETO CON MÚSICA
   ========================================== */


/* ==========================================
   1. DATOS DE LOS ENCARGOS
   ========================================== */

function dato(template, selector, atributo) {
  if (!template) return '';

  const elemento = template.content.querySelector(selector);

  if (!elemento) return '';

  if (atributo) {
    return (
      elemento.getAttribute(atributo) || ''
    ).trim();
  }

  return elemento.textContent.trim();
}

const encargos = Array.from({ length: 6 }, (_, i) => {
  const plantilla = document.getElementById(
    `encargo-${i + 1}`
  );

  return {
    imagen: dato(plantilla, '.foto-encargo', 'src'),
    video: dato(plantilla, '.video-encargo', 'src'),
    p5: dato(plantilla, '.p5-encargo', 'src'),

    permisosP5:
      dato(plantilla, '.p5-encargo', 'allow') ||
      'camera; microphone; fullscreen',

    titulo: dato(plantilla, '.titulo-dato'),

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
});


/* ==========================================
   2. AJUSTAR ESCENARIO A LA VENTANA
   ========================================== */

const escenario = document.getElementById('escenario');

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

window.addEventListener('resize', adaptarPantalla);
adaptarPantalla();


/* ==========================================
   3. ESTADO GENERAL
   ========================================== */

let actual = 0;
let transicionEnCurso = false;
let arrastrandoPerilla = false;
let punteroActivo = null;

const panelMiniatura = document.getElementById(
  'imagen-grande'
);

const panelDetalle = document.getElementById(
  'imagen-detalle'
);


/* ==========================================
   4. CAMBIO SUAVE ENTRE PANTALLAS
   ========================================== */

function mostrar(id) {
  const destino = document.getElementById(id);
  const anterior = document.querySelector(
    '.diapositiva.activa'
  );

  if (!destino || destino === anterior) return;

  document.querySelectorAll('.diapositiva.saliendo')
    .forEach(pantalla => {
      pantalla.classList.remove('saliendo');
    });

  if (anterior) {
    anterior.classList.remove('activa');
    anterior.classList.add('saliendo');

    anterior.addEventListener(
      'transitionend',
      function limpiar(evento) {
        if (
          evento.target !== anterior ||
          evento.propertyName !== 'opacity'
        ) {
          return;
        }

        anterior.classList.remove('saliendo');

        anterior.removeEventListener(
          'transitionend',
          limpiar
        );
      }
    );
  }

  destino.classList.add('activa');
}


/* ==========================================
   5. CASETE IMAGEN ESCRITA
   ========================================== */

const botonTextoInicio = document.getElementById(
  'abrir-texto-inicio'
);

const estucheInicio = document.getElementById(
  'estuche-inicio'
);

botonTextoInicio.addEventListener('click', () => {
  const abierto = estucheInicio.classList.toggle(
    'abierto'
  );

  botonTextoInicio.classList.toggle(
    'abierto',
    abierto
  );

  botonTextoInicio.setAttribute(
    'aria-expanded',
    String(abierto)
  );

  estucheInicio.setAttribute(
    'aria-hidden',
    String(!abierto)
  );
});


/* ==========================================
   6. REPRODUCTOR DE MÚSICA

   EL ARCHIVO SE DEFINE EN INDEX.HTML.

   VOLUMEN INICIAL: 25 %
   ========================================== */

const musicaFondo = document.getElementById(
  'musica-fondo'
);

const volumenMusica = document.getElementById(
  'volumen-musica'
);

const botonSonido = document.getElementById(
  'boton-sonido'
);

const porcentajeVolumen = document.getElementById(
  'porcentaje-volumen'
);

let ultimoVolumen = 0.25;

/* VOLUMEN INICIAL */

musicaFondo.volume = 0.25;


/* ==========================================
   ACTUALIZAR EL CONTROL VISUAL
   ========================================== */

function actualizarBotonSonido() {
  const silenciado =
    musicaFondo.muted ||
    musicaFondo.volume === 0;

  botonSonido.textContent = silenciado
    ? '♪̸'
    : '♪';

  botonSonido.setAttribute(
    'aria-label',
    silenciado
      ? 'Activar sonido'
      : 'Silenciar música'
  );

  botonSonido.setAttribute(
    'aria-pressed',
    String(musicaFondo.muted)
  );

  porcentajeVolumen.textContent =
    silenciado
      ? '0%'
      : `${Math.round(musicaFondo.volume * 100)}%`;
}


/* ==========================================
   CAMBIAR VOLUMEN CON LA BARRA
   ========================================== */

volumenMusica.addEventListener('input', () => {
  const volumen = Math.max(
    0,
    Math.min(1, Number(volumenMusica.value) / 100)
  );

  musicaFondo.volume = volumen;
  musicaFondo.muted = false;

  if (volumen > 0) {
    ultimoVolumen = volumen;
  }

  actualizarBotonSonido();
});


/* ==========================================
   SILENCIAR Y VOLVER A ACTIVAR
   ========================================== */

botonSonido.addEventListener('click', () => {
  const silenciado =
    musicaFondo.muted ||
    musicaFondo.volume === 0;

  if (silenciado) {
    musicaFondo.muted = false;

    if (musicaFondo.volume === 0) {
      musicaFondo.volume = ultimoVolumen;

      volumenMusica.value = String(
        Math.round(ultimoVolumen * 100)
      );
    }

  } else {
    musicaFondo.muted = true;
  }

  actualizarBotonSonido();
});


/* ESTADO INICIAL DEL CONTROL */

actualizarBotonSonido();


/* ==========================================
   7. CASETE ENCARGOS

   ABRE LA RUEDA Y COMIENZA LA MÚSICA
   ========================================== */

document.getElementById('abrir-imagen')
  .addEventListener('click', evento => {
    evento.preventDefault();

    if (transicionEnCurso) return;

    /*
      La reproducción se solicita dentro
      del clic del usuario para cumplir
      las restricciones del navegador.
    */

    if (musicaFondo.paused) {
      musicaFondo.play().catch(error => {
        console.warn(
          'No se pudo reproducir la música:',
          error
        );
      });
    }

    mostrar('imagen-escrita');
  });


/* ==========================================
   8. DETENER P5.JS Y VIDEOS DEL DETALLE

   NO DETIENE LA MÚSICA DE FONDO.
   ========================================== */

function detenerContenido() {
  panelDetalle.querySelectorAll('video')
    .forEach(video => video.pause());

  panelDetalle.replaceChildren();
}


/* ==========================================
   9. FLECHAS DE NAVEGACIÓN
   ========================================== */

document.getElementById('volver-inicio')
  .addEventListener('click', () => {
    if (transicionEnCurso) return;

    detenerContenido();
    mostrar('inicio');
  });

document.getElementById('volver-rueda')
  .addEventListener('click', () => {
    if (transicionEnCurso) return;

    detenerContenido();
    mostrar('imagen-escrita');
  });


/* ==========================================
   10. DISCO LATERAL GIRATORIO
   ========================================== */

const pantallaRueda = document.getElementById(
  'imagen-escrita'
);

const discoLateral = document.createElement('div');
discoLateral.className = 'disco-lateral';
discoLateral.setAttribute('aria-hidden', 'true');

const discoLateralGiro = document.createElement('div');
discoLateralGiro.className = 'disco-lateral-giro';

const discoLateralImagen = document.createElement('img');
discoLateralImagen.className = 'disco-lateral-imagen';
discoLateralImagen.alt = '';
discoLateralImagen.draggable = false;

discoLateralGiro.appendChild(discoLateralImagen);
discoLateral.appendChild(discoLateralGiro);
pantallaRueda.appendChild(discoLateral);

function actualizarDiscoLateral(i) {
  const imagen = encargos[i].imagen;

  if (imagen) {
    discoLateralImagen.src = imagen;
    discoLateral.style.visibility = 'visible';
  } else {
    discoLateralImagen.removeAttribute('src');
    discoLateral.style.visibility = 'hidden';
  }
}


/* ==========================================
   11. ELEMENTOS SVG DE LA RUEDA
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
  return document.createElementNS(NS, tag);
}

function polar(radio, grados) {
  const angulo = grados * Math.PI / 180;

  return [
    260 + radio * Math.cos(angulo),
    260 + radio * Math.sin(angulo)
  ];
}


/* ==========================================
   12. MOSTRAR MINIATURA
   ========================================== */

function mostrarFoto(panel, src) {
  panel.replaceChildren();

  if (!src) return;

  const img = document.createElement('img');

  img.src = src;
  img.alt = 'Miniatura del encargo';
  img.draggable = false;

  panel.appendChild(img);
}


/* ==========================================
   13. SELECCIONAR ENCARGO

   CAMBIA CARÁTULA, RUEDA Y CD LATERAL.
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
    .style.transform = `rotate(${30 + i * 60}deg)`;

  mostrarFoto(
    panelMiniatura,
    encargos[i].imagen
  );

  actualizarDiscoLateral(i);
}


/* ==========================================
   14. GENERAR LOS SEIS SECTORES
   ========================================== */

for (let i = 0; i < 6; i++) {
  const a = polar(250, -90 + i * 60);
  const b = polar(250, -30 + i * 60);

  const forma = `
    M260 260
    L${a[0]} ${a[1]}
    A250 250 0 0 1 ${b[0]} ${b[1]}
    Z
  `;

  const g = svg('g');

  g.classList.add('sector');
  g.setAttribute('tabindex', '0');
  g.setAttribute('role', 'button');

  g.setAttribute(
    'aria-label',
    `Abrir Encargo ${i + 1}`
  );

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

  const img = svg('image');

  img.setAttribute('href', encargos[i].imagen);
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

  const path = svg('path');

  path.classList.add('contorno-sector');
  path.setAttribute('d', forma);

  path.setAttribute(
    'fill',
    `url(#patron-encargo-${i})`
  );

  g.appendChild(path);


  /* SELECCIONAR AL PASAR EL MOUSE */

  g.addEventListener('mouseenter', () => {
    if (
      !transicionEnCurso &&
      !arrastrandoPerilla
    ) {
      seleccionar(i);
    }
  });


  /* SELECCIONAR CON TECLADO */

  g.addEventListener('focus', () => {
    if (!transicionEnCurso) {
      seleccionar(i);
    }
  });


  /* ABRIR ENCARGO CON CLIC */

  g.addEventListener('click', () => {
    abrirDetalle(i);
  });

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
   15. PERILLA ORIGINAL

   PUEDE GIRAR EN AMBOS SENTIDOS.
   ========================================== */

const perilla = document.getElementById('perilla');

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

  const indice = Math.floor(angulo / 60) % 6;

  seleccionar(indice);
}

perilla.addEventListener('pointerdown', evento => {
  if (transicionEnCurso) return;

  if (
    evento.pointerType === 'mouse' &&
    evento.button !== 0
  ) {
    return;
  }

  if (arrastrandoPerilla) return;

  arrastrandoPerilla = true;
  punteroActivo = evento.pointerId;

  perilla.setPointerCapture(evento.pointerId);
  elegirSegunPuntero(evento);

  evento.preventDefault();
});

perilla.addEventListener('pointermove', evento => {
  if (!arrastrandoPerilla) return;

  if (evento.pointerId !== punteroActivo) {
    return;
  }

  elegirSegunPuntero(evento);
});

function terminarArrastre(evento) {
  if (
    punteroActivo !== null &&
    evento.pointerId !== punteroActivo
  ) {
    return;
  }

  arrastrandoPerilla = false;
  punteroActivo = null;
}

for (const tipo of [
  'pointerup',
  'pointercancel',
  'lostpointercapture'
]) {
  perilla.addEventListener(tipo, terminarArrastre);
}


/* ==========================================
   16. TEXTOS CON FORMA CIRCULAR
   ========================================== */

function mostrarTextoConForma(id, texto) {
  const contenedor = document.getElementById(id);

  contenedor.replaceChildren();

  for (const nombre of [
    'forma-exterior',
    'forma-interior'
  ]) {
    const span = document.createElement('span');

    span.className = nombre;
    span.setAttribute('aria-hidden', 'true');

    contenedor.appendChild(span);
  }

  const contenido = document.createElement('span');

  contenido.className = 'texto-contenido';
  contenido.textContent = texto;

  contenedor.appendChild(contenido);
  contenedor.scrollTop = 0;
}


/* ==========================================
   17. ENLACES P5JS Y WIKI
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
   18. CARGAR P5.JS, VIDEO O FOTO
   ========================================== */

function cargarProyecto(item) {
  panelDetalle.replaceChildren();

  if (item.p5) {
    const iframe = document.createElement('iframe');

    iframe.title = `Proyecto p5.js: ${item.titulo}`;
    iframe.allow = item.permisosP5;
    iframe.setAttribute('allowfullscreen', '');

    iframe.referrerPolicy =
      'strict-origin-when-cross-origin';

    iframe.src = item.p5;

    panelDetalle.appendChild(iframe);

  } else if (item.video) {
    const video = document.createElement('video');

    video.src = item.video;
    video.controls = true;
    video.playsInline = true;

    panelDetalle.appendChild(video);

  } else {
    mostrarFoto(panelDetalle, item.imagen);
  }
}


/* ==========================================
   19. ABRIR DETALLE DEL ENCARGO

   LA TAPA COMIENZA CON TAMAÑO FINAL.
   DURACIÓN: 2 SEGUNDOS.
   ========================================== */

function abrirDetalle(i) {
  if (transicionEnCurso) return;

  seleccionar(i);

  const item = encargos[i];

  document.getElementById('titulo-encargo')
    .textContent = item.titulo;

  mostrarTextoConForma(
    'texto-izquierda',
    item.textoIzquierdo
  );

  mostrarTextoConForma(
    'texto-derecha',
    item.textoDerecho
  );

  asignarEnlace('link-jp5', item.linkJP5);
  asignarEnlace('link-wiki', item.linkWiki);

  mostrarFoto(panelDetalle, item.imagen);

  transicionEnCurso = true;


  /* ESCENA DEL LIBRO A TAMAÑO FINAL */

  const escena = document.createElement('div');
  escena.className = 'libro-escena';

  const hoja = document.createElement('div');
  hoja.className = 'libro-hoja';


  /* CARA DELANTERA */

  const frente = document.querySelector(
    '.marco-derecho'
  ).cloneNode(true);

  frente.classList.add('libro-cara');

  frente.querySelectorAll('[id]')
    .forEach(elemento => {
      elemento.removeAttribute('id');
    });

  Object.assign(frente.style, {
    position: 'absolute',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    margin: '0',
    transform: 'none'
  });


  /* CARA TRASERA */

  const detras = frente.cloneNode(true);
  detras.classList.add('libro-cara-trasera');

  hoja.appendChild(frente);
  hoja.appendChild(detras);

  escena.appendChild(hoja);
  escenario.appendChild(escena);


  /* MOSTRAR TERCERA PANTALLA */

  const detalle = document.getElementById('detalle');

  detalle.classList.remove('detalle-entrando');
  void detalle.offsetWidth;
  detalle.classList.add('detalle-entrando');

  mostrar('detalle');


  /* TERMINAR ANIMACIÓN */

  hoja.addEventListener(
    'animationend',
    evento => {
      if (
        evento.target !== hoja ||
        evento.animationName !== 'abrir-libro'
      ) {
        return;
      }

      escena.remove();
      detalle.classList.remove('detalle-entrando');

      cargarProyecto(item);
      transicionEnCurso = false;

    },
    { once: true }
  );
}


/* ==========================================
   20. ESTADO INICIAL
   ========================================== */

seleccionar(0);

sectores[0].classList.remove('seleccionado');


/* ==========================================
   21. WIKI PRINCIPAL
   ========================================== */

const botonWiki = document.getElementById(
  'abrir-wiki'
);

if (botonWiki) {
  botonWiki.target = '_blank';
  botonWiki.rel = 'noopener noreferrer';
}
