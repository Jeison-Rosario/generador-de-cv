/* Form/controller: user content is always rendered as text, never HTML. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const { groups, levels, clean, safeUrl, validate, period } = window.CVData;
  const personal = ['name','title','email','phone','birthday','link','summary'];
  const form = $('formulario');
  let sequence = 0, generated = null;
  function node(tag, text, className) {
    const el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (className) el.className = className;
    return el;
  }
  function field(row, name, label, type='text', maxLength=140) {
    const wrap = node('div', undefined, 'field');
    const id = row.id + '-' + name;
    const input = node(type === 'textarea' ? 'textarea' : type === 'select' ? 'select' : 'input');
    input.id = id; input.dataset.field = name;
    if (input.tagName === 'INPUT') input.type = type;
    if (type === 'textarea') input.rows = 3;
    if (['text','textarea'].includes(type)) input.maxLength = maxLength;
    if (type === 'month') input.min = '1900-01';
    if (type === 'select') {
      const empty = node('option', 'Selecciona un nivel'); empty.value=''; input.append(empty);
      levels.forEach((level,i) => {const opt=node('option', `${i+1} · ${level}`); opt.value=String(i+1); input.append(opt);});
    }
    const lab = node('label',label);lab.htmlFor=id;
    const error=node('p','', 'field-error');error.id=id+'-error';input.setAttribute('aria-describedby',error.id);
    wrap.append(lab,input,error); return wrap;
  }
  function addRow(key, values={}, focus=true) {
    const container = $(key+'-rows');
    if (container.children.length>=20) { $('status').textContent='Puedes agregar hasta 20 entradas por sección.';return; }
    const group = groups[key], row = node('fieldset',undefined,'row-card');
    row.id='entry-'+(++sequence);row.dataset.group=key;
    row.append(node('legend',group.name+' · '+(container.children.length+1)));
    const fields=node('div',undefined,'fields'+(group.kind==='rating'?' rating-fields':''));
    fields.append(field(row,'name',group.name));
    if (group.kind==='rating') fields.append(field(row,'level','Nivel de manejo','select'));
    else {
      fields.append(field(row,'org',group.org),field(row,'start','Desde','month'),field(row,'end','Hasta','month'));
      const checkWrap=node('div',undefined,'field wide');
      const label=node('label',undefined,'check');const current=node('input');current.type='checkbox';current.id=row.id+'-current';current.dataset.field='current';
      label.append(current,document.createTextNode('En curso / empleo actual'));checkWrap.append(label);fields.append(checkWrap);
      const desc=field(row,'description','Logros o descripción (opcional)','textarea',2000);desc.classList.add('wide');fields.append(desc);
    }
    const remove=node('button','Eliminar entrada','secondary remove');remove.type='button';remove.dataset.remove='true';remove.setAttribute('aria-label','Eliminar entrada de '+group.label);
    row.append(fields,remove);container.append(row);
    for (const [name,value] of Object.entries(values)) {
      const input=row.querySelector('[data-field="'+name+'"]');if(!input) continue;
      if(name==='current') input.checked=Boolean(value);else input.value=value;
    }
    syncCurrent(row);
    if(focus) row.querySelector('input').focus();
  }
  function syncCurrent(row) {
    const check=row.querySelector('[data-field="current"]');
    if(check) row.querySelector('[data-field="end"]').disabled=check.checked;
  }
  function initGroups() {
    for(const [key,group] of Object.entries(groups)) {
      const section=node('section',undefined,'group');section.setAttribute('aria-labelledby',key+'-title');
      const title=node('h3',group.label);title.id=key+'-title';section.append(title,node('p','Opcional. Las entradas completamente vacías no se incluyen.'));
      const rows=node('div');rows.id=key+'-rows';
      const add=node('button','Agregar '+group.name.toLowerCase(),'secondary');add.type='button';add.dataset.add=key;
      section.append(rows,add);$('dynamic-sections').append(section);addRow(key,{},false);
    }
  }
  function collect() {
    const data={};for(const key of personal) data[key]=clean($(key).value);
    const url=safeUrl(data.link);if(url) data.link=url;
    for(const key of Object.keys(groups)) {
      data[key]=Array.from($(key+'-rows').children).map(row=>{
        const value={id:row.id};row.querySelectorAll('[data-field]').forEach(input=>{value[input.dataset.field]=input.type==='checkbox'?input.checked:clean(input.value);});return value;
      }).filter(row=>Object.entries(row).some(([key,value])=>key!=='id'&&value!==''&&value!==false));
    }
    return data;
  }
  function clearErrors() {
    form.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
    document.querySelectorAll('.field-error').forEach(el=>el.textContent='');$('errors').replaceChildren();$('errors').hidden=true;
  }
  function showErrors(errors) {
    clearErrors();if(!errors.length) return;
    const list=node('ul');$('errors').append(node('strong','Revisa los siguientes campos:'),list);$('errors').hidden=false;
    for(const error of errors) {
      const input=$(error.field);if(input) {input.setAttribute('aria-invalid','true');const message=$(error.field+'-error');if(message) message.textContent=error.message;}
      const item=node('li'),link=node('a',error.message);link.href='#'+error.field;
      link.addEventListener('click',event=>{event.preventDefault();input?.focus();});item.append(link);list.append(item);
    }
    $(errors[0].field)?.focus();
  }
  function markDirty() {
    if(generated) { $('status').textContent='Hay cambios pendientes. Actualiza la vista previa antes de descargar.';$('download').disabled=true;$('print').disabled=true; }
  }
  function render(data) {
    const article=node('article',undefined,'cv-document');article.setAttribute('aria-label','Currículum de '+data.name);
    article.append(node('h2',data.name),node('p',data.title,'cv-subtitle'));
    article.append(node('p',[data.email,data.phone].filter(Boolean).join(' | '),'cv-contact'));
    if(data.link) {const p=node('p',undefined,'cv-contact'),link=node('a',data.link);link.href=data.link;link.target='_blank';link.rel='noopener noreferrer';p.append(link);article.append(p);}
    if(data.birthday) article.append(node('p','Nacimiento: '+data.birthday.split('-').reverse().join('/'),'cv-contact'));
    if(data.summary) {const section=node('section');section.append(node('h3','Perfil profesional'),node('p',data.summary));article.append(section);}
    for(const key of ['experience','education','certifications','skills','software','languages']) {
      if(!data[key].length) continue;
      const section=node('section');section.append(node('h3',groups[key].label));
      if(groups[key].kind==='rating') {const ul=node('ul',undefined,'cv-list');data[key].forEach(row=>ul.append(node('li',`${row.name} - ${levels[Number(row.level)-1]} (${row.level}/5)`)));section.append(ul);}
      else for(const row of data[key]) {const entry=node('div',undefined,'cv-entry');entry.append(node('h4',row.name+' | '+row.org),node('p',period(row),'cv-date'));if(row.description) entry.append(node('p',row.description));section.append(entry);}
      article.append(section);
    }
    $('preview').replaceChildren(article);generated=data;$('download').disabled=false;$('print').disabled=false;$('edit').hidden=false;
    $('status').textContent='Vista previa actualizada. Tus datos siguen en el formulario para editarlos.';
  }
  function reset() {
    form.reset();for(const key of Object.keys(groups)) {$(key+'-rows').replaceChildren();addRow(key,{},false);}
    clearErrors();generated=null;$('download').disabled=true;$('print').disabled=true;$('edit').hidden=true;
    $('preview').replaceChildren(node('p','Completa tus datos para generar una nueva vista previa.','empty'));
    $('status').textContent='Formulario borrado. No hay datos guardados.';
  }
  personal.forEach(key=>{const input=$(key),error=node('p','','field-error');error.id=key+'-error';input.setAttribute('aria-describedby',error.id);input.after(error);});
  $('birthday').max=new Date().toISOString().slice(0,10);
  initGroups();
  form.addEventListener('input',markDirty);
  form.addEventListener('change',event=>{const row=event.target.closest('.row-card');if(row)syncCurrent(row);markDirty();});
  form.addEventListener('click',event=>{
    const add=event.target.closest('[data-add]');if(add){addRow(add.dataset.add);markDirty();}
    const remove=event.target.closest('[data-remove]');if(remove){const row=remove.closest('.row-card');const key=row.dataset.group;row.remove();$(key+'-rows').nextElementSibling.focus();clearErrors();markDirty();}
  });
  form.addEventListener('submit',event=>{event.preventDefault();const data=collect();const errors=validate(data);showErrors(errors);if(errors.length){markDirty();return;}render(data);$('preview-title').scrollIntoView?.({behavior:'smooth',block:'start'});});
  $('edit').addEventListener('click',()=>{$('name').focus();});
  $('clear').addEventListener('click',()=>{if(window.confirm('¿Borrar todos los datos del formulario y la vista previa?')) reset();});
  $('example').addEventListener('click',()=>{
    const data=collect();const hasData=personal.some(key=>data[key])||Object.keys(groups).some(key=>data[key].length);
    if(hasData&&!window.confirm('El ejemplo reemplazará tus datos actuales. ¿Continuar?')) return;
    reset();const sample={name:'Alex Rivera',title:'Desarrollador de software junior',email:'alex@example.com',phone:'+1 809 555 0123',link:'https://example.com',summary:'Estudiante de desarrollo de software con interés en aplicaciones web y bases de datos. Me enfoco en crear soluciones claras, validar la información y aprender mediante proyectos prácticos.'};
    for(const [key,value] of Object.entries(sample)) $(key).value=value;
    const rows={skills:[{name:'JavaScript',level:'3'},{name:'Modelado de datos',level:'3'}],software:[{name:'Git y GitHub',level:'3'}],languages:[{name:'Español',level:'5'},{name:'Inglés',level:'3'}],education:[{name:'Desarrollo de Software',org:'Institución de ejemplo',start:'2024-01',current:true,description:'Formación en programación, bases de datos y desarrollo web.'}],experience:[{name:'Desarrollador de proyecto académico',org:'Equipo de ejemplo',start:'2025-01',end:'2025-05',description:'Implementé formularios y validaciones para un catálogo web. Colaboré con el equipo mediante Git y documenté los pasos de instalación.'}],certifications:[]};
    for(const key of Object.keys(groups)){ $(key+'-rows').replaceChildren();for(const row of rows[key]) addRow(key,row,false);}
    render(collect());clearErrors();
  });
  $('download').addEventListener('click',()=>{
    if(!generated||$('download').disabled) return;
    const button=$('download');button.disabled=true;
    try {
      if(!window.jspdf?.jsPDF) throw new Error('No se pudo cargar la biblioteca PDF. Revisa tu conexión o utiliza «Imprimir / guardar PDF».');
      window.CVPdf.createPdf(generated,window.jspdf.jsPDF).save(window.CVPdf.filename(generated.name));
      $('status').textContent='PDF generado. Comprueba la descarga en tu navegador.';
    } catch(error) { $('status').textContent=error.message||'No se pudo generar el PDF. Utiliza la opción de impresión.'; }
    finally {button.disabled=false;}
  });
  $('print').addEventListener('click',()=>{if(generated&&!$('print').disabled) window.print();});
})();
