import * as T from 'three';
const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.75,...extra});
const M={metal:mat('#aeb5b5',{metalness:.9,roughness:.27}),dark:mat('#252a32'),stone:mat('#b4ac9c'),cap:mat('#d5cdbc'),soil:mat('#37382b'),leaf:mat('#617449'),red:mat('#b91528',{roughness:.28}),glass:mat('#253b46',{metalness:.5,roughness:.17}),cream:mat('#d0c7af'),white:mat('#e3dfd1'),pink:mat('#d62694'),wood:mat('#655b4d'),chink:mat('#bfb6a2'),roof:mat('#9d9d98',{metalness:.65,roughness:.6})};
function mesh(g,geo,material,p=[0,0,0]){const m=new T.Mesh(geo,material);m.position.set(...p);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
const box=(g,w,h,d,p,m)=>mesh(g,new T.BoxGeometry(w,h,d),m,p);
const cyl=(g,r,h,p,m,r2=r)=>mesh(g,new T.CylinderGeometry(r,r2,h,24),m,p);
const ball=(g,r,p,m)=>mesh(g,new T.SphereGeometry(r,20,14),m,p);
function rod(g,a,b,r,m){const x=new T.Vector3(...a),y=new T.Vector3(...b),v=y.clone().sub(x);const o=cyl(g,r,v.length(),x.add(y).multiplyScalar(.5).toArray(),m);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return o;}
function label(g,text,w,h,p,bg='#31323a',fg='#eee4ce'){const c=document.createElement('canvas');c.width=1024;c.height=256;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,1024,256);x.fillStyle=fg;x.textAlign='center';x.textBaseline='middle';x.font='bold 78px Georgia';x.fillText(text,512,128,980);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return mesh(g,new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:t,roughness:.85}),p);}
function paving(g,w=18,d=16){box(g,w,.22,d,[0,-.12,0],mat('#8c8b88'));for(let x=-w/2+2;x<w/2;x+=2)box(g,.014,.005,d,[x,.001,0],M.dark);for(let z=-d/2+2;z<d/2;z+=2)box(g,w,.005,.014,[0,.001,z],M.dark);}
function planter(g,x,z,w=3,d=1.5){box(g,w,.65,d,[x,.33,z],M.stone);box(g,w+.12,.12,d+.12,[x,.72,z],M.cap);box(g,w-.3,.04,d-.3,[x,.79,z],M.soil);for(let i=0;i<12;i++){const a=i*2.4,xx=x+Math.sin(a)*(w/2-.3),zz=z+Math.cos(a)*(.4);rod(g,[xx,.8,zz],[xx,1.1+i%3*.12,zz],.018,M.leaf);const o=ball(g,.14,[xx,1.12+i%3*.12,zz],M.leaf);o.scale.y=.5;}for(let i=0;i<3;i++)ball(g,.13,[x-w/3+i*w/3,.95,z+.3],mat('#c87c32'));}
function bench(g,x,z,w=3){box(g,w,.65,1,[x,.34,z],M.stone);box(g,w+.1,.14,1.12,[x,.73,z],M.cap);for(let i=0;i<w*3;i++)box(g,.025,.5,.015,[x-w/2+i/3,.35,z+.51],M.dark);}
function tree(g,x,z,s=1){cyl(g,.12,2.2*s,[x,1.1*s,z],M.wood);for(let i=0;i<5;i++){const b=ball(g,.7*s,[x+Math.sin(i*2)*.5*s,2.1*s+i*.2*s,z+Math.cos(i*2)*.4*s],M.leaf);b.scale.y=1.3;}}
function light(g,p,color=0xffc988,power=16,range=10){const l=new T.PointLight(color,power,range,2);l.position.set(...p);l.userData.lamp=true;g.add(l);return l;}
function strings(g,a,b){const v=new T.Vector3(...a),end=new T.Vector3(...b),pts=[];for(let i=0;i<=24;i++){const t=i/24,p=v.clone().lerp(end,t);p.y-=Math.sin(t*Math.PI)*.6;pts.push(p);}mesh(g,new T.TubeGeometry(new T.CatmullRomCurve3(pts),24,.018,5,false),M.dark);for(let i=0;i<=12;i++){const p=pts[i*2].clone();p.y-=.11;ball(g,.075,p.toArray(),mat('#ffe4ac',{emissive:'#ffb84d',emissiveIntensity:2}));if(i%4===0)light(g,p.toArray(),0xffc77a,6,6);}}
function pole(g,x,z){cyl(g,.08,5.5,[x,2.75,z],M.dark);box(g,.4,.18,.4,[x,.09,z],M.dark);}
function tinman(g){
 const metal=M.metal,body=new T.Group();g.add(body);body.name='Tin Man sculptural interpretation';
 // Seated pose, with one raised knee and heart held at the chest.
 cyl(body,.64,2.35,[0,3.32,0],metal,.78);cyl(body,.68,.16,[0,2.18,0],metal,.72);
 for(let i=0;i<24;i++){const a=i/24*Math.PI*2;ball(body,.035,[Math.sin(a)*.7,2.2,Math.cos(a)*.7],metal);}
 cyl(body,.27,.45,[0,4.68,0],metal);cyl(body,.48,.94,[0,5.28,0],metal);box(body,.6,.25,.4,[0,4.83,.23],metal);
 const hat=mesh(body,new T.ConeGeometry(.56,1.45,32),metal,[0,6.38,0]);hat.rotation.z=-.1;cyl(body,.58,.05,[0,5.66,0],metal);
 for(const x of [-.52,.52]){const e=ball(body,.17,[x,5.3,.02],metal);e.scale.set(.3,1,1);}
 for(const x of [-.19,.19]){const eye=ball(body,.1,[x,5.38,.45],M.dark);eye.scale.set(1,.32,.2);rod(body,[x-.1,5.5,.43],[x+.08,5.53,.45],.035,metal);ball(body,.14,[x,5.16,.44],metal);}
 const nose=mesh(body,new T.ConeGeometry(.12,.35,4),metal,[0,5.24,.54]);nose.rotation.x=Math.PI/2;
 const smile=new T.CatmullRomCurve3([new T.Vector3(-.24,5.08,.43),new T.Vector3(0,4.99,.49),new T.Vector3(.24,5.08,.43)]);mesh(body,new T.TubeGeometry(smile,16,.025,6,false),M.dark);
 for(const s of [-1,1]){const bow=mesh(body,new T.ConeGeometry(.16,.38,3),metal,[s*.19,4.55,.36]);bow.rotation.z=s*Math.PI/2;}ball(body,.08,[0,4.55,.4],metal);
 rod(body,[-.76,4.27,0],[-1.02,3.0,.15],.23,metal);ball(body,.24,[-1.02,3,.15],metal);rod(body,[-1.02,3,.15],[.48,4.02,.91],.18,metal);
 const palm=ball(body,.23,[.5,4.05,1],metal);palm.scale.set(.8,1.2,.35);for(let i=0;i<4;i++)rod(body,[.37+i*.09,4.01+i*.035,1.1],[.58+i*.09,4.38-i*.07,1.08],.055,metal);
 rod(body,[.76,4.27,0],[1.05,3.15,.12],.24,metal);ball(body,.25,[1.05,3.15,.12],metal);rod(body,[1.05,3.15,.12],[.85,2.65,1.15],.19,metal);box(body,.46,.18,.4,[.83,2.62,1.22],metal);for(let i=0;i<4;i++)rod(body,[.64+i*.12,2.59,1.35],[.62+i*.13,2.1,1.44],.065,metal);
 rod(body,[-.4,2.15,0],[-.48,1.3,.75],.33,metal);rod(body,[-.48,1.3,.75],[-.48,.35,.85],.25,metal);box(body,.65,.3,1.05,[-.48,.15,1.14],metal);
 rod(body,[.43,2.15,0],[.55,2.25,1.15],.35,metal);ball(body,.37,[.55,2.25,1.15],metal);rod(body,[.55,2.25,1.15],[.55,.35,1.3],.28,metal);box(body,.7,.3,1.15,[.55,.15,1.6],metal);
 const h=new T.Shape();h.moveTo(0,-.35);h.bezierCurveTo(-.9,.2,-.35,.8,0,.38);h.bezierCurveTo(.35,.8,.9,.2,0,-.35);const heart=mesh(body,new T.ExtrudeGeometry(h,{depth:.14,bevelEnabled:true,bevelSize:.05,bevelThickness:.05,bevelSegments:3,steps:1}),M.red,[.52,4.02,.81]);heart.scale.setScalar(.75);heart.userData.heart=true;
 bench(g,0,-.25,2.5);return body;
}
function street(g){paving(g,18,24);for(const z of [-8,0,8]){for(const x of [-5,5])pole(g,x,z);strings(g,[-5,5.45,z],[5,5.45,z]);if(z<8)strings(g,[-5,5.45,z],[5,5.45,z+8]);planter(g,0,z,3,2);bench(g,0,z+2);}
 for(const x of [-8.5,8.5])for(let i=0;i<3;i++){const z=-8+i*7;box(g,2,5+i%2,6,[x,2.5+i%2*.5,z],M.cream);for(let j=0;j<2;j++)box(g,.03,1.5,1.5,[x>0?7.48:-7.48,3.5,z-1.5+j*3],M.glass);tree(g,x>0?6.5:-6.5,z,.7);}
}
function frame(g,x,y,z,w,h){const group=new T.Group();group.position.set(x,y,z);g.add(group);box(group,w+.16,h+.16,.12,[0,0,0],M.wood);box(group,w,h,.14,[0,0,.02],M.glass);box(group,.04,h,.02,[0,0,.1],M.cream);return group;}
function fiesta(g){paving(g,16,14);box(g,8,7,5,[0,3.5,-1.5],M.cream);for(const y of [6.7,6.9])box(g,8.35,.12,5.3,[0,y,-1.5],M.white);for(let i=0;i<24;i++)box(g,.13,.2,.2,[-3.8+i*.33,6.55,1.1],M.white);
 for(const x of [-2.5,0,2.5]){frame(g,x,5.05,1.05,.9,1.7);box(g,1.2,.13,.24,[x,6,1.12],M.wood);}
 box(g,5.8,.15,1.8,[-.5,2.9,1.65],M.dark);box(g,.23,2.8,.23,[2.35,1.4,2.4],M.cream);frame(g,-1.2,1.65,1.08,2.1,1.6);frame(g,1.2,1.3,1.08,.85,2.4);label(g,'La Fiesta',2,.45,[-1.2,1.6,1.18],'#1b1723','#f9b4bf');
 const glow=mat('#9a0d89',{emissive:'#e415b3',emissiveIntensity:.7});box(g,5.8,.025,.12,[-.5,2.8,2.4],glow);light(g,[-2,2.5,2.4],0xff138d,40,8);light(g,[2,2.4,2.1],0x7f32ff,45,8);planter(g,4.8,3,2,1.3);tree(g,-5,1,.9);
 for(const y of [.4,.8,1.2,1.6,2,2.4,3.2,3.6,4,4.4,4.8,5.2,5.6,6])box(g,7.9,.014,.01,[0,y,1.013],mat('#b2a990'));
}
function stella(g){paving(g,13,12);box(g,8,3.6,4,[0,1.8,-1],M.white);box(g,8.2,.23,4.2,[0,3.65,-1],M.dark);frame(g,-2.5,1.55,1.04,1.2,2.8);frame(g,.9,1.9,1.05,4.8,2.5);label(g,"Stella’s",1.6,.85,[0,2.65,1.2],'#e8e0d1','#313029');label(g,'213',.35,.5,[-3.65,2,1.1],'#ddd8cc','#262a2b');light(g,[-2.6,1.8,1.5],0x10d4ed,18,6);light(g,[1.9,2.8,1.5],0xffdc9c,12,5);
 for(let i=0;i<13;i++){const x=-3.8+i*.63;ball(g,.045,[x,3.45,1.1],mat('#ffe8b5',{emissive:'#ffdf9e',emissiveIntensity:2}));}
 box(g,5,.3,1.4,[.8,.18,2.3],M.cap);const ramp=box(g,2.5,.14,1.4,[4.5,.12,2.3],M.cap);ramp.rotation.z=-.1;for(const z of [1.7,2.95]){rod(g,[-1.5,1.1,z],[5.6,.6,z],.045,M.dark);rod(g,[-1.5,.7,z],[5.6,.3,z],.035,M.dark);for(let i=0;i<5;i++)rod(g,[-1.5+i*1.7,.05,z],[-1.5+i*1.7,1.1-i*.12,z],.04,M.dark);}
 box(g,1.25,.1,.7,[-3,1.45,3.1],M.pink);for(const x of [-3.5,-2.5])rod(g,[x,.03,3.1],[x,1.4,3.1],.06,M.pink);for(const x of [-4,-2]){cyl(g,.3,.1,[x,.9,3.3],M.dark);for(let i=0;i<3;i++){const a=i/3*6.28;rod(g,[x+Math.sin(a)*.24,.85,3.3+Math.cos(a)*.24],[x+Math.sin(a)*.35,0,3.3+Math.cos(a)*.35],.035,M.dark);}}tree(g,5,0,1.1);planter(g,0,4.5,3,1);
}
function cabin(g){
 const logMat=mat('#6e6252'),grain=mat('#4a4239');box(g,8,.35,5.6,[0,.15,0],M.stone);
 // Segmented front logs leave a real doorway and window opening.
 for(let row=0;row<10;row++){const y=.5+row*.34;for(const z of [-2.65,2.65]){const segments=z<0||y>2.9?[[-4,4]]:[[-4,.55],[1.55,1.85],[2.85,4]];for(const [a,b]of segments){box(g,b-a,.29,.3,[(a+b)/2,y,z],logMat);box(g,b-a,.055,.28,[(a+b)/2,y+.167,z],M.chink);for(let j=0;j<3;j++)box(g,(b-a)*.82,.008,.012,[(a+b)/2,y-.08+j*.07,z+(z>0?.157:-.157)],grain);}}
 for(const x of [-3.87,3.87])for(const [a,b]of [[-2.65,-.48],[.48,2.65]])box(g,.32,.29,b-a,[x,y,(a+b)/2],logMat);
 for(const x of [-3.87,3.87]){if(y<1||y>2.2)box(g,.32,.29,.96,[x,y,0],logMat);box(g,.28,.055,5.5,[x,y+.167,0],M.chink);}
 for(const x of [-4,4])for(const z of [-2.7,2.7])box(g,.45,.27,.5,[x,y,z],logMat);}
 for(const x of [-4,4]){const shape=new T.Shape();shape.moveTo(-2.65,3.75);shape.lineTo(2.65,3.75);shape.lineTo(0,5.15);shape.closePath();const o=mesh(g,new T.ShapeGeometry(shape),mat('#a29b8c',{side:T.DoubleSide}),[x,0,0]);o.rotation.y=Math.PI/2;for(let j=0;j<17;j++){const z=-2.6+j*.325,h=1.4*(1-Math.abs(z)/2.65);box(g,.04,h,.27,[x,3.75+h/2,z],mat(j%2?'#8f887c':'#a29b8c'));}}
 for(const s of [-1,1]){const roof=box(g,8.8,.08,3.25,[0,4.46,s*1.42],M.roof);roof.rotation.x=s*.488;for(let i=0;i<18;i++){const rib=box(g,.025,.035,3.25,[-4.25+i*.5,4.51,s*1.42],M.roof);rib.rotation.x=s*.488;}}
 frame(g,1.05,1.9,2.83,.85,1.65);box(g,.85,2.55,.13,[2.35,1.65,2.84],M.wood);for(let i=0;i<10;i++)box(g,.83,.012,.02,[2.35,.45+i*.25,2.92],grain);for(const x of [.5,1.6,1.8,2.9])box(g,.1,2.7,.12,[x,1.7,2.9],M.wood);label(g,'COBMOOSA',2.3,.34,[1.7,3.12,2.93],'#4c4233','#ede2c6');
 for(const x of [-4.08,4.08]){const win=frame(g,0,1.65,0,.8,1.2);win.position.set(x,1.65,0);win.rotation.y=x>0?Math.PI/2:-Math.PI/2;}
 box(g,8,2.1,1.9,[0,1.2,-3.65],logMat);const lean=box(g,8.5,.08,2.4,[0,2.65,-3.65],M.roof);lean.rotation.x=-.3;
 for(let i=0;i<25;i++){const a=i/25*6.28;ball(g,.2,[Math.sin(a)*4.05,.2,Math.cos(a)*2.8],M.stone);}
 box(g,13,.2,11,[0,-.15,0],M.leaf);tree(g,-5,-3,1.2);tree(g,5,-3,1.5);
}
function landscape(g){const geo=new T.PlaneGeometry(24,20,24,20);geo.rotateX(-Math.PI/2);const p=geo.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,-Math.max(0,-p.getX(i)-2)*.2+.07*Math.sin(p.getZ(i)));geo.computeVertexNormals();mesh(g,geo,M.leaf);const water=box(g,6,.05,18,[-10,-1.3,-1],mat('#2c6975',{metalness:.7,roughness:.15}));water.userData.water=true;const t=new T.Group();t.scale.setScalar(.55);t.position.set(5,0,-2);g.add(t);tinman(t);for(let i=0;i<10;i++)tree(g,-6+i*1.6,-8,.7+i%3*.2);planter(g,5,2,3,1.2);bench(g,1,3,2.5);light(g,[5,2,2],0xffce8a,30,12);}
export const builders={tinman:g=>{paving(g,7,7);tinman(g);planter(g,-2.3,-1,1.4,1);planter(g,2.3,-1,1.4,1);},lights:street,fiesta,stella,landscape,cabin};
export function build(id){const g=new T.Group();g.name=id;builders[id](g);return g;}
