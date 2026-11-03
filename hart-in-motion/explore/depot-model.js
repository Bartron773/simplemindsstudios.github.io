import * as T from 'three';
export function build(){const scene=new T.Scene();
const building=new T.Group();building.name='Hart Railroad Depot — approximate photo reconstruction';scene.add(building);
let seed=42;function rand(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}
function texture(kind){const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.fillStyle=kind==='roof'?'#645f58':kind==='wood'?'#80705a':'#283745';x.fillRect(0,0,512,512);for(let i=0;i<14000;i++){const v=rand();x.fillStyle=`rgba(${v>.5?'255,255,255':'0,0,0'},${rand()*.065})`;x.fillRect(rand()*512,rand()*512,kind==='wood'?50:20,1);}if(kind==='roof'){for(let y=0;y<512;y+=32){for(let a=-32;a<512;a+=64){const xx=a+(y%64?32:0);x.fillStyle=`rgba(0,0,0,${.04+rand()*.13})`;x.fillRect(xx,y,62,30);x.fillStyle='#292b2a';x.fillRect(xx,y+30,64,2);x.fillRect(xx,y,1,32);}}}else if(kind==='siding'){for(let y=0;y<512;y+=32){x.fillStyle='#152330';x.fillRect(0,y,512,2);x.fillStyle='#607080';x.globalAlpha=.22;x.fillRect(0,y+2,512,1);x.globalAlpha=1;}}const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t;}
const siding=texture('siding'),woodtex=texture('wood'),rooftex=texture('roof');
function mat(color,roughness=.85,map=null){return new T.MeshStandardMaterial({color,roughness,map});}
const navy=mat('#c5c8cd',.91,siding),navySolid=mat('#293746'),trim=mat('#dddcd0'),brown=mat('#c6b59c',.94,woodtex),bracket=mat('#283139'),foundation=mat('#57564e'),glass=mat('#23323b',.22);glass.metalness=.24;const roofmat=mat('#b8b3ab',.98,rooftex);
function box(w,h,d,x,y,z,m=navySolid,parent=building){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function beam(a,b,w=.12,d=w,m=bracket,parent=building){const av=new T.Vector3(...a),bv=new T.Vector3(...b),delta=bv.clone().sub(av);const o=box(w,delta.length(),d,0,0,0,m,parent);o.position.copy(av.add(bv).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return o;}
// Length 22.5, width 7.5, eaves 1.2. Dimensions are inferred rather than surveyed.
box(22.5,.45,7.5,0,.225,0,foundation);box(22.5,3.5,7.5,0,2.2,0,navy);
// Individually modeled clapboard edges along both long elevations.
for(const z of [-3.775,3.775])for(let y=.52;y<3.95;y+=.135)box(22.48,.014,.025,0,y,z,mat('#1e2b39'));
const profile=new T.Shape();profile.moveTo(-3.75,0);profile.lineTo(3.75,0);profile.lineTo(0,1.95);profile.closePath();
for(const side of [-1,1]){const geo=new T.ShapeGeometry(profile);const m=new T.Mesh(geo,navySolid);m.rotation.y=Math.PI/2*side;m.position.set(side*11.255,3.95,0);m.castShadow=true;m.receiveShadow=true;building.add(m);}
// Vertical boards on the distinctive three-window end.
for(let z=-3.72;z<3.75;z+=.16){const cap=3.95+1.95*(1-Math.abs(z)/3.75);box(.026,cap-.47,.012,11.27,(cap+.47)/2,z,bracket);}
const overhang=4.95,rise=2.57,slope=Math.atan2(rise,overhang),span=Math.hypot(overhang,rise);
rooftex.repeat.set(5,1.4);for(const s of [-1,1]){const o=box(25.1,.12,span,0,4.62,s*overhang/2,roofmat);o.rotation.x=s*slope;beam([-12.55,3.33,s*overhang],[12.55,3.33,s*overhang],.16,.13,bracket);}
beam([-12.6,5.94,0],[12.6,5.94,0],.13,.13,bracket);
for(const x of [-12.54,12.54]){beam([x,3.32,-4.95],[x,5.91,0],.16,.16,brown);beam([x,5.91,0],[x,3.32,4.95],.16,.16,brown);beam([x,4.7,-2.3],[x,4.7,2.3],.12,.12,bracket);beam([x,4.7,0],[x,5.91,0],.12,.12,bracket);beam([x,4.7,0],[x,5.55,-.72],.1,.1);beam([x,4.7,0],[x,5.55,.72],.1,.1);}
for(const x of [-10.8,-7.1,-3.5,0,3.7,7.4,10.8])for(const s of [-1,1]){beam([x,2.95,s*3.76],[x,3.88,s*4.65],.12,.12);beam([x,3.87,s*3.76],[x,3.87,s*4.65],.12,.12);}
box(.48,.75,.5,-.8,5.84,-.6,mat('#815c47'));for(let y=5.5;y<6.2;y+=.13)box(.5,.018,.52,-.8,y,-.6,mat('#b4a08a'));
function opening(parent,w,h,x,y,window=true,transom=false){box(w+.2,h+.2,.09,x,y,0,trim,parent);box(w,h,.12,x,y,.035,window?glass:trim,parent);box(w+.3,.095,.18,x,y-h/2-.09,.07,trim,parent);if(window){box(w,.055,.06,x,y,.12,trim,parent);box(.038,h,.06,x,y,.12,trim,parent);}else{for(let a=-h/2;a<h/2;a+=.13){const length=Math.min(w,(h/2-a)*1.15);if(length>0)beam([x-w/2,y+a,.105],[x-w/2+length,y+a+length*.85,.105],.013,.013,mat('#b8b9b0'),parent);}box(.055,.13,.05,x+w*.35,y-.08,.14,bracket,parent);}if(transom){box(w+.15,.42,.08,x,y+h/2+.34,0,trim,parent);box(w,.31,.11,x,y+h/2+.34,.045,glass,parent);for(let k=-w/2;k<=w/2;k+=w/5)box(.035,.33,.04,x+k,y+h/2+.34,.12,trim,parent);}}
function face(z,rot=0){const g=new T.Group();g.position.z=z;g.rotation.y=rot;building.add(g);return g;}
const front=face(3.81);opening(front,1.55,2.1,-7.2,2,false,true);opening(front,1.7,2.1,3,2,false,true);opening(front,.67,.83,5.15,2.95);opening(front,.83,1.98,8.1,1.73,false);
const back=face(-3.81,Math.PI);opening(back,1.1,2.15,-7.8,2.25);opening(back,.85,1.1,-4.1,2.05);opening(back,1.7,2.15,-.7,1.94,false);opening(back,.9,2.04,8.55,1.75,false);
const end=new T.Group();end.position.x=11.31;end.rotation.y=Math.PI/2;building.add(end);for(const x of [-1.02,0,1.02])opening(end,.84,1.97,x,2.14,true);
const other=new T.Group();other.position.x=-11.31;other.rotation.y=-Math.PI/2;building.add(other);opening(other,1.95,2.72,0,1.94,false);opening(other,.83,1.3,-1.94,2.87);opening(other,.83,1.3,1.94,2.87);
function deck(x,len,z,sign){const g=new T.Group();building.add(g);box(len,.22,1.82,x,.83,z,brown,g);for(let xx=x-len/2;xx<x+len/2;xx+=.17)box(.014,.012,1.8,xx,.947,z,foundation,g);for(let xx=x-len/2+.1;xx<x+len/2;xx+=1.65){box(.16,1.9,.16,xx,.96,z+sign*.78,brown,g);box(.16,.77,.16,xx,.39,z-sign*.7,brown,g);}box(len, .12,.15,x,1.91,z+sign*.78,brown,g);box(len,.08,.1,x,1.05,z+sign*.78,brown,g);for(let xx=x-len/2+.15;xx<x+len/2;xx+=.19)box(.055,.86,.055,xx,1.46,z+sign*.78,brown,g);const edge=x+len/2;for(let i=0;i<6;i++){box(.32,.15,1.45,edge+.16+i*.28,.79-i*.13,z,brown,g);}for(const zz of [z-.72,z+.72]){beam([edge,1.9,zz],[edge+1.7,1.05,zz],.11,.11,brown,g);for(let i=0;i<6;i++)box(.06,.9,.06,edge+i*.29,1.4-i*.14,zz,brown,g);}}
deck(6.55,7.55,4.65,1);deck(-8.6,4.7,-4.65,-1);

const root=new T.Group();for(const child of [...scene.children])root.add(child);return root;}
