import * as T from 'three';
export function build(){const scene=new T.Scene();
const model=new T.Group();model.name='Old fishery — surviving fabric, present-condition photo interpretation';scene.add(model);
let seed=193;function rnd(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
function texture(kind){const c=document.createElement('canvas');c.width=1024;c.height=512;const a=c.getContext('2d');a.fillStyle=kind==='brick'?'#ab9870':kind==='wood'?'#736957':kind==='metal'?'#a6b2ae':'#a89f85';a.fillRect(0,0,1024,512);if(kind==='brick'){const colors=['#c88b43','#bd7a34','#ce9149','#d29953','#ba813d','#d5a25b','#d7c28b','#aa743a'];for(let row=0;row<8;row++)for(let col=-1;col<8;col++){a.fillStyle=colors[Math.floor(rnd()*colors.length)];a.fillRect(col*128+(row%2?64:0)+2,row*64+2,124,60);}}for(let i=0;i<32000;i++){a.fillStyle=`rgba(${rnd()>.5?'255,255,255':'0,0,0'},${rnd()*.13})`;a.fillRect(rnd()*1024,rnd()*512,kind==='wood'?1:2,kind==='wood'?8+rnd()*70:2);}if(kind==='metal')for(let x=0;x<1024;x+=16){a.fillStyle='#657672';a.fillRect(x,0,2,512);a.fillStyle='#cbd1c8';a.fillRect(x+3,0,2,512);}const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t;}
function mat(color,roughness=.95,map=null){return new T.MeshStandardMaterial({color,roughness,map});}
const brick=mat('#ffffff',.97,texture('brick')),concrete=mat('#ffffff',1,texture('concrete')),wood=mat('#ffffff',.98,texture('wood')),darkwood=mat('#6d6557',.99,texture('wood')),metal=mat('#ffffff',.88,texture('metal')),rust=mat('#6e4831'),black=mat('#30342b'),pale=mat('#c9b885'),mortar=mat('#9b9277');
function box(w,h,d,x,y,z,m=wood,parent=model){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function beam(a,b,w=.13,d=w,m=wood,parent=model){const av=new T.Vector3(...a),bv=new T.Vector3(...b);const o=box(w,av.distanceTo(bv),d,0,0,0,m,parent);o.position.copy(av.clone().add(bv).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),bv.sub(av).normalize());return o;}
function wall(w,h,d,x,y,z){const m=brick.clone();m.map=brick.map.clone();m.map.repeat.set(Math.max(w,d)/2.7,h/1.15);return box(w,h,d,x,y,z,m);}
function cable(points,r=.012,m=black){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const o=new T.Mesh(new T.TubeGeometry(curve,Math.max(16,points.length*3),r,5,false),m);model.add(o);return o;}
// Existing concrete basement: open bays remain genuinely open, with no infill box.
box(11.6,.21,6.2,-.25,2.35,0,concrete);box(11.6,.16,6.15,-.25,.04,0,concrete);box(11.5,2.3,.22,-.25,1.15,-3,concrete);box(.22,2.3,6.1,-6,1.15,0,concrete);
for(const x of [-5.85,-2.85,.45,3.75,5.35])box(.23,2.3,.24,x,1.15,3,concrete);
box(11.6,.36,.27,-.25,2.21,3.03,concrete);box(3,.95,.2,-.7,1.82,3.03,concrete);
// Storage material is intentionally sparse and secondary to the visible structure.
for(let i=0;i<35;i++){const o=box(.6+rnd()*.9,.07,.13,-4.8+rnd()*9.5,.2+rnd()*1.15,.5+rnd()*2,wood);o.rotation.y=rnd()*.8-.4;o.rotation.z=rnd()*.2-.1;}for(const x of [-4.4,1.5,3.4]){beam([x,.14,2.1],[x+.1,2.17,2.1],.08,.08,rust);box(.45,.48,.4,x,.32,2.1,rust);}
// Ochre brick upper room, raised above the remaining foundation.
wall(11.5,2.75,.24,-.25,3.825,3);wall(11.5,2.75,.24,-.25,3.825,-3);wall(.24,2.75,6,-6,3.825,0);wall(.24,2.75,6,5.5,3.825,0);
// Weathered door on long wall and two small old metal fittings.
box(.78,2.13,.1,-5.35,3.52,3.16,darkwood);for(const y of [2.49,4.55])box(.92,.08,.13,-5.35,y,3.18,wood);for(const x of [-5.77,-4.93])box(.08,2.18,.12,x,3.52,3.18,wood);box(.18,.22,.04,-2.35,4.76,3.15,rust);const fitting=new T.Mesh(new T.CylinderGeometry(.13,.13,.08,12),rust);fitting.rotation.x=Math.PI/2;fitting.position.set(-2.35,4.14,3.18);model.add(fitting);
// Main gable roof survives; its end cladding has a real hole exposing the framing.
const eave=5.23,rise=1.23,span=3.2;for(const s of [-1,1]){const m=box(11.95,.09,Math.hypot(span,rise),-.25,eave+rise/2,s*span/2,metal);m.rotation.x=s*Math.atan2(rise,span);}
beam([-6.25,6.49,0],[5.75,6.49,0],.09,.09,metal);
function gable(x,side,damaged){const sh=new T.Shape();sh.moveTo(-3,0);sh.lineTo(3,0);sh.lineTo(0,1.23);sh.closePath();if(damaged){const hole=new T.Path();hole.moveTo(-.55,.07);hole.lineTo(-.55,.75);hole.lineTo(.47,1.0);hole.lineTo(.47,.07);hole.closePath();sh.holes.push(hole);}const m=darkwood.clone();m.side=T.DoubleSide;const o=new T.Mesh(new T.ShapeGeometry(sh),m);o.rotation.y=side*Math.PI/2;o.position.set(x,5.23,0);o.castShadow=true;model.add(o);if(damaged){beam([x+.03,5.29,-.53],[x+.03,6.31,0],.095,.095,wood);beam([x+.03,6.31,0],[x+.03,5.29,.5],.095,.095,wood);}}
gable(5.64,1,true);gable(-6.14,-1,false);
for(let x=-6;x<5.6;x+=.54)for(const s of [-1,1])beam([x,5.15,s*2.85],[x,5.15,s*3.22],.07,.12,wood);
// End porch: concrete slab and partly lost flat canopy, with only surviving supports.
box(2.15,2.3,.22,6.52,1.15,-3,concrete);box(.23,2.3,6.2,7.55,1.15,0,concrete);box(2.25,.2,6.25,6.56,2.34,0,concrete);
box(.16,2.4,1.2,5.66,3.65,0,wood);box(.19,2.25,1.06,5.74,3.65,0,darkwood);for(const z of [-.64,.64])box(.12,2.5,.09,5.79,3.65,z,wood);for(const y of [2.47,4.84])box(.13,.08,1.4,5.79,y,0,wood);box(.09,.08,.14,5.88,3.61,.45,rust);
for(const z of [3.01,.93]){const p=box(.21,2.56,.2,7.42,3.66,z,wood);p.rotation.z=z===.93?.018:-.012;}
// The surviving right-hand brick fragment has an irregular top and broken edges.
wall(.27,2.43,2.05,7.53,3.65,-2.05);for(let i=0;i<7;i++){const y=4.9+(i%3)*.07;box(.29,.12,.28,7.53,y,-3+i*.3,i%3?mat('#c98e47'):pale);}for(let i=0;i<9;i++)box(.29,.1,.24,7.53,2.54+i*.24,-1.05+(i%3)*.055,i%4?mat('#c58a41'):pale);
beam([7.78,2.47,-.99],[7.8,4.76,-2.25],.36,.075,wood);
// Rusted I-section across porch front, ragged planks and exposed short rafters.
box(.13,.14,6.3,7.4,4.99,0,rust);for(const y of [4.9,5.08])box(.23,.035,6.3,7.4,y,0,rust);
for(let z=-3;z<=3;z+=.49)beam([5.55,5.11,z],[7.64,5.01,z],.095,.15,wood);
for(let x=5.55;x<7.65;x+=.2){for(let z=-3;z<3.1;z+=1.05){if(rnd()<.22)continue;const o=box(.18,.055,.65+rnd()*.39,x,5.18-rnd()*.075,z+.45,wood);o.rotation.x=rnd()*.07-.035;}}
for(let i=0;i<18;i++){const o=box(.18,.07,.35+rnd()*.6,7.53,5.13+(rnd()-.5)*.12,-2.8+i*.33,wood);o.rotation.x=(rnd()-.5)*.4;}
// Stair treads and rail fragments retain their damaged, uneven state.
for(let i=0;i<10;i++){if(i===6)continue;const o=box(1.36,.09,.27,5.52,2.26-i*.224,3.3+i*.27,wood);o.rotation.z=(i%3-1)*.04;o.rotation.y=(i%4-2)*.02;}
for(const x of [4.84,6.19]){beam([x,2.28,3.21],[x,.1,5.85],.13,.16,wood);beam([x,3.12,3.2],[x+.06,.98,5.82],.075,.075,wood);beam([x,.1,5.85],[x+.06,1.05,5.85],.075,.075,wood);}beam([4.84,3.12,3.2],[3.7,3.08,3.21],.07,.07,wood);beam([4.83,3.05,3.2],[4.7,2.6,4.6],.08,.08,wood);
// Surviving low foundation footprint extends into the absent half, never rebuilt above it.
for(let i=0;i<22;i++){const x=-6.2-i*.34;const h=Math.max(.25,2.2-i*.16);box(.34,h,.27,x,h/2,3.02,concrete);}box(7.5,.26,.28,-10,.13,-3,concrete);box(.28,.28,6,-13.7,.14,0,concrete);
// Concrete cracks, loose boards, salvage blocks and coiled cabling photographed at porch.
for(const x of [6.7,7.2])cable([[x,2.45,3.1],[x+.1,2.29,3.17],[x-.03,2.02,3.18],[x+.12,1.65,3.18]],.011,mat('#756e58'));
for(let i=0;i<20;i++){const o=box(.16,.05,.6+rnd()*1.4,6.3+rnd()*.9,2.48+rnd()*.25,-1.3+rnd(),wood);o.rotation.x=(rnd()-.5)*.55;o.rotation.y=rnd()*.9;}
for(let i=0;i<5;i++){const points=[];for(let t=0;t<=Math.PI*2.1;t+=.13)points.push([6.3+Math.cos(t)*(.3+i*.06),2.49+i*.012,1.65+Math.sin(t)*(.3+i*.04)]);cable(points,.008);}
for(let stack=0;stack<3;stack++)for(let j=0;j<5;j++){const o=box(.7,.13,.36,8.6+stack*.38,.13+j*.14,-2.9+stack*.5,stack%2?concrete:mat('#ba8a64'));o.rotation.y=(rnd()-.5)*.45;}
for(let i=0;i<24;i++){const o=box(.12+rnd()*.28,.07+rnd()*.12,.13+rnd()*.2,-12+rnd()*6,.1+rnd()*.1,1+rnd()*2,concrete);o.rotation.y=rnd()*Math.PI;}
// Restrained vine fragments on the obscured rear wall, not a replacement for architecture.
const vine=mat('#69704a');for(let i=0;i<7;i++){const x=-5+rnd()*9;const points=[];for(let k=0;k<8;k++)points.push([x+Math.sin(k*.9)*.24,.5+k*.5,-3.18]);cable(points,.009,vine);for(let k=0;k<9;k++){const leaf=new T.Mesh(new T.SphereGeometry(.08,5,3),vine);leaf.scale.set(1,.3,1.8);leaf.position.set(x+Math.sin(k)*.33,.7+k*.36,-3.22);leaf.rotation.z=k;model.add(leaf);}}

const root=new T.Group();for(const child of [...scene.children])root.add(child);return root;}
