// Santa Biblia · consulta versículos desde bible-api.com (textos de dominio público)

const versionSelect = document.getElementById("version");
const referenceInput = document.getElementById("reference");
const searchBtn = document.getElementById("search");
const resultBox = document.getElementById("result");

// Nombres de libros en español -> inglés (la API usa nombres ingleses)
const BOOK_MAP = {
  "genesis": "Genesis", "génesis": "Genesis", "exodo": "Exodus", "éxodo": "Exodus",
  "levitico": "Leviticus", "levítico": "Leviticus", "numeros": "Numbers", "números": "Numbers",
  "deuteronomio": "Deuteronomy", "josue": "Joshua", "josué": "Joshua", "jueces": "Judges",
  "rut": "Ruth", "1 samuel": "1 Samuel", "2 samuel": "2 Samuel", "1 reyes": "1 Kings",
  "2 reyes": "2 Kings", "1 cronicas": "1 Chronicles", "1 crónicas": "1 Chronicles",
  "2 cronicas": "2 Chronicles", "2 crónicas": "2 Chronicles", "esdras": "Ezra",
  "nehemias": "Nehemiah", "nehemías": "Nehemiah", "ester": "Esther", "job": "Job",
  "salmos": "Psalms", "salmo": "Psalms", "proverbios": "Proverbs", "eclesiastes": "Ecclesiastes",
  "eclesiastés": "Ecclesiastes", "cantares": "Song of Solomon", "cantar de los cantares": "Song of Solomon",
  "isaias": "Isaiah", "isaías": "Isaiah", "jeremias": "Jeremiah", "jeremías": "Jeremiah",
  "lamentaciones": "Lamentations", "ezequiel": "Ezekiel", "daniel": "Daniel", "oseas": "Hosea",
  "joel": "Joel", "amos": "Amos", "amós": "Amos", "abdias": "Obadiah", "abdías": "Obadiah",
  "jonas": "Jonah", "jonás": "Jonah", "miqueas": "Micah", "nahum": "Nahum", "nahúm": "Nahum",
  "habacuc": "Habakkuk", "sofonias": "Zephaniah", "sofonías": "Zephaniah", "hageo": "Haggai",
  "zacarias": "Zechariah", "zacarías": "Zechariah", "malaquias": "Malachi", "malaquías": "Malachi",
  "mateo": "Matthew", "marcos": "Mark", "lucas": "Luke", "juan": "John",
  "hechos": "Acts", "romanos": "Romans", "1 corintios": "1 Corinthians", "2 corintios": "2 Corinthians",
  "galatas": "Galatians", "gálatas": "Galatians", "efesios": "Ephesians", "filipenses": "Philippians",
  "colosenses": "Colossians", "1 tesalonicenses": "1 Thessalonians", "2 tesalonicenses": "2 Thessalonians",
  "1 timoteo": "1 Timothy", "2 timoteo": "2 Timothy", "tito": "Titus", "filemon": "Philemon",
  "filemón": "Philemon", "hebreos": "Hebrews", "santiago": "James", "1 pedro": "1 Peter",
  "2 pedro": "2 Peter", "1 juan": "1 John", "2 juan": "2 John", "3 juan": "3 John",
  "judas": "Jude", "apocalipsis": "Revelation"
};

function translateReference(ref) {
  // Separa "Libro cap:ver" en libro y resto numérico
  const match = ref.trim().match(/^(.*?)(\d.*)$/);
  if (!match) return ref.trim();
  const bookPart = match[1].trim().toLowerCase();
  const numberPart = match[2].trim();
  const english = BOOK_MAP[bookPart];
  return english ? `${english} ${numberPart}` : ref.trim();
}

function setState(html) {
  resultBox.innerHTML = html;
}

async function fetchVerse() {
  const raw = referenceInput.value.trim();
  if (!raw) {
    setState('<p class="error">Escribe una cita, por ejemplo: Juan 3:16</p>');
    return;
  }

  const version = versionSelect.value;
  const translated = translateReference(raw);
  const url = `https://bible-api.com/${encodeURIComponent(translated)}?translation=${version}`;

  setState('<p class="loading">Buscando la Palabra…</p>');

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("No se encontró la cita.");
    const data = await res.json();

    if (!data.verses || data.verses.length === 0) {
      setState('<p class="error">No se encontró esa cita. Revisa el nombre del libro.</p>');
      return;
    }

    const title = data.reference || raw;
    const verses = data.verses
      .map(v => `<p class="verse"><span class="num">${v.verse}</span>${v.text.trim()}</p>`)
      .join("");

    setState(`<h2>${title}</h2>${verses}`);
  } catch (err) {
    setState('<p class="error">No se pudo cargar. Revisa la cita o tu conexión.</p>');
  }
}

searchBtn.addEventListener("click", fetchVerse);
referenceInput.addEventListener("keydown", e => {
  if (e.key === "Enter") fetchVerse();
});

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    referenceInput.value = chip.dataset.ref;
    fetchVerse();
  });
});
