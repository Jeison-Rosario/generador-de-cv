/* Shared data rules; no DOM or network dependencies. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CVData = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const groups = {
    skills: { label: 'Habilidades', kind: 'rating', name: 'Habilidad' },
    software: { label: 'Software', kind: 'rating', name: 'Herramienta' },
    languages: { label: 'Idiomas', kind: 'rating', name: 'Idioma' },
    experience: { label: 'Experiencia laboral', kind: 'period', name: 'Puesto', org: 'Empresa' },
    education: { label: 'Educación', kind: 'period', name: 'Título o programa', org: 'Institución' },
    certifications: { label: 'Certificaciones', kind: 'period', name: 'Certificación', org: 'Entidad emisora' }
  };
  const levels = ['Básico', 'Elemental', 'Intermedio', 'Avanzado', 'Experto'];
  const clean = value => String(value ?? '').trim();
  function safeUrl(value) {
    if (!clean(value)) return '';
    try {
      const url = new URL(clean(value));
      return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
    } catch { return null; }
  }
  function validMonth(value) { return /^\d{4}-(0[1-9]|1[0-2])$/.test(value) && Number(value.slice(0, 4)) >= 1900; }
  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value + 'T12:00:00Z');
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value && Number(value.slice(0,4)) >= 1900;
  }
  function validate(data, today = new Date().toISOString().slice(0, 10)) {
    const errors = [];
    const add = (field, message) => errors.push({ field, message });
    for (const [field, label, max] of [['name', 'Nombre', 100], ['title', 'Ocupación', 120], ['email', 'Correo', 160]]) {
      if (!clean(data[field])) add(field, label + ': completa este campo.');
      else if (clean(data[field]).length > max) add(field, label + ': texto demasiado largo.');
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(data.email))) add('email', 'Introduce un correo válido.');
    if (data.phone && (!/^[+\d\s().-]+$/.test(data.phone) || data.phone.replace(/\D/g, '').length < 7 || data.phone.replace(/\D/g, '').length > 15)) add('phone', 'Teléfono: utiliza entre 7 y 15 dígitos.');
    if (data.birthday && (!validDate(data.birthday) || data.birthday > today)) add('birthday', 'La fecha de nacimiento debe ser válida y no futura.');
    if (safeUrl(data.link) === null) add('link', 'El enlace debe comenzar con https:// o http://.');
    if (clean(data.link).length > 300) add('link', 'El enlace no puede superar 300 caracteres.');
    if (clean(data.summary).length > 3000) add('summary', 'El resumen no puede superar 3000 caracteres.');
    for (const [key, group] of Object.entries(groups)) {
      if ((data[key] || []).length > 20) add(key, 'El máximo es de 20 entradas por sección.');
      for (const row of data[key] || []) {
        const field = name => row.id + '-' + name;
        if (!clean(row.name)) add(field('name'), group.name + ': completa este campo o elimina la entrada.');
        if (clean(row.name).length > 140) add(field('name'), 'Utiliza hasta 140 caracteres.');
        if (group.kind === 'rating') {
          if (!/^[1-5]$/.test(String(row.level))) add(field('level'), 'Selecciona un nivel de 1 a 5.');
        } else {
          if (!clean(row.org)) add(field('org'), group.org + ': completa este campo.');
          if (clean(row.org).length > 140) add(field('org'), 'Utiliza hasta 140 caracteres.');
          if (!validMonth(row.start)) add(field('start'), 'Selecciona un mes de inicio válido.');
          if (!row.current && !validMonth(row.end)) add(field('end'), 'Selecciona un mes final o marca «En curso».');
          else if (!row.current && row.end < row.start) add(field('end'), 'La fecha final no puede ser anterior al inicio.');
          if (clean(row.description).length > 2000) add(field('description'), 'Utiliza hasta 2000 caracteres.');
        }
      }
    }
    return errors;
  }
  function formatMonth(value) { return validMonth(value) ? value.slice(5) + '/' + value.slice(0, 4) : ''; }
  function period(row) { return formatMonth(row.start) + ' - ' + (row.current ? 'Actualidad' : formatMonth(row.end)); }
  function blocks(data) {
    const result = [{ kind: 'name', text: data.name }, { kind: 'subtitle', text: data.title }];
    result.push({ kind: 'contact', text: [data.email, data.phone].filter(Boolean).join(' | ') });
    if (data.link) result.push({ kind: 'contact', text: data.link });
    if (data.birthday) result.push({ kind: 'contact', text: 'Nacimiento: ' + data.birthday.split('-').reverse().join('/') });
    if (data.summary) result.push({ kind: 'heading', text: 'Perfil profesional' }, { kind: 'body', text: data.summary });
    for (const key of ['experience', 'education', 'certifications', 'skills', 'software', 'languages']) {
      if (!(data[key] || []).length) continue;
      result.push({ kind: 'heading', text: groups[key].label });
      for (const row of data[key]) {
        if (groups[key].kind === 'rating') result.push({ kind: 'body', text: row.name + ' - ' + levels[Number(row.level)-1] + ' (' + row.level + '/5)' });
        else {
          result.push({ kind: 'entry', text: row.name + ' | ' + row.org }, { kind: 'date', text: period(row) });
          if (row.description) result.push({ kind: 'body', text: row.description });
        }
      }
    }
    return result;
  }
  return { groups, levels, clean, safeUrl, validate, blocks, period };
});
