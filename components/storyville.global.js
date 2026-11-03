/* @ds-bundle: {"format":4,"namespace":"Storyville","components":[{"name":"Button"},{"name":"Eyebrow"},{"name":"SectionHeader"},{"name":"Callout"},{"name":"Table"},{"name":"Card"},{"name":"Surface"}]} */
(function () {
  var R = window.React, h = R.createElement;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function omit(p, keys) { var o = {}; for (var k in p) if (keys.indexOf(k) < 0) o[k] = p[k]; return o; }

  function Button(p) {
    var variant = p.variant || 'primary', size = p.size || 'md';
    var rest = omit(p, ['variant', 'size', 'className', 'children', 'href']);
    rest.className = cx('sv-btn', 'sv-btn-' + variant, size === 'sm' && 'sv-btn-sm', p.className);
    if (p.href) { rest.href = p.href; return h('a', rest, p.children); }
    if (!rest.type) rest.type = 'button';
    return h('button', rest, p.children);
  }

  function Eyebrow(p) {
    return h(p.as || 'span', { className: cx('sv-eyebrow', 'eyebrow', p.className) }, p.children);
  }

  function SectionHeader(p) {
    var level = p.level || 2;
    return h('div', { className: cx('sv-section', p.className) },
      p.number != null ? h('span', { className: 'sv-section-num subheading-h2', 'aria-hidden': 'true' }, p.number) : null,
      h('h' + level, { className: 'sv-section-title subheading-h2' }, p.children));
  }

  function Callout(p) {
    var body = typeof p.children === 'string' ? h('p', { className: 'body' }, p.children) : p.children;
    return h('aside', { className: cx('sv-callout', 'body', p.className), role: 'note' },
      p.title ? h('span', { className: 'sv-callout-title table-header' }, p.title) : null, body);
  }

  function Table(p) {
    var cols = p.columns || [], rows = p.rows || [];
    return h('table', { className: cx('sv-table', p.header === 'dark' && 'sv-table-dark', p.className) },
      p.caption ? h('caption', { className: 'caption', style: { textAlign: 'left', paddingBottom: 'var(--space-2)' } }, p.caption) : null,
      h('thead', null, h('tr', null, cols.map(function (c, i) { return h('th', { key: i, scope: 'col', className: 'table-header' }, c); }))),
      h('tbody', null, rows.map(function (r, i) {
        return h('tr', { key: i }, r.map(function (c, j) { return h('td', { key: j, className: 'table-body' }, c); }));
      })));
  }

  function Card(p) {
    return h('article', { className: cx('sv-card', p.className) },
      p.eyebrow ? h(Eyebrow, null, p.eyebrow) : null,
      h('h3', { className: 'sv-card-title subheading-h2' }, p.title),
      p.children ? h('div', { className: 'sv-card-body body' }, p.children) : null,
      p.footer ? h('div', { className: 'sv-card-footer' }, p.footer) : null);
  }

  function Surface(p) {
    var tone = p.tone || 'light';
    return h(p.as || 'section', { className: cx('sv-surface', 'sv-surface-' + tone, 'body', p.className), style: p.style }, p.children);
  }

  var C = window;
  C.Storyville = C.Storyville || {};
  Object.assign(C.Storyville, { Button: Button, Eyebrow: Eyebrow, SectionHeader: SectionHeader, Callout: Callout, Table: Table, Card: Card, Surface: Surface });
})();
