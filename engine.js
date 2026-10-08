/* Weave math - exact arithmetic on labeled published weaving norms. */
const STRUCT = {
  plain: { factor: 0.5,  note: 'plain weave - the balanced workhorse' },
  twill: { factor: 2/3,  note: 'twill - denser, drapier, hungrier' },
  satin: { factor: 0.75, note: 'satin - the yarn eater with the shine' },
};
const LOOM_WASTE_IN = 27; // labeled norm for floor/table looms
const TAKEUP = 0.10, SHRINK = 0.10, DRAW = 1.10; // labeled norms
const r1 = x => Math.round(x * 10) / 10;
const r2 = x => Math.round(x * 100) / 100;
const bad = m => { throw new Error(m); };

function sett(wpi, structKey) {
  const s = STRUCT[structKey];
  if (!s) bad('unknown structure');
  if (!Number.isFinite(wpi) || wpi <= 0) bad('wraps per inch must be positive');
  const epi = Math.round(wpi * s.factor);
  let verdict;
  if (epi < 10) verdict = 'a chunky, quick weave (labeled)';
  else if (epi <= 20) verdict = 'the everyday cloth zone (labeled)';
  else verdict = 'fine cloth - real patience (labeled)';
  return { epi, verdict, note: s.note };
}

function warp(widthIn, lengthIn, fringeIn, epi) {
  for (const [v, m] of [[widthIn, 'width must be positive'], [lengthIn, 'length must be positive'], [epi, 'ends per inch must be positive']])
    if (!Number.isFinite(v) || v <= 0) bad(m);
  if (!Number.isFinite(fringeIn) || fringeIn < 0) bad('fringe cannot be negative');
  const ends = Math.ceil(widthIn * epi);
  const wasteIn = LOOM_WASTE_IN;
  const wovenIn = (lengthIn + 2 * fringeIn) * (1 + TAKEUP + SHRINK);
  const warpLenIn = wovenIn + wasteIn;
  const warpYd = (ends * warpLenIn) / 36;
  let verdict;
  if (warpYd < 100) verdict = 'a sampler sip of yarn (labeled)';
  else if (warpYd < 600) verdict = 'a scarf-to-towel budget (labeled)';
  else verdict = 'a serious warp - weigh the cones first (labeled)';
  return { ends, warpLenIn: r1(warpLenIn), wasteIn, warpYd: r1(warpYd), verdict };
}

function weft(widthIn, ppi, lengthIn, stashYd) {
  for (const [v, m] of [[widthIn, 'width must be positive'], [ppi, 'picks per inch must be positive'], [lengthIn, 'length must be positive'], [stashYd, 'stash must be zero or positive']])
    if (!Number.isFinite(v) || v < 0) bad(m);
  if (widthIn === 0) bad('width must be positive');
  if (ppi === 0) bad('picks per inch must be positive');
  if (lengthIn === 0) bad('length must be positive');
  const picks = ppi * lengthIn;
  const weftYd = (picks * widthIn * DRAW) / 36;
  const covers = stashYd >= weftYd;
  const shortfall = r1(weftYd - stashYd);
  const verdict = covers ? 'the stash covers the weft (labeled)' : 'short by ' + shortfall + ' yd - wind ' + Math.ceil(shortfall) + ' yd more (labeled)';
  return { picks: Math.round(picks), weftYd: r1(weftYd), covers, verdict };
}

const api = { STRUCT, LOOM_WASTE_IN, TAKEUP, SHRINK, DRAW, sett, warp, weft };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.Weavemath = api;
