/**
 * Village map, drawn on a <canvas> at native 16px tiles from the sprite sheets in /public/sprites.
 * Grid is W×H tiles. Buildings are 7×7 tile footprints with the door at bottom-centre.
 * Edit BLD / POND / decor placements below to rearrange the village.
 */
export const TS = 16, W = 32, H = 21;

export type BuildingId = 'guild' | 'post' | 'armory' | 'academy' | 'tavern';
export type PanelId = 'quests' | 'contact' | 'items' | 'academy' | 'tavern' | 'status';
export interface Building { id: BuildingId; x: number; y: number; w: number; h: number; dx: number; dy: number; roof: keyof typeof ROOF; wall: keyof typeof WALLY; panel: PanelId }

// house.png: x-offset of each 108px pitched-roof colour, y of each wall material row (32px tall)
const ROOF = { gray: 306, red: 418, tan: 530, dark: 642, blue: 754, green: 865 };
const WALLY = { plaster: 64, wood: 160, stone: 224, dark: 288 };

export const BLD: Building[] = ([
  { id: 'guild', x: 3, y: 2, roof: 'red', wall: 'plaster', panel: 'quests' },
  { id: 'post', x: 12, y: 2, roof: 'green', wall: 'wood', panel: 'contact' },
  { id: 'armory', x: 22, y: 2, roof: 'dark', wall: 'dark', panel: 'items' },
  { id: 'academy', x: 5, y: 11, roof: 'blue', wall: 'stone', panel: 'academy' },
  { id: 'tavern', x: 19, y: 11, roof: 'tan', wall: 'wood', panel: 'tavern' },
] as const).map((b) => ({ ...b, w: 7, h: 7, dx: b.x + 3, dy: b.y + 6 })) as Building[];

const POND = { x: 27, y: 12, w: 3, h: 4 };

// outside.png sprite rects [sx, sy, sw, sh]
const SPR: Record<string, [number, number, number, number]> = {
  round: [277, 50, 52, 60], pine: [404, 56, 40, 52], s1: [277, 121, 35, 50], s2: [320, 120, 32, 48], s3: [355, 124, 26, 46],
  barrel: [193, 25, 14, 18], barrel2: [209, 25, 14, 18], log: [291, 22, 45, 20], stump: [338, 25, 28, 19], stump2: [370, 25, 28, 19],
  rock: [80, 49, 16, 14], rock2: [98, 49, 12, 14], sign: [53, 25, 23, 20],
};

function rng(s: number) { return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

const path = new Set<string>();
const P = (x: number, y: number) => path.add(x + ',' + y);
for (let x = 2; x <= 29; x++) P(x, 9);
for (let x = 8; x <= 22; x++) P(x, 18);
for (let y = 9; y <= 18; y++) P(15, y);

const r = rng(7);
const ground: [number, number][] = [];
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const p = path.has(x + ',' + y), v = r();
  ground.push(p ? [16 + Math.floor(r() * 4) * 16, 96]
    : v < 0.08 ? [16 + Math.floor(r() * 8) * 16, 32]
    : v < 0.12 ? [16 + Math.floor(r() * 8) * 16, 48]
    : [32 + Math.floor(r() * 4) * 16, 16]);
}

interface Obj { k: string; bx: number; by: number }
const objs: Obj[] = [];
const block = new Set<string>();
const add = (k: string, tx: number, ty: number, blk = true, ox = 0, oy = 0) => {
  objs.push({ k, bx: tx * TS + 8 + ox, by: (ty + 1) * TS + oy });
  if (blk && tx >= 0 && ty >= 0) block.add(tx + ',' + ty);
};
for (let x = -1; x <= W; x += 2) { add(x % 4 === 1 ? 'pine' : 'round', x, -1, false, Math.round(r() * 6 - 3), 6); add(x % 4 === 1 ? 'round' : 'pine', x + 1, 0, false, 0, 4); }
for (let y = 1; y < H; y += 2) { add(y % 4 === 1 ? 'round' : 'pine', 0, y, false, -4); add(y % 4 === 1 ? 'pine' : 'round', W - 1, y, false, 4); }
for (let x = 1; x < W - 1; x += 2) add(['s1', 's2', 's3'][x % 3], x, H - 1, false, Math.round(r() * 6 - 3), 10);
([
  ['round', 13, 13], ['pine', 17, 15], ['s2', 3, 10], ['s1', 11, 10], ['pine', 28, 6], ['s3', 19, 7], ['barrel', 18, 16], ['barrel2', 18, 17],
  ['log', 3, 16, true, 0], ['stump', 26, 18], ['rock', 28, 10], ['rock2', 2, 17], ['stump2', 9, 7], ['sign', 17, 9, false],
] as [string, number, number, boolean?, number?][]).forEach((a) => add(...a));

export function blocked(x: number, y: number) {
  if (x <= 0 || y <= 0 || x >= W - 1 || y >= H - 1) return true;
  if (block.has(x + ',' + y)) return true;
  if (x >= POND.x && x < POND.x + POND.w && y >= POND.y && y < POND.y + POND.h) return true;
  const b = BLD.find((b) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h);
  return !!b && !(b.dx === x && b.dy === y);
}

export type Sheets = Record<'house' | 'terrain' | 'outside' | 'water', HTMLImageElement>;

export function loadSheets(): Promise<Sheets> {
  const names = ['house', 'terrain', 'outside', 'water'] as const;
  return Promise.all(names.map((k) => new Promise<[string, HTMLImageElement]>((res, rej) => {
    const i = new Image(); i.onload = () => res([k, i]); i.onerror = rej; i.src = `/sprites/${k}.png`;
  }))).then((a) => Object.fromEntries(a) as Sheets);
}

function drawHouse(g: CanvasRenderingContext2D, im: Sheets, b: Building) {
  const ox = b.x * TS + 2, oy = b.y * TS - 2, wy = WALLY[b.wall];
  g.drawImage(im.house, ROOF[b.roof], 147, 108, 82, ox, oy, 108, 82);
  let x = ox + 6;
  for (const [sx, w] of [[18, 12], [160, 16], [72, 40], [160, 16], [50, 12]]) { g.drawImage(im.house, sx, wy, w, 32, x, oy + 82, w, 32); x += w; }
}

/** Draw the whole scene. `frame` advances the 3-frame water animation. */
export function draw(g: CanvasRenderingContext2D, im: Sheets, frame: number) {
  g.imageSmoothingEnabled = false;
  for (let i = 0; i < ground.length; i++) { const x = i % W, y = (i / W) | 0, [sx, sy] = ground[i]; g.drawImage(im.terrain, sx, sy, 16, 16, x * TS, y * TS, 16, 16); }
  const f = frame % 3;
  for (let y = 0; y < POND.h; y++) for (let x = 0; x < POND.w; x++) {
    const cx = x === 0 ? 0 : x === POND.w - 1 ? 2 : 1, cy = y === 0 ? 0 : y === POND.h - 1 ? 2 : 1;
    g.drawImage(im.water, (1 + 3 * f + cx) * 16, (9 + cy) * 16, 16, 16, (POND.x + x) * TS, (POND.y + y) * TS, 16, 16);
  }
  type Item = { by: number; o?: Obj; b?: Building };
  const list: Item[] = [...objs.map((o) => ({ o, by: o.by })), ...BLD.map((b) => ({ b, by: (b.y + 7) * TS }))].sort((a, b) => a.by - b.by);
  for (const it of list) {
    if (it.b) { drawHouse(g, im, it.b); continue; }
    const o = it.o!, [sx, sy, sw, sh] = SPR[o.k];
    g.drawImage(im.outside, sx, sy, sw, sh, Math.round(o.bx - sw / 2), o.by - sh, sw, sh);
  }
}

/** BFS path (4-neighbour). Doors are only enterable as the final target. */
export function findPath(from: [number, number], to: [number, number]): [number, number][] | null {
  const [tx, ty] = to; if (blocked(tx, ty)) return null;
  const K = (x: number, y: number) => y * 64 + x, prev = new Map<number, [number, number] | null>([[K(...from), null]]), q: [number, number][] = [from];
  const isDoor = (x: number, y: number) => BLD.some((b) => b.dx === x && b.dy === y);
  while (q.length) {
    const [x, y] = q.shift()!; if (x === tx && y === ty) break;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, k = K(nx, ny);
      if (!prev.has(k) && !blocked(nx, ny) && !(isDoor(nx, ny) && !(nx === tx && ny === ty))) { prev.set(k, [x, y]); q.push([nx, ny]); }
    }
  }
  if (!prev.has(K(tx, ty))) return null;
  const out: [number, number][] = []; let c: [number, number] | null | undefined = [tx, ty];
  while (c && !(c[0] === from[0] && c[1] === from[1])) { out.unshift(c); c = prev.get(K(c[0], c[1])); }
  return out;
}
