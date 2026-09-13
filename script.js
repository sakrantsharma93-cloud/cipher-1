const nav = document.getElementById("nav");

const menuBtn = document.querySelector(".menu-btn");

const navLinks = document.querySelector(".nav-links");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 20);
});

menuBtn?.addEventListener("click", () => {
  const open = menuBtn.getAttribute("aria-expanded") === "true";

  menuBtn.setAttribute(
    "aria-expanded",
    String(!open)
  );

  navLinks?.classList.toggle(
    "mobile-open",
    !open
  );
});

navLinks?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("mobile-open");

    menuBtn?.setAttribute(
      "aria-expanded",
      "false"
    );
  });
});


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const observer = new IntersectionObserver(
  (entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("visible");

        observer.unobserve(entry.target);

      }

    });

  },
  {
    threshold: 0.12
  }
);

document
  .querySelectorAll(".reveal")
  .forEach(el => observer.observe(el));


/* =========================================================
   HERO / NETWORK DECORATIVE NODES
   ========================================================= */

function drawNodes(containerId, count = 12) {

  const el = document.getElementById(containerId);

  if (!el) return;

  for (let i = 0; i < count; i++) {

    const node = document.createElement("span");

    node.style.position = "absolute";

    node.style.width =
      (i % 5 === 0 ? 10 : 6) + "px";

    node.style.height =
      node.style.width;

    node.style.borderRadius = "50%";

    node.style.background =
      i % 5 === 0
        ? "#d9ff55"
        : "#777";

    node.style.boxShadow =
      i % 5 === 0
        ? "0 0 14px rgba(217,255,85,.5)"
        : "none";

    node.style.left =
      (8 + Math.random() * 84) + "%";

    node.style.top =
      (10 + Math.random() * 76) + "%";

    node.style.zIndex = "2";

    el.appendChild(node);
  }
}

drawNodes("heroGraph", 14);

/* Lightweight animated network preview for the Network Intelligence capability card. */
function initMiniNetwork() {
  const canvas = document.getElementById("networkOneCanvas");
  const stage = document.getElementById("networkOne");
  if (!canvas || !stage) return;
  const ctx = canvas.getContext("2d");
  let W=0,H=0,dpr=1,nodes=[],links=[],raf=0,last=0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function resize(){
    const r=stage.getBoundingClientRect(); W=Math.max(260,r.width); H=Math.max(180,r.height);
    dpr=Math.min(window.devicePixelRatio||1,2); canvas.width=W*dpr; canvas.height=H*dpr; canvas.style.width=W+"px"; canvas.style.height=H+"px"; ctx.setTransform(dpr,0,0,dpr,0,0);
    const cx=W*.5,cy=H*.52,rx=Math.min(W,H)*.34,ry=Math.min(W,H)*.32;
    nodes=Array.from({length:18},(_,i)=>{const a=(i/18)*Math.PI*2+(Math.random()-.5)*.35; const rr=(i<5?.48:.72+Math.random()*.28); return {x:cx+Math.cos(a)*rx*rr,y:cy+Math.sin(a)*ry*rr,ox:cx+Math.cos(a)*rx*rr,oy:cy+Math.sin(a)*ry*rr,r:i===0?5.5:(i%5===0?4.2:2.8),phase:Math.random()*Math.PI*2,speed:.45+Math.random()*.65};});
    links=[]; for(let i=1;i<nodes.length;i++){links.push([i,Math.floor(Math.random()*i)]); if(i%4===0) links.push([i,Math.floor(Math.random()*i)]);}
  }
  function frame(t){
    const dt=Math.min(32,(t-last)||16)/16; last=t; ctx.clearRect(0,0,W,H);
    for(const p of nodes){p.phase+=.012*p.speed*dt; p.x=p.ox+Math.sin(p.phase)*5; p.y=p.oy+Math.cos(p.phase*1.17)*4;}
    for(const [a,b] of links){const A=nodes[a],B=nodes[b]; const d=Math.hypot(A.x-B.x,A.y-B.y); if(d<180){ctx.strokeStyle=`rgba(217,255,85,${Math.max(.018,.08-d/2200)})`;ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke();}}
    nodes.forEach((p,i)=>{const glow=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);glow.addColorStop(0,`rgba(217,255,85,${i===0?.24:.10})`);glow.addColorStop(1,"rgba(217,255,85,0)");ctx.fillStyle=glow;ctx.beginPath();ctx.arc(p.x,p.y,p.r*5,0,Math.PI*2);ctx.fill();ctx.fillStyle=i===0?"#d9ff55":"#7d8580";ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();});
    if(!reduced) raf=requestAnimationFrame(frame);
  }
  window.addEventListener("resize",resize,{passive:true}); resize(); if(!reduced) raf=requestAnimationFrame(frame); else frame(16);
}

initMiniNetwork();


/* =========================================================
   BLACKBIRD ORGANIC NETWORK
   ========================================================= */

const canvas =
  document.getElementById("blackbirdCanvas");

const stage =
  document.getElementById("blackbird");

const selectedBox =
  document.getElementById("networkSelected");

const nodeCountEl =
  document.getElementById("nodeCount");

const edgeCountEl =
  document.getElementById("edgeCount");


if (canvas && stage) {

  const ctx = canvas.getContext("2d");

  let W = 0;
  let H = 0;

  let dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );

  let nodes = [];
  let links = [];

  let mouse = {
    x: -9999,
    y: -9999
  };

  let hovered = null;
  let selected = null;
  let pulse = 0;


  const TYPES = [
    "person",
    "person",
    "person",
    "org",
    "place",
    "evidence"
  ];


  const NAMES = [
    "Subject 047",
    "Subject 018",
    "Subject 029",
    "Subject 063",
    "Subject 081",
    "Org A",
    "Org B",
    "Location 01",
    "Location 02",
    "Evidence 12",
    "Evidence 21",
    "Subject 091",
    "Subject 104",
    "Org C",
    "Subject 116",
    "Location 03"
  ];


  function resize() {

    const r =
      stage.getBoundingClientRect();

    W = Math.max(300, r.width);
    H = Math.max(300, r.height);

    dpr =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    canvas.style.width =
      W + "px";

    canvas.style.height =
      H + "px";

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );
  }


  function makeNodes() {

    nodes = [];

    const cx = W * 0.50;
    const cy = H * 0.52;


    nodes.push({
      x: cx,
      y: cy,
      ox: cx,
      oy: cy,
      r: 18,
      type: "person",
      name: "Subject 047",
      fixed: true,
      phase: 0
    });


    for (let i = 1; i < 25; i++) {

      const angle =
        (i / 24) * Math.PI * 2 +
        (Math.random() - 0.5) * 0.38;

      const ring =
        i < 9
          ? Math.min(W, H) *
            (0.19 + Math.random() * 0.08)

          : i < 17
            ? Math.min(W, H) *
              (0.30 + Math.random() * 0.10)

            : Math.min(W, H) *
              (0.40 + Math.random() * 0.08);


      const x =
        cx +
        Math.cos(angle) *
        ring;

      const y =
        cy +
        Math.sin(angle) *
        ring *
        0.78;


      nodes.push({

        x,
        y,

        ox: x,
        oy: y,

        r:
          i % 7 === 0
            ? 8
            : i % 4 === 0
              ? 6
              : 4,

        type:
          TYPES[i % TYPES.length],

        name:
          NAMES[i % NAMES.length],

        fixed: false,

        phase:
          Math.random() *
          Math.PI *
          2,

        speed:
          0.0005 +
          Math.random() *
          0.0007

      });
    }


    links = [];


    /* Central web */

    for (let i = 1; i < 9; i++) {

      links.push([
        0,
        i
      ]);

    }


    /* Secondary links */

    for (
      let i = 1;
      i < nodes.length;
      i++
    ) {

      const candidates =
        nodes
          .map((_, j) => j)
          .filter(j => j !== i);


      candidates.sort(
        (a, b) =>
          Math.hypot(
            nodes[a].ox -
            nodes[i].ox,

            nodes[a].oy -
            nodes[i].oy
          )

          -

          Math.hypot(
            nodes[b].ox -
            nodes[i].ox,

            nodes[b].oy -
            nodes[i].oy
          )
      );


      const take =
        i < 9
          ? 1
          : 1 +
            (i % 3 === 0
              ? 1
              : 0);


      for (
        let k = 0;
        k < take;
        k++
      ) {

        const j =
          candidates[k];

        const exists =
          links.some(
            l =>
              (
                l[0] === i &&
                l[1] === j
              )
              ||
              (
                l[0] === j &&
                l[1] === i
              )
          );


        if (
          !exists &&
          Math.random() > 0.12
        ) {

          links.push([
            i,
            j
          ]);

        }
      }
    }


    /* Long-range connections */

    [
      [2, 15],
      [5, 20],
      [8, 18],
      [11, 23],
      [14, 21]
    ].forEach(pair =>
      links.push(pair)
    );


    if (nodeCountEl) {

      nodeCountEl.textContent =
        nodes.length;

    }


    if (edgeCountEl) {

      edgeCountEl.textContent =
        links.length;

    }


    selected =
      nodes[0];
  }


  function color(type) {

    if (type === "person")
      return "#d9ff55";

    if (type === "org")
      return "#c5cac7";

    if (type === "place")
      return "#87918c";

    return "#ff6b5f";
  }


  function animate(t) {

    pulse = t * 0.001;

    ctx.clearRect(
      0,
      0,
      W,
      H
    );


    /* Organic movement */

    nodes.forEach(n => {

      if (!n.fixed) {

        n.x =
          n.ox +
          Math.sin(
            pulse *
            n.speed *
            900 +
            n.phase
          ) *
          4;

        n.y =
          n.oy +
          Math.cos(
            pulse *
            n.speed *
            820 +
            n.phase *
            0.7
          ) *
          4;

      }

    });


    /* Connections */

    links.forEach(
      (l, idx) => {

        const a =
          nodes[l[0]];

        const b =
          nodes[l[1]];


        const active =
          (
            Math.sin(
              pulse * 0.9 +
              idx * 0.67
            ) + 1
          ) / 2;


        const near =
          hovered &&
          (
            hovered === a ||
            hovered === b
          );


        ctx.beginPath();

        ctx.moveTo(
          a.x,
          a.y
        );


        const mx =
          (a.x + b.x) / 2 +
          (b.y - a.y) *
          0.035;

        const my =
          (a.y + b.y) / 2 -
          (b.x - a.x) *
          0.035;


        ctx.quadraticCurveTo(
          mx,
          my,
          b.x,
          b.y
        );


        ctx.strokeStyle =
          near
            ? "rgba(217,255,85,.46)"
            : `rgba(128,136,132,${
                0.10 +
                active * 0.10
              })`;


        ctx.lineWidth =
          near
            ? 1.35
            : 0.7;


        ctx.stroke();


        /* Moving spark */

        const p =
          (
            pulse * 0.055 +
            idx * 0.071
          ) % 1;


        const x =
          a.x +
          (b.x - a.x) *
          p;

        const y =
          a.y +
          (b.y - a.y) *
          p;


        ctx.beginPath();

        ctx.arc(
          x,
          y,
          near ? 2.2 : 1.25,
          0,
          Math.PI * 2
        );


        ctx.fillStyle =
          near
            ? "rgba(217,255,85,.9)"
            : "rgba(170,180,175,.42)";

        ctx.fill();

      }
    );


    /* Nodes */

    nodes.forEach(n => {

      const dist =
        Math.hypot(
          mouse.x - n.x,
          mouse.y - n.y
        );


      const hot =
        dist < 32 ||
        n === selected;


      const c =
        color(n.type);


      if (hot) {

        ctx.beginPath();

        ctx.arc(
          n.x,
          n.y,
          n.r +
          11 +
          Math.sin(
            pulse * 2 +
            n.phase
          ) *
          2,
          0,
          Math.PI * 2
        );


        ctx.strokeStyle =
          n === selected
            ? "rgba(217,255,85,.18)"
            : "rgba(255,255,255,.10)";


        ctx.stroke();

      }


      ctx.beginPath();

      ctx.arc(
        n.x,
        n.y,
        n.r +
        (n === selected ? 2 : 0),
        0,
        Math.PI * 2
      );


      ctx.fillStyle = c;

      ctx.shadowBlur =
        n === selected
          ? 22
          : hot
            ? 12
            : 0;

      ctx.shadowColor = c;

      ctx.fill();

      ctx.shadowBlur = 0;


      if (hot || n === selected) {

        ctx.font =
          '9px "DM Mono", monospace';

        ctx.fillStyle =
          "#b9bfbc";

        ctx.fillText(
          n.name,
          n.x + n.r + 7,
          n.y - 7
        );

      }

    });


    /* Center focus ring */

    const c = nodes[0];

    if (c) {

      ctx.beginPath();

      ctx.arc(
        c.x,
        c.y,
        31 +
        Math.sin(
          pulse * 1.7
        ) *
        3,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        "rgba(217,255,85,.12)";

      ctx.stroke();

    }


    requestAnimationFrame(
      animate
    );
  }


  function pick(e) {

    const r =
      canvas.getBoundingClientRect();

    const x =
      e.clientX -
      r.left;

    const y =
      e.clientY -
      r.top;


    mouse = {
      x,
      y
    };

    hovered = null;


    for (const n of nodes) {

      if (
        Math.hypot(
          x - n.x,
          y - n.y
        ) <
        Math.max(
          14,
          n.r + 8
        )
      ) {

        hovered = n;
        break;

      }

    }


    canvas.style.cursor =
      hovered
        ? "pointer"
        : "default";
  }


  canvas.addEventListener(
    "mousemove",
    pick
  );


  canvas.addEventListener(
    "mouseleave",
    () => {

      mouse = {
        x: -9999,
        y: -9999
      };

      hovered = null;

    }
  );


  canvas.addEventListener(
    "click",
    () => {

      if (!hovered)
        return;

      selected = hovered;


      if (selectedBox) {

        const strong =
          selectedBox.querySelector(
            "strong"
          );

        const span =
          selectedBox.querySelector(
            "span"
          );


        if (strong) {

          strong.textContent =
            hovered.name;

        }


        const degree =
          links.filter(
            l =>
              l[0] ===
                nodes.indexOf(
                  hovered
                )
              ||
              l[1] ===
                nodes.indexOf(
                  hovered
                )
          ).length;


        if (span) {

          span.textContent =
            `${degree} direct connections`;

        }

      }

    }
  );


  window.addEventListener(
    "resize",
    () => {

      resize();
      makeNodes();

    }
  );


  resize();
  makeNodes();

  requestAnimationFrame(
    animate
  );
}


/* =========================================================
   DETAILS ACCORDION
   ========================================================= */

document
  .querySelectorAll("details")
  .forEach(item => {

    item.addEventListener(
      "toggle",
      () => {

        if (item.open) {

          document
            .querySelectorAll("details")
            .forEach(other => {

              if (other !== item) {

                other.removeAttribute(
                  "open"
                );

              }

            });

        }

      }
    );

  });


/* =========================================================
   CIPHER AUTH + BACKEND + CASE ORBIT
   ========================================================= */

(() => {

  const auth =
    document.getElementById(
      "cipherAuth"
    );

  const workspace =
    document.getElementById(
      "cipherWorkspace"
    );

  const form =
    document.getElementById(
      "authForm"
    );


  if (
    !auth ||
    !workspace ||
    !form
  ) {
    return;
  }


  const title =
    document.getElementById(
      "authTitle"
    );

  const subtitle =
    document.getElementById(
      "authSubtitle"
    );

  const kicker =
    document.getElementById(
      "authKicker"
    );

  const submit =
    document.getElementById(
      "authSubmitText"
    );


  const name =
    document.getElementById(
      "authName"
    );

  const email =
    document.getElementById(
      "authEmail"
    );

  const pass =
    document.getElementById(
      "authPassword"
    );

  const confirm =
    document.getElementById(
      "authConfirm"
    );


  let mode = "login";


  /* =====================================================
     BACKEND CONFIGURATION
     ===================================================== */

  const API_BASE = "";
const TOKEN_KEY = "cipher_access_token";
const USER_KEY = "cipher_user";
const USERS_KEY = "cipher_local_users";

function cipherGetUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function cipherSaveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function cipherMakeLocalToken() {
  return `cipher-local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function cipherApi(path, options = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const body = options.body ? JSON.parse(options.body) : null;

  if (path === "/auth/login" && method === "POST") {
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!email || !password) {
      throw new Error("Enter your email and password.");
    }

    // Cipher's original frontend demo account.
    if (email === "investigator@cipher.local" && password === "cipher123") {
      const token = cipherMakeLocalToken();
      const demoUser = {
        id: "cipher-demo-investigator",
        name: "Investigator",
        email: "investigator@cipher.local"
      };

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(demoUser));

      return {
        access_token: token,
        user: demoUser
      };
    }

    const users = cipherGetUsers();
    const user = users.find(item => item.email === email);

    if (!user || user.password !== password) {
      throw new Error("Invalid email or password.");
    }

    const token = cipherMakeLocalToken();
    const loggedInUser = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));

    return {
      access_token: token,
      user: loggedInUser
    };
  }

  if (path === "/auth/register" && method === "POST") {
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!name || !email || !password) {
      throw new Error("Complete all required fields.");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    const users = cipherGetUsers();

    if (users.some(item => item.email === email)) {
      throw new Error("An account with this email already exists.");
    }

    const user = {
      id: `local-${Date.now()}`,
      name,
      email,
      password
    };

    users.push(user);
    cipherSaveUsers(users);

    const token = cipherMakeLocalToken();
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email
    }));

    return {
      access_token: token,
      user: { id: user.id, name: user.name, email: user.email }
    };
  }

  // Keep the existing frontend functional without a backend.
  if (path === "/cases" && method === "GET") {
    return JSON.parse(localStorage.getItem("cipher_local_cases") || "[]");
  }

  if (path === "/cases" && method === "POST") {
    const cases = JSON.parse(localStorage.getItem("cipher_local_cases") || "[]");
    const created = {
      ...body,
      id: body?.id || `local-case-${Date.now()}`,
      created_at: body?.created_at || new Date().toISOString()
    };
    cases.push(created);
    localStorage.setItem("cipher_local_cases", JSON.stringify(cases));
    return created;
  }

  if (path.startsWith("/cases/") && method === "GET") {
    const id = path.split("/").pop();
    const cases = JSON.parse(localStorage.getItem("cipher_local_cases") || "[]");
    return cases.find(item => String(item.id) === String(id)) || null;
  }

  throw new Error(`Local mode does not support ${method} ${path}.`);
}

window.cipherApi = cipherApi;
window.cipherApiConfig = { API_BASE, TOKEN_KEY, USER_KEY };


  /* =====================================================
     AUTH UI MODE
     ===================================================== */

  function setMode(m) {

    mode = m;

    auth.classList.toggle(
      "signup-mode",
      m === "signup"
    );


    document
      .querySelectorAll(
        ".auth-switch button"
      )
      .forEach(b => {

        b.classList.toggle(
          "active",
          b.dataset.mode === m
        );

      });


    name.required =
      m === "signup";

    confirm.required =
      m === "signup";


    kicker.textContent =
      m === "signup"
        ? "AUTH / 002"
        : "AUTH / 001";


    title.textContent =
      m === "signup"
        ? "Create access."
        : "Welcome back.";


    subtitle.textContent =
      m === "signup"
        ? "Create a local demo identity and enter your investigative workspace."
        : "Sign in to enter your investigative workspace.";


    submit.textContent =
      m === "signup"
        ? "CREATE & ENTER"
        : "ENTER CIPHER";
  }


  function openAuth(m) {

    setMode(m);

    auth.classList.add("open");

    auth.setAttribute(
      "aria-hidden",
      "false"
    );


    workspace.classList.remove(
      "open"
    );

    workspace.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.style.overflow =
      "hidden";


    setTimeout(
      () =>
        (
          m === "signup"
            ? name
            : email
        )?.focus(),
      100
    );
  }


  function closeAll() {

    auth.classList.remove(
      "open"
    );

    workspace.classList.remove(
      "open"
    );


    auth.setAttribute(
      "aria-hidden",
      "true"
    );

    workspace.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.style.overflow =
      "";


    if (
      location.hash.startsWith(
        "#auth"
      ) ||
      location.hash ===
        "#workspace"
    ) {

      history.replaceState(
        null,
        "",
        location.pathname +
        location.search
      );

    }
  }


  function enter() {

    auth.classList.remove(
      "open"
    );

    workspace.classList.add(
      "open"
    );


    auth.setAttribute(
      "aria-hidden",
      "true"
    );

    workspace.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.style.overflow =
      "hidden";


    history.replaceState(
      null,
      "",
      "#workspace"
    );


    requestAnimationFrame(
      () =>
        requestAnimationFrame(
          () => {
            initOrbit();
            window.cipherLoadCases?.();
          }
        )
    );
  }


  /* =====================================================
     OPEN LOGIN / SIGNUP
     ===================================================== */

  document
    .querySelectorAll("[data-auth]")
    .forEach(a => {

      a.addEventListener(
        "click",
        e => {

          e.preventDefault();
          e.stopPropagation();

          openAuth(
            a.dataset.auth
          );


          history.replaceState(
            null,
            "",
            location.pathname +
            location.search +
            "#auth-" +
            a.dataset.auth
          );

        }
      );

    });


  document
    .querySelectorAll(
      ".auth-switch button"
    )
    .forEach(b => {

      b.addEventListener(
        "click",
        () =>
          setMode(
            b.dataset.mode
          )
      );

    });


  document
    .getElementById(
      "authClose"
    )
    ?.addEventListener(
      "click",
      closeAll
    );


  document
    .getElementById(
      "workspaceExit"
    )
    ?.addEventListener(
      "click",
      closeAll
    );


  document.addEventListener(
    "keydown",
    e => {

      if (
        e.key === "Escape" &&
        (
          auth.classList.contains(
            "open"
          ) ||
          workspace.classList.contains(
            "open"
          )
        )
      ) {

        closeAll();

      }

    }
  );


  /* =====================================================
     REAL BACKEND LOGIN / SIGNUP
     ===================================================== */

  form.addEventListener(
    "submit",
    async e => {

      e.preventDefault();


      /* Basic validation */

      if (
        !email.checkValidity() ||
        !pass.checkValidity() ||
        (
          mode === "signup" &&
          !name.checkValidity()
        )
      ) {

        form.reportValidity();

        return;

      }


      /* Password confirmation */

      if (
        mode === "signup" &&
        pass.value !==
          confirm.value
      ) {

        confirm.setCustomValidity(
          "Passwords do not match."
        );

        form.reportValidity();

        confirm.setCustomValidity(
          ""
        );

        return;

      }


      /* Disable button */

      submit.disabled = true;


      const originalText =
        submit.textContent;


      submit.textContent =
        mode === "login"
          ? "AUTHENTICATING..."
          : "CREATING...";


      try {

        const body =
          mode === "login"
            ? {
                email: email.value.trim(),
                password: pass.value
              }
            : {
                name: name.value.trim(),
                full_name: name.value.trim(),
                email: email.value.trim(),
                password: pass.value,
                role: "INVESTIGATOR"
              };

        const data = await cipherApi(
          mode === "login"
            ? "/auth/login"
            : "/auth/register",
          {
            method: "POST",
            body: JSON.stringify(body)
          }
        );

        /* LOGIN SUCCESS */
        if (mode === "login") {
          localStorage.setItem(
            TOKEN_KEY,
            data.access_token
          );

          localStorage.setItem(
            USER_KEY,
            JSON.stringify(data.user)
          );

          enter();
        }

        /* SIGNUP SUCCESS */
        else {
          alert(
            "Account created successfully. Please login."
          );

          setMode("login");
          pass.value = "";
          confirm.value = "";

          setTimeout(() => {
            email.focus();
          }, 100);
        }

      } catch (error) {

        console.error(
          "CIPHER local authentication error:",
          error
        );

        alert(
          error.message ||
          "Unable to authenticate locally."
        );

      }

      finally {

        submit.disabled =
          false;

        submit.textContent =
          originalText;

      }

    }
  );


  /* =====================================================
     HASH ROUTING
     ===================================================== */

  window.addEventListener(
    "hashchange",
    () => {

      if (
        location.hash ===
        "#auth-login"
      ) {

        openAuth(
          "login"
        );

      }

      else if (
        location.hash ===
        "#auth-signup"
      ) {

        openAuth(
          "signup"
        );

      }

      else if (
        location.hash ===
        "#workspace"
      ) {

        enter();

      }

    }
  );


  if (
    location.hash ===
    "#auth-login"
  ) {

    openAuth(
      "login"
    );

  }


  if (
    location.hash ===
    "#auth-signup"
  ) {

    openAuth(
      "signup"
    );

  }


  /* =====================================================
     CASE ORBIT
     ===================================================== */

  let orbitRAF = null;

  let orbitRunning = false;

  let stage;

  let cards = [];


  const state = {

    angle: -18,

    angularVelocity: 0.014,

    drag: false,

    lastX: 0,

    lastY: 0,

    focusedCard: null,

    focusProgress: 0,

    snapTarget: null,

    tiltX: -12,

    targetTiltX: -12,

    tiltZ: -3.5,

    targetTiltZ: -3.5,

    radiusBoost: 0,

    targetRadiusBoost: 0,

    lastFrameTime: 0

  };


  const clamp =
    (v, a, b) =>
      Math.max(
        a,
        Math.min(
          b,
          v
        )
      );


  const shortestDelta =
    (target, current) =>
      (
        (
          target -
          current +
          540
        ) %
        360
      ) -
      180;


  function initOrbit() {

    stage =
      document.getElementById(
        "caseStage"
      );


    if (!stage)
      return;


    cards = [
      ...stage.querySelectorAll(
        ".floating-case"
      )
    ];


    if (!cards.length)
      return;


    if (
      !stage.querySelector(
        ".case-orbit-plane"
      )
    ) {

      stage.insertAdjacentHTML(
        "afterbegin",
        `
        <div class="case-orbit-plane" aria-hidden="true">

          <span class="orbit-ellipse orbit-ellipse-a"></span>

          <span class="orbit-ellipse orbit-ellipse-b"></span>

          <span class="orbit-axis orbit-axis-x"></span>

          <span class="orbit-axis orbit-axis-y"></span>

        </div>

        <div class="case-orbit-reticle" aria-hidden="true">
          <i></i>
          <b></b>
        </div>

        <div class="case-orbit-hud" aria-hidden="true">

          <span>
            CASE ORBIT / SPATIAL VIEW
          </span>

          <b>
            DRAG TO ROTATE · RELEASE FOR MOMENTUM
          </b>

        </div>
        `
      );

    }


    if (
      !stage.dataset.orbitBound
    ) {

      stage.dataset.orbitBound =
        "1";


      stage.addEventListener(
        "pointerdown",
        e => {

          if (
            e.target.closest(
              ".floating-case"
            ) ||
            e.target.closest(
              ".new-case"
            )
          ) {
            return;
          }


          state.drag = true;

          state.lastX =
            e.clientX;

          state.lastY =
            e.clientY;


          stage.setPointerCapture?.(
            e.pointerId
          );


          stage.classList.add(
            "dragging"
          );

        }
      );


      stage.addEventListener(
        "pointermove",
        e => {

          if (!state.drag)
            return;


          const dx =
            e.clientX -
            state.lastX;

          const dy =
            e.clientY -
            state.lastY;


          state.lastX =
            e.clientX;

          state.lastY =
            e.clientY;


          state.focusedCard =
            null;

          state.focusProgress =
            0;

          state.snapTarget =
            null;


          cards.forEach(
            c =>
              c.classList.remove(
                "focus"
              )
          );


          const speed =
            dx * 0.34;


          state.angularVelocity =
            clamp(
              speed,
              -2.2,
              2.2
            );


          state.angle +=
            speed;


          state.targetTiltX =
            clamp(
              state.targetTiltX -
                dy * 0.055,
              -18,
              -5
            );


          state.targetTiltZ =
            clamp(
              state.targetTiltZ +
                dx * 0.018,
              -7,
              1
            );

        }
      );


      const release = () => {

        if (!state.drag)
          return;

        state.drag = false;

        stage.classList.remove(
          "dragging"
        );

      };


      stage.addEventListener(
        "pointerup",
        release
      );

      stage.addEventListener(
        "pointercancel",
        release
      );

      stage.addEventListener(
        "lostpointercapture",
        release
      );


      stage.addEventListener(
        "wheel",
        e => {

          e.preventDefault();


          if (
            state.focusedCard
          ) {
            return;
          }


          const delta =
            clamp(
              e.deltaY * 0.055,
              -3.5,
              3.5
            );


          state.angularVelocity =
            delta * 0.22;

          state.angle +=
            delta;

        },
        {
          passive: false
        }
      );


      stage.addEventListener(
        "click",
        e => {

          if (
            state.focusedCard &&
            !e.target.closest(
              ".floating-case"
            )
          ) {

            releaseCard();

          }

        }
      );


      const bindCaseCard =
        card => {

          if (
            card.dataset.caseBound ===
            "1"
          ) {
            return;
          }


          card.dataset.caseBound =
            "1";


          card.addEventListener(
            "click",
            e => {

              if (
                e.target.closest(
                  "button"
                )
              ) {
                return;
              }


              e.stopPropagation();


              focusCard(
                card
              );

              const caseId = card.dataset.caseId;
              const selectedCase = (window.cipherAllCases || []).find(item => String(item.id) === String(caseId));
              if (selectedCase && typeof openCase === "function") {
                openCase(selectedCase, true);
                return;
              }

              const main =
                stage.querySelector(
                  ".case-main"
                );


              if (
                main &&
                card !== main
              ) {

                const index =
                  card.querySelector(
                    ".case-top span"
                  )?.textContent ||
                  "CASE / SELECTED";


                const mainIndex =
                  main.querySelector(
                    ".case-index"
                  );

                const mainTitle =
                  main.querySelector(
                    "h3"
                  );


                if (mainIndex) {

                  mainIndex.textContent =
                    index;

                }


                if (mainTitle) {

                  mainTitle.textContent =
                    card.dataset.case;

                }

              }

            }
          );

        };


      cards.forEach(
        bindCaseCard
      );


      window.cipherRefreshCases =
        () => {

          cards = [
            ...stage.querySelectorAll(
              ".floating-case"
            )
          ];


          cards.forEach(
            bindCaseCard
          );


          if (
            state.focusedCard &&
            !cards.includes(
              state.focusedCard
            )
          ) {

            releaseCard();

          }

        };


      window.cipherFocusCase =
        card =>
          focusCard(card);

    }


    if (!orbitRunning) {

      orbitRunning =
        true;

      orbitLoop();

    }

  }


  function focusCard(card) {

    if (!cards.length)
      return;


    const i =
      cards.indexOf(card);


    if (i < 0)
      return;


    const spacing =
      360 / cards.length;


    const base =
      i * spacing;


    const desired =
      90 - base;


    state.snapTarget =
      state.angle +
      shortestDelta(
        desired,
        state.angle
      );


    state.angularVelocity =
      0;


    state.focusedCard =
      card;


    state.focusProgress =
      0;


    state.targetTiltX =
      -9;

    state.targetTiltZ =
      -2;


    cards.forEach(
      c =>
        c.classList.toggle(
          "focus",
          c === card
        )
    );

  }


  function releaseCard() {

    if (!state.focusedCard)
      return;


    state.focusedCard =
      null;

    state.focusProgress =
      0;

    state.snapTarget =
      null;

    state.angularVelocity =
      0.012;


    cards.forEach(
      c =>
        c.classList.remove(
          "focus"
        )
    );

  }


  function orbitLoop() {

    if (
      !workspace.classList.contains(
        "open"
      )
    ) {

      orbitRunning =
        false;

      state.lastFrameTime = 0;
      orbitRAF =
        null;

      return;

    }


    const now = performance.now();
    const dt = state.lastFrameTime ? Math.min(2, (now - state.lastFrameTime) / 16.67) : 1;
    state.lastFrameTime = now;

    if (state.drag) {

      state.angularVelocity *= Math.pow(0.995, dt);

    }

    else if (
      state.snapTarget !== null
    ) {

      const delta =
        state.snapTarget -
        state.angle;


      state.angle +=
        delta * (1 - Math.pow(0.905, dt));


      state.angularVelocity *=
        Math.pow(0.82, dt);


      if (
        Math.abs(delta) <
        0.06
      ) {

        state.angle =
          state.snapTarget;

        state.snapTarget =
          null;

        state.angularVelocity =
          0;

      }

    }

    else if (
      !state.focusedCard
    ) {

      state.angularVelocity +=
        0.00042 * dt;

      state.angularVelocity *=
        Math.pow(0.986, dt);


      state.angularVelocity =
        clamp(
          state.angularVelocity,
          -1.8,
          1.8
        );


      state.angle +=
        state.angularVelocity * dt;

    }


    if (state.focusedCard) {

      const arrival =
        state.snapTarget === null
          ? 1
          : clamp(
              1 -
                Math.abs(
                  state.snapTarget -
                  state.angle
                ) /
                  45,
              0,
              1
            );


      state.focusProgress +=
        (
          arrival -
          state.focusProgress
        ) *
        0.09;

    }

    else {

      state.focusProgress *=
        0.88;

    }


    state.targetTiltX +=
      (
        -11 -
        state.targetTiltX
      ) *
      0.006;


    state.targetTiltZ +=
      (
        -3.5 -
        state.targetTiltZ
      ) *
      0.006;


    state.tiltX +=
      (
        state.targetTiltX -
        state.tiltX
      ) *
      0.08;


    state.tiltZ +=
      (
        state.targetTiltZ -
        state.tiltZ
      ) *
      0.08;


    const r =
      stage.getBoundingClientRect();


    const mobile =
      r.width < 700;


    const rx =
      Math.min(
        r.width *
          (mobile
            ? 0.34
            : 0.38),
        mobile
          ? 270
          : 510
      ) +
      state.radiusBoost;


    const ry =
      Math.min(
        r.height *
          (mobile
            ? 0.25
            : 0.29),
        mobile
          ? 155
          : 190
      );


    const depth =
      mobile
        ? 105
        : 185;


    const n =
      cards.length;


    cards.forEach(
      (card, i) => {

        const phase =
          (
            i / n
          ) *
          Math.PI *
          2 +
          state.angle *
            Math.PI /
            180;


        const x =
          Math.cos(phase) *
          rx;


        const y =
          Math.sin(phase) *
          ry;


        const z =
          Math.sin(phase) *
          depth;


        const front =
          (
            z + depth
          ) /
          (
            depth * 2
          );


        const baseScale =
          mobile
            ? 0.76 +
              front * 0.12
            : 0.80 +
              front * 0.16;


        const isFocused =
          state.focusedCard ===
          card;


        const p =
          state.focusProgress;


        const focusX =
          isFocused
            ? x * (1 - p)
            : x;


        const focusY =
          isFocused
            ? y * (1 - p)
            : y;


        const focusZ =
          isFocused
            ? z * (1 - p) +
              125 * p
            : z;


        const focusScale =
          isFocused
            ? 1 + 0.20 * p
            : 1;


        const rotY =
          -Math.cos(phase) *
          18;


        const rotX =
          state.tiltX -
          Math.sin(phase) *
            5;


        const transform =
          `translate3d(calc(-50% + ${focusX}px),calc(-50% + ${focusY}px),${focusZ}px) rotateZ(${state.tiltZ}deg) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${baseScale * focusScale})`;


        card.style.setProperty(
          "--case-transform",
          transform
        );


        card.style.transform =
          transform;


        card.style.zIndex =
          isFocused
            ? "9999"
            : String(
                Math.round(
                  100 +
                  front *
                    100
                )
              );


        if (isFocused) {

          card.style.opacity =
            "1";

          card.style.filter =
            "brightness(1.10) saturate(1.04) blur(0px)";

        }

        else {

          const distanceFromFront =
            Math.abs(
              0.5 -
              front
            );


          const opacity =
            0.28 +
            front * 0.36 -
            distanceFromFront *
              0.08;


          card.style.opacity =
            String(
              clamp(
                opacity,
                0.20,
                0.68
              )
            );


          card.style.filter =
            `brightness(${0.76 + front * 0.20}) blur(${(1 - front) * 0.75}px)`;

        }

      }
    );


    orbitRAF =
      requestAnimationFrame(
        orbitLoop
      );

  }

})();


/* =========================================================
   SCROLL-DRIVEN TIMELINE RECONSTRUCTION
   ========================================================= */

(function initCipherTimeline() {

  const section =
    document.getElementById(
      "timeline-reconstruction"
    );

  const canvas =
    document.getElementById(
      "cipherTimeline"
    );

  const trace =
    document.getElementById(
      "timelineTrace"
    );


  if (
    !section ||
    !canvas ||
    !trace
  ) {
    return;
  }


  const nodes = [
    ...canvas.querySelectorAll(
      ".timeline-node"
    )
  ];


  const events = [
    ...canvas.querySelectorAll(
      ".timeline-event"
    )
  ];


  const progressLabel =
    document.getElementById(
      "timelineProgressLabel"
    );


  const progressState =
    document.getElementById(
      "timelineProgressState"
    );


  let pathLength = 0;

  let raf = 0;

  let current = 0;

  let target = 0;


  function measure() {

    pathLength =
      trace.getTotalLength();

    trace.style.strokeDasharray =
      pathLength;

    trace.style.strokeDashoffset =
      pathLength;

  }


  function clamp(
    v,
    a = 0,
    b = 1
  ) {

    return Math.max(
      a,
      Math.min(
        b,
        v
      )
    );

  }


  function update() {

    raf = 0;


    const rect =
      section.getBoundingClientRect();


    const travel =
      Math.max(
        1,
        section.offsetHeight -
          window.innerHeight
      );


    target =
      clamp(
        -rect.top /
          travel
      );


    current +=
      (
        target -
        current
      ) *
      0.10;


    if (
      Math.abs(
        target -
        current
      ) <
      0.0005
    ) {

      current =
        target;

    }


    const eased =
      current *
      current *
      (
        3 -
        2 *
        current
      );


    trace.style.strokeDashoffset =
      pathLength *
      (
        1 -
        eased
      );


    const active =
      Math.min(
        nodes.length,
        Math.max(
          1,
          Math.floor(
            current *
              nodes.length
          ) +
            1
        )
      );


    nodes.forEach(
      (node, i) => {

        const index =
          i + 1;


        node.classList.toggle(
          "active",
          index <= active
        );


        node.classList.toggle(
          "current",
          index === active &&
          current < 0.995
        );

      }
    );


    events.forEach(
      (event, i) => {

        const index =
          i + 1;


        const threshold =
          (
            index - 1
          ) /
          Math.max(
            1,
            events.length -
              1
          );


        const show =
          current >=
          Math.max(
            0,
            threshold -
              0.055
          );


        event.classList.toggle(
          "visible",
          show
        );

      }
    );


    const shown =
      Math.min(
        nodes.length,
        Math.max(
          1,
          Math.ceil(
            current *
              nodes.length
          )
        )
      );


    if (progressLabel) {

      progressLabel.textContent =
        String(shown).padStart(
          2,
          "0"
        ) +
        " / " +
        String(
          nodes.length
        ).padStart(
          2,
          "0"
        );

    }


    if (progressState) {

      progressState.textContent =
        current > 0.97
          ? "TRACE COMPLETE"
          : current > 0.08
            ? "RECONSTRUCTING"
            : "TRACE READY";

    }


    if (current < 1) {

      raf =
        requestAnimationFrame(
          update
        );

    }

  }


  function request() {

    if (!raf) {

      raf =
        requestAnimationFrame(
          update
        );

    }

  }


  measure();


  window.addEventListener(
    "resize",
    () => {

      measure();
      request();

    },
    {
      passive: true
    }
  );


  window.addEventListener(
    "scroll",
    request,
    {
      passive: true
    }
  );


  request();

})();


/* =========================================================
   BACKEND CASE MANAGEMENT / FRONTEND ONLY
   ========================================================= */
(function initBackendCases() {
  const casesView = document.getElementById("casesView");
  const stage = document.getElementById("caseStage");
  const newCaseBtn = document.getElementById("newCaseBtn");
  if (!casesView || !stage) return;

  let loadedCases = [];

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function priorityLabel(priority) {
    const p = String(priority || "MEDIUM").toUpperCase();
    return p === "CRITICAL" ? "CRITICAL" : p;
  }

  function renderCases(cases) {
    if (!Array.isArray(cases) || !cases.length) {
      stage.querySelectorAll(".floating-case").forEach(card => card.remove());
      window.cipherRefreshCases?.();
      return;
    }

    loadedCases = cases;
    stage.querySelectorAll(".floating-case").forEach(card => card.remove());
    const main = cases[0];
    const rest = cases.slice(1, 5);
    const positions = ["c1", "c2", "c4", "c5"];

    stage.insertAdjacentHTML("beforeend", `
      ${rest.map((c, i) => `
        <article class="floating-case case-back ${positions[i] || "c1"}" data-case="${esc(c.title)}" data-case-id="${esc(c.id)}">
          <div class="case-top"><span>CASE / ${esc(c.case_number)}</span><b>${esc(priorityLabel(c.priority))}</b></div>
          <h3>${esc(c.title)}</h3>
          <p>${esc(c.description || "No case description provided.")}</p>
          <div class="case-stats"><span>${esc(c.status || "OPEN")}</span><span>${esc(c.priority || "MEDIUM")}</span></div>
        </article>
      `).join("")}
      <article class="floating-case case-main c3" data-case="${esc(main.title)}" data-case-id="${esc(main.id)}">
        <div class="case-top"><span>CASE / ${esc(main.case_number)}</span><b class="${String(main.priority).toUpperCase() === "HIGH" || String(main.priority).toUpperCase() === "CRITICAL" ? "high" : ""}">${esc(priorityLabel(main.priority))}</b></div>
        <div class="case-index">${esc(main.case_number)}</div>
        <h3>${esc(main.title)}</h3>
        <p>${esc(main.description || "No case description provided.")}</p>
        <div class="case-metrics">
          <div><strong>—</strong><span>ENTITIES</span></div>
          <div><strong>—</strong><span>CONNECTIONS</span></div>
          <div><strong>—</strong><span>EVIDENCE</span></div>
          <div><strong>${esc(main.priority || "MED")}</strong><span>PRIORITY</span></div>
        </div>
        <div class="case-footer"><span>${esc(main.status || "OPEN")} · ${esc(main.created_at ? new Date(main.created_at).toLocaleDateString() : "NEW")}</span><button type="button" class="open-backend-case">OPEN CASE ↗</button></div>
      </article>`);

    window.cipherRefreshCases?.();
    bindOpenButtons();
  }

  function bindOpenButtons() {
    stage.querySelectorAll(".open-backend-case").forEach(btn => {
      if (btn.dataset.bound === "1") return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", async e => {
        e.stopPropagation();
        const card = btn.closest(".floating-case");
        const id = card?.dataset.caseId;
        if (!id) return;
        try {
          const data = await window.cipherApi(`/cases/${encodeURIComponent(id)}`);
          const c = data.case;
          window.cipherSetActiveCase?.(c);
          if (typeof toast === "function") toast(`Case ${c.case_number} loaded from backend.`);
        } catch (error) {
          if (typeof toast === "function") toast(error.message);
        }
      });
    });
  }

  async function loadCases() {
    const token = localStorage.getItem(window.cipherApiConfig?.TOKEN_KEY || "cipher_access_token");
    if (!token || !window.cipherApi) return;
    try {
      const data = await window.cipherApi("/cases");
      renderCases(data.cases || []);
    } catch (error) {
      console.warn("CIPHER case load:", error.message);
      if (typeof toast === "function") toast(error.message);
    }
  }

  window.cipherLoadCases = loadCases;
  window.cipherSetActiveCase = c => {
    const title = c?.title || "Untitled Case";
    const number = c?.case_number || "—";
    const header = document.querySelector(".workspace-case");
    if (header) header.innerHTML = `<span>CASE /</span> ${esc(number)} <i></i> ${esc(title)} · ${esc(c?.status || "OPEN")}`;
  };

  newCaseBtn?.addEventListener("click", () => openNewCaseModal());

  function openNewCaseModal() {
    let modal = document.getElementById("backendCaseModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "backendCaseModal";
      modal.className = "backend-case-modal";
      modal.innerHTML = `
        <div class="backend-case-dialog" role="dialog" aria-modal="true" aria-labelledby="backendCaseTitle">
          <button type="button" class="backend-case-close" aria-label="Close">×</button>
          <span class="room-kicker">CASE / NEW RECORD</span>
          <h2 id="backendCaseTitle">Create case.</h2>
          <p>Creates a case through the existing CIPHER backend. No backend files are changed.</p>
          <form id="backendCaseForm">
            <label>CASE NUMBER<input name="case_number" required placeholder="CASE / 043"></label>
            <label>TITLE<input name="title" required placeholder="Investigation title"></label>
            <label>DESCRIPTION<textarea name="description" rows="3" placeholder="Brief case description"></textarea></label>
            <label>PRIORITY<select name="priority"><option>LOW</option><option selected>MEDIUM</option><option>HIGH</option><option>CRITICAL</option></select></label>
            <div class="backend-case-actions"><button type="button" class="backend-case-cancel">CANCEL</button><button type="submit" class="backend-case-submit">CREATE CASE ↗</button></div>
          </form>
        </div>`;
      document.body.appendChild(modal);
      const close = () => modal.classList.remove("open");
      modal.querySelector(".backend-case-close").addEventListener("click", close);
      modal.querySelector(".backend-case-cancel").addEventListener("click", close);
      modal.addEventListener("click", e => { if (e.target === modal) close(); });
      modal.querySelector("form").addEventListener("submit", async e => {
        e.preventDefault();
        const form = e.currentTarget;
        const submit = form.querySelector(".backend-case-submit");
        const payload = Object.fromEntries(new FormData(form).entries());
        payload.description = payload.description || null;
        submit.disabled = true;
        submit.textContent = "CREATING...";
        try {
          const data = await window.cipherApi("/cases", { method: "POST", body: JSON.stringify(payload) });
          close();
          window.cipherSetActiveCase?.(data.case);
          await loadCases();
          if (typeof toast === "function") toast(`Case ${data.case.case_number} created successfully.`);
        } catch (error) {
          if (typeof toast === "function") toast(error.message);
        } finally {
          submit.disabled = false;
          submit.textContent = "CREATE CASE ↗";
        }
      });
    }
    modal.classList.add("open");
    modal.querySelector("input")?.focus();
  }
})();


/* =========================================================
   NETWORK WORKSPACE / NODE EDITOR
   ========================================================= */

(function initNetworkWorkspace() {

  const sideItems = [
    ...document.querySelectorAll(
      ".workspace-sidebar .side-item[data-view]"
    )
  ];


  const casesView =
    document.getElementById(
      "casesView"
    );

  const networkView =
    document.getElementById(
      "networkView"
    );

  const timelineView =
    document.getElementById(
      "timelineView"
    );

  const evidenceView =
    document.getElementById(
      "evidenceView"
    );

  const modal =
    document.getElementById(
      "nodeModal"
    );


  if (
    !sideItems.length ||
    !casesView ||
    !networkView
  ) {
    return;
  }


  function switchView(
    view
  ) {

    sideItems.forEach(
      btn =>
        btn.classList.toggle(
          "active",
          btn.dataset.view ===
            view
        )
    );


    casesView.classList.toggle(
      "active-view",
      view === "cases"
    );


    networkView.classList.toggle(
      "active-view",
      view === "network"
    );


    timelineView?.classList.toggle(
      "active-view",
      view === "timeline"
    );


    evidenceView?.classList.toggle(
      "active-view",
      view === "evidence"
    );


    if (
      view === "network"
    ) {

      networkView.scrollTop =
        0;

    }


    if (
      view === "timeline" &&
      timelineView
    ) {

      timelineView.scrollTop =
        0;

    }


    if (
      view === "evidence" &&
      evidenceView
    ) {

      evidenceView.scrollTop =
        0;

    }

  }


  const openModal = () => {

    if (!modal)
      return;


    modal.classList.add(
      "open"
    );


    modal.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.style.overflow =
      "hidden";


    showStep(1);


    setTimeout(
      () =>
        modal
          .querySelector(
            'input[name="nodeName"]'
          )
          ?.focus(),
      80
    );

  };


  const closeModal = () => {

    if (!modal)
      return;


    modal.classList.remove(
      "open"
    );


    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    if (
      document
        .getElementById(
          "cipherWorkspace"
        )
        ?.classList.contains(
          "open"
        )
    ) {

      document.body.style.overflow =
        "hidden";

    }

  };


  document
    .getElementById(
      "addNodeBtn"
    )
    ?.addEventListener(
      "click",
      openModal
    );


  document
    .getElementById(
      "deleteNodeBtn"
    )
    ?.addEventListener(
      "click",
      () =>
        showNetworkToast(
          "No node selected — choose a node in the graph first."
        )
    );


  document
    .querySelectorAll(
      "[data-node-close]"
    )
    .forEach(
      el =>
        el.addEventListener(
          "click",
          closeModal
        )
    );


  document
    .getElementById(
      "nodeModalClose"
    )
    ?.addEventListener(
      "click",
      closeModal
    );


  document.addEventListener(
    "keydown",
    e => {

      if (
        e.key === "Escape" &&
        modal?.classList.contains(
          "open"
        )
      ) {

        closeModal();

      }

    }
  );


  let step = 1;


  const steps = [
    ...document.querySelectorAll(
      ".node-step"
    )
  ];


  const dots = [
    ...document.querySelectorAll(
      "[data-step-dot]"
    )
  ];


  const counter =
    document.getElementById(
      "nodeStepNumber"
    );


  const next =
    document.getElementById(
      "nodeNext"
    );


  const back =
    document.getElementById(
      "nodeBack"
    );


  function showStep(n) {

    step =
      Math.max(
        1,
        Math.min(
          4,
          n
        )
      );


    steps.forEach(
      x =>
        x.classList.toggle(
          "active",
          Number(
            x.dataset.step
          ) === step
        )
    );


    dots.forEach(
      x =>
        x.classList.toggle(
          "active",
          Number(
            x.dataset.stepDot
          ) <= step
        )
    );


    if (counter) {

      counter.textContent =
        String(step).padStart(
          2,
          "0"
        );

    }


    if (back) {

      back.style.visibility =
        step === 1
          ? "hidden"
          : "visible";

    }


    if (next) {

      next.innerHTML =
        step === 4
          ? 'LINK NODE <span>↗</span>'
          : 'NEXT <span>→</span>';

    }

  }


  next?.addEventListener(
    "click",
    () => {

      if (step < 4) {

        showStep(
          step + 1
        );

        return;

      }


      closeModal();


      showNetworkToast(
        "Node draft staged — ready for the live graph layer."
      );

    }
  );


  back?.addEventListener(
    "click",
    () =>
      showStep(
        step - 1
      )
  );


  document
    .querySelectorAll(
      ".node-type"
    )
    .forEach(
      btn =>
        btn.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".node-type"
              )
              .forEach(
                x =>
                  x.classList.remove(
                    "active"
                  )
              );


            btn.classList.add(
              "active"
            );

          }
        )
    );


  document
    .querySelectorAll(
      ".source-choice"
    )
    .forEach(
      btn =>
        btn.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".source-choice"
              )
              .forEach(
                x =>
                  x.classList.remove(
                    "active"
                  )
              );


            btn.classList.add(
              "active"
            );

          }
        )
    );


  document
    .querySelectorAll(
      ".confidence"
    )
    .forEach(
      btn =>
        btn.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".confidence"
              )
              .forEach(
                x =>
                  x.classList.remove(
                    "active"
                  )
              );


            btn.classList.add(
              "active"
            );

          }
        )
    );


  document
    .querySelectorAll(
      ".inspector-tabs button"
    )
    .forEach(
      btn =>
        btn.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".inspector-tabs button"
              )
              .forEach(
                x =>
                  x.classList.remove(
                    "active"
                  )
              );


            btn.classList.add(
              "active"
            );

          }
        )
    );


  function showNetworkToast(
    message
  ) {

    let t =
      document.getElementById(
        "networkToast"
      );


    if (!t) {

      t =
        document.createElement(
          "div"
        );

      t.id =
        "networkToast";

      t.className =
        "network-toast";

      document.body.appendChild(
        t
      );

    }


    t.textContent =
      message;


    t.classList.add(
      "show"
    );


    clearTimeout(
      t._timer
    );


    t._timer =
      setTimeout(
        () =>
          t.classList.remove(
            "show"
          ),
        2600
      );

  }

})();


/* =========================================================
   CSV IMPORT
   ========================================================= */

(function initCsvImport() {

  const input =
    document.getElementById(
      "csvFileInput"
    );

  const mainBtn =
    document.getElementById(
      "mainCsvUploadBtn"
    );

  const nodeBtn =
    document.getElementById(
      "nodeCsvUploadBtn"
    );

  const dropzone =
    document.getElementById(
      "nodeCsvDropzone"
    );

  const status =
    document.getElementById(
      "csvFileStatus"
    );


  if (!input)
    return;


  function setStatus(
    file
  ) {

    if (!status)
      return;


    if (!file) {

      status.classList.remove(
        "has-file"
      );


      status.innerHTML =
        `
        <span class="status-dot"></span>

        <div>
          <b>NO FILE ATTACHED</b>

          <small>
            Select a CSV to preview its structure.
          </small>
        </div>
        `;


      return;

    }


    status.classList.add(
      "has-file"
    );


    status.innerHTML =
      `
      <span class="status-dot"></span>

      <div>

        <b>
          ${escapeHtml(
            file.name
          )}
        </b>

        <small>
          Reading CSV structure…
        </small>

      </div>
      `;


    const reader =
      new FileReader();


    reader.onload = () => {

      const text =
        String(
          reader.result || ""
        );


      const lines =
        text
          .split(/\r?\n/)
          .filter(
            line =>
              line.trim()
          );


      const first =
        lines[0] || "";


      const cols =
        parseCsvLine(
          first
        ).length;


      const rows =
        Math.max(
          0,
          lines.length - 1
        );


      status.innerHTML =
        `
        <span class="status-dot"></span>

        <div>

          <b>
            ${escapeHtml(
              file.name
            )}
          </b>

          <small>
            ${rows.toLocaleString()}
            data row${rows === 1 ? "" : "s"}
            ·
            ${cols}
            column${cols === 1 ? "" : "s"}
            ·
            ready for ingestion
          </small>

        </div>
        `;


      if (
        typeof showNetworkToast ===
        "function"
      ) {

        showNetworkToast(
          "CSV loaded locally — " +
          rows.toLocaleString() +
          " rows detected."
        );

      }

    };


    reader.onerror =
      () => {

        status.innerHTML =
          `
          <span class="status-dot"></span>

          <div>

            <b>
              CSV READ ERROR
            </b>

            <small>
              Check the file and try again.
            </small>

          </div>
          `;

      };


    reader.readAsText(
      file
    );

  }


  function escapeHtml(
    value
  ) {

    return String(
      value
    ).replace(
      /[&<>'"]/g,
      c =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;"
        })[c]
    );

  }


  function parseCsvLine(
    line
  ) {

    const out = [];

    let cur = "";

    let quote = false;


    for (
      let i = 0;
      i < line.length;
      i++
    ) {

      const ch =
        line[i];


      if (ch === '"') {

        if (
          quote &&
          line[i + 1] === '"'
        ) {

          cur += '"';

          i++;

        }

        else {

          quote =
            !quote;

        }

      }

      else if (
        ch === "," &&
        !quote
      ) {

        out.push(
          cur.trim()
        );

        cur = "";

      }

      else {

        cur += ch;

      }

    }


    out.push(
      cur.trim()
    );


    return out;

  }


  function choose() {

    input.value = "";

    input.click();

  }


  mainBtn?.addEventListener(
    "click",
    choose
  );


  nodeBtn?.addEventListener(
    "click",
    choose
  );


  input.addEventListener(
    "change",
    () => {

      const file =
        input.files?.[0];


      if (!file)
        return;


      if (
        !/\.csv$/i.test(
          file.name
        )
      ) {

        if (
          typeof showNetworkToast ===
          "function"
        ) {

          showNetworkToast(
            "Please choose a CSV file."
          );

        }


        input.value =
          "";

        return;

      }


      setStatus(
        file
      );

    }
  );


  [
    "dragenter",
    "dragover"
  ].forEach(
    type =>
      dropzone?.addEventListener(
        type,
        e => {

          e.preventDefault();

          dropzone.classList.add(
            "dragover"
          );

        }
      )
  );


  [
    "dragleave",
    "drop"
  ].forEach(
    type =>
      dropzone?.addEventListener(
        type,
        e => {

          e.preventDefault();

          dropzone.classList.remove(
            "dragover"
          );

        }
      )
  );


  dropzone?.addEventListener(
    "drop",
    e => {

      const file =
        e.dataTransfer
          ?.files?.[0];


      if (!file)
        return;


      if (
        !/\.csv$/i.test(
          file.name
        )
      ) {

        if (
          typeof showNetworkToast ===
          "function"
        ) {

          showNetworkToast(
            "Please drop a CSV file."
          );

        }

        return;

      }


      setStatus(
        file
      );

    }
  );

})();


/* =========================================================
   WORKSPACE TIMELINE — TEMPORAL GRAPH
   ========================================================= */

(function initWorkspaceTimeline() {

  const view =
    document.getElementById(
      "timelineView"
    );

  const stage =
    document.getElementById(
      "workspaceTimelineStage"
    );

  const scroll =
    document.getElementById(
      "timelineStageScroll"
    );

  const svg =
    document.getElementById(
      "timelineConnectionSvg"
    );


  const cards = [
    ...document.querySelectorAll(
      ".timeline-event-card"
    )
  ];


  const cursor =
    document.getElementById(
      "timelineSequenceCursor"
    );


  const replay =
    document.getElementById(
      "timelineReplayBtn"
    );


  const clear =
    document.getElementById(
      "timelineClearBtn"
    );


  const resetLayout =
    document.getElementById(
      "timelineResetLayoutBtn"
    );


  const status =
    document.getElementById(
      "workspaceTimelineStatus"
    );


  const seqLabel =
    document.getElementById(
      "timelineSequenceLabel"
    );


  const seqState =
    document.getElementById(
      "timelineSequenceState"
    );


  const footer =
    document.getElementById(
      "timelineFooterState"
    );


  const title =
    document.getElementById(
      "timelineInspectorTitle"
    );


  const body =
    document.getElementById(
      "timelineInspectorBody"
    );


  if (
    !view ||
    !stage ||
    !scroll ||
    !svg ||
    !cards.length
  ) {
    return;
  }


  const data = [

    {
      date: "12 MAR 1993",
      kind: "ORIGIN",
      title:
        "Coordinated blasts strike Mumbai",
      summary:
        "A series of explosions hit locations across the city.",
      meta:
        "257 fatalities · 713 injured",
      tags: [
        "MUMBAI",
        "ORIGIN"
      ]
    },

    {
      date: "12 MAR 1993",
      kind: "IMPACT",
      title:
        "Multiple targets, one sequence",
      summary:
        "Records describe coordinated explosions across major city locations.",
      meta:
        "CASE OPENED",
      tags: [
        "MUMBAI",
        "IMPACT"
      ]
    },

    {
      date: "19 APR 1993",
      kind: "CASE DEVELOPMENT",
      title:
        "First major arrest milestone",
      summary:
        "Sanjay Dutt was arrested in a related arms-possession case.",
      meta:
        "PERSON / ARREST",
      tags: [
        "PERSON",
        "ARREST"
      ]
    },

    {
      date: "04 NOV 1993",
      kind: "EVIDENCE",
      title:
        "Primary charge sheet filed",
      summary:
        "The primary charge sheet was filed against 189 accused.",
      meta:
        "189 ACCUSED",
      tags: [
        "DOCUMENT",
        "EVIDENCE"
      ]
    },

    {
      date: "19 NOV 1993",
      kind: "INVESTIGATION",
      title:
        "Case moves to the CBI",
      summary:
        "The investigation was formally handed to the Central Bureau of Investigation.",
      meta:
        "CENTRAL BUREAU OF INVESTIGATION",
      tags: [
        "CBI",
        "INVESTIGATION"
      ]
    },

    {
      date: "11 NOV 2005",
      kind: "EXTRADITION",
      title:
        "Abu Salem extradited to India",
      summary:
        "After detention in Lisbon, he was extradited to India.",
      meta:
        "2005",
      tags: [
        "PERSON",
        "EXTRADITION"
      ]
    },

    {
      date: "12 SEP 2006",
      kind: "JUDGMENT",
      title:
        "TADA court begins judgment",
      summary:
        "The court began delivering its judgment, with convictions and acquittals announced in stages.",
      meta:
        "2006",
      tags: [
        "COURT",
        "JUDGMENT"
      ]
    },

    {
      date: "30 JUL 2015",
      kind: "FINAL MILESTONE",
      title:
        "Yakub Memon execution",
      summary:
        "Yakub Memon was executed in Nagpur after his final plea was rejected.",
      meta:
        "CASE MILESTONE",
      tags: [
        "COURT",
        "CLOSED"
      ]
    }

  ];


  let visible = 0;

  let timer = null;

  let paths = [];

  let drag = null;

  let suppressClick =
    false;

  let sequenceRunning =
    false;

  let sequenceComplete =
    false;


  function esc(v) {

    return String(
      v
    ).replace(
      /[&<>\"']/g,
      c =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;"
        })[c]
    );

  }


  function setInspector(
    index
  ) {

    const d =
      data[index - 1];


    if (!d)
      return;


    if (title) {

      title.textContent =
        d.title;

    }


    if (body) {

      body.innerHTML =
        `
        <div class="timeline-inspector-kicker">

          <i></i>

          <span>
            EVENT
            ${String(index).padStart(2, "0")}
            /
            ${esc(d.kind)}
          </span>

        </div>

        <div class="timeline-inspector-date">
          ${esc(d.date)}
        </div>

        <div class="timeline-inspector-section">

          <span>
            EVENT
          </span>

          <h3>
            ${esc(d.title)}
          </h3>

          <p>
            ${esc(d.summary)}
          </p>

        </div>

        <div class="timeline-inspector-section">

          <span>
            CLASSIFICATION
          </span>

          <div class="timeline-inspector-tags">

            ${d.tags
              .map(
                t =>
                  `<b>${esc(t)}</b>`
              )
              .join("")}

          </div>

        </div>

        <div class="timeline-inspector-section">

          <span>
            CASE SIGNAL
          </span>

          <strong>
            ${esc(d.meta)}
          </strong>

        </div>
        `;

    }


    cards.forEach(
      c =>
        c.classList.toggle(
          "selected",
          Number(
            c.dataset.event
          ) === index
        )
    );

  }


  function setProgress(
    n,
    state
  ) {

    visible = n;


    if (seqLabel) {

      seqLabel.textContent =
        String(n).padStart(
          2,
          "0"
        ) +
        " / 08";

    }


    if (seqState) {

      seqState.textContent =
        state;

    }


    if (status) {

      status.textContent =
        state ===
        "TRACE COMPLETE"

          ? "TRACE COMPLETE"

          : state ===
              "AWAITING TRACE"

            ? "TRACE READY"

            : "TRACE RUNNING";

    }


    if (footer) {

      footer.textContent =
        state ===
        "TRACE COMPLETE"

          ? "TRACE COMPLETE"

          : state ===
              "AWAITING TRACE"

            ? "TRACE READY"

            : "EVENT " +
              String(
                Math.max(
                  1,
                  n
                )
              ).padStart(
                2,
                "0"
              ) +
              " / 08";

    }

  }


  function placeDefaults() {

    const w =
      stage.clientWidth;

    const h =
      stage.clientHeight;


    const insetX =
      w * 0.07;

    const insetY =
      h * 0.11;

    const insetBottom =
      h * 0.12;

    const gap = 18;


    const gridW =
      w -
      insetX * 2;


    const gridH =
      h -
      insetY -
      insetBottom;


    const cellW =
      (
        gridW -
        gap * 3
      ) / 4;


    const cellH =
      (
        gridH -
        gap * 3
      ) / 4;


    cards.forEach(
      (card, i) => {

        const row =
          Math.floor(
            i / 4
          );


        const col =
          row === 0
            ? i
            : 3 -
              (i - 4);


        const cx =
          insetX +
          col *
            (
              cellW +
              gap
            ) +
          cellW / 2;


        const cy =
          insetY +
          row *
            (
              cellH +
              gap
            ) +
          cellH / 2;


        const x =
          Math.round(
            cx -
            card.offsetWidth /
              2
          );


        const y =
          Math.round(
            cy -
            card.offsetHeight /
              2
          );


        card.style.setProperty(
          "left",
          Math.max(
            8,
            Math.min(
              w -
                card.offsetWidth -
                8,
              x
            )
          ) +
            "px",
          "important"
        );


        card.style.setProperty(
          "top",
          Math.max(
            32,
            Math.min(
              h -
                card.offsetHeight -
                18,
              y
            )
          ) +
            "px",
          "important"
        );


        card.style.right =
          "auto";

        card.style.bottom =
          "auto";


        card.style.setProperty(
          "--snake-row",
          row
        );


        card.style.setProperty(
          "--snake-col",
          col
        );

      }
    );

  }


  function cursorPoint(
    index
  ) {

    const card =
      cards[index - 1];


    if (!card || !cursor)
      return null;


    const sr =
      stage.getBoundingClientRect();


    const r =
      card.getBoundingClientRect();


    return {

      x:
        r.left -
        sr.left +
        r.width / 2,

      y:
        r.top -
        sr.top +
        r.height / 2

    };

  }


  function moveSequenceCursor(
    index,
    instant = false
  ) {

    if (!cursor)
      return;


    const pt =
      cursorPoint(
        index
      );


    if (!pt)
      return;


    const prev =
      cursor._point;


    let angle = 0;


    if (prev) {

      angle =
        Math.atan2(
          pt.y -
            prev.y,
          pt.x -
            prev.x
        ) *
        180 /
        Math.PI;

    }


    cursor.style.setProperty(
      "--cursor-x",
      pt.x + "px"
    );


    cursor.style.setProperty(
      "--cursor-y",
      pt.y + "px"
    );


    cursor.style.setProperty(
      "--cursor-angle",
      angle + "deg"
    );


    cursor.classList.toggle(
      "instant",
      !!instant
    );


    cursor.classList.add(
      "active"
    );


    cursor._point =
      pt;

  }


  function hideSequenceCursor() {

    cursor?.classList.remove(
      "active"
    );

  }


  function drawPaths() {

    const W =
      stage.clientWidth;

    const H =
      stage.clientHeight;


    svg.setAttribute(
      "viewBox",
      `0 0 ${W} ${H}`
    );


    svg.setAttribute(
      "width",
      W
    );


    svg.setAttribute(
      "height",
      H
    );


    svg.innerHTML =
      "";

    paths = [];


    for (
      let i = 0;
      i <
      cards.length - 1;
      i++
    ) {

      const a =
        cursorPoint(
          i + 1
        );

      const b =
        cursorPoint(
          i + 2
        );


      if (!a || !b)
        continue;


      const path =
        document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );


      const dx =
        b.x -
        a.x;

      const dy =
        b.y -
        a.y;


      let d;


      if (i === 3) {

        const midY =
          (
            a.y +
            b.y
          ) / 2;


        d =
          `M ${a.x} ${a.y} Q ${a.x} ${midY} ${a.x} ${midY} L ${b.x} ${b.y}`;

      }

      else {

        const bend =
          Math.min(
            24,
            Math.max(
              10,
              Math.abs(
                dx
              ) *
                0.055
            )
          );


        const qx =
          (
            a.x +
            b.x
          ) / 2;


        const qy =
          (
            a.y +
            b.y
          ) / 2 +
          (
            Math.abs(dy) >
            Math.abs(dx)
              ? 0
              : i < 3
                ? bend
                : -bend
          );


        d =
          `M ${a.x} ${a.y} Q ${qx} ${qy} ${b.x} ${b.y}`;

      }


      path.setAttribute(
        "d",
        d
      );


      path.classList.add(
        "timeline-connector"
      );


      path.dataset.event =
        String(
          i + 1
        );


      svg.appendChild(
        path
      );


      const length =
        path.getTotalLength();


      path.style.strokeDasharray =
        length;

      path.style.strokeDashoffset =
        length;


      paths.push(
        path
      );

    }


    paths.forEach(
      (p, i) => {

        if (
          i <
          Math.max(
            0,
            visible - 1
          )
        ) {

          p.classList.add(
            "drawn"
          );

        }

      }
    );


    if (visible > 0) {

      moveSequenceCursor(
        visible,
        true
      );

    }

  }


  function revealAllFront() {

    clearTimeout(
      timer
    );


    sequenceRunning =
      false;

    sequenceComplete =
      false;

    visible =
      0;


    cards.forEach(
      c => {

        c.classList.add(
          "revealed"
        );

        c.classList.remove(
          "selected",
          "flipping",
          "flipped",
          "dragging",
          "moving"
        );


        c.style.transition =
          "";

      }
    );


    placeDefaults();

    drawPaths();

    setProgress(
      0,
      "TRACE READY"
    );


    if (cursor) {

      cursor.classList.remove(
        "active"
      );

      cursor.classList.add(
        "instant"
      );

      cursor._point =
        null;

    }

  }


  function revealNext() {

    if (
      !sequenceRunning ||
      visible >=
        cards.length
    ) {

      if (
        visible >=
        cards.length
      ) {

        sequenceRunning =
          false;

        sequenceComplete =
          true;

        setProgress(
          8,
          "TRACE COMPLETE"
        );


        setTimeout(
          hideSequenceCursor,
          900
        );

      }


      return;

    }


    const next =
      visible + 1;


    moveSequenceCursor(
      next,
      false
    );


    visible =
      next;


    const card =
      cards[
        visible - 1
      ];


    const path =
      paths[
        visible - 2
      ];


    card.classList.add(
      "flipping",
      "flipped",
      "selected"
    );


    path?.classList.add(
      "drawn"
    );


    setInspector(
      visible
    );


    setProgress(
      visible,
      visible ===
        cards.length
        ? "TRACE COMPLETE"
        : "TRACE RUNNING"
    );


    setTimeout(
      () =>
        card.classList.remove(
          "flipping"
        ),
      900
    );


    if (
      visible <
      cards.length
    ) {

      timer =
        setTimeout(
          revealNext,
          980
        );

    }

    else {

      setTimeout(
        () => {

          sequenceRunning =
            false;

          sequenceComplete =
            true;

          hideSequenceCursor();

        },
        1050
      );

    }

  }


  function startTrace() {

    clearTimeout(
      timer
    );


    sequenceRunning =
      true;

    sequenceComplete =
      false;

    visible =
      0;


    cards.forEach(
      c => {

        c.classList.add(
          "revealed"
        );

        c.classList.remove(
          "selected",
          "flipped",
          "flipping",
          "dragging",
          "moving"
        );


        c.style.transition =
          "";

      }
    );


    placeDefaults();

    drawPaths();


    setProgress(
      0,
      "TRACE RUNNING"
    );


    if (cursor) {

      cursor.classList.add(
        "instant"
      );

      cursor._point =
        null;

    }


    setTimeout(
      () => {

        moveSequenceCursor(
          1,
          true
        );


        setTimeout(
          revealNext,
          420
        );

      },
      260
    );

  }


  function clearTrace() {

    revealAllFront();


    if (title) {

      title.textContent =
        "No event selected";

    }


    if (body) {

      body.innerHTML =
        `
        <div class="timeline-inspector-empty">

          <span>◎</span>

          <b>
            SELECT A TRACE NODE
          </b>

          <p>
            Choose an event from the sequence to inspect its date, classification and investigative context.
          </p>

        </div>
        `;

    }

  }


  function replayTrace() {

    revealAllFront();

    setTimeout(
      startTrace,
      480
    );

  }


  function pointFromEvent(e) {

    if (
      e.touches &&
      e.touches[0]
    ) {

      return {

        x:
          e.touches[0]
            .clientX,

        y:
          e.touches[0]
            .clientY

      };

    }


    return {

      x:
        e.clientX,

      y:
        e.clientY

    };

  }


  function beginDrag(
    card,
    e
  ) {

    if (
      !sequenceComplete ||
      !card.classList.contains(
        "revealed"
      ) ||
      drag
    ) {
      return;
    }


    if (
      e.type ===
        "mousedown" &&
      e.button !== 0
    ) {
      return;
    }


    const pt =
      pointFromEvent(
        e
      );


    const sr =
      stage.getBoundingClientRect();


    const r =
      card.getBoundingClientRect();


    drag = {

      card,

      startX:
        pt.x,

      startY:
        pt.y,

      startLeft:
        r.left -
        sr.left,

      startTop:
        r.top -
        sr.top,

      offsetX:
        pt.x -
        r.left,

      offsetY:
        pt.y -
        r.top,

      moved:
        false

    };


    card.classList.add(
      "dragging"
    );


    card.style.transition =
      "none";


    suppressClick =
      false;


    e.preventDefault();

    e.stopPropagation();

  }


  function moveDrag(e) {

    if (!drag)
      return;


    const pt =
      pointFromEvent(
        e
      );


    const sr =
      stage.getBoundingClientRect();


    const card =
      drag.card;


    const nx =
      pt.x -
      sr.left -
      drag.offsetX;


    const ny =
      pt.y -
      sr.top -
      drag.offsetY;


    if (
      Math.hypot(
        pt.x -
          drag.startX,
        pt.y -
          drag.startY
      ) >
      4
    ) {

      drag.moved =
        true;

      suppressClick =
        true;

    }


    const maxX =
      stage.clientWidth -
      card.offsetWidth -
      10;


    const maxY =
      stage.clientHeight -
      card.offsetHeight -
      24;


    card.style.setProperty(
      "left",
      Math.max(
        10,
        Math.min(
          maxX,
          nx
        )
      ) +
        "px",
      "important"
    );


    card.style.setProperty(
      "top",
      Math.max(
        30,
        Math.min(
          maxY,
          ny
        )
      ) +
        "px",
      "important"
    );


    drawPaths();

    e.preventDefault();

  }


  function endDrag() {

    if (!drag)
      return;


    const card =
      drag.card;


    const moved =
      drag.moved;


    card.classList.remove(
      "dragging"
    );


    card.classList.add(
      "moving"
    );


    card.style.transition =
      "";


    setTimeout(
      () =>
        card.classList.remove(
          "moving"
        ),
      420
    );


    if (moved) {

      setInspector(
        Number(
          card.dataset.event
        )
      );

    }


    drag =
      null;


    drawPaths();


    if (moved) {

      setTimeout(
        () => {
          suppressClick =
            false;
        },
        40
      );

    }

  }


  cards.forEach(
    card => {

      card.addEventListener(
        "mousedown",
        e =>
          beginDrag(
            card,
            e
          )
      );


      card.addEventListener(
        "touchstart",
        e =>
          beginDrag(
            card,
            e
          ),
        {
          passive: false
        }
      );


      card.addEventListener(
        "click",
        e => {

          if (
            suppressClick ||
            sequenceRunning
          ) {

            e.preventDefault();

            e.stopPropagation();

            return;

          }


          const n =
            Number(
              card.dataset.event
            );


          card.classList.toggle(
            "flipped"
          );


          setInspector(
            n
          );


          moveSequenceCursor(
            n,
            false
          );

        }
      );

    }
  );


  document.addEventListener(
    "mousemove",
    moveDrag,
    {
      passive: false
    }
  );


  document.addEventListener(
    "mouseup",
    endDrag,
    {
      passive: false
    }
  );


  document.addEventListener(
    "touchmove",
    moveDrag,
    {
      passive: false
    }
  );


  document.addEventListener(
    "touchend",
    endDrag,
    {
      passive: false
    }
  );


  document.addEventListener(
    "touchcancel",
    endDrag,
    {
      passive: false
    }
  );


  replay?.addEventListener(
    "click",
    replayTrace
  );


  clear?.addEventListener(
    "click",
    clearTrace
  );


  resetLayout?.addEventListener(
    "click",
    () => {

      revealAllFront();


      if (
        typeof showNetworkToast ===
        "function"
      ) {

        showNetworkToast(
          "Timeline cards returned to the fixed 4 × 4 snake pattern."
        );

      }

    }
  );


  window.addEventListener(
    "resize",
    () => {

      placeDefaults();

      drawPaths();

    },
    {
      passive: true
    }
  );


  const observer =
    new MutationObserver(
      () => {

        if (
          view.classList.contains(
            "active-view"
          )
        ) {

          requestAnimationFrame(
            () => {

              placeDefaults();

              drawPaths();


              if (
                !sequenceRunning &&
                !sequenceComplete
              ) {

                replayTrace();

              }

            }
          );

        }

      }
    );


  observer.observe(
    view,
    {
      attributes: true,
      attributeFilter: [
        "class"
      ]
    }
  );


  requestAnimationFrame(
    () => {

      revealAllFront();

      setProgress(
        0,
        "TRACE READY"
      );

    }
  );

})();


/* =========================================================
   GIS WORKSPACE
   ========================================================= */

(function initGISWorkspace() {

  const gisView =
    document.getElementById(
      "gisView"
    );

  const casesView =
    document.getElementById(
      "casesView"
    );

  const networkView =
    document.getElementById(
      "networkView"
    );

  const timelineView =
    document.getElementById(
      "timelineView"
    );

  const evidenceView =
    document.getElementById(
      "evidenceView"
    );

  const gisMap =
    document.getElementById(
      "gisMapPlaceholder"
    );

  const lockBtn =
    document.getElementById(
      "gisLockButton"
    );

  const lockText =
    document.getElementById(
      "gisLockText"
    );

  const search =
    document.getElementById(
      "gisSearchInput"
    );

  const coords =
    document.getElementById(
      "gisCoordinates"
    );

  const title =
    document.getElementById(
      "gisInfoTitle"
    );

  const body =
    document.getElementById(
      "gisInspectorBody"
    );

  const waypoint =
    document.getElementById(
      "gisAddWaypoint"
    );

  const focusSearch =
    document.getElementById(
      "gisSearchFocusBtn"
    );


  if (!gisView)
    return;


  let unlocked =
    false;


  const escapeHtml =
    v =>
      String(
        v ?? ""
      ).replace(
        /[&<>'"]/g,
        c =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;"
          })[c]
      );


  function toast(
    msg
  ) {

    if (
      typeof showNetworkToast ===
      "function"
    ) {

      showNetworkToast(
        msg
      );

      return;

    }


    let t =
      document.getElementById(
        "networkToast"
      );


    if (!t) {

      t =
        document.createElement(
          "div"
        );

      t.id =
        "networkToast";

      t.className =
        "network-toast";

      document.body.appendChild(
        t
      );

    }


    t.textContent =
      msg;


    t.classList.add(
      "show"
    );


    clearTimeout(
      t._timer
    );


    t._timer =
      setTimeout(
        () =>
          t.classList.remove(
            "show"
          ),
        2500
      );

  }


  /* =========================================================
     SINGLE WORKSPACE NAVIGATION CONTROLLER
     ========================================================= */

  const workspaceViewHistory = [];
  let currentWorkspaceView = "cases";
  const workspaceBack = document.getElementById("workspaceBack");

  function applyWorkspaceView(view) {
    const views = { cases: casesView, network: networkView, gis: gisView, timeline: timelineView, evidence: evidenceView };

    Object.entries(views).forEach(([name, el]) => {
      el?.classList.toggle("active-view", name === view);
    });

    document.querySelectorAll(".workspace-sidebar .side-item[data-view]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.view === view);
    });

    const active = views[view];
    if (active) active.scrollTop = 0;

    workspaceBack?.classList.toggle("disabled", workspaceViewHistory.length === 0);
    workspaceBack?.setAttribute("aria-disabled", workspaceViewHistory.length === 0 ? "true" : "false");
  }

  function switchWorkspaceView(view, fromBack = false) {
    const allowed = ["cases", "network", "gis", "timeline", "evidence"];
    if (!allowed.includes(view)) return;

    if (!fromBack && currentWorkspaceView !== view) {
      workspaceViewHistory.push(currentWorkspaceView);
      if (workspaceViewHistory.length > 20) workspaceViewHistory.shift();
    }

    currentWorkspaceView = view;
    applyWorkspaceView(view);
  }

  window.cipherSwitchWorkspaceView = switchWorkspaceView;

  document.querySelectorAll(".workspace-sidebar .side-item[data-view]").forEach(btn => {
    btn.addEventListener("click", () => switchWorkspaceView(btn.dataset.view));
  });

  workspaceBack?.addEventListener("click", () => {
    if (!workspaceViewHistory.length) return;
    const previous = workspaceViewHistory.pop();
    currentWorkspaceView = previous;
    applyWorkspaceView(previous);
  });

  applyWorkspaceView(currentWorkspaceView);

  lockBtn?.addEventListener(
    "click",
    () => {

      unlocked =
        !unlocked;


      gisMap?.classList.toggle(
        "unlocked",
        unlocked
      );


      gisMap?.classList.toggle(
        "locked",
        !unlocked
      );


      if (lockText) {

        lockText.textContent =
          unlocked
            ? "LOCK MAP"
            : "UNLOCK MAP";

      }


      const small =
        lockBtn?.querySelector(
          "small"
        );


      if (small) {

        small.textContent =
          unlocked
            ? "Map interaction enabled"
            : "Map interaction locked";

      }


      toast(
        unlocked
          ? "GIS map unlocked — integration layer can now receive interaction."
          : "GIS map locked."
      );

    }
  );


  waypoint?.addEventListener(
    "click",
    () => {

      if (!unlocked) {

        toast(
          "Unlock the GIS map before placing a waypoint."
        );

        return;

      }


      toast(
        "Waypoint mode active — click the map to place a location."
      );


      gisMap?.classList.add(
        "waypoint-mode"
      );


      setTimeout(
        () =>
          gisMap?.classList.remove(
            "waypoint-mode"
          ),
        1800
      );

    }
  );


  focusSearch?.addEventListener(
    "click",
    () =>
      search?.focus()
  );


  document.addEventListener(
    "keydown",
    e => {

      if (
        (
          e.metaKey ||
          e.ctrlKey
        ) &&
        e.key.toLowerCase() ===
          "k"
      ) {

        e.preventDefault();

        search?.focus();

      }

    }
  );


  function renderSelected(
    data
  ) {

    const d =
      data || {};


    const name =
      d.name ||
      d.title ||
      d.label ||
      "Selected map node";


    const type =
      d.type ||
      "LOCATION";


    const latitude =
      d.latitude ??
      d.lat ??
      "—";


    const longitude =
      d.longitude ??
      d.lng ??
      d.lon ??
      "—";


    const coordinate =
      (
        latitude !== "—" &&
        longitude !== "—"
      )
        ? `${latitude} · ${longitude}`
        : "— · —";


    if (title) {

      title.textContent =
        name;

    }


    if (coords) {

      coords.textContent =
        coordinate;

    }


    if (body) {

      body.innerHTML =
        `
        <div class="gis-selected-state selected">


          <div>

            <b>
              MAP NODE SELECTED
            </b>

            <p>
              ${escapeHtml(
                d.summary ||
                "Location data received from the integrated GIS layer."
              )}
            </p>

          </div>

        </div>

        <div class="gis-info-section">

          <div class="gis-info-title">

            <span>
              LOCATION
            </span>

            <small>
              ACTIVE
            </small>

          </div>

          <div class="gis-info-row">

            <span>
              NAME
            </span>

            <b class="gis-searchable">
              ${escapeHtml(name)}
            </b>

          </div>

          <div class="gis-info-row">

            <span>
              TYPE
            </span>

            <b class="gis-searchable">
              ${escapeHtml(type)}
            </b>

          </div>

          <div class="gis-info-row">

            <span>
              COORDINATES
            </span>

            <b class="gis-searchable">
              ${escapeHtml(coordinate)}
            </b>

          </div>

        </div>

        <div class="gis-info-section">

          <div class="gis-info-title">

            <span>
              CASE CONTEXT
            </span>

            <small>
              ${
                d.caseId
                  ? escapeHtml(
                      d.caseId
                    )
                  : "—"
              }
            </small>

          </div>

          <div class="gis-info-placeholder gis-searchable">

            ${escapeHtml(
              d.context ||
              "Node-linked investigative information will appear here."
            )}

          </div>

        </div>

        <div class="gis-info-section">

          <div class="gis-info-title">

            <span>
              SOURCES
            </span>

            <small>
              ${
                Array.isArray(
                  d.sources
                )
                  ? d.sources.length
                  : 0
              }
            </small>

          </div>

          <div class="gis-info-placeholder">

            ${
              Array.isArray(
                d.sources
              ) &&
              d.sources.length
                ? d.sources
                    .map(
                      escapeHtml
                    )
                    .join(" · ")
                : "Location-linked records will appear here."
            }

          </div>

        </div>
        `;


      highlightSearch();

    }

  }


  function highlightSearch() {

    const q =
      (
        search?.value ||
        ""
      ).trim();


    document
      .querySelectorAll(
        "#gisInspector .gis-searchable"
      )
      .forEach(
        el => {

          el.classList.remove(
            "gis-search-hit"
          );


          if (
            q &&
            el.textContent
              .toLowerCase()
              .includes(
                q.toLowerCase()
              )
          ) {

            el.classList.add(
              "gis-search-hit"
            );

          }

        }
      );

  }


  search?.addEventListener(
    "input",
    () =>
      highlightSearch()
  );


  search?.addEventListener(
    "keydown",
    e => {

      if (
        e.key ===
          "Enter" &&
        search.value.trim()
      ) {

        toast(
          `GIS search ready — highlighting “${search.value.trim()}” in the inspector.`
        );


        highlightSearch();

      }

    }
  );


  window.cipherSelectGISNode =
    function (
      nodeData
    ) {

      renderSelected(
        nodeData
      );

    };


  window.addEventListener(
    "cipher:gis-node-select",
    e =>
      renderSelected(
        e.detail
      )
  );

})();


/* =========================================================
   CASE REPORT / CHART SHEET
   ========================================================= */

(function initCaseReport() {

  const view =
    document.getElementById(
      "evidenceView"
    );


  if (!view)
    return;


  const printBtn =
    document.getElementById(
      "reportPrintPdf"
    );


  const saveState =
    document.getElementById(
      "reportSaveState"
    );


  const generated =
    document.getElementById(
      "reportGeneratedAt"
    );


  const title =
    document.getElementById(
      "reportTitle"
    );


  const subtitle =
    document.getElementById(
      "reportSubtitle"
    );


  const status =
    document.getElementById(
      "reportCaseStatus"
    );


  const summaryBtn =
    document.getElementById(
      "reportCaseSummaryBtn"
    );


  const toast =
    window.showNetworkToast;


  let reportTimer = 0;


  const fields =
    () =>
      [
        ...view.querySelectorAll(
          "[data-report-field]"
        )
      ];


  const getField =
    name =>
      view.querySelector(
        `[data-report-field="${name}"]`
      )?.value?.trim() ||
      "";


  const setDraftState =
    (
      label = "LOCAL DRAFT"
    ) => {

      if (saveState) {

        saveState.textContent =
          label;

      }


      clearTimeout(
        reportTimer
      );


      reportTimer =
        setTimeout(
          () => {

            if (saveState) {

              saveState.textContent =
                "AUTO-SAVED LOCALLY";

            }

          },
          700
        );

    };


  function syncHeader() {

    if (title) {

      title.textContent =
        getField(
          "caseId"
        ).includes(
          "BBC-1"
        )

          ? "1993 Bombay Serial Blasts"

          : (
              getField(
                "caseType"
              ) ||
              "Cipher Investigation Case"
            );

    }


    if (subtitle) {

      subtitle.textContent =
        `${
          getField(
            "caseType"
          ) ||
          "Investigation"
        } · ${
          getField(
            "incidentDate"
          ) ||
          "Date not entered"
        } · ${
          getField(
            "location"
          ) ||
          "Location not entered"
        }`;

    }


    if (status) {

      status.textContent =
        `CASE / ${
          getField(
            "caseId"
          ) ||
          "DRAFT"
        }`;

    }


    setDraftState();

  }


  fields().forEach(
    el =>
      el.addEventListener(
        "input",
        syncHeader
      )
  );


  function addEvidence() {

    const list =
      document.getElementById(
        "reportEvidenceList"
      );


    if (!list)
      return;


    const row =
      document.createElement(
        "div"
      );


    row.className =
      "evidence-row";


    row.innerHTML =
      `
      <span class="evidence-icon">
        NEW
      </span>

      <div>

        <b contenteditable="true">
          New evidence item
        </b>

        <small contenteditable="true">
          Enter source, date, authority and verification status.
        </small>

      </div>

      <em>
        USER INPUT
      </em>
      `;


    list.appendChild(
      row
    );


    row
      .querySelector(
        "b"
      )
      ?.focus();


    setDraftState(
      "EVIDENCE ADDED"
    );

  }


  document
    .getElementById(
      "reportAddEvidence"
    )
    ?.addEventListener(
      "click",
      addEvidence
    );


  document
    .getElementById(
      "reportAddEvidenceInline"
    )
    ?.addEventListener(
      "click",
      addEvidence
    );


  summaryBtn?.addEventListener(
    "click",
    () => {

      if (
        typeof toast ===
        "function"
      ) {

        toast(
          "Case Summary is reserved for the next report module. The case sheet is ready for its data."
        );

      }

    }
  );


  function printPdf() {

    const old =
      document.title;


    document.title =
      `Cipher Case Report — ${
        getField(
          "caseId"
        ) ||
        "Draft"
      }`;


    if (generated) {

      generated.textContent =
        `GENERATED ${new Date().toLocaleString()}`;

    }


    setDraftState(
      "PREPARING PDF"
    );


    setTimeout(
      () => {

        window.print();

        document.title =
          old;

      },
      120
    );

  }


  printBtn?.addEventListener(
    "click",
    printPdf
  );


  if (generated) {

    generated.textContent =
      "LOCAL DRAFT";

  }


  syncHeader();

})();

// Frontend-only authentication: no backend required.
window.cipherLocalLogout = function () {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/* =========================================================
   CIPHER CASE HUB / MULTI-CASE WORKSPACE
   Global case browser + persistent active-case context.
   The local adapter can later be replaced by the backend team's
   /cases and /cases/{id} responses without changing the UI flow.
   ========================================================= */
(() => {
  const CASE_KEY = "cipher_active_case";
  const CASE_STORE = "cipher_local_cases";
  const PAGE_SIZE = 8;

  const seedCases = [
    {id:"demo-014",case_number:"014",title:"Operation Sandstorm",description:"Cross-border movement and financial links.",status:"ACTIVE",priority:"MEDIUM",investigator:"Team Alpha",entities:62,links:104,evidence:31,locations:12,created_at:"2026-09-11T12:30:00Z",updated_at:"2026-09-12T14:12:00Z"},
    {id:"demo-021",case_number:"021",title:"Project Helix",description:"Corporate ownership and proxy entities.",status:"REVIEW",priority:"LOW",investigator:"Investigator B",entities:31,links:58,evidence:19,locations:6,created_at:"2026-09-09T09:15:00Z",updated_at:"2026-09-12T11:40:00Z"},
    {id:"demo-042",case_number:"042",title:"Blackbird Network",description:"A connected network spanning people, organizations, locations and financial evidence.",status:"ACTIVE",priority:"HIGH",investigator:"Investigator",entities:148,links:392,evidence:67,locations:18,created_at:"2026-08-28T08:00:00Z",updated_at:"2026-09-12T16:20:00Z"},
    {id:"demo-009",case_number:"009",title:"Silent Harbour",description:"Logistics network reconstruction across multiple locations.",status:"CLOSED",priority:"LOW",investigator:"Team Delta",entities:19,links:41,evidence:24,locations:9,created_at:"2026-08-18T10:00:00Z",updated_at:"2026-09-08T17:20:00Z"},
    {id:"demo-033",case_number:"033",title:"Project Dawn",description:"Evidence-led entity resolution and identity matching.",status:"ACTIVE",priority:"MEDIUM",investigator:"Team Alpha",entities:47,links:83,evidence:28,locations:11,created_at:"2026-08-30T10:30:00Z",updated_at:"2026-09-10T13:05:00Z"},
    {id:"demo-057",case_number:"057",title:"Northern Route",description:"Movement pattern analysis around transport corridors.",status:"REVIEW",priority:"HIGH",investigator:"Investigator C",entities:86,links:173,evidence:44,locations:23,created_at:"2026-09-01T07:20:00Z",updated_at:"2026-09-12T09:42:00Z"},
    {id:"demo-061",case_number:"061",title:"Copper Thread",description:"Financial transfers and intermediary account relationships.",status:"ACTIVE",priority:"CRITICAL",investigator:"Financial Cell",entities:103,links:226,evidence:52,locations:14,created_at:"2026-09-03T11:00:00Z",updated_at:"2026-09-12T15:18:00Z"},
    {id:"demo-074",case_number:"074",title:"Grey Meridian",description:"Communications analysis linked to recurring location events.",status:"ACTIVE",priority:"HIGH",investigator:"Team Bravo",entities:72,links:141,evidence:39,locations:17,created_at:"2026-09-05T13:30:00Z",updated_at:"2026-09-11T18:12:00Z"},
    {id:"demo-081",case_number:"081",title:"Paper Lantern",description:"Document provenance and source-record correlation.",status:"REVIEW",priority:"MEDIUM",investigator:"Records Cell",entities:28,links:46,evidence:61,locations:4,created_at:"2026-09-06T09:10:00Z",updated_at:"2026-09-11T10:22:00Z"},
    {id:"demo-096",case_number:"096",title:"Red Quarry",description:"Vehicle, phone and location overlap investigation.",status:"ACTIVE",priority:"HIGH",investigator:"Team Delta",entities:91,links:188,evidence:36,locations:29,created_at:"2026-09-07T15:00:00Z",updated_at:"2026-09-12T12:02:00Z"}
  ];

  const esc = value => String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  const norm = value => String(value || "").trim().toUpperCase();
  const priorityClass = p => ["HIGH","CRITICAL"].includes(norm(p)) ? "case-risk-high" : "";
  const statusLabel = s => norm(s) === "REVIEW" ? "UNDER REVIEW" : (norm(s) || "OPEN");

  function getCasesLocal() {
    try { return JSON.parse(localStorage.getItem(CASE_STORE) || "[]"); } catch { return []; }
  }

  function ensureDemoCases() {
    const current = getCasesLocal();
    if (!current.length) localStorage.setItem(CASE_STORE, JSON.stringify(seedCases));
    return getCasesLocal();
  }

  function getActiveCase() {
    try {
      const saved = JSON.parse(localStorage.getItem(CASE_KEY) || "null");
      return saved || seedCases[2];
    } catch { return seedCases[2]; }
  }

  function updateCaseContext(c, announce = false) {
    if (!c) return;
    localStorage.setItem(CASE_KEY, JSON.stringify(c));
    window.cipherActiveCase = c;

    const number = document.getElementById("workspaceCaseNumber");
    const title = document.getElementById("workspaceCaseTitle");
    const header = document.querySelector(".workspace-case");
    if (number) number.textContent = c.case_number || "—";
    if (title) title.textContent = `${c.title || "Untitled Case"} · ${statusLabel(c.status)}`;
    header?.setAttribute("aria-label", `Active case ${c.case_number || ""} ${c.title || ""}. Click to switch case.`);

    const dashboardTitle = document.getElementById("dashboardCaseTitle");
    if (dashboardTitle) dashboardTitle.innerHTML = `${esc((c.title || "Untitled Case").split(" ").slice(0,-1).join(" ") || c.title)} <em>${esc((c.title || "").split(" ").slice(-1).join(" "))}</em>`;
    const map = {
      dashboardEntities:c.entities ?? "—", dashboardLinks:c.links ?? "—", dashboardEvidence:c.evidence ?? "—", dashboardLocations:c.locations ?? "—",
      dashboardRisk: priorityLabelForDash(c.priority),
    };
    Object.entries(map).forEach(([id,val]) => { const el=document.getElementById(id); if(el) el.textContent=val; });
    const risk = document.getElementById("dashboardRisk");
    if (risk) risk.className = norm(c.priority)==="CRITICAL" ? "risk-critical" : norm(c.priority)==="HIGH" ? "risk-high" : "";

    const netB = document.querySelector(".network-head-status b");
    if (netB) netB.textContent = `CASE / ${c.case_number || "—"}`;
    const netTop = document.querySelector(".network-canvas-top span:last-child");
    if (netTop) netTop.textContent = `${c.case_number || "—"} · ${c.entities ?? 0} ENTITIES · ${c.links ?? 0} LINKS`;
    const timelineB = document.querySelector(".timeline-screen-status b");
    if (timelineB) timelineB.textContent = `CASE / ${c.case_number || "—"}`;

    const sideBottom = document.querySelector(".side-bottom");
    if (sideBottom) sideBottom.innerHTML = `<span>${esc(c.entities ?? 0)} ENTITIES</span><span>${esc(c.links ?? 0)} LINKS</span><span>${esc(c.evidence ?? 0)} EVIDENCE</span>`;

    document.querySelectorAll("[data-case-context-title]").forEach(el => el.textContent = c.title || "Untitled Case");
    if (announce && typeof window.toast === "function") window.toast(`Switched to Case ${c.case_number}: ${c.title}.`);
  }

  function priorityLabelForDash(p) {
    const v=norm(p); return v==="CRITICAL" ? "CRITICAL" : v || "MEDIUM";
  }

  function openCase(c, navigate = true) {
    updateCaseContext(c, true);
    closeCaseSwitcher();
    if (navigate && typeof window.cipherSwitchWorkspaceView === "function") window.cipherSwitchWorkspaceView("network");
  }

  function renderIndex(cases) {
    const list=document.getElementById("caseIndexList");
    const count=document.getElementById("caseResultsCount");
    if (!list) return;
    const state = window.__cipherCaseIndexState || {page:1,search:"",status:"ALL",priority:"ALL"};
    const q=norm(state.search);
    const filtered=cases.filter(c => {
      const hay=norm(`${c.case_number} ${c.title} ${c.description} ${c.investigator}`);
      return (!q || hay.includes(q)) && (state.status==="ALL" || norm(c.status)===state.status) && (state.priority==="ALL" || norm(c.priority)===state.priority);
    });
    const pages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));
    state.page=Math.min(state.page,pages); window.__cipherCaseIndexState=state;
    const start=(state.page-1)*PAGE_SIZE;
    const pageItems=filtered.slice(start,start+PAGE_SIZE);
    if(count) count.textContent=`${filtered.length} investigation${filtered.length===1?"":"s"}`;
    list.innerHTML=pageItems.length ? pageItems.map(c=>`<button type="button" class="case-index-row" data-case-index-id="${esc(c.id)}">
      <span class="case-index-number">CASE / ${esc(c.case_number)}</span>
      <span class="case-index-main"><strong>${esc(c.title)}</strong><small>${esc(c.description || "No description provided.")}</small></span>
      <span class="case-index-investigator">${esc(c.investigator || "—")}</span>
      <span class="case-index-status">${esc(statusLabel(c.status))}</span>
      <span class="case-index-priority ${priorityClass(c.priority)}">${esc(norm(c.priority) || "MEDIUM")}</span>
      <span class="case-index-stats"><b>${esc(c.entities ?? 0)}</b><small>ENTITIES</small><b>${esc(c.evidence ?? 0)}</b><small>EVIDENCE</small></span>
      <span class="case-index-open">OPEN ↗</span>
    </button>`).join("") : `<div class="case-index-empty"><strong>No investigations match this search.</strong><span>Try another case number, title, investigator or filter.</span></div>`;

    list.querySelectorAll("[data-case-index-id]").forEach(btn=>btn.addEventListener("click",()=>{
      const c=cases.find(item=>String(item.id)===String(btn.dataset.caseIndexId)); if(c) openCase(c,true);
    }));

    const pager=document.getElementById("casePagination");
    if(pager) pager.innerHTML=pages>1 ? `<button type="button" ${state.page<=1?"disabled":""} data-page="prev">←</button><span>PAGE ${state.page} / ${pages}</span><button type="button" ${state.page>=pages?"disabled":""} data-page="next">→</button>` : `<span>ALL ${filtered.length} INVESTIGATIONS</span>`;
    pager?.querySelector('[data-page="prev"]')?.addEventListener("click",()=>{state.page--;renderIndex(cases);});
    pager?.querySelector('[data-page="next"]')?.addEventListener("click",()=>{state.page++;renderIndex(cases);});
  }

  function renderFeatured(cases) {
    const stage=document.getElementById("caseStage"); if(!stage) return;
    const active=getActiveCase();
    const state = window.__cipherCaseIndexState || {page:1,search:"",status:"ALL",priority:"ALL"};
    const q=norm(state.search);
    const hasFilter=Boolean(q || state.status !== "ALL" || state.priority !== "ALL");
    const pool=Array.isArray(cases) ? cases : [];
    const ordered = hasFilter
      ? pool.slice(0,5)
      : [active,...pool.filter(c=>String(c.id)!==String(active.id))].slice(0,5);
    const meta=document.getElementById("caseDiscoveryMeta");
    if(meta){
      if(hasFilter) meta.textContent=`${pool.length} matching investigation${pool.length===1?"":"s"} · showing up to 5 on the desk`;
      else meta.textContent=`Showing ${ordered.length} featured investigations · search to narrow the desk`;
    }
    stage.querySelectorAll(".floating-case").forEach(card=>card.remove());
    const positions=["c1","c2","c4","c5"];
    const cards=ordered.map((c,i)=>{
      const main=i===0;
      return `<article class="floating-case ${main?"case-main c3":"case-back "+positions[i-1]} ${String(c.id)===String(active.id)?"case-selected":""}" data-case="${esc(c.title)}" data-case-id="${esc(c.id)}">
        <div class="case-top"><span>CASE / ${esc(c.case_number)}</span><b class="${priorityClass(c.priority)}">${esc(norm(c.priority)||"MEDIUM")}</b></div>
        ${main?`<div class="case-index">${esc(c.title?.toUpperCase().replace(/\\s+/g,"_")||"CASE")}</div>`:""}
        <h3>${esc(c.title)}</h3><p>${esc(c.description||"No description provided.")}</p>
        ${main?`<div class="case-metrics"><div><strong>${esc(c.entities??0)}</strong><span>ENTITIES</span></div><div><strong>${esc(c.links??0)}</strong><span>CONNECTIONS</span></div><div><strong>${esc(c.evidence??0)}</strong><span>EVIDENCE</span></div><div><strong>${esc(c.locations??0)}</strong><span>LOCATIONS</span></div></div>`:`<div class="case-stats"><span>${esc(statusLabel(c.status))}</span><span>${esc(c.entities??0)} entities</span></div>`}
        <div class="case-footer"><span>${esc(statusLabel(c.status))} · ${esc(c.investigator||"UNASSIGNED")}</span><button type="button" class="open-index-case">${main?"OPEN CASE":"SELECT CASE"} ↗</button></div>
      </article>`;
    }).join("");
    stage.insertAdjacentHTML("beforeend",cards);
    stage.querySelectorAll(".open-index-case").forEach(btn=>btn.addEventListener("click",e=>{
      e.stopPropagation(); const c=cases.find(item=>String(item.id)===String(btn.closest(".floating-case")?.dataset.caseId)); if(c) openCase(c,true);
    }));
    if(typeof window.cipherRefreshCases==="function") window.cipherRefreshCases();
  }

  async function loadAllCases(){
    let cases=[];
    try {
      if(window.cipherApi){
        const data=await window.cipherApi("/cases");
        cases=Array.isArray(data)?data:(data?.cases||[]);
      }
    } catch(e){ console.warn("CIPHER case index:",e.message); }
    if(!cases.length) cases=ensureDemoCases();
    window.cipherAllCases=cases;
    const activeSaved=getActiveCase();
    const active=cases.find(c=>String(c.id)===String(activeSaved.id)) || cases.find(c=>String(c.case_number)===String(activeSaved.case_number)) || cases.find(c=>String(c.case_number)==="042") || cases[0];
    updateCaseContext(active,false);
    renderFeatured(cases);
    renderIndex(cases);
    return cases;
  }

  function buildSwitcher(){
    if(document.getElementById("caseSwitcherModal")) return;
    const modal=document.createElement("div"); modal.id="caseSwitcherModal"; modal.className="case-switcher-modal"; modal.setAttribute("aria-hidden","true");
    modal.innerHTML=`<div class="case-switcher-backdrop" data-case-switch-close></div><section class="case-switcher-dialog" role="dialog" aria-modal="true" aria-labelledby="caseSwitcherTitle"><header><div><span class="dashboard-eyebrow">CIPHER / INVESTIGATION CONTEXT</span><h2 id="caseSwitcherTitle">Switch investigation</h2><p>Choose a case. Network, GIS, Timeline and Evidence will stay scoped to it.</p></div><button type="button" class="case-switcher-close" data-case-switch-close>×</button></header><label class="case-switcher-search"><span>⌕</span><input id="caseSwitcherSearch" type="search" placeholder="Search cases…" autocomplete="off"></label><div class="case-switcher-list" id="caseSwitcherList"></div><footer><span id="caseSwitcherCount"></span><button type="button" data-case-switch-close>BACK TO CASES</button></footer></section>`;
    document.body.appendChild(modal);
    modal.querySelectorAll("[data-case-switch-close]").forEach(el=>el.addEventListener("click",closeCaseSwitcher));
    modal.querySelector("#caseSwitcherSearch")?.addEventListener("input",renderSwitcher);
  }

  function renderSwitcher(){
    const list=document.getElementById("caseSwitcherList"); if(!list) return;
    const q=norm(document.getElementById("caseSwitcherSearch")?.value);
    const cases=(window.cipherAllCases||[]).filter(c=>!q || norm(`${c.case_number} ${c.title} ${c.investigator}`).includes(q));
    const active=getActiveCase();
    list.innerHTML=cases.slice(0,12).map(c=>`<button type="button" class="case-switch-row ${String(c.id)===String(active.id)?"active":""}" data-switch-id="${esc(c.id)}"><span class="switch-case-no">${esc(c.case_number)}</span><span><strong>${esc(c.title)}</strong><small>${esc(statusLabel(c.status))} · ${esc(norm(c.priority)||"MEDIUM")} · ${esc(c.entities??0)} entities</small></span><b>${String(c.id)===String(active.id)?"CURRENT":"OPEN ↗"}</b></button>`).join("") || `<div class="case-switch-empty">No matching investigations.</div>`;
    document.getElementById("caseSwitcherCount")?.replaceChildren(document.createTextNode(`${cases.length} investigation${cases.length===1?"":"s"}`));
    list.querySelectorAll("[data-switch-id]").forEach(btn=>btn.addEventListener("click",()=>{const c=(window.cipherAllCases||[]).find(x=>String(x.id)===String(btn.dataset.switchId));if(c)openCase(c,true);}));
  }

  function openCaseSwitcher(){
    buildSwitcher(); const modal=document.getElementById("caseSwitcherModal"); modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.getElementById("workspaceCaseSwitcher")?.setAttribute("aria-expanded","true"); renderSwitcher(); setTimeout(()=>document.getElementById("caseSwitcherSearch")?.focus(),60);
  }
  function closeCaseSwitcher(){const modal=document.getElementById("caseSwitcherModal");if(modal){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");}document.getElementById("workspaceCaseSwitcher")?.setAttribute("aria-expanded","false");}
  window.cipherOpenCaseSwitcher=openCaseSwitcher;
  window.cipherCloseCaseSwitcher=closeCaseSwitcher;
  window.cipherSetActiveCase=updateCaseContext;
  window.cipherLoadCases=loadAllCases;

  document.getElementById("workspaceCaseSwitcher")?.addEventListener("click",openCaseSwitcher);
  document.getElementById("dashboardOpenActiveCase")?.addEventListener("click",()=>openCase(getActiveCase(),true));

  const search=document.getElementById("caseSearchInput");
  const status=document.getElementById("caseStatusFilter");
  const priority=document.getElementById("casePriorityFilter");
  const searchTop=document.getElementById("caseSearchInputTop");
  const statusTop=document.getElementById("caseStatusFilterTop");
  const priorityTop=document.getElementById("casePriorityFilterTop");
  function refreshIndex(source="bottom"){
    const sourceSearch=source === "top" ? searchTop : search;
    const sourceStatus=source === "top" ? statusTop : status;
    const sourcePriority=source === "top" ? priorityTop : priority;
    const next={page:1,search:sourceSearch?.value||"",status:sourceStatus?.value||"ALL",priority:sourcePriority?.value||"ALL"};
    window.__cipherCaseIndexState=next;
    if(source === "top"){
      if(search) search.value=next.search;
      if(status) status.value=next.status;
      if(priority) priority.value=next.priority;
    }else{
      if(searchTop) searchTop.value=next.search;
      if(statusTop) statusTop.value=next.status;
      if(priorityTop) priorityTop.value=next.priority;
    }
    const all=window.cipherAllCases||[];
    const q=norm(next.search);
    const filtered=all.filter(c=>{
      const hay=norm(`${c.case_number} ${c.title} ${c.description} ${c.investigator}`);
      return (!q || hay.includes(q)) && (next.status==="ALL" || norm(c.status)===next.status) && (next.priority==="ALL" || norm(c.priority)===next.priority);
    });
    renderFeatured(filtered);
    renderIndex(all);
  }
  search?.addEventListener("input",()=>refreshIndex("bottom")); status?.addEventListener("change",()=>refreshIndex("bottom")); priority?.addEventListener("change",()=>refreshIndex("bottom"));
  searchTop?.addEventListener("input",()=>refreshIndex("top")); statusTop?.addEventListener("change",()=>refreshIndex("top")); priorityTop?.addEventListener("change",()=>refreshIndex("top"));

  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCaseSwitcher();});
  ensureDemoCases();
  setTimeout(loadAllCases,120);
})();
