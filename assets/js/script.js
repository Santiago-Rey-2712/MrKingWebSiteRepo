/* =====================================================
   MR. KING — PORTFOLIO
   Todo lo editable vive en localStorage bajo "mrking_site_data".
   Esto significa que tus cambios se guardan en ESTE navegador.
   Si publicas el sitio en un hosting, cada visitante ve la misma
   versión que tú guardaste la última vez que exportaste los archivos.
===================================================== */

const STORAGE_KEY = "mrking_site_data";

const defaultData = () => ({
  texts: {},          // { "hero-name": "texto..." }
  media: {},          // { "about-photo": { type: "image"|"video", src: "data:..." } }
  whatsapp: "",        // link completo de wa.me
  projects: [
    { id: "p1", tag: "Juego 2D", title: "Nombre del juego 2D", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Describe el juego, el motor usado y tu rol en el proyecto.", media: null },
    { id: "p2", tag: "Juego 3D", title: "Nombre del juego 3D", desc: "Lorem ipsum dolor sit amet. Cuenta la mecánica principal y qué hiciste en Unity para este proyecto.", media: null },
    { id: "p3", tag: "Sitio web", title: "Nombre del sitio web", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Explica el objetivo del sitio y las tecnologías usadas.", media: null },
    { id: "p4", tag: "Catálogo", title: "Nombre del catálogo", desc: "Lorem ipsum dolor sit amet. Describe el catálogo digital o impreso que diseñaste.", media: null },
    { id: "p5", tag: "Diseño de interiores", title: "Nombre del proyecto de interiores", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cuenta el concepto del espacio y las herramientas usadas.", media: null },
  ],
  gallery: [],
});

let data = loadData();
let editing = false;

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw);
    return { ...defaultData(), ...parsed };
  } catch (e) {
    console.warn("No se pudo leer los datos guardados, usando valores por defecto.", e);
    return defaultData();
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    flashSaved();
  } catch (e) {
    alert("No se pudo guardar: el almacenamiento del navegador está lleno. Prueba con imágenes/videos más livianos.");
  }
}

function flashSaved() {
  const flag = document.getElementById("savedFlag");
  flag.classList.add("show");
  clearTimeout(flashSaved._t);
  flashSaved._t = setTimeout(() => flag.classList.remove("show"), 1400);
}

/* =====================================================
   TEXTOS EDITABLES
===================================================== */
function applyTexts() {
  document.querySelectorAll("[data-editable]").forEach((el) => {
    const key = el.getAttribute("data-editable");
    if (data.texts[key] !== undefined) {
      el.innerText = data.texts[key];
    }
  });
}

function wireTextEditing() {
  document.querySelectorAll("[data-editable]").forEach((el) => {
    el.addEventListener("blur", () => {
      const key = el.getAttribute("data-editable");
      data.texts[key] = el.innerText;
      saveData();
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && el.tagName !== "P") {
        e.preventDefault();
        el.blur();
      }
    });
  });
}

/* =====================================================
   MODO EDICIÓN (toggle general)
===================================================== */
const editBar = document.getElementById("editBar");
const editToggle = document.getElementById("editToggle");
const editActions = document.getElementById("editActions");

function setEditing(on) {
  editing = on;
  document.body.classList.toggle("is-editing", on);
  editBar.classList.toggle("is-editing", on);
  editActions.hidden = !on;
  editToggle.innerHTML = on
    ? '<span class="edit-bar__dot"></span> Salir del modo edición'
    : '<span class="edit-bar__dot"></span> Activar modo edición';

  document.querySelectorAll("[data-editable]").forEach((el) => {
    el.setAttribute("contenteditable", on ? "true" : "false");
  });
  document.querySelectorAll("[data-upload-trigger]").forEach((btn) => (btn.hidden = !on));
  document.getElementById("addProjectBtn").hidden = !on;
  document.getElementById("addGalleryBtn").hidden = !on;
  document.getElementById("editWhatsapp").hidden = !on;
}

editToggle.addEventListener("click", () => setEditing(!editing));

document.getElementById("saveBtn").addEventListener("click", () => {
  saveData();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Esto borra todos tus textos, imágenes, videos y proyectos añadidos, y vuelve a los valores de ejemplo. ¿Continuar?")) {
    localStorage.removeItem(STORAGE_KEY);
    data = defaultData();
    location.reload();
  }
});

/* =====================================================
   MEDIA SLOTS genéricos (foto de "sobre mí", proyectos, galería)
   Cada slot con [data-media-id] guarda/lee su imagen o video
   directamente desde `data.media[id]`.
===================================================== */
function renderMediaSlot(slotEl, mediaObj) {
  const img = slotEl.querySelector("[data-media-img]");
  const video = slotEl.querySelector("[data-media-video]");
  const empty = slotEl.querySelector("[data-media-empty]");

  img.hidden = true;
  video.hidden = true;
  video.pause && video.pause();

  if (mediaObj && mediaObj.src) {
    if (mediaObj.type === "video") {
      video.src = mediaObj.src;
      video.hidden = false;
    } else {
      img.src = mediaObj.src;
      img.hidden = false;
    }
    empty.style.display = "none";
  } else {
    empty.style.display = "flex";
  }
}

function wireMediaSlot(slotEl, onChange) {
  const input = slotEl.querySelector("[data-upload-input]");
  const trigger = slotEl.querySelector("[data-upload-trigger]");
  trigger.addEventListener("click", () => input.click());
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const maxMB = isVideo ? 25 : 8;
    if (file.size > maxMB * 1024 * 1024) {
      alert(`Ese archivo pesa demasiado (máx. ${maxMB}MB en el navegador). Usa un archivo más liviano o comprímelo antes de subirlo.`);
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ type: isVideo ? "video" : "image", src: reader.result });
      input.value = "";
    };
    reader.readAsDataURL(file);
  });
}

/* --- Foto de "Sobre mí" --- */
const aboutSlot = document.querySelector('.media-slot[data-media-id="about-photo"]');
renderMediaSlot(aboutSlot, data.media["about-photo"]);
wireMediaSlot(aboutSlot, (media) => {
  data.media["about-photo"] = media;
  renderMediaSlot(aboutSlot, media);
  saveData();
});

/* =====================================================
   PROYECTOS
===================================================== */
const projectGrid = document.getElementById("projectGrid");

function projectCardTemplate(project) {
  return `
    <article class="project-card" data-project-id="${project.id}">
      <div class="media-slot" data-media-slot>
        <img data-media-img src="" alt="${escapeHtml(project.title)}" hidden>
        <video data-media-video src="" hidden controls playsinline></video>
        <div class="media-slot__empty" data-media-empty><span>Sube una imagen o video de este proyecto</span></div>
        <button type="button" class="media-slot__upload-btn" data-upload-trigger hidden>Subir imagen o video</button>
        <input type="file" accept="image/*,video/*" hidden data-upload-input>
      </div>
      <div class="project-card__body">
        <span class="project-card__tag" data-field="tag" contenteditable="false">${escapeHtml(project.tag)}</span>
        <h3 class="project-card__title" data-field="title" contenteditable="false">${escapeHtml(project.title)}</h3>
        <p class="project-card__desc" data-field="desc" contenteditable="false">${escapeHtml(project.desc)}</p>
        <button type="button" class="project-card__remove" data-remove-project>Eliminar proyecto</button>
      </div>
    </article>
  `;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.innerText = str || "";
  return div.innerHTML;
}

function renderProjects() {
  projectGrid.innerHTML = data.projects.map(projectCardTemplate).join("");

  projectGrid.querySelectorAll(".project-card").forEach((card) => {
    const id = card.getAttribute("data-project-id");
    const project = data.projects.find((p) => p.id === id);

    renderMediaSlot(card.querySelector("[data-media-slot]"), project.media);
    wireMediaSlot(card.querySelector("[data-media-slot]"), (media) => {
      project.media = media;
      renderMediaSlot(card.querySelector("[data-media-slot]"), media);
      saveData();
    });

    card.querySelectorAll("[data-field]").forEach((fieldEl) => {
      fieldEl.setAttribute("contenteditable", editing ? "true" : "false");
      fieldEl.addEventListener("blur", () => {
        project[fieldEl.getAttribute("data-field")] = fieldEl.innerText;
        saveData();
      });
    });

    card.querySelector("[data-upload-trigger]").hidden = !editing;

    card.querySelector("[data-remove-project]").addEventListener("click", () => {
      if (confirm("¿Eliminar este proyecto?")) {
        data.projects = data.projects.filter((p) => p.id !== id);
        saveData();
        renderProjects();
      }
    });
  });
}

document.getElementById("addProjectBtn").addEventListener("click", () => {
  const newProject = {
    id: "p" + Date.now(),
    tag: "Categoría",
    title: "Nuevo proyecto",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cuenta de qué trata este proyecto.",
    media: null,
  };
  data.projects.push(newProject);
  saveData();
  renderProjects();
});

/* =====================================================
   GALERÍA — espacio libre de imágenes y videos
===================================================== */
const galleryGrid = document.getElementById("galleryGrid");

function galleryItemTemplate(item) {
  return `
    <div class="media-slot gallery-item" data-gallery-id="${item.id}">
      <img data-media-img src="" alt="Elemento de galería" hidden>
      <video data-media-video src="" hidden controls playsinline></video>
      <div class="media-slot__empty" data-media-empty><span>Sube una imagen o video</span></div>
      <button type="button" class="media-slot__remove-btn" data-remove-gallery title="Eliminar">×</button>
      <button type="button" class="media-slot__upload-btn" data-upload-trigger hidden>Subir</button>
      <input type="file" accept="image/*,video/*" hidden data-upload-input>
    </div>
  `;
}

function renderGallery() {
  galleryGrid.innerHTML = data.gallery.map(galleryItemTemplate).join("");

  galleryGrid.querySelectorAll(".gallery-item").forEach((slot) => {
    const id = slot.getAttribute("data-gallery-id");
    const item = data.gallery.find((g) => g.id === id);

    renderMediaSlot(slot, item.media);
    wireMediaSlot(slot, (media) => {
      item.media = media;
      renderMediaSlot(slot, media);
      saveData();
    });

    slot.querySelector("[data-upload-trigger]").hidden = !editing;
    slot.querySelector("[data-remove-gallery]").addEventListener("click", () => {
      data.gallery = data.gallery.filter((g) => g.id !== id);
      saveData();
      renderGallery();
    });
  });
}

document.getElementById("addGalleryBtn").addEventListener("click", () => {
  data.gallery.push({ id: "g" + Date.now(), media: null });
  saveData();
  renderGallery();
});

/* =====================================================
   WHATSAPP
===================================================== */
const whatsappLink = document.getElementById("whatsappLink");

function renderWhatsapp() {
  if (data.whatsapp) {
    whatsappLink.href = data.whatsapp;
  } else {
    whatsappLink.removeAttribute("href");
  }
}

document.getElementById("editWhatsapp").addEventListener("click", () => {
  const current = data.whatsapp || "https://wa.me/00000000000";
  const value = prompt("Pega tu enlace de WhatsApp (ej: https://wa.me/573001234567):", current);
  if (value !== null) {
    data.whatsapp = value.trim();
    renderWhatsapp();
    saveData();
  }
});

/* =====================================================
   INIT
===================================================== */
applyTexts();
wireTextEditing();
renderProjects();
renderGallery();
renderWhatsapp();
setEditing(false);
document.getElementById("year").textContent = new Date().getFullYear();
