

/* =========================================
   FOTOGRAFÍAS Y TEXTOS EDITABLES

   Cambia las rutas de las imágenes
   y los textos de cada encargo.

   Ejemplo de fotografía:
   imagen: 'imagenes/foto1.jpg'

   Si imagen está vacía (''),
   el rectángulo permanece verde.
   ========================================= */

const encargos = [

  // ===== SECTOR 1 =====
  {
    imagen: '',
    titulo: 'Encargo 1',

    textoIzquierdo:
      'El ejercicio debia contener un\n' +
      'sistema de particulas, ....',

    textoDerecho:
      'El ejercicio debia contener un\n' +
      'sistema de particulas, ....',

    linkJP5: '',
    linkWiki: ''
  },

  // ===== SECTOR 2 =====
  {
    imagen: '',
    titulo: 'Encargo 2',

    textoIzquierdo:
      'El ejercicio debia contener un\n' +
      'sistema de particulas, ....',

    textoDerecho:
      'El ejercicio debia contener un\n' +
      'sistema de particulas, ....',

    linkJP5: '',
    linkWiki: ''
  },

  // ===== SECTOR 3 =====
  {
    imagen: '',
    titulo: 'Encargo 3',

    textoIzquierdo:
      'El ejercicio debia contener un\n' +
      'sistema de particulas, ....',

    textoDerecho:
      'El ejercicio debia contener un\n' +
      'sistema de particulas, ....',

    linkJP5: '',
    linkWiki: ''
  },

  // ===== SECTOR 4 =====
  {
    imagen: '',
    titulo: 'Encargo 4',

    textoIzquierdo:
      'El ejercicio debia contener un\n' +
      'sistema de particulas, ....',

    textoDerecho:
      'El ejercicio debia contener un\n' +
      'sistema de particulas, ....',

    linkJP5: '',
    linkWiki: ''
  },

  // ===== SECTOR 5 =====
  {
    imagen: '',
    titulo: 'Encargo 5',

    textoIzquierdo:
      'El ejercicio debia contener un\n' +
      'sistema de particulas, ....',

    textoDerecho:
      'El ejercicio debia contener un\n' +
      'sistema de particulas, ....',

    linkJP5: '',
    linkWiki: ''
  },

  // ===== SECTOR 6 =====
  {
    imagen: '',
    titulo: 'Encargo 6',

    textoIzquierdo:
      'El ejercicio debia contener un\n' +
      'sistema de particulas, ....',

    textoDerecho:
      'El ejercicio debia contener un\n' +
      'sistema de particulas, ....',

    linkJP5: '',
    linkWiki: ''
  }

];


/* =========================================
   ADAPTACIÓN DE PANTALLA
   ========================================= */

function adaptarPantalla() {

  const escala = Math.min(
    window.innerWidth / 1366,
    window.innerHeight / 768
  );

  const escenario =
    document.getElementById('escenario');

  escenario.style.transform =
    `scale(${escala})`;

  escenario.style.left =
    `${(window.innerWidth - 1366 * escala) / 2}px`;

  escenario.style.top =
    `${(window.innerHeight - 768 * escala) / 2}px`;
}

window.addEventListener('resize', adaptarPantalla);

adaptarPantalla();


/* =========================================
   CAMBIO DE DIAPOSITIVAS
   ========================================= */

function mostrar(id) {

  document.querySelectorAll('.diapositiva')
    .forEach(diapositiva => {

      diapositiva.classList.toggle(
        'activa',
        diapositiva.id === id
      );

    });
}


/* =========================================
   BOTÓN IMAGEN ESCRITA
   ========================================= */

document.getElementById('abrir-imagen')
  .addEventListener('click', evento => {

    evento.preventDefault();

    mostrar('imagen-escrita');

  });


/* =========================================
   FLECHAS DE REGRESO
   ========================================= */

document.querySelectorAll('.volver')
  .forEach(boton => {

    boton.addEventListener('click', () => {

      if (transicionEnCurso) return;

      mostrar('inicio');

    });

  });


/* =========================================
   CONFIGURACIÓN DE RUEDA
   ========================================= */

const NS = 'http://www.w3.org/2000/svg';

const grupo =
  document.getElementById('sectores-rueda');

const clips =
  document.getElementById('clips-rueda');

const sectores = [];

let actual = 0;

let transicionEnCurso = false;


/* =========================================
   COORDENADAS CIRCULARES
   ========================================= */

function coordenada(radio, grados) {

  const angulo = grados * Math.PI / 180;

  return [
    260 + radio * Math.cos(angulo),
    260 + radio * Math.sin(angulo)
  ];
}


/* =========================================
   CREAR SEIS SECTORES INTERACTIVOS
   ========================================= */

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

  const sector =
    document.createElementNS(NS, 'g');

  sector.setAttribute('class', 'sector');

  sector.setAttribute('role', 'button');

  sector.setAttribute('tabindex', '0');

  sector.setAttribute(
    'aria-label',
    `Abrir Encargo ${i + 1}`
  );


  /* CREAR FORMA DEL SECTOR */

  const contorno =
    document.createElementNS(NS, 'path');

  contorno.setAttribute('d', forma);

  contorno.setAttribute('fill', '#7a1111');

  sector.appendChild(contorno);


  /* CREAR RECORTE PARA FOTOGRAFÍA */

  const clip =
    document.createElementNS(NS, 'clipPath');

  clip.setAttribute('id', `recorte-${i}`);

  const cp =
    document.createElementNS(NS, 'path');

  cp.setAttribute('d', forma);

  clip.appendChild(cp);

  clips.appendChild(clip);


  /* INSERTAR FOTOGRAFÍA */

  if (encargos[i].imagen) {

    const foto =
      document.createElementNS(NS, 'image');

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


  /* EVENTOS DE INTERACCIÓN */

  sector.addEventListener(
    'mouseenter',
    () => seleccionar(i)
  );

  sector.addEventListener(
    'focus',
    () => seleccionar(i)
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


/* =========================================
   MOSTRAR FOTOGRAFÍA
   ========================================= */

function aplicarFoto(elemento, ruta) {

  elemento.style.backgroundImage = ruta
    ? `url("${ruta.replace(/"/g, '%22')}")`
    : 'none';
}


/* =========================================
   SELECCIONAR SECTOR DE RUEDA
   ========================================= */

function seleccionar(indice) {

  actual = indice;

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

  /* CAMBIAR FOTOGRAFÍA DERECHA */

  aplicarFoto(
    document.getElementById('imagen-grande'),
    encargos[indice].imagen
  );
}


/* =========================================
   ACTUALIZAR ENLACES
   ========================================= */

function asignarEnlace(id, url) {

  const enlace =
    document.getElementById(id);

  enlace.href = url || '#';

  enlace.onclick = url
    ? null
    : evento => evento.preventDefault();
}


/* =========================================
   TRANSICIÓN DE APERTURA DE LIBRO

   DURACIÓN: 5 SEGUNDOS

   MODIFICACIONES:

   1. Apertura más lenta.
   2. Movimiento suave.
   3. Fotografía y marco giran juntos.
   4. Aparece suavemente la diapositiva 3.
   5. No permite animaciones superpuestas.
   ========================================= */

function abrirDetalle(indice) {

  if (transicionEnCurso) return;

  seleccionar(indice);

  const item = encargos[indice];


  /* ACTUALIZAR FOTOGRAFÍA DE DIAPOSITIVA 3 */

  aplicarFoto(
    document.getElementById('imagen-detalle'),
    item.imagen
  );


  /* ACTUALIZAR TÍTULO */

  document.getElementById('titulo-encargo')
    .textContent = item.titulo;


  /* ACTUALIZAR TEXTOS */

  document.getElementById('texto-izquierda')
    .textContent = item.textoIzquierdo;

  document.getElementById('texto-derecha')
    .textContent = item.textoDerecho;


  /* ACTUALIZAR ENLACES */

  asignarEnlace('link-jp5', item.linkJP5);

  asignarEnlace('link-wiki', item.linkWiki);


  /* ACTIVAR BLOQUEO DE TRANSICIÓN */

  transicionEnCurso = true;


  /* OBTENER ESCENARIO PRINCIPAL */

  const escenario =
    document.getElementById('escenario');


  /* CREAR CONTENEDOR 3D DEL LIBRO */

  const escenaLibro =
    document.createElement('div');

  escenaLibro.className = 'libro-escena';


  /* CREAR LA HOJA GIRATORIA */

  const hoja =
    document.createElement('div');

  hoja.className = 'libro-hoja';


  /* =====================================
     CARA FRONTAL

     Copia marco negro, panel verde
     y fotografía como una sola pieza.
     ===================================== */

  const frontal = document.querySelector(
    '#imagen-escrita .marco-derecho'
  ).cloneNode(true);

  frontal.classList.add('libro-cara');

  frontal.removeAttribute('id');

  frontal.querySelectorAll('[id]')
    .forEach(elemento => {
      elemento.removeAttribute('id');
    });

  frontal.style.left = '0';
  frontal.style.top = '0';

  frontal.style.width = '100%';
  frontal.style.height = '100%';


  /* =====================================
     CARA TRASERA

     Utiliza exactamente la misma fotografía
     y el mismo marco negro.
     ===================================== */

  const trasera = frontal.cloneNode(true);

  trasera.classList.add('libro-cara-trasera');


  /* UNIR LAS DOS CARAS */

  hoja.appendChild(frontal);

  hoja.appendChild(trasera);


  /* INCORPORAR AL ESCENARIO */

  escenaLibro.appendChild(hoja);

  escenario.appendChild(escenaLibro);


  /* =====================================
     MOSTRAR DIAPOSITIVA 3 DEBAJO

     Se agrega la clase detalle-entrando,
     que controla su aparición suave.
     ===================================== */

  const detalle =
    document.getElementById('detalle');

  detalle.classList.remove('detalle-entrando');

  // Reinicia la animación de aparición
  void detalle.offsetWidth;

  detalle.classList.add('detalle-entrando');

  mostrar('detalle');


  /* =====================================
     FINALIZAR AL TERMINAR LA ANIMACIÓN

     Ocurre tras los 5 segundos definidos
     en el CSS.

     Eliminar el libro temporal permite
     ver por completo la diapositiva 3.
     ===================================== */

  hoja.addEventListener(
    'animationend',
    evento => {

      if (evento.animationName !== 'abrir-libro') {
        return;
      }

      /* ELIMINAR HOJA TEMPORAL */
      escenaLibro.remove();

      /* DEJAR EL DETALLE VISIBLE */
      detalle.classList.remove(
        'detalle-entrando'
      );

      /* PERMITIR NUEVAS INTERACCIONES */
      transicionEnCurso = false;

    },
    { once: true }
  );
}


/* =========================================
   ESTADO INICIAL
   ========================================= */

seleccionar(0);

sectores[0].classList.remove('seleccionado');


/* =========================================
   ACCESO MEDIANTE ENLACES INTERNOS
   ========================================= */

const hash = location.hash.substring(1);

if (hash === 'imagen-escrita') {

  mostrar('imagen-escrita');

} else if (hash === 'detalle') {

  mostrar('imagen-escrita');

  abrirDetalle(0);
}
