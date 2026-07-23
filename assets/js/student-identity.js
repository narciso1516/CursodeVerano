(() => {
  "use strict";

  const NAME_KEY = "cursoVeranoStudentNameV1";
  const PROGRESS_KEY = "cursoVeranoProgressV1";
  const activity = document.title.replace(/\s*[|·].*$/, "").trim() || "Actividad";
  const pageKey = location.pathname.replace(/\/index\.html$/, "/");

  const styles = document.createElement("style");
  styles.textContent = `
    .student-name-modal{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:20px;background:#082a1fd9;backdrop-filter:blur(5px)}
    .student-name-card{width:min(100%,460px);padding:28px;border-radius:26px;background:#fff;color:#17324d;box-shadow:0 24px 70px #0005;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
    .student-name-card h2{margin:0 0 8px;font-size:clamp(26px,6vw,38px);line-height:1.1}
    .student-name-card p{margin:0 0 18px;line-height:1.5;color:#52616d}
    .student-name-card label{display:block;margin-bottom:7px;font-weight:850}
    .student-name-card input{width:100%;padding:14px 15px;border:2px solid #cbd7df;border-radius:14px;font:inherit;color:#17324d}
    .student-name-card input:focus{outline:3px solid #f4be2a66;border-color:#1d6f42}
    .student-name-card button{width:100%;margin-top:13px;padding:14px;border:0;border-radius:14px;background:#17643b;color:#fff;font:inherit;font-weight:900;cursor:pointer}
    .student-name-error{min-height:22px;margin-top:8px!important;color:#a52d20!important;font-weight:750}
    .student-identity-chip{position:fixed;right:12px;bottom:12px;z-index:9990;display:flex;align-items:center;gap:8px;max-width:calc(100vw - 24px);padding:9px 12px;border:1px solid #ffffff70;border-radius:999px;background:#17324dee;color:#fff;box-shadow:0 8px 24px #0003;font:700 14px system-ui,-apple-system,"Segoe UI",sans-serif}
    .student-identity-chip button{border:0;background:transparent;color:#ffe08a;text-decoration:underline;font:inherit;cursor:pointer}
    .student-result-name{margin:16px auto;padding:16px 18px;border:2px solid #d8b34a;border-radius:18px;background:#fff8d9;color:#17324d;text-align:left;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
    .student-result-name span{display:block;font-size:13px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#6f5a16}
    .student-result-name strong{display:block;margin-top:4px;font-size:clamp(22px,5vw,32px);overflow-wrap:anywhere}
    @media print{.student-name-modal,.student-identity-chip{display:none!important}.student-result-name{break-inside:avoid}}
  `;
  document.head.appendChild(styles);

  function cleanName(value) {
    return value.trim().replace(/\s+/g, " ").slice(0, 48);
  }

  function getName() {
    return cleanName(localStorage.getItem(NAME_KEY) || "");
  }

  function setName(value) {
    localStorage.setItem(NAME_KEY, cleanName(value));
  }

  function showNamePrompt() {
    document.querySelector(".student-name-modal")?.remove();
    const modal = document.createElement("div");
    modal.className = "student-name-modal";
    modal.innerHTML = `
      <form class="student-name-card">
        <h2>Antes de comenzar</h2>
        <p>Escribe tu nombre de pila o el código indicado por el docente. Aparecerá en tu informe final.</p>
        <label for="studentIdentityInput">Nombre o código</label>
        <input id="studentIdentityInput" maxlength="48" autocomplete="name" required placeholder="Ejemplo: Rosalía o R-024">
        <p class="student-name-error" role="alert"></p>
        <button type="submit">Guardar y continuar</button>
      </form>`;
    document.body.appendChild(modal);
    const input = modal.querySelector("input");
    input.value = getName();
    input.focus();
    modal.querySelector("form").addEventListener("submit", event => {
      event.preventDefault();
      const name = cleanName(input.value);
      if (name.length < 2) {
        modal.querySelector(".student-name-error").textContent = "Escribe al menos dos caracteres.";
        return;
      }
      setName(name);
      modal.remove();
      renderChip();
      attachNameToResult();
    });
  }

  function renderChip() {
    document.querySelector(".student-identity-chip")?.remove();
    const chip = document.createElement("div");
    chip.className = "student-identity-chip";
    chip.innerHTML = `<span>Alumno: <strong></strong></span><button type="button">Cambiar</button>`;
    chip.querySelector("strong").textContent = getName();
    chip.querySelector("button").addEventListener("click", showNamePrompt);
    document.body.appendChild(chip);
  }

  function looksComplete(element) {
    const text = element.textContent.replace(/\s+/g, " ").trim();
    return /terminaste|resultado de la evaluaci[oó]n|actividad completada|misi[oó]n cumplida/i.test(text)
      && /\/(?:40|50)\b|correctas|primer intento|precisi[oó]n|todos los retos/i.test(text);
  }

  function saveCompletion() {
    const name = getName();
    if (!name) return;
    let records = [];
    try { records = JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []; } catch (_) {}
    const record = {
      page: pageKey,
      activity,
      student: name,
      completedAt: new Date().toISOString()
    };
    const existing = records.findIndex(item => item.page === pageKey && item.student === name);
    if (existing >= 0) records[existing] = record;
    else records.push(record);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(records.slice(-100)));
  }

  function attachNameToResult() {
    if (!getName()) return;
    const candidates = [...document.querySelectorAll("main,section,article,.card,.finish,#result,#actividad")];
    const result = candidates.find(looksComplete);
    if (!result || result.querySelector(".student-result-name")) return;
    const heading = [...result.querySelectorAll("h1,h2,h3")].find(node =>
      /terminaste|resultado|completada|misi[oó]n/i.test(node.textContent)
    );
    const box = document.createElement("div");
    box.className = "student-result-name";
    box.innerHTML = "<span>Informe de actividad</span><strong></strong>";
    box.querySelector("strong").textContent = getName();
    if (heading) heading.insertAdjacentElement("afterend", box);
    else result.prepend(box);
    saveCompletion();
  }

  function init() {
    if (!getName()) showNamePrompt();
    else renderChip();
    attachNameToResult();
    new MutationObserver(attachNameToResult).observe(document.body, {childList:true, subtree:true});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
