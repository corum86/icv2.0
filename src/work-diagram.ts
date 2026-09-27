// Markup for the abstract migration diagram used on the NDA energy-platform card and drawer.
// Styles: .wk-diagram* in src/styles/work.css. Decorative only → aria-hidden.
export function migrationDiagramHTML(): string {
  const nodes = [15, 16, 17, 18, 19, 20, 21, 22].map((v, i) => {
    const mod = i === 0 ? ' wk-diagram__node--start' : i === 7 ? ' wk-diagram__node--end' : '';
    return `<div class="wk-diagram__node${mod}"><i></i>${v}</div>`;
  }).join('');
  const diff = [['del', '−', 62], ['del', '−', 40], ['add', '+', 74], ['add', '+', 52], ['add', '+', 66]]
    .map(([c, s, w]) => `<div class="${c}" style="--w:${w}%">${s}</div>`).join('');
  return `<div class="wk-diagram" aria-hidden="true">
    <div class="wk-diagram__cmd">$ ng update @angular/core</div>
    <div class="wk-diagram__track">${nodes}</div>
    <div class="wk-diagram__foot">
      <div class="wk-diagram__diff">${diff}</div>
      <div class="wk-diagram__nums"><span>bootstrap <b>3 → 5</b></span><strong>150K <small>LOC</small></strong></div>
    </div>
  </div>`;
}
