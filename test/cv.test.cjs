const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const {jsPDF}=require('jspdf');
const rules=require('../assets/js/site/data.js');
const pdf=require('../assets/js/site/pdf.js');
const base=()=>({name:'María Núñez',title:'Desarrolladora junior',email:'maria@example.com',phone:'',birthday:'',link:'',summary:'',...Object.fromEntries(Object.keys(rules.groups).map(key=>[key,[]]))});
function app(){
 const dom=new JSDOM(fs.readFileSync(path.join(__dirname,'../index.html'),'utf8'),{runScripts:'outside-only',url:'https://example.com/generador-de-cv/'});
 dom.window.confirm=()=>true;dom.window.print=()=>{};
 for(const file of ['data.js','pdf.js','index.js']) dom.window.eval(fs.readFileSync(path.join(__dirname,'../assets/js/site',file),'utf8'));
 return dom;
}
const input=(window,id,value)=>{const el=window.document.getElementById(id);el.value=value;el.dispatchEvent(new window.Event('input',{bubbles:true}));};
const submit=window=>window.document.getElementById('formulario').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));

test('minimal profile accepts optional blank sections and Spanish names',()=>{assert.deepEqual(rules.validate(base()),[]);});
test('contact, URL, birthday, whitespace and length validation',()=>{
 for(const [key,value] of [['name','  '],['email','invalid'],['phone','1234'],['link','javascript:alert(1)'],['link','data:text/html,hi'],['birthday','2099-01-01'],['birthday','2025-02-30'],['summary','x'.repeat(3001)]]) assert.ok(rules.validate({...base(),[key]:value}).some(error=>error.field===key),key);
 assert.equal(rules.safeUrl('https://example.com'), 'https://example.com/');
 assert.equal(rules.safeUrl('https://name:password@example.com'),null);
});
test('validates complete rows, date order, ongoing periods and ratings',()=>{
 const data=base();data.experience=[{id:'entry-1',name:'Dev',org:'Empresa',start:'2025-01',end:'2024-12',current:false,description:''}];
 assert.ok(rules.validate(data).some(error=>error.field==='entry-1-end'));
 data.experience[0].current=true;assert.deepEqual(rules.validate(data),[]);
 data.skills=[{id:'entry-2',name:'JS',level:'6'}];assert.ok(rules.validate(data).some(error=>error.field==='entry-2-level'));
 data.skills[0].level='3';assert.deepEqual(rules.validate(data),[]);
 assert.equal(rules.period(data.experience[0]),'01/2025 - Actualidad');
});
test('form keeps data, regenerates one preview and does not render input as HTML',()=>{
 const {window}=app();input(window,'name','<img src=x onerror=alert(1)>');input(window,'title','Developer');input(window,'email','alex@example.com');submit(window);
 const doc=window.document;assert.equal(doc.querySelectorAll('.cv-document').length,1);assert.equal(doc.querySelector('#preview img'),null);assert.ok(doc.getElementById('preview').textContent.includes('<img'));
 assert.equal(doc.getElementById('name').value,'<img src=x onerror=alert(1)>');
 input(window,'name','María Núñez');assert.equal(doc.getElementById('download').disabled,true);submit(window);
 assert.equal(doc.querySelectorAll('.cv-document').length,1);assert.equal(doc.getElementById('download').disabled,false);assert.equal(doc.getElementById('name').value,'María Núñez');window.close();
});
test('dynamic entries can be added, removed and labels/IDs stay unique',()=>{
 const {window}=app(),doc=window.document;for(const button of doc.querySelectorAll('[data-add]')) {button.click();button.click();}
 const ids=Array.from(doc.querySelectorAll('[id]'),el=>el.id);assert.equal(ids.length,new Set(ids).size);
 for(const label of doc.querySelectorAll('label[for]')) assert.ok(doc.getElementById(label.htmlFor));
 const rows=doc.getElementById('skills-rows');assert.equal(rows.children.length,3);rows.querySelector('[data-remove]').click();assert.equal(rows.children.length,2);
 doc.querySelector('[data-add="skills"]').click();assert.equal(rows.children.length,3);window.close();
});
test('example validates, ongoing dates disable end field and clearing is explicit',()=>{
 const {window}=app(),doc=window.document;doc.getElementById('example').click();assert.ok(doc.getElementById('preview').textContent.includes('Alex Rivera'));submit(window);assert.equal(doc.getElementById('errors').hidden,true);
 const row=doc.getElementById('education-rows').firstElementChild;assert.equal(row.querySelector('[data-field="end"]').disabled,true);
 const check=row.querySelector('[data-field="current"]');check.checked=false;check.dispatchEvent(new window.Event('change',{bubbles:true}));assert.equal(row.querySelector('[data-field="end"]').disabled,false);submit(window);assert.equal(doc.getElementById('errors').hidden,false);
 window.confirm=()=>false;doc.getElementById('clear').click();assert.equal(doc.getElementById('name').value,'Alex Rivera');window.confirm=()=>true;doc.getElementById('clear').click();assert.equal(doc.getElementById('name').value,'');assert.equal(doc.getElementById('download').disabled,true);window.close();
});
test('incomplete dynamic rows show field errors and keep the last preview',()=>{
 const {window}=app(),doc=window.document;doc.getElementById('example').click();const old=doc.getElementById('preview').textContent;doc.querySelector('[data-add="skills"]').click();const row=doc.getElementById('skills-rows').lastElementChild;row.querySelector('[data-field="name"]').value='CSS';submit(window);
 assert.equal(doc.getElementById('errors').hidden,false);assert.equal(row.querySelector('[data-field="level"]').getAttribute('aria-invalid'),'true');assert.equal(doc.getElementById('preview').textContent,old);assert.equal(doc.getElementById('download').disabled,true);window.close();
});
test('missing PDF library gives actionable feedback; printing remains available',()=>{
 const {window}=app(),doc=window.document;doc.getElementById('example').click();doc.getElementById('download').click();assert.ok(doc.getElementById('status').textContent.includes('Imprimir'));assert.equal(doc.getElementById('download').disabled,false);let calls=0;window.print=()=>calls++;doc.getElementById('print').click();assert.equal(calls,1);window.close();
});
test('PDF is selectable text, one page for a short CV and paginated for long content',()=>{
 const data=base();data.summary='Programación, organización y atención a los detalles.';
 const short=pdf.createPdf(data,jsPDF);assert.equal(short.getNumberOfPages(),1);
 const out=process.env.CV_QA_DIR||'/tmp/cv-qa';fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/short.pdf',Buffer.from(short.output('arraybuffer')));
 data.summary='Trabajo en equipo y documentación. '.repeat(70);
 data.education=[{name:'Desarrollo de Software',org:'ITLA',start:'2024-01',end:'',current:true,description:'Formación en programación y bases de datos.'}];
 data.experience=Array.from({length:14},(_,i)=>({name:'Puesto '+(i+1),org:'Equipo de ejemplo',start:'2024-01',end:'2025-01',current:false,description:('Logro '+(i+1)+': validé entradas, documenté procesos y colaboré con el equipo. ').repeat(12)}));
 data.certifications=[{name:'CERTIFICACION-FINAL',org:'Entidad de ejemplo',start:'2025-01',end:'2025-03',current:false,description:'FIN-DEL-CV'}];
 const long=pdf.createPdf(data,jsPDF);assert.ok(long.getNumberOfPages()>2);fs.writeFileSync(out+'/long.pdf',Buffer.from(long.output('arraybuffer')));
 // The PDF remains text-based instead of using raster screenshots.
 for(let page=1;page<=long.getNumberOfPages();page++) {const stream=long.internal.pages[page].join('\n');assert.ok(!stream.includes('/Subtype /Image'));}
 assert.ok(pdf.filename('../../María Núñez').startsWith('CV-'));assert.ok(!pdf.filename('../../María Núñez').includes('/'));
});
test('PDF rejects unsupported glyphs with print fallback instead of corrupting text',()=>{
 const data=base();data.name='姓名';assert.throws(()=>pdf.createPdf(data,jsPDF),/Imprimir/);
});
