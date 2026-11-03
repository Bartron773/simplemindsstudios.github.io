import * as T from 'three';
export function batch(root){
 root.updateMatrixWorld(true);const groups=new Map();
 root.traverse(o=>{if(!o.isMesh||Array.isArray(o.material))return;const key=o.material.uuid;if(!groups.has(key))groups.set(key,{material:o.material,geometries:[]});let g=o.geometry.clone();if(g.index)g=g.toNonIndexed();g.applyMatrix4(o.matrixWorld);groups.get(key).geometries.push(g);});
 const result=new T.Group();
 for(const {material,geometries}of groups.values()){const g=new T.BufferGeometry();for(const name of ['position','normal','uv']){const parts=geometries.map(o=>o.attributes[name]).filter(Boolean);if(parts.length!==geometries.length)continue;const array=new Float32Array(parts.reduce((n,a)=>n+a.array.length,0));let offset=0;for(const a of parts){array.set(a.array,offset);offset+=a.array.length;}g.setAttribute(name,new T.BufferAttribute(array,parts[0].itemSize));}const mesh=new T.Mesh(g,material);mesh.castShadow=true;mesh.receiveShadow=true;result.add(mesh);for(const old of geometries)old.dispose();}
 result.name=root.name;return result;
}
