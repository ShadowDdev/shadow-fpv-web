import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import React,{useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RotateCcw,RotateCw,Maximize,Minimize,Cpu} from 'lucide-react';
import './hardware.css';
function combineMeshes(source){
 const batches=new Map();source.updateMatrixWorld(true);
 source.traverse(mesh=>{if(!mesh.isMesh)return;const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];const base=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry.clone();const groups=base.groups.length?base.groups:[{start:0,count:base.attributes.position.count,materialIndex:0}];
 for(const group of groups){const mat=materials[group.materialIndex||0],part=new THREE.BufferGeometry();for(const name of ['position','normal','uv']){const attr=base.attributes[name];if(attr)part.setAttribute(name,new THREE.Float32BufferAttribute(attr.array.slice(group.start*attr.itemSize,(group.start+group.count)*attr.itemSize),attr.itemSize));}part.applyMatrix4(mesh.matrixWorld);const key=mat.uuid+Object.keys(part.attributes).join();if(!batches.has(key))batches.set(key,{mat,parts:[]});batches.get(key).parts.push(part);}base.dispose();mesh.geometry.dispose();});
 const result=new THREE.Group();for(const {mat,parts} of batches.values()){const geometry=mergeGeometries(parts);if(geometry)result.add(new THREE.Mesh(geometry,mat));parts.forEach(p=>p.dispose());}return result;
}
function buildHardware(code){
 const g=new THREE.Group();
 const material=(color,metalness=.5,roughness=.4)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
 const board=material(0x30233e,.35),black=material(0x16171d,.35),purple=material(0x9870c9,.75),gold=material(0xd9b56b,.85),silver=material(0xbec3cb,.85),copper=material(0xc47740,.85);
 function mesh(geo,mat,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);g.add(m);return m;}
 function box(w,h,d,x,y,z,mat=black){return mesh(new THREE.BoxGeometry(w,h,d),mat,x,y,z);}
 function cyl(r,h,x,y,z,mat=purple){const m=mesh(new THREE.CylinderGeometry(r,r,h,48),mat,x,y,z);m.rotation.x=Math.PI/2;return m;}
 function label(text,x,y,z,width){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#eee4ff';ctx.textAlign='center';ctx.font='bold 48px monospace';ctx.fillText(text,256,77);const texture=new THREE.CanvasTexture(c);const m=mesh(new THREE.PlaneGeometry(width,width/4),new THREE.MeshBasicMaterial({map:texture,transparent:true}),x,y,z);return m;}
 if(code==='MTR'){
 cyl(1.25,.22,0,0,-.6,black);cyl(.98,.7,0,0,-.18,black);
 for(let i=0;i<12;i++){const a=i*Math.PI/6;cyl(.21,.55,Math.cos(a)*.81,Math.sin(a)*.81,-.05,copper);}
 const shell=mesh(new THREE.TorusGeometry(1.12,.17,16,64),purple,0,0,.3);
 cyl(.37,.18,0,0,.44,purple);for(let i=0;i<6;i++){const a=i*Math.PI/3;const spoke=box(.83,.16,.12,Math.cos(a)*.66,Math.sin(a)*.66,.42,purple);spoke.rotation.z=a;}
 cyl(.13,1.1,0,0,.85,silver);cyl(.24,.18,0,0,1.1,black);
 for(let i=0;i<4;i++){const a=i*Math.PI/2;cyl(.16,.12,Math.cos(a)*1.1,Math.sin(a)*1.1,-.75,silver);}
 label('SHADOW',0,-.57,.52,.9);
 }else if(code==='FRM'){
 for(const sign of [-1,1]){const arm=box(.32,5.2,.16,0,0,0,black);arm.rotation.z=sign*Math.PI/4;}
 for(const x of [-1.73,1.73])for(const y of [-1.73,1.73]){cyl(.32,.15,x,y,0,black);for(let i=0;i<4;i++){const a=i*Math.PI/2;cyl(.055,.03,x+Math.cos(a)*.19,y+Math.sin(a)*.19,.09,silver);}}
 box(1.15,2.2,.12,0,0,.1,black);box(1.05,1.7,.1,0,0,.72,board);
 for(const x of [-.44,.44])for(const y of [-.69,.69]){cyl(.07,.6,x,y,.4,purple);cyl(.1,.05,x,y,.8,silver);}
 label('SHADOW',0,0,.785,.85);
 }else{
 const rx=code==='RX',w=rx?1.35:3.3,h=rx?2.3:3.3;
 const shape=new THREE.Shape();const r=.16;shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
 if(!rx)for(const x of [-1.35,1.35])for(const y of [-1.35,1.35]){const hole=new THREE.Path();hole.absarc(x,y,.12,0,Math.PI*2,true);shape.holes.push(hole);mesh(new THREE.TorusGeometry(.14,.025,8,24),gold,x,y,.12);}
 mesh(new THREE.ExtrudeGeometry(shape,{depth:.1,bevelEnabled:false}),board);
 if(code==='ESC'){for(const x of [-.9,0,.9])for(const y of [-.6,.25]){box(.56,.53,.14,x,y,.17);for(let i=0;i<4;i++){box(.06,.12,.04,x-.2+i*.13,y-.33,.12,gold);box(.06,.12,.04,x-.2+i*.13,y+.33,.12,gold);}}}
 else{box(rx?.64:1,rx?.64:1,.15,0,0,.18);for(let i=0;i<8;i++){const t=-.42+i*.12;for(const s of [-1,1]){box(.055,.16,.04,t,s*.58,.15,silver);box(.16,.055,.04,s*.58,t,.15,silver);}}}
 for(let i=0;i<(rx?5:10);i++){const x=-w/2+.24+i*(w-.48)/(rx?4:9);box(.14,.25,.035,x,-h/2+.13,.12,gold);if(!rx)box(.14,.25,.035,x,h/2-.13,.12,gold);}
 for(let i=0;i<18;i++){const x=-w/2+.24+(i%6)*(w-.48)/5,y=-h/2+.55+Math.floor(i/6)*(h-1.1)/2;if(Math.abs(x)<.65&&Math.abs(y)<.7)continue;box(.12,.23,.07,x,y,.15,silver);box(.08,.07,.08,x,y,.19,black);}
 if(code==='FC'){box(.65,.36,.22,0,1.19,.2,silver);box(.49,.16,.23,0,1.28,.21,black);}
 if(rx){const wire=box(.035,1.3,.035,0,1.75,.12,black);box(1.5,.055,.06,0,2.4,.12,black);cyl(.095,.08,0,.8,.18,gold);}
 for(let i=0;i<6;i++){const x=-w/2+.28+i*(w-.56)/5;box(.018,.4,.005,x,-.8,.106,gold);}
 label('SHADOW '+code,0,-h/2+.5,.22,rx?.95:1.4);
 }
 return g;
}
export default function HardwareViewer({code='FC',view='Perspective',compact=false,thumbnail=false}){
 const mount=useRef(),api=useRef();const [failed,setFailed]=useState(false);const [rotate,setRotate]=useState(false);const [expanded,setExpanded]=useState(false);
 useEffect(()=>{let renderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{setFailed(true);return;}
 const el=mount.current;renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));renderer.setClearColor(0x000000,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(36,1,.1,100);const model=buildHardware(code);scene.add(model);let cancelled=false;
 if(code==='FC'){new MTLLoader().load('/models/fc.mtl',materials=>{materials.preload();new OBJLoader().setMaterials(materials).load('/models/fc.obj',object=>{if(cancelled){object.traverse(o=>{o.geometry?.dispose();});return;}object=combineMeshes(object);const bounds=new THREE.Box3().setFromObject(object),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());object.position.sub(center);const wrapper=new THREE.Group();wrapper.add(object);wrapper.scale.setScalar(3.5/Math.max(size.x,size.y,size.z));scene.remove(model);scene.add(wrapper);},undefined,()=>{});},undefined,()=>{});}
scene.add(new THREE.HemisphereLight(0xffffff,0x303030,1.5));for(const [color,power,pos] of [[0xffffff,2.5,[3,5,7]],[0xffffff,1.2,[-4,0,4]],[0xffffff,.8,[0,-4,2]]]){const l=new THREE.DirectionalLight(color,power);l.position.set(...pos);scene.add(l);}
 const controls=new OrbitControls(camera,renderer.domElement);controls.enabled=!thumbnail;controls.enablePan=false;controls.enableZoom=false;controls.enableDamping=true;controls.minDistance=5;controls.maxDistance=20;controls.autoRotateSpeed=1.2;
 function reset(nextView='Perspective'){const distance=code==='FRM'?11:code==='RX'?9:8.3;camera.position.set(...(nextView==='Top'?[0,0,distance]:[distance*.4,-distance*.46,distance*.8]));controls.target.set(0,code==='RX'?.35:0,0);controls.update();}
 reset(view);api.current={controls,reset};let visible=true;const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});visibility.observe(el);const resize=new ResizeObserver(()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();});resize.observe(el);let frame;function draw(){frame=requestAnimationFrame(draw);if(!visible||document.hidden)return;controls.update();renderer.render(scene,camera);}draw();
 return()=>{cancelled=true;cancelAnimationFrame(frame);resize.disconnect();visibility.disconnect();controls.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{m.map?.dispose();m.dispose();});}});renderer.dispose();renderer.domElement.remove();api.current=null;};
 },[code]);
 useEffect(()=>{api.current?.reset(view);},[view]);useEffect(()=>{if(api.current)api.current.controls.autoRotate=rotate;},[rotate]);
 return <div className={'hardware-viewer '+(compact?'viewer-compact ':'')+(expanded?'viewer-expanded':'')+(thumbnail?' viewer-thumbnail':'')}><div ref={mount} className="hardware-canvas" role="img" aria-label={thumbnail?'OpenFC Lite Mini reference model': 'Interactive '+code+' concept model. Drag to rotate; use view controls for fixed angles.'}>{failed&&<div className="viewer-fallback"><Cpu size={64}/><p>3D preview unavailable on this device.</p><span>Product information is available below.</span></div>}</div><span className="viewer-label">{code==='FC'?'OPENFC LITE MINI / SUPPLIED REFERENCE':'SHADOW / '+code+' · CONCEPT MODEL'}</span>{!thumbnail&&<div className="viewer-controls"><button onClick={()=>api.current?.reset(view)} aria-label="Reset model view"><RotateCcw size={16}/></button><button aria-pressed={rotate} aria-label={rotate?'Pause rotation':'Auto-rotate model'} onClick={()=>setRotate(!rotate)}><RotateCw size={16}/></button>{!compact&&<button aria-expanded={expanded} aria-label={expanded?'Reduce model size':'Enlarge model'} onClick={()=>setExpanded(!expanded)}>{expanded?<Minimize size={16}/>:<Maximize size={16}/>}</button>}</div>}{!thumbnail&&<span className="viewer-hint">DRAG TO ROTATE · ILLUSTRATIVE GEOMETRY</span>}</div>;
}





