import * as T from 'three';
import {build as depot} from './depot-model.js';
import {build as caboose} from './caboose-model.js';
import {build as heritage} from './heritage-model.js';
import {build as fishery} from './fishery-model.js';
import {build as later} from './night-models.js';
import {school,pavilion,tower} from './new-models.js';
import {church,loghouse,outhouse,mill} from './heritage-models.js';
import {batch} from './geometry.js';
const builders={church,loghouse,outhouse,mill,depot,caboose,heritage,fishery,school,pavilion,tower};
const cache=new Map();
export function build(id){if(cache.has(id))return cache.get(id);let root=builders[id]?builders[id]():later(id);if(['depot','caboose','heritage','fishery'].includes(id))root=batch(root);root.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(root);root.userData.bounds={min:bounds.min.toArray(),max:bounds.max.toArray()};cache.set(id,root);return root;}
