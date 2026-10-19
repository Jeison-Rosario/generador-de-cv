(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./data.js'));
  else root.CVPdf = factory(root.CVData);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (dataRules) {
  'use strict';
  // Built-in Helvetica supports Spanish/Latin text. Browser printing remains available for other scripts.
  const pdfText = text => String(text).normalize('NFC').replace(/[\u2010-\u2015]/g, '-').replace(/\u2026/g, '...').replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/\u00a0/g, ' ').replace(/\t/g, '    ').replace(/\u2022/g, '-');
  function createPdf(data, JsPDF) {
    const blocks = dataRules.blocks(data);
    if (blocks.some(block => /[^\u000a\u000d\u0020-\u007e\u00a0-\u00ff]/u.test(pdfText(block.text)))) {
      throw new Error('Para caracteres de otros alfabetos o emojis, utiliza «Imprimir / guardar PDF», que usa las fuentes del navegador.');
    }
    const doc = new JsPDF({ unit: 'mm', format: 'a4', compress: true });
    const margin = 18, width = 174, bottom = 277;
    let y = 22;
    const styles = { name: [23, 'bold', 10], subtitle: [13, 'normal', 7], contact: [10, 'normal', 5], heading: [12, 'bold', 7], entry: [11, 'bold', 6], date: [9, 'normal', 5], body: [10.5, 'normal', 5.5] };
    for (const block of blocks) {
      const [size, weight, lineHeight] = styles[block.kind];
      doc.setFont('helvetica', weight); doc.setFontSize(size);
      const lines = doc.splitTextToSize(pdfText(block.text), width);
      const gap = block.kind === 'heading' ? 6 : block.kind === 'entry' ? 3 : 1;
      // Keep headings with at least two lines of following content, and entry titles with their dates.
      const keep = block.kind === 'heading' ? 30 : block.kind === 'entry' ? 22 : 0;
      if (block.kind !== 'body' && y + gap + lines.length * lineHeight + keep > bottom && lines.length * lineHeight < 220) { doc.addPage(); y = 22; }
      y += gap;
      doc.setTextColor(...(block.kind === 'heading' || block.kind === 'name' ? [24, 77, 64] : [35, 45, 54]));
      for (const line of lines) {
        if (y + lineHeight > bottom) { doc.addPage(); y = 22; }
        doc.text(line, margin, y); y += lineHeight;
      }
    }
    const pages = doc.getNumberOfPages();
    for (let page = 1; page <= pages; page++) {
      doc.setPage(page); doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(100,110,115);
      doc.text(page + ' / ' + pages, 192, 288, { align: 'right' });
    }
    doc.setProperties({ title: 'CV - ' + pdfText(data.name), author: pdfText(data.name), subject: 'Currículum vitae' });
    return doc;
  }
  function filename(name) { return ('CV-' + String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/-+$/,'').slice(0,80) + '.pdf'); }
  return { createPdf, filename };
});
