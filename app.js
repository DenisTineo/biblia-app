// Santa Biblia · lee pasajes desde data.json (dominio público, sin internet)

const versionSelect = document.getElementById("version");
const referenceSelect = document.getElementById("reference");
const searchBtn = document.getElementById("search");
const resultBox = document.getElementById("result");

let BIBLIA = null;

function setState(html) {
  resultBox.innerHTML = html;
}

// Carga el archivo local una sola vez
async function cargarDatos() {
  try {
    const res = await fetch("data.json");
    if (!res.ok) throw new Error("No se pudo abrir data.json");
    BIBLIA = await res.json();
    llenarSelectores();
    mostrarPasaje(Object.keys(BIBLIA.pasajes)[0]);
  } catch (err) {
    setState('<p class="error">No se pudo cargar el texto. Falta el archivo data.json.</p>');
  }
}

function llenarSelectores() {
  // Versiones
  versionSelect.innerHTML = "";
  for (const [clave, nombre] of Object.entries(BIBLIA.versiones)) {
    const opt = document.createElement("option");
    opt.value = clave;
    opt.textContent = nombre;
    versionSelect.appendChild(opt);
  }
  // Pasajes
  referenceSelect.innerHTML = "";
  for (const cita of Object.keys(BIBLIA.pasajes)) {
    const opt = document.createElement("option");
    opt.value = cita;
    opt.textContent = cita;
    referenceSelect.appendChild(opt);
  }
}

function mostrarPasaje(cita) {
  if (!BIBLIA) return;
  const version = versionSelect.value;
  const pasaje = BIBLIA.pasajes[cita];

  if (!pasaje || !pasaje[version]) {
    setState('<p class="error">Ese pasaje no está en esta versión.</p>');
    return;
  }

  const versiculos = pasaje[version]
    .map(v => `<p class="verse"><span class="num">${v.v}</span>${v.t}</p>`)
    .join("");

  setState(`<h2>${cita}</h2>${versiculos}`);
}

searchBtn.addEventListener("click", () => mostrarPasaje(referenceSelect.value));
referenceSelect.addEventListener("change", () => mostrarPasaje(referenceSelect.value));
versionSelect.addEventListener("change", () => mostrarPasaje(referenceSelect.value));

cargarDatos();
