document.querySelectorAll(".experiment-home-fab, .sidebar-home, #homeButton").forEach(el =&gt; el.remove());

const catalog = [
  {
    id:"kinematics",
    title:"Кинематика",
    icon:"↗",
    experiments:[
      { id:"ballistics", title:"Баллистика", subtitle:"Движение тела под углом" }
    ]
  },
  { id:"dynamics", title:"Динамика", icon:"→", experiments:[] },
  { id:"statics", title:"Статика", icon:"⌁", experiments:[] },
  { id:"conservation", title:"Законы сохранения", icon:"Σ", experiments:[] },
  { id:"molecular", title:"Молекулярная физика", icon:"◌", experiments:[] },
  { id:"thermodynamics", title:"Термодинамика", icon:"△", experiments:[] },
  { id:"electrostatics", title:"Электростатика", icon:"±", experiments:[] },
  { id:"electrodynamics", title:"Электродинамика", icon:"ϟ", experiments:[] },
  {
    id:"magnetism",
    title:"Магнетизм",
    icon:"⊙",
    experiments:[
      {
        id:"charged-particle-3d",
        title:"Заряженная частица в электрическом и магнитном полях",
        subtitle:"Сила Лоренца"
      }
    ]
  },
  { id:"oscillations", title:"Колебания и волны", icon:"∿", experiments:[] },
  { id:"optics", title:"Оптика", icon:"◇", experiments:[] },
  { id:"quantum", title:"Квантовая физика", icon:"h", experiments:[] }
];

const appShell = document.getElementById("appShell");
const nav = document.getElementById("experimentNav");
const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("sidebarBackdrop");
const menuButton = document.getElementById("menuButton");
const sidebarBrandHome = document.getElementById("sidebarBrandHome");
const sidebarClose = document.getElementById("sidebarClose");
const floatingBurger = document.getElementById("floatingBurger");
const brandHome = document.getElementById("brandHome");
const welcome = document.getElementById("welcomeScreen");
const stage = document.getElementById("experimentStage");
const mount = document.getElementById("experimentMount");

let currentExperimentId = null;
let currentSectionId = null;

function findExperiment(id){
  for(const section of catalog){
    const exp = section.experiments.find(e =&gt; e.id === id);
    if(exp) return { section, exp };
  }
  return null;
}

function buildNavigation(){
  nav.innerHTML = "";

  for(const section of catalog){
    const wrap = document.createElement("section");
    wrap.className = "nav-section";
    wrap.dataset.sectionId = section.id;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "nav-section-button";
    button.innerHTML = `
      &lt;span class="nav-section-left"&gt;
        &lt;span class="nav-section-icon"&gt;${section.icon}&lt;/span&gt;
        &lt;span&gt;${section.title}&lt;/span&gt;
      &lt;/span&gt;
      &lt;span class="nav-chevron"&gt;›&lt;/span&gt;
    `;

    const expWrap = document.createElement("div");
    expWrap.className = "nav-experiments";

    const inner = document.createElement("div");
    inner.className = "nav-experiments-inner";

    if(section.experiments.length){
      for(const exp of section.experiments){
        const expButton = document.createElement("button");
        expButton.type = "button";
        expButton.className = "nav-experiment";
        expButton.dataset.experimentId = exp.id;
        expButton.innerHTML = `
          &lt;span class="nav-experiment-title"&gt;${exp.title}&lt;/span&gt;
          &lt;span class="nav-experiment-subtitle"&gt;${exp.subtitle || ""}&lt;/span&gt;
        `;
        expButton.addEventListener("click", () =&gt; openExperiment(exp.id));
        inner.appendChild(expButton);
      }
    } else {
      const empty = document.createElement("div");
      empty.className = "nav-empty";
      empty.textContent = "Эксперименты добавим позже";
      inner.appendChild(empty);
    }

    button.addEventListener("click", () =&gt; {
      const willOpen = !wrap.classList.contains("open");

      document.querySelectorAll(".nav-section").forEach(sectionEl =&gt; {
        if(sectionEl !== wrap &amp;&amp; !sectionEl.classList.contains("active-section")){
          sectionEl.classList.remove("open");
        }
      });

      wrap.classList.toggle("open", willOpen);
    });

    expWrap.appendChild(inner);
    wrap.append(button, expWrap);
    nav.appendChild(wrap);
  }
}

function syncActiveNavigation(){
  document.querySelectorAll(".nav-section").forEach(sectionEl =&gt; {
    const isActiveSection = sectionEl.dataset.sectionId === currentSectionId;
    sectionEl.classList.toggle("active-section", isActiveSection);

    if(isActiveSection){
      sectionEl.classList.add("open");
    }
  });

  document.querySelectorAll(".nav-experiment").forEach(button =&gt; {
    button.classList.toggle("active", button.dataset.experimentId === currentExperimentId);
  });
}

function showSidebar(){
  document.body.classList.add("sidebar-visible");

  if(window.innerWidth &gt;= 1050){
    appShell.classList.remove("menu-collapsed");
    syncActiveNavigation();
  }else{
    sidebar.classList.add("open");
    backdrop.classList.add("open");
    menuButton?.setAttribute("aria-expanded", "true");
    syncActiveNavigation();
  }
}

function hideSidebar(){
  document.body.classList.remove("sidebar-visible");

  if(window.innerWidth &gt;= 1050){
    appShell.classList.add("menu-collapsed");
  }else{
    sidebar.classList.remove("open");
    backdrop.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
}

function openHome(){
  currentExperimentId = null;
  currentSectionId = null;

  welcome.hidden = false;
  welcome.style.display = "";
  stage.hidden = true;
  stage.style.display = "none";
  mount.innerHTML = "";

  appShell.classList.remove("experiment-mode");
  appShell.classList.add("menu-collapsed");

  document.body.classList.remove("sidebar-visible");
  sidebar.classList.remove("open");
  backdrop.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");

  document.querySelectorAll(".nav-experiment").forEach(el =&gt; el.classList.remove("active"));
  document.querySelectorAll(".nav-section").forEach(el =&gt; {
    el.classList.remove("active-section", "open");
  });

  if(location.hash){
    history.replaceState(null, "", location.pathname + location.search);
  }

  syncActiveNavigation();
}

async function openExperiment(id){
  const found = findExperiment(id);
  if(!found) return;

  currentExperimentId = id;
  currentSectionId = found.section.id;
  syncActiveNavigation();

  welcome.hidden = true;
  welcome.style.display = "none";
  stage.hidden = false;
  stage.style.display = "";
  appShell.classList.add("experiment-mode");
  mount.innerHTML = "";

  const moduleMap = {
    "ballistics": "./experiments/mechanics/ballistics.js",
    "charged-particle-3d": "./experiments/magnetism/charged-particle-3d.js"
  };

  try{
    const modulePath = moduleMap[id];
    if(!modulePath) throw new Error("Module path not found");
    const mod = await import(modulePath);

    if(typeof mod.mountExperiment !== "function"){
      throw new Error("mountExperiment() not found");
    }

    await mod.mountExperiment(mount, {
      experiment: found.exp,
      section: found.section
    });
  }catch(error){
    console.error(error);
    mount.innerHTML = `
      &lt;div class="placeholder"&gt;
        &lt;div class="placeholder-label"&gt;${found.section.title}&lt;/div&gt;
        &lt;h1&gt;${found.exp.title}&lt;/h1&gt;
        &lt;p&gt;Эксперимент пока не подключён или файл не найден.&lt;/p&gt;
      &lt;/div&gt;
    `;
  }

  hideSidebar();
  history.replaceState(null, "", `#${id}`);
}

menuButton?.addEventListener("click", showSidebar);
floatingBurger.addEventListener("click", showSidebar);
sidebarClose?.addEventListener("click", hideSidebar);
backdrop.addEventListener("click", hideSidebar);
brandHome?.addEventListener("click", openHome);



buildNavigation();

function openInitialMenu(){
  if(window.innerWidth &lt; 1050 &amp;&amp; !location.hash){
    sidebar.classList.add("open");
    backdrop.classList.add("open");
    menuButton?.setAttribute("aria-expanded", "true");
  }
}

openInitialMenu();

const initialId = location.hash.replace("#", "");
if(initialId &amp;&amp; findExperiment(initialId)){
  openExperiment(initialId);
}





sidebarBrandHome?.addEventListener("click", openHome);
