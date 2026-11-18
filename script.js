const translations={
es:{navHome:"Inicio",navGames:"Juegos",navAvatar:"Avatar",navFriends:"Amigos",navCatalog:"Catálogo",login:"Iniciar sesión",signup:"Registrarse",logout:"Cerrar sesión",eyebrow:"UN MUNDO DE JUEGOS",welcome:"¡Bienvenido a BLOXITY!",intro:"Descubre juegos, personaliza tu avatar y conoce a otros jugadores.",join:"Únete a BLOXITY",avatarTitle:"Mi avatar R6",classicAvatar:"Clásico · 6 partes",avatarHelp:"Personaliza los colores de tu avatar. Inicia sesión para guardar los cambios.",bodyColor:"Color de cabeza y brazos",shirtColor:"Color de camiseta",pantsColor:"Color de pantalones",saveAvatar:"Guardar avatar",friendsTitle:"Mis amigos",findPlayer:"Buscar jugador por nombre",addFriend:"Agregar amigo",incoming:"Solicitudes recibidas",myFriends:"Amigos",loginFriends:"Inicia sesión para ver tus amigos y solicitudes.",featured:"Juegos destacados",coming:"Próximamente",gameSoon:"Próximamente",catalogTitle:"Catálogo",catalogText:"Pronto podrás descubrir artículos para personalizar tu avatar.",footer:"Plataforma independiente inspirada en la estética de los juegos de 2017.",username:"Nombre de usuario",password:"Contraseña",privacy:"Usa una contraseña única. Nunca compartas tu contraseña con nadie.",notLogged:"No has iniciado sesión.",logged:"Sesión iniciada como"},
en:{navHome:"Home",navGames:"Games",navAvatar:"Avatar",navFriends:"Friends",navCatalog:"Catalog",login:"Log in",signup:"Sign up",logout:"Log out",eyebrow:"A WORLD OF GAMES",welcome:"Welcome to BLOXITY!",intro:"Discover games, customize your avatar, and meet other players.",join:"Join BLOXITY",avatarTitle:"My R6 avatar",classicAvatar:"Classic · 6 parts",avatarHelp:"Customize your avatar colors. Sign in to save your changes.",bodyColor:"Head and arms color",shirtColor:"Shirt color",pantsColor:"Pants color",saveAvatar:"Save avatar",friendsTitle:"My friends",findPlayer:"Find player by username",addFriend:"Add friend",incoming:"Incoming requests",myFriends:"Friends",loginFriends:"Sign in to see your friends and requests.",featured:"Featured games",coming:"Coming soon",gameSoon:"Coming soon",catalogTitle:"Catalog",catalogText:"Soon you'll be able to discover items to customize your avatar.",footer:"Independent platform inspired by the look and feel of 2017 games.",username:"Username",password:"Password",privacy:"Use a unique password. Never share your password with anyone.",notLogged:"You are not logged in.",logged:"Signed in as"}
};
let lang="es",mode="login",client=null,profile=null,platformStatus=null;
const $=id=>document.getElementById(id), tr=k=>translations[lang][k]||k;
function setLang(v){lang=v;document.documentElement.lang=v;document.querySelectorAll("[data-i18n]").forEach(e=>{if(translations[v][e.dataset.i18n])e.textContent=tr(e.dataset.i18n)});updateStatus()}
$("language").addEventListener("change",e=>setLang(e.target.value));
const cfg=window.BLOXITY_CONFIG||{};
if(window.supabase&&cfg.SUPABASE_URL?.startsWith("https://")&&cfg.SUPABASE_ANON_KEY&&!cfg.SUPABASE_ANON_KEY.includes("PASTE_"))client=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
function updateStatus(){ $("accountStatus").textContent=profile?tr("logged")+" "+profile.username:tr("notLogged");$("openLogin").classList.toggle("hidden",!!profile);$("openRegister").classList.toggle("hidden",!!profile);$("logout").classList.toggle("hidden",!profile);$("heroJoin").classList.toggle("hidden",!!profile);if(!profile){$("incomingList").innerHTML=`<p class="empty">${tr("loginFriends")}</p>`;$("friendsList").innerHTML=`<p class="empty">${tr("loginFriends")}</p>`;$("friendCount").textContent="0"}$("adminNav").classList.toggle("hidden",!platformStatus?.is_admin);}
function authOpen(m){mode=m;$("authMessage").textContent="";$("dialogTitle").textContent=tr(m);$("submitAuth").textContent=tr(m);$("username").classList.remove("hidden");$("usernameLabel").classList.remove("hidden");$("username").required=true;$("username").value="";$("password").value="";$("authDialog").showModal()}
$("openLogin").onclick=()=>authOpen("login");$("openRegister").onclick=()=>authOpen("signup");$("heroJoin").onclick=e=>{e.preventDefault();authOpen("signup")};$("closeDialog").onclick=()=>$("authDialog").close();
function msg(id,s,err=false){$(id).textContent=s;$(id).style.color=err?"#b33":"#18783b"}
async function loadProfile(user){if(!client||!user)return;let {data,error}=await client.from("profiles").select("username,body_color,shirt_color,pants_color,head_style,face_style,equipped_items").eq("id",user.id).single();if(error){profile={username:user.user_metadata?.username||"Player"};return}profile=data;$("bodyColor").value=data.body_color||"#f2c078";$("shirtColor").value=data.shirt_color||"#00a2ff";$("pantsColor").value=data.pants_color||"#30343b";$("headStyle").value=data.head_style||"block";$("faceStyle").value=data.face_style||"smile";equippedItems=Array.isArray(data.equipped_items)?data.equipped_items:[];renderAvatar();if(window.bloxityR6)window.bloxityR6.setEquipped(equippedItems);renderCatalog();updateStatus();await loadFriends();await loadEconomy()}
function usernameAuthEmail(username){return username.trim().toLowerCase()+"@users.bloxity.invalid"}
$("authForm").onsubmit=async e=>{e.preventDefault();if(!client){msg("authMessage",lang==="es"?"Supabase no está configurado. Revisa config.js.":"Supabase is not configured. Check config.js.",true);return}const username=$("username").value.trim(),password=$("password").value;if(!/^[A-Za-z0-9_]{3,20}$/.test(username)){msg("authMessage",lang==="es"?"El nombre de usuario debe tener 3–20 caracteres: letras, números o _.":"Username must be 3–20 characters: letters, numbers, or _.",true);return}if(password.length<8){msg("authMessage",lang==="es"?"La contraseña debe tener al menos 8 caracteres.":"Password must be at least 8 characters.",true);return}const email=usernameAuthEmail(username);try{let r=mode==="signup"?await client.auth.signUp({email,password,options:{data:{username}}}):await client.auth.signInWithPassword({email,password});if(r.error)throw r.error;if(mode==="signup"&&!r.data.session){msg("authMessage",lang==="es"?"La cuenta se creó, pero Supabase todavía exige confirmar un correo. En Supabase ve a Authentication → Providers → Email y desactiva Confirm email; después vuelve a registrarte.":"The account was created, but Supabase still requires email confirmation. In Supabase, go to Authentication → Providers → Email and turn off Confirm email, then register again.",true);return}if(r.data.user){await loadProfile(r.data.user);$("authDialog").close();$("authForm").reset()}}catch(err){const text=String(err.message||err);const friendly=/already registered|already exists|user already/i.test(text)?(lang==="es"?"Ese nombre de usuario ya está registrado. Elige otro.":"That username is already registered. Choose another."):text;msg("authMessage",friendly,true)}};
$("logout").onclick=async()=>{if(client){const {error}=await client.auth.signOut();if(error){msg("friendMessage",error.message,true);return}}profile=null;updateStatus();loadEconomy()};
let equippedItems=[];
function renderAvatar(){const f=$("avatarFigure");f.style.setProperty("--skin",$("bodyColor").value);f.style.setProperty("--shirt",$("shirtColor").value);f.style.setProperty("--pants",$("pantsColor").value);if(window.bloxityR6)window.bloxityR6.update()}
["bodyColor","shirtColor","pantsColor"].forEach(id=>$(id).addEventListener("input",renderAvatar));
$("saveAvatar").onclick=async()=>{if(!client||!profile){msg("avatarMessage",lang==="es"?"Inicia sesión para guardar tu avatar.":"Sign in to save your avatar.",true);return}const values={body_color:$("bodyColor").value,shirt_color:$("shirtColor").value,pants_color:$("pantsColor").value,head_style:$("headStyle").value,face_style:$("faceStyle").value,equipped_items:equippedItems};const {error}=await client.from("profiles").update(values).eq("id",(await client.auth.getUser()).data.user.id);if(error)msg("avatarMessage",error.message,true);else{Object.assign(profile,values);msg("avatarMessage",lang==="es"?"¡Avatar guardado!":"Avatar saved!")}};
async function loadFriends(){if(!client||!profile)return;const {data:userData}=await client.auth.getUser();const uid=userData.user.id;const {data:requests,error}=await client.from("friend_requests").select("id,sender_id,receiver_id,status,sender:profiles!friend_requests_sender_id_fkey(username),receiver:profiles!friend_requests_receiver_id_fkey(username)").or(`sender_id.eq.${uid},receiver_id.eq.${uid}`);if(error){msg("friendMessage",error.message,true);return}const incoming=(requests||[]).filter(r=>r.receiver_id===uid&&r.status==="pending"),friends=(requests||[]).filter(r=>r.status==="accepted");$("incomingList").innerHTML=incoming.length?"":`<p class="empty">${lang==="es"?"No tienes solicitudes nuevas.":"No new requests."}</p>`;for(const r of incoming){const row=document.createElement("div");row.className="friend-item";const name=document.createElement("strong");name.textContent=r.sender?.username||"Player";const actions=document.createElement("div");actions.className="friend-actions";const yes=document.createElement("button");yes.className="accept";yes.textContent=lang==="es"?"Aceptar":"Accept";yes.onclick=()=>respond(r.id,"accepted");const no=document.createElement("button");no.textContent=lang==="es"?"Rechazar":"Decline";no.onclick=()=>respond(r.id,"rejected");actions.append(yes,no);row.append(name,actions);$("incomingList").append(row)}
const unique=new Map();friends.forEach(r=>{const other=r.sender_id===uid?r.receiver:r.sender;if(other)unique.set(r.id,other.username)});$("friendCount").textContent=String(unique.size);$("friendsList").innerHTML=unique.size?"":`<p class="empty">${lang==="es"?"Todavía no tienes amigos.":"You don't have friends yet."}</p>`;unique.forEach(name=>{const row=document.createElement("div");row.className="friend-item";const n=document.createElement("strong");n.textContent=name;row.append(n);$("friendsList").append(row)})}
async function respond(id,status){const {error}=await client.from("friend_requests").update({status}).eq("id",id);if(error)msg("friendMessage",error.message,true);else{msg("friendMessage",status==="accepted"?(lang==="es"?"Solicitud aceptada.":"Request accepted."):(lang==="es"?"Solicitud rechazada.":"Request declined."));loadFriends()}}
$("sendRequest").onclick=async()=>{if(!client||!profile){msg("friendMessage",lang==="es"?"Inicia sesión para agregar amigos.":"Sign in to add friends.",true);return}const username=$("friendUsername").value.trim();if(!username){msg("friendMessage",lang==="es"?"Escribe un nombre de usuario.":"Enter a username.",true);return}const {data:me}=await client.auth.getUser();const {data:target,error:findError}=await client.from("profiles").select("id,username").ilike("username",username).maybeSingle();if(findError||!target){msg("friendMessage",lang==="es"?"No encontramos ese jugador.":"Player not found.",true);return}if(target.id===me.user.id){msg("friendMessage",lang==="es"?"No puedes agregarte a ti mismo.":"You cannot add yourself.",true);return}const {error}=await client.from("friend_requests").insert({sender_id:me.user.id,receiver_id:target.id});if(error)msg("friendMessage",error.code==="23505"?(lang==="es"?"Ya existe una solicitud o amistad.":"A request or friendship already exists."):error.message,true);else{msg("friendMessage",lang==="es"?"Solicitud enviada.":"Friend request sent.");$("friendUsername").value=""}};
if(client){client.auth.getSession().then(({data})=>{if(data.session)loadProfile(data.session.user)});client.auth.onAuthStateChange((_e,s)=>{if(!s){profile=null;updateStatus();loadEconomy()}else loadProfile(s.user)})}
setLang("es");renderAvatar();updateStatus();

// Selectable classic-style R6 preview animations.
document.querySelectorAll(".anim-btn").forEach(button=>{
  button.addEventListener("click",()=>{
    const kind=button.dataset.animation;
    const figure=$("avatarFigure");
    figure.classList.remove("anim-idle","anim-walk","anim-jump");
    figure.classList.add("anim-"+kind);
    if(window.bloxityR6)window.bloxityR6.setAnimation(kind);
    document.querySelectorAll(".anim-btn").forEach(b=>b.classList.toggle("active",b===button));
  });
});
$("avatarFigure").classList.add("anim-idle");

// Three.js R6 avatar preview. The model is a simple six-part block rig.
(function initBloxity3D(){
 const host=$("avatar3d");
 if(!host || !window.THREE){if(host)host.innerHTML='<p class="empty">No se pudo cargar la vista 3D. Revisa tu conexión a Internet.</p>';return;}
 const THREE=window.THREE;
 const scene=new THREE.Scene();scene.background=new THREE.Color(0xe9f5fc);
 const camera=new THREE.PerspectiveCamera(35,1,0.1,100);camera.position.set(4.5,3.0,7.5);camera.lookAt(0,1.25,0);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;host.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0xffffff,0x8093a2,2.0));
 const key=new THREE.DirectionalLight(0xffffff,2.2);key.position.set(-3,6,5);scene.add(key);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.MeshStandardMaterial({color:0xe9f5fc,roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.03;scene.add(floor);
 const grid=new THREE.GridHelper(8,16,0xc4dce9,0xd6e7ef);grid.position.y=-.02;scene.add(grid);
 const rig=new THREE.Group();scene.add(rig);
 const mat=(color)=>new THREE.MeshStandardMaterial({color:new THREE.Color(color),roughness:.78});
 const skin=mat("#f2c078"),shirt=mat("#00a2ff"),pants=mat("#30343b"),black=mat("#242424");
 const box=(w,h,d,m)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
 const torso=box(.95,1.05,.48,shirt);torso.position.y=1.62;rig.add(torso);
 const headGroup=new THREE.Group();headGroup.position.set(0,2.45,0);rig.add(headGroup);
 let headMesh=null,faceMesh=null;
 function makeFace(type){
   const c=document.createElement("canvas");c.width=256;c.height=256;const x=c.getContext("2d");
   x.clearRect(0,0,256,256);x.fillStyle="#252525";
   if(type==="surprised"){x.beginPath();x.arc(86,91,13,0,Math.PI*2);x.arc(170,91,13,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(128,169,16,23,0,0,Math.PI*2);x.fill();}
   else if(type==="neutral"){x.beginPath();x.arc(86,96,10,0,Math.PI*2);x.arc(170,96,10,0,Math.PI*2);x.fill();x.fillRect(91,164,74,8);}
   else {x.beginPath();x.arc(86,91,12,0,Math.PI*2);x.arc(170,91,12,0,Math.PI*2);x.fill();x.strokeStyle="#252525";x.lineWidth=9;x.lineCap="round";x.beginPath();if(type==="happy"){x.arc(128,135,48,.18,Math.PI-.18);}else{x.arc(128,128,42,.18,Math.PI-.18);}x.stroke();}
   const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
   return new THREE.Mesh(new THREE.PlaneGeometry(.72,.72),new THREE.MeshBasicMaterial({map:tex,transparent:true,side:THREE.DoubleSide,depthWrite:false}));
 }
 function rebuildHead(){
   if(headMesh){headGroup.remove(headMesh);headMesh.geometry.dispose();}
   if(faceMesh){headGroup.remove(faceMesh);faceMesh.material.map?.dispose();faceMesh.material.dispose();}
   const style=$("headStyle").value;
   headMesh=style==="round"?new THREE.Mesh(new THREE.SphereGeometry(.43,24,18),skin):box(.82,.82,.82,skin);
   headGroup.add(headMesh);
   faceMesh=makeFace($("faceStyle").value);faceMesh.position.set(0,0,.414);headGroup.add(faceMesh);
 }
 rebuildHead();
 const arms=[];
 [-1,1].forEach(side=>{const pivot=new THREE.Group();pivot.position.set(side*.62,2.08,0);rig.add(pivot);const limb=box(.38,.98,.43,skin);limb.position.y=-.48;pivot.add(limb);arms.push(pivot)});
 const legs=[];
 [-1,1].forEach(side=>{const pivot=new THREE.Group();pivot.position.set(side*.245,1.08,0);rig.add(pivot);const limb=box(.45,1.02,.46,pants);limb.position.y=-.5;pivot.add(limb);legs.push(pivot)});
 const accessoryGroup=new THREE.Group();rig.add(accessoryGroup);
 let animation="idle",start=performance.now(),dragging=false,lastX=0,rotation=0;
 function resize(){const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
 const ro=new ResizeObserver(resize);ro.observe(host);resize();
 host.addEventListener("pointerdown",e=>{dragging=true;lastX=e.clientX;host.setPointerCapture(e.pointerId)});
 host.addEventListener("pointermove",e=>{if(!dragging)return;rotation+=(e.clientX-lastX)*.012;lastX=e.clientX;rig.rotation.y=rotation});
 host.addEventListener("pointerup",()=>dragging=false);host.addEventListener("pointercancel",()=>dragging=false);
 function animate(now){requestAnimationFrame(animate);const t=(now-start)/1000;arms.forEach(a=>a.rotation.x=0);legs.forEach(l=>l.rotation.x=0);rig.position.y=0;headGroup.rotation.set(0,0,0);
  if(animation==="idle"){rig.position.y=Math.sin(t*2)*.025;headGroup.rotation.z=Math.sin(t*1.4)*.025;}
  if(animation==="walk"){arms[0].rotation.x=Math.sin(t*8)*.55;arms[1].rotation.x=-Math.sin(t*8)*.55;legs[0].rotation.x=-Math.sin(t*8)*.48;legs[1].rotation.x=Math.sin(t*8)*.48;rig.position.y=Math.abs(Math.sin(t*8))*.045;}
  if(animation==="jump"){const phase=(t%1.05)/1.05;rig.position.y=phase<.5?Math.sin(phase*Math.PI)*.72:0;arms.forEach(a=>a.rotation.x=-.95);legs.forEach(l=>l.rotation.x=.15);}
  renderer.render(scene,camera)
 }
 requestAnimationFrame(animate);
 function setEquipped(ids){
  while(accessoryGroup.children.length){const obj=accessoryGroup.children[accessoryGroup.children.length-1];accessoryGroup.remove(obj);obj.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}})}
  torso.material=shirt;legs.forEach(l=>l.children[0].material=pants);headGroup.children.forEach(o=>{if(o===headMesh)o.material=skin});
  const chosen=(ids||[]).map(id=>catalogItems?.find(i=>i.id===id)).filter(Boolean);
  const add=(geometry,material,pos,rot)=>{const m=new THREE.Mesh(geometry,material);m.position.set(...pos);if(rot)m.rotation.set(...rot);accessoryGroup.add(m);return m};
  chosen.forEach(item=>{
   const c=item.color||"#ffffff",m=mat(c);
   if(item.kind==="cap"){add(new THREE.BoxGeometry(.98,.16,.9),m,[0,2.91,0]);add(new THREE.BoxGeometry(1.05,.09,.35),m,[0,2.83,.43])}
   if(item.kind==="crown"){add(new THREE.CylinderGeometry(.34,.39,.18,8),m,[0,2.94,0]);for(let n=0;n<5;n++){const a=(n/5)*Math.PI*2;add(new THREE.ConeGeometry(.09,.27,4),m,[Math.cos(a)*.29,3.15,Math.sin(a)*.29])}}
   if(item.kind==="beanie"){add(new THREE.SphereGeometry(.46,16,10,0,Math.PI*2,0,Math.PI/2),m,[0,2.84,0])}
   if(item.kind==="hair"){add(new THREE.BoxGeometry(.9,.28,.88),m,[0,2.84,-.02]);add(new THREE.BoxGeometry(.9,.42,.18),m,[0,2.62,-.34])}
   if(item.kind==="backpack"){add(new THREE.BoxGeometry(.72,.78,.3),m,[0,1.72,-.39])}
   if(item.kind==="wings"){[-1,1].forEach(side=>{const wing=add(new THREE.BoxGeometry(.62,.95,.12),m,[side*.72,1.95,-.34],[0,0,side*-.28])})}
   if(item.kind==="shirt"){const shirtMat=mat(c);torso.material=shirtMat}
   if(item.kind==="pants"){const pantsMat=mat(c);legs.forEach(l=>l.children[0].material=pantsMat)}
   if(item.kind==="face"){ $("faceStyle").value=item.face;rebuildHead()}
  });
 }
 window.bloxityR6={update(){skin.color.set($("bodyColor").value);shirt.color.set($("shirtColor").value);pants.color.set($("pantsColor").value);rebuildHead();setEquipped(equippedItems)},setAnimation(a){animation=a},setEquipped,setRig(kind){rig.scale.set(kind==="r15"?.94:1,kind==="r15"?1.04:1,kind==="r15"?.94:1);camera.position.set(kind==="r15"?4.7:4.5,kind==="r15"?3.15:3.0,kind==="r15"?7.8:7.5);camera.lookAt(0,1.25,0)}};
 $("headStyle").addEventListener("change",()=>window.bloxityR6.update());
 $("faceStyle").addEventListener("change",()=>window.bloxityR6.update());
})();

// BLOXITY catalog: original sample items, no paid purchases in this prototype.
const catalogItems=[
{id:"cap_blue",name:"Gorra clásica azul",category:"hats",icon:"🧢",price:250,kind:"cap",color:"#167ac6"},
{id:"crown_gold",name:"Corona dorada",category:"hats",icon:"👑",price:1500,kind:"crown",color:"#f3c644"},
{id:"beanie",name:"Gorro tejido",category:"hats",icon:"🎩",price:180,kind:"beanie",color:"#7a4bb7"},
{id:"hair_brown",name:"Pelo castaño",category:"hair",icon:"💇",price:120,kind:"hair",color:"#70452e"},
{id:"hair_black",name:"Pelo negro",category:"hair",icon:"🖤",price:120,kind:"hair",color:"#252525"},
{id:"face_smile",name:"Sonrisa",category:"faces",icon:"🙂",price:100,kind:"face",face:"smile"},
{id:"face_happy",name:"Feliz",category:"faces",icon:"😄",price:100,kind:"face",face:"happy"},
{id:"shirt_red",name:"Camiseta roja",category:"shirts",icon:"👕",price:75,kind:"shirt",color:"#d94b45"},
{id:"shirt_green",name:"Camiseta verde",category:"shirts",icon:"👕",price:75,kind:"shirt",color:"#35a56b"},
{id:"pants_blue",name:"Pantalones azules",category:"pants",icon:"👖",price:90,kind:"pants",color:"#2859a8"},
{id:"backpack",name:"Mochila aventurera",category:"back",icon:"🎒",price:350,kind:"backpack",color:"#a85a32"},
{id:"wings",name:"Alas celestes",category:"back",icon:"🪽",price:900,kind:"wings",color:"#8bd7f5"},
{id:"gear_gravity_coil",name:"Gravity Coil",category:"gear",icon:"🌀",price:250,currency:"tix",kind:"gear"},
{id:"gear_speed_coil",name:"Speed Coil",category:"gear",icon:"⚡",price:200,currency:"tix",kind:"gear"},
{id:"gear_paint_bucket",name:"Paint Bucket",category:"gear",icon:"🪣",price:100,currency:"tix",kind:"gear"},
{id:"gear_bloxy_radio",name:"Classic Radio",category:"gear",icon:"📻",price:150,currency:"tix",kind:"gear"},
{id:"bc_hat_classic",name:"Sombrero Builders Club",category:"hats",icon:"🎩",price:0,kind:"hat"},
{id:"bc_hat_turbo",name:"Sombrero Turbo Builders Club",category:"hats",icon:"🎩",price:0,kind:"hat"},
{id:"bc_hat_outage",name:"Sombrero Outrageous Builders Club",category:"hats",icon:"🎩",price:0,kind:"hat"}
];
let catalogCategory="all";
let ownedItems=new Set();
function renderCatalog(){
 const grid=$("catalogGrid");if(!grid)return;
 const term=$("catalogSearch").value.trim().toLowerCase();
 const items=catalogItems.filter(i=>(catalogCategory==="all"||i.category===catalogCategory)&&i.name.toLowerCase().includes(term));
 $("catalogCount").textContent=`${items.length} ${lang==="es"?"artículos":"items"}`;
 grid.innerHTML="";
 if(!items.length){grid.innerHTML=`<p class="empty">${lang==="es"?"No hay artículos con esa búsqueda.":"No items match your search."}</p>`;return}
 items.forEach(item=>{
  const card=document.createElement("article");card.className="catalog-item";
  const art=document.createElement("div");art.className="catalog-art";const emoji=document.createElement("span");emoji.textContent=item.icon;art.append(emoji);
  const name=document.createElement("h3");name.textContent=item.name;
  const price=document.createElement("div");price.className="catalog-price";price.textContent=`${item.currency==="tix"?"🎟️":item.currency==="robux"?"R$":"◇"} ${Number(item.price).toLocaleString(lang==="es"?"es-GT":"en-US")} ${item.currency==="tix"?"Tix":item.currency==="robux"?"Robux":"BloxCoins"}`;
  const btn=document.createElement("button");
  const owned=ownedItems.has(item.id),isOn=equippedItems.includes(item.id);
  btn.className=owned?"owned-item":"buy-item";
  btn.textContent=owned?(isOn?(lang==="es"?"Equipado ✓":"Equipped ✓"):(lang==="es"?"Equipar":"Wear")):(lang==="es"?"Comprar":"Buy");
  btn.onclick=()=>owned?toggleCatalogItem(item):purchaseCatalogItem(item);
  card.append(art,name,price,btn);grid.append(card);
 });
 updateEquippedSummary();
}
function toggleCatalogItem(item){
 if(!ownedItems.has(item.id)){msg("catalogMessage",lang==="es"?"Primero debes comprar este artículo.":"You must buy this item first.",true);return}
 const sameType={hats:["cap_blue","crown_gold","beanie"],hair:["hair_brown","hair_black"],faces:["face_smile","face_happy"],shirts:["shirt_red","shirt_green"],pants:["pants_blue"],back:["backpack","wings"]};
 const group=sameType[item.category]||[];
 if(equippedItems.includes(item.id))equippedItems=equippedItems.filter(id=>id!==item.id);
 else equippedItems=[...equippedItems.filter(id=>!group.includes(id)),item.id];
 if(window.bloxityR6)window.bloxityR6.setEquipped(equippedItems);
 renderCatalog();
 msg("catalogMessage",lang==="es"?"Avatar actualizado. Pulsa «Guardar avatar» para guardar los cambios.":"Avatar updated. Press “Save avatar” to save your changes.");
}
function updateEquippedSummary(){
 const names=equippedItems.map(id=>catalogItems.find(i=>i.id===id)?.name).filter(Boolean);
 $("equippedSummary").textContent=names.length?names.join(" · "):(lang==="es"?"Todavía no has equipado artículos.":"No items equipped yet.");
}
$("catalogSearch").addEventListener("input",renderCatalog);
document.querySelectorAll(".catalog-filter").forEach(b=>b.addEventListener("click",()=>{catalogCategory=b.dataset.category;document.querySelectorAll(".catalog-filter").forEach(x=>x.classList.toggle("active",x===b));renderCatalog()}));
$("clearCatalog").addEventListener("click",()=>{equippedItems=[];if(window.bloxityR6)window.bloxityR6.setEquipped(equippedItems);renderCatalog();msg("catalogMessage",lang==="es"?"Has quitado todos los artículos.":"All items removed.")});

// BLOXITY v0.7 economy: all balance changes happen in secure Supabase RPC functions.
function formatCoins(value){return Number(value||0).toLocaleString(lang==="es"?"es-GT":"en-US")}
function showBalance(value){
 const formatted=value==="---"?"---":formatCoins(value);
 $("coinBalance").textContent=formatted;
 $("headerCoins").textContent=formatted;
}
function transactionLabel(type){
 const labels={starter_bonus:"Bono inicial",daily_reward:"Recompensa diaria",purchase:"Compra de artículo",builders_club_daily:"Builders Club: recompensa diaria",admin_grant:"Ajuste administrativo"};
 return labels[type]||(type||"Movimiento");
}
async function loadEconomy(){
 if(!client||!profile){
  platformStatus=null;updateStatus();
  showBalance("---");$("walletStatus").textContent="Inicia sesión para consultar tu saldo.";
  $("claimDaily").disabled=true;$("claimTixDaily").disabled=true;$("claimBcDaily").disabled=true;$("dailyStatus").textContent="";$("tixDailyStatus").textContent="";$("bcStatus").textContent="Inicia sesión y elige un nivel para activar tu recompensa.";
  $("transactionList").innerHTML='<p class="empty">Inicia sesión para ver tus movimientos.</p>';
  ownedItems=new Set();renderCatalog();return;
 }
 const {data:userData,error:userError}=await client.auth.getUser();
 if(userError||!userData.user)return;
 const uid=userData.user.id;
 const [wallet,inventory,transactions,status,currencyTransactions]=await Promise.all([
  client.from("profiles").select("coin_balance,last_daily_claim_at,robux_balance,tix_balance,bc_tier,bc_daily_claim_at,player_id,tix_daily_claim_at").eq("id",uid).single(),
  client.from("user_inventory").select("item_id").eq("user_id",uid),
  client.from("wallet_transactions").select("transaction_type,amount,balance_after,created_at").eq("user_id",uid).order("created_at",{ascending:false}).limit(10),
  client.rpc("get_my_platform_status"),
  client.from("currency_transactions").select("currency,amount,balance_after,transaction_type,description,created_at").eq("user_id",uid).order("created_at",{ascending:false}).limit(10)
 ]);
 if(wallet.error){$("walletStatus").textContent="Ejecuta la migración v0.7 de Supabase.";msg("dailyStatus",wallet.error.message,true);return}
 showBalance(wallet.data.coin_balance);$("robuxBalance").textContent=formatCoins(wallet.data.robux_balance);$("tixBalance").textContent=formatCoins(wallet.data.tix_balance);$("walletStatus").textContent=`ID de jugador: ${wallet.data.player_id} · Tu saldo está guardado en tu cuenta.`;platformStatus=status.data||null;updateStatus();updateBcPanel(wallet.data);
 ownedItems=new Set((inventory.data||[]).map(x=>x.item_id));
 renderCatalog();
 if(inventory.error)msg("catalogMessage",inventory.error.message,true);
 const list=$("transactionList");list.innerHTML="";
 (transactions.data||[]).forEach(t=>{
  const row=document.createElement("div");row.className="transaction-row";
  const info=document.createElement("div");info.className="transaction-info";
  const label=document.createElement("strong");label.textContent=transactionLabel(t.transaction_type);
  const date=document.createElement("span");date.textContent=new Date(t.created_at).toLocaleString(lang==="es"?"es-GT":"en-US",{dateStyle:"short",timeStyle:"short"});
  info.append(label,date);
  const amount=document.createElement("span");amount.className="transaction-amount "+(Number(t.amount)>=0?"positive":"negative");
  amount.textContent=(Number(t.amount)>0?"+":"")+formatCoins(t.amount)+" ◇";
  row.append(info,amount);list.append(row);
 });
 if(!(transactions.data||[]).length)list.innerHTML='<p class="empty">Todavía no hay movimientos.</p>';
 if(transactions.error)list.innerHTML='<p class="empty">No se pudo cargar el historial.</p>';
 (currencyTransactions.data||[]).forEach(t=>{
  const row=document.createElement("div");row.className="transaction-row";
  const info=document.createElement("div");info.className="transaction-info";
  const label=document.createElement("strong");label.textContent=(t.currency==="robux"?"Robux":"Tix")+" · "+(t.description||transactionLabel(t.transaction_type));
  const date=document.createElement("span");date.textContent=new Date(t.created_at).toLocaleString(lang==="es"?"es-GT":"en-US",{dateStyle:"short",timeStyle:"short"});info.append(label,date);
  const amount=document.createElement("span");amount.className="transaction-amount "+(Number(t.amount)>=0?"positive":"negative");amount.textContent=(Number(t.amount)>0?"+":"")+formatCoins(t.amount)+" "+(t.currency==="robux"?"R$":"Tix");row.append(info,amount);list.append(row);
 });
 updateDailyButton(wallet.data.last_daily_claim_at);updateTixDailyButton(wallet.data.tix_daily_claim_at);
}
function updateDailyButton(lastClaim){
 const button=$("claimDaily");
 if(!profile||!client){button.disabled=true;return}
 if(!lastClaim){button.disabled=false;$("dailyStatus").textContent="¡Tu primera recompensa está lista!";return}
 const next=new Date(new Date(lastClaim).getTime()+24*60*60*1000),remaining=next-Date.now();
 if(remaining<=0){button.disabled=false;$("dailyStatus").textContent="Tu recompensa diaria está disponible.";return}
 button.disabled=true;
 const hours=Math.floor(remaining/3600000),minutes=Math.floor((remaining%3600000)/60000);
 $("dailyStatus").textContent=`Próxima recompensa en ${hours} h ${minutes} min.`;
}
$("claimDaily").addEventListener("click",async()=>{
 if(!client||!profile){msg("dailyStatus","Inicia sesión para reclamar.",true);return}
 $("claimDaily").disabled=true;
 const {data,error}=await client.rpc("claim_daily_reward");
 if(error){msg("dailyStatus",error.message,true);$("claimDaily").disabled=false;return}
 if(!data.ok){msg("dailyStatus",data.message||"Todavía no está disponible.",true);updateDailyButton(data.last_daily_claim_at);return}
 msg("dailyStatus","¡Reclamaste +100 BloxCoins!");
 await loadEconomy();
});

function updateTixDailyButton(lastClaim){const b=$("claimTixDaily");if(!profile||!client){b.disabled=true;return}const remaining=lastClaim?new Date(lastClaim).getTime()+86400000-Date.now():0;b.disabled=remaining>0;if(remaining>0){const h=Math.floor(remaining/3600000),m=Math.floor(remaining%3600000/60000);$("tixDailyStatus").textContent=`Próxima recompensa de Tix en ${h} h ${m} min.`}else $("tixDailyStatus").textContent="Puedes reclamar 10 Tix hoy."}
$("claimTixDaily").addEventListener("click",async()=>{if(!client||!profile)return;$("claimTixDaily").disabled=true;const {data,error}=await client.rpc("claim_tix_daily_reward");if(error){msg("tixDailyStatus",error.message,true);$("claimTixDaily").disabled=false;return}msg("tixDailyStatus",data.message,!data.ok);await loadEconomy()});

async function purchaseCatalogItem(item){
 if(!client||!profile){msg("catalogMessage","Inicia sesión para comprar artículos.",true);return}
 const {data,error}=await client.rpc("purchase_catalog_item",{p_item_id:item.id});
 if(error){msg("catalogMessage",error.message,true);return}
 if(!data.ok){msg("catalogMessage",data.message||"No se pudo completar la compra.",true);return}
 msg("catalogMessage",`¡Compraste ${item.name} por ${formatCoins(data.price)} ${data.currency==="tix"?"Tix":data.currency==="robux"?"Robux":"BloxCoins"}!`);
 await loadEconomy();
}


function updateBcPanel(data){
 const names={none:"Sin Builders Club",builders_club:"Builders Club",turbo_builders_club:"Turbo Builders Club",outrageous_builders_club:"Outrageous Builders Club"};
 $("bcStatus").textContent=names[data.bc_tier]||"Sin Builders Club";
 const chosen=data.bc_tier&&data.bc_tier!=="none";
 document.querySelectorAll(".bc-choose").forEach(b=>{b.disabled=!!chosen;b.textContent=chosen?(b.dataset.tier===data.bc_tier?"Nivel activo":"No disponible"):"Elegir nivel"});
 const last=data.bc_daily_claim_at,remaining=last?new Date(last).getTime()+86400000-Date.now():0;
 $("claimBcDaily").disabled=!chosen||remaining>0;
 if(chosen&&remaining>0){const h=Math.floor(remaining/3600000),m=Math.floor(remaining%3600000/60000);$("bcStatus").textContent+=` · Próxima recompensa en ${h} h ${m} min.`}
 else if(chosen)$("bcStatus").textContent+=" · Recompensa disponible: 85 Robux.";
}
document.querySelectorAll(".bc-choose").forEach(b=>b.addEventListener("click",async()=>{
 if(!client||!profile){msg("bcMessage","Inicia sesión para elegir Builders Club.",true);return}
 b.disabled=true;const {data,error}=await client.rpc("choose_builders_club_tier",{p_tier:b.dataset.tier});
 if(error){msg("bcMessage",error.message,true);b.disabled=false;return}msg("bcMessage",data.message,!data.ok);await loadEconomy();
}));
$("claimBcDaily").addEventListener("click",async()=>{if(!client||!profile)return;$("claimBcDaily").disabled=true;const {data,error}=await client.rpc("claim_builders_club_daily_reward");if(error){msg("bcMessage",error.message,true);$("claimBcDaily").disabled=false;return}msg("bcMessage",data.message,!data.ok);await loadEconomy()});
async function adminCall(fn,args,messageId){if(!client||!profile){msg(messageId,"Inicia sesión.",true);return null}const {data,error}=await client.rpc(fn,args);if(error){msg(messageId,error.message,true);return null}msg(messageId,data.message||"Operación completada.",data.ok===false);return data}
$("grantAdmin").onclick=async()=>{if(platformStatus?.player_id!==1){msg("adminRoleMessage","Solo el ID 1 puede otorgar administradores.",true);return}const id=Number($("adminPlayerId").value);if(!Number.isSafeInteger(id)||id<1){msg("adminRoleMessage","Escribe un ID válido.",true);return}await adminCall("admin_grant_admin",{p_player_id:id},"adminRoleMessage")};
$("revokeAdmin").onclick=async()=>{if(platformStatus?.player_id!==1){msg("adminRoleMessage","Solo el ID 1 puede retirar administradores.",true);return}const id=Number($("adminPlayerId").value);if(!Number.isSafeInteger(id)||id<1){msg("adminRoleMessage","Escribe un ID válido.",true);return}await adminCall("admin_revoke_admin",{p_player_id:id},"adminRoleMessage")};
$("lookupPlayer").onclick=async()=>{const id=Number($("lookupPlayerId").value);if(!Number.isSafeInteger(id)||id<1){$("lookupResult").textContent="ID no válido.";return}const data=await adminCall("admin_lookup_player",{p_player_id:id},"adminRoleMessage");if(data)$("lookupResult").textContent=JSON.stringify(data,null,2)};
$("grantCurrencyButton").onclick=async()=>{const id=Number($("currencyPlayerId").value),amount=Number($("grantAmount").value);if(!Number.isSafeInteger(id)||id<1||!Number.isSafeInteger(amount)||amount<1){msg("adminCurrencyMessage","Revisa el ID y la cantidad.",true);return}await adminCall("admin_grant_currency",{p_player_id:id,p_currency:$("grantCurrency").value,p_amount:amount,p_reason:$("grantReason").value||"Ajuste administrativo"},"adminCurrencyMessage")};

renderCatalog();

// BLOXITY v0.8: independent navigation pages (single-page app).
(function initPageNavigation(){
 const views=[...document.querySelectorAll(".page-view")];
 const links=[...document.querySelectorAll("[data-page]")];
 function showPage(page,updateHash=true){
  let valid=["home","games","avatar","friends","catalog","economy","buildersclub","admin"].includes(page)?page:"home";
  if(valid==="admin"&&!platformStatus?.is_admin)valid="home";
  views.forEach(v=>v.classList.toggle("active",v.dataset.view===valid));
  links.forEach(a=>a.classList.toggle("active",a.dataset.page===valid));
  if(updateHash && location.hash!=="#"+valid) history.replaceState(null,"","#"+valid);
  window.scrollTo({top:0,behavior:"smooth"});
 }
 links.forEach(a=>a.addEventListener("click",e=>{
  const page=a.dataset.page;if(!page)return;
  e.preventDefault();showPage(page);
 }));
 window.addEventListener("hashchange",()=>showPage(location.hash.slice(1),false));
 showPage(location.hash.slice(1)||"home",false);
})();

// Games page filters and individual experience preview.
(function initGamesPage(){
 const grid=$("gameGrid");if(!grid)return;
 const search=$("gameSearch"),category=$("gameCategory"),sort=$("gameSort");
 function filterGames(){
  const term=(search.value||"").trim().toLowerCase();
  const cards=[...grid.querySelectorAll(".game-card")];
  cards.forEach(card=>{
   const matchesText=card.dataset.name.toLowerCase().includes(term);
   const matchesCategory=category.value==="all"||card.dataset.category===category.value;
   card.classList.toggle("hidden",!(matchesText&&matchesCategory));
  });
  if(sort.value==="name"){
   cards.sort((a,b)=>a.dataset.name.localeCompare(b.dataset.name));
   cards.forEach(card=>grid.append(card));
  }
  $("gameEmpty").classList.toggle("hidden",cards.every(c=>c.classList.contains("hidden")));
 }
 [search,category,sort].forEach(el=>el.addEventListener("input",filterGames));
 document.querySelectorAll(".game-open").forEach(btn=>btn.addEventListener("click",()=>{
  $("gameDialogTitle").textContent=btn.dataset.game;
  $("gameDialogDescription").textContent="La página de esta experiencia está preparada como vista previa. La ejecución de juegos y los servidores multijugador se implementarán en una fase posterior.";
  $("gameDialog").showModal();
 }));
 $("closeGameDialog").onclick=()=>$("gameDialog").close();
})();

// Avatar editor category shortcuts.
(function initAvatarEditorTabs(){
 document.querySelectorAll("[data-avatar-tab]").forEach(tab=>tab.addEventListener("click",()=>{
  document.querySelectorAll("[data-avatar-tab]").forEach(t=>t.classList.toggle("active",t===tab));
  const target=tab.dataset.avatarTab;
  const categoryMap={recent:"all",clothing:"shirts",body:"faces",accessories:"hats"};
  if(categoryMap[target]){
   catalogCategory=categoryMap[target];
   document.querySelectorAll(".catalog-filter").forEach(b=>b.classList.toggle("active",b.dataset.category===catalogCategory));
   renderCatalog();
  }
  if(target==="animations"){
   document.querySelector(".animation-controls")?.scrollIntoView({behavior:"smooth",block:"center"});
  }else if(target==="costumes"){
   msg("avatarMessage","Los conjuntos guardados se habilitarán en la siguiente fase.",true);
  }else{
   msg("avatarMessage","Categoría seleccionada: "+tab.textContent+". Abre Catálogo para explorar los artículos disponibles.",false);
  }
 }));
 document.querySelectorAll(".rig-btn").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".rig-btn").forEach(b=>b.classList.toggle("active",b===btn));
  const rig=btn.dataset.rig;
  if(window.bloxityR6?.setRig)window.bloxityR6.setRig(rig);
  $("avatar3d").dataset.rig=rig;
  $("avatar3d").setAttribute("aria-label",rig.toUpperCase()+" avatar preview");
  msg("avatarMessage",rig==="r6"?"Vista R6 clásica seleccionada.":"Vista R15 seleccionada (proporciones preliminares; rig articulado R15 pendiente).");
 }));
})();
