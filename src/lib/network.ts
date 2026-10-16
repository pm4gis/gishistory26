import { networkNeighbourhood, radialNetworkLayout, networkLabelLines } from './network-layout.mjs';

declare global {
  interface Window {
    __network: {
      records: Array<{id: string; name: string; kind?: string; url?: string}>;
      edges: Array<{id: string; a: string; b: string; label?: string; basis?: string; sources?: Array<{label: string; url: string}>}>;
    };
  }
}

const SVG_NS = 'http://www.w3.org/2000/svg';

function element(tag: string, attrs: Record<string, string> = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  return node;
}

export function initNetwork() {
  if (!window.__network) return;
  const {records, edges} = window.__network;
  const select = document.getElementById('focus') as HTMLSelectElement | null;
  const focusSearch = document.getElementById('focus-search') as HTMLInputElement | null;
  const canvas = document.getElementById('graph');
  const list = document.getElementById('connections');
  const status = document.getElementById('network-status');
  const zoomIn = document.getElementById('network-zoom-in') as HTMLButtonElement | null;
  const zoomOut = document.getElementById('network-zoom-out') as HTMLButtonElement | null;
  const reset = document.getElementById('network-reset') as HTMLButtonElement | null;
  const recordLink = document.getElementById('network-entry-link') as HTMLAnchorElement | null;
  if (!select || !focusSearch || !canvas || !list || !status || !zoomIn || !zoomOut || !reset || !recordLink) return;

  const recordsById = new Map(records.map(record => [record.id, record]));
  const search = new URL(location.href).searchParams.get('focus');
  if (search && recordsById.has(search)) select.value = search;
  const options = Array.from(select.options);
  function filterFocusOptions() {
    const query = focusSearch!.value.trim().toLocaleLowerCase('en-NZ');
    for (const option of options) {
      const matches = !query || (option.textContent || '').toLocaleLowerCase('en-NZ').includes(query);
      option.hidden = !matches && option.value !== select!.value;
    }
  }
  function focusEntry(id: string) {
    if (!recordsById.has(id)) return;
    focusSearch!.value = '';
    const option = options.find(item => item.value === id);
    if (option) option.hidden = false;
    select!.value = id;
    select!.dispatchEvent(new Event('change', {bubbles: true}));
  }
  focusSearch.addEventListener('input', filterFocusOptions);
  document.querySelectorAll<HTMLButtonElement>('[data-network-focus]').forEach(button => {
    button.addEventListener('click', () => focusEntry(button.dataset.networkFocus || ''));
  });
  filterFocusOptions();
  let svg: SVGSVGElement | null = null;
  let width = 980;
  let height = 620;
  let zoom = 1;
  let centreX = 0;
  let centreY = 0;
  let pan: {pointerId: number; x: number; y: number; centreX: number; centreY: number} | null = null;

  function updateViewport() {
    if (!svg) return;
    const vw = width * zoom;
    const vh = height * zoom;
    svg.setAttribute('viewBox', [centreX - vw / 2, centreY - vh / 2, vw, vh].join(' '));
    zoomIn!.disabled = zoom <= 0.46;
    zoomOut!.disabled = zoom >= 2.49;
  }

  function changeZoom(factor: number) {
    zoom = Math.max(0.45, Math.min(2.5, zoom * factor));
    updateViewport();
  }

  function resetView() {
    zoom = 1;
    centreX = 0;
    centreY = 0;
    updateViewport();
  }

  function updateFocus(id: string) {
    if (!recordsById.has(id)) return;
    const option = options.find(item => item.value === id);
    if (option) option.hidden = false;
    select!.value = id;
    const url = new URL(location.href);
    url.searchParams.set('focus', id);
    history.replaceState(null, '', url);
    render();
  }

  function renderEvidence(relationships: typeof edges) {
    list!.replaceChildren();
    for (const edge of relationships) {
      const otherId = edge.a === select!.value ? edge.b : edge.a;
      const other = recordsById.get(otherId);
      if (!other) continue;
      const item = document.createElement('li');
      item.className = 'network-evidence-item';
      const title = document.createElement('a');
      title.href = other.url || '/browse/';
      title.textContent = other.name;
      const relation = document.createElement('p');
      relation.className = 'network-evidence-relation';
      relation.textContent = edge.label || 'Documented relationship';
      const detail = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = 'Evidence and sources';
      const basis = document.createElement('p');
      basis.textContent = edge.basis || 'No description recorded.';
      detail.append(summary, basis);
      for (const source of edge.sources || []) {
        if (!source.url || !/^(https?:\/\/|\/(?!\/))/i.test(source.url)) continue;
        const link = document.createElement('a');
        link.href = source.url;
        link.textContent = source.label || source.url;
        link.className = 'network-source-link';
        detail.append(link);
      }
      item.append(title, relation, detail);
      list!.append(item);
    }
    if (!list!.childElementCount) {
      const empty = document.createElement('li');
      empty.textContent = 'There are no documented connections for this entry.';
      list!.append(empty);
    }
  }

  function makeNode(id: string, x: number, y: number, isFocus: boolean) {
    const record = recordsById.get(id);
    const name = record?.name || id;
    const group = element('g', {
      'class': 'network-node' + (isFocus ? ' network-node--focus' : ''),
      'transform': 'translate(' + x + ' ' + y + ')',
      'role': 'button',
      'tabindex': '0',
      'aria-label': 'Explore connections for ' + name
    });
    const title = element('title');
    title.textContent = name;
    const boxWidth = isFocus ? 250 : 220;
    const boxHeight = isFocus ? 96 : 82;
    const box = element('rect', {
      x: String(-boxWidth / 2), y: String(-boxHeight / 2),
      width: String(boxWidth), height: String(boxHeight), rx: '15'
    });
    const label = element('text', {'class': 'network-node__name', 'text-anchor': 'middle'});
    const lines = networkLabelLines(name, isFocus ? 27 : 23);
    lines.forEach((line: string, i: number) => {
      const span = element('tspan', {x: '0', y: String(lines.length === 1 ? -3 : -15 + i * 19)});
      span.textContent = line;
      label.append(span);
    });
    const kind = element('text', {'class': 'network-node__kind', x: '0', y: isFocus ? '34' : '29', 'text-anchor': 'middle'});
    kind.textContent = isFocus ? 'SELECTED · ' + (record?.kind || 'entry') : (record?.kind || 'entry');
    group.append(title, box, label, kind);
    group.addEventListener('click', () => { if (!isFocus) updateFocus(id); });
    group.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (!isFocus) updateFocus(id);
      }
    });
    return group;
  }

  function render() {
    const view = networkNeighbourhood(records, edges, select!.value);
    const layout = radialNetworkLayout(view.visibleIds);
    width = layout.width;
    height = layout.height;
    const current = recordsById.get(select!.value);
    recordLink!.href = current?.url || '/browse/';
    recordLink!.textContent = 'Read entry: ' + (current?.name || 'Selected entry');
    renderEvidence(view.relationships);

    const scene = element('svg', {
      class: 'network-svg',
      role: 'group',
      'aria-label': 'Interactive diagram showing the selected entry and its documented neighbouring entries. Select a node to explore its connections.'
    }) as SVGSVGElement;
    const desc = element('desc');
    desc.textContent = 'The central entry is connected to its immediate neighbours. Use Tab and Enter to select a node. Relationship evidence is listed below the diagram.';
    scene.append(desc);
    const links = element('g', {class: 'network-links', 'aria-hidden': 'true'});
    for (const edge of view.visibleRelationships) {
      const a = layout.positions.get(edge.a);
      const b = layout.positions.get(edge.b);
      if (!a || !b) continue;
      const line = element('line', {
        x1: String(a.x), y1: String(a.y), x2: String(b.x), y2: String(b.y),
        class: 'network-link'
      });
      const title = element('title');
      title.textContent = edge.label || 'Documented relationship';
      line.append(title);
      links.append(line);
    }
    scene.append(links);
    const nodes = element('g', {class: 'network-nodes'});
    for (const id of view.visibleIds) {
      const position = layout.positions.get(id);
      if (!position) continue;
      nodes.append(makeNode(id, position.x, position.y, id === select!.value));
    }
    scene.append(nodes);
    scene.addEventListener('pointerdown', event => {
      if (event.button !== 0 || (event.target as Element).closest('.network-node')) return;
      pan = {pointerId: event.pointerId, x: event.clientX, y: event.clientY, centreX, centreY};
      scene.setPointerCapture(event.pointerId);
      scene.classList.add('is-panning');
    });
    scene.addEventListener('pointermove', event => {
      if (!pan || event.pointerId !== pan.pointerId) return;
      const bounds = scene.getBoundingClientRect();
      centreX = pan.centreX - (event.clientX - pan.x) / bounds.width * width * zoom;
      centreY = pan.centreY - (event.clientY - pan.y) / bounds.height * height * zoom;
      updateViewport();
    });
    const endPan = () => { pan = null; scene.classList.remove('is-panning'); };
    scene.addEventListener('pointerup', endPan);
    scene.addEventListener('pointercancel', endPan);
    scene.addEventListener('lostpointercapture', endPan);
    scene.addEventListener('wheel', event => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      changeZoom(event.deltaY < 0 ? 0.85 : 1.15);
    }, {passive: false});

    svg = scene;
    canvas!.replaceChildren(scene);
    resetView();
    const neighbours = view.neighbours.length;
    const suffix = view.hiddenCount ? ' Showing the first ' + (neighbours - view.hiddenCount) + ' neighbours; all relationships are listed below.' : '';
    status!.textContent = (neighbours + 1) + (neighbours === 0 ? ' entry, ' : ' entries, ') + view.relationships.length + (view.relationships.length === 1 ? ' connection.' : ' connections.') + suffix;
  }

  zoomIn.addEventListener('click', () => changeZoom(0.78));
  zoomOut.addEventListener('click', () => changeZoom(1.28));
  reset.addEventListener('click', resetView);
  select.addEventListener('change', () => updateFocus(select.value));
  render();
}
