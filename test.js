const M = require('./engine.js');
const E = require('./expected.json');
let n = 0, fail = 0;
const eq = (a, b, tag) => {
  n++;
  if (JSON.stringify(a) !== JSON.stringify(b)) { fail++; console.error('FAIL', tag, JSON.stringify(a), '!=', JSON.stringify(b)); }
};
for (const c of E.sett) { let r; try { r = M.sett(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'sett ' + c.in); }
for (const c of E.warp) { let r; try { r = M.warp(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'warp ' + c.in); }
for (const c of E.weft) { let r; try { r = M.weft(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'weft ' + c.in); }
// anchors
const a = M.sett(20, 'plain');
eq(a.epi, 10, 'anchor epi plain');
eq(M.sett(24, 'twill').epi, 16, 'anchor epi twill');
const w = M.warp(10, 72, 5, 12);
eq(w.ends, 120, 'anchor ends'); eq(w.wasteIn, 27, 'anchor waste');
eq(M.weft(10, 10, 60, 184).covers, true, 'anchor covers');
eq(M.weft(10, 10, 60, 180).covers, false, 'anchor short'); eq(M.weft(10, 10, 60, 0).weftYd, 183.3, 'anchor weftYd');
// monotonic
for (const k of Object.keys(M.STRUCT)) {
  n++; if (!(M.sett(30, k).epi > M.sett(12, k).epi)) { fail++; console.error('FAIL monotone sett', k); }
}
n++; if (!(M.warp(20, 90, 6, 16).warpYd > M.warp(10, 60, 4, 12).warpYd)) { fail++; console.error('FAIL monotone warp'); }
n++; if (!(M.weft(20, 16, 90, 99999).weftYd > M.weft(10, 10, 60, 0).weftYd)) { fail++; console.error('FAIL monotone weft'); }
// errors
const errs = [
  () => M.sett(0, 'plain'), () => M.sett(-2, 'twill'), () => M.sett(NaN, 'plain'), () => M.sett(10, 'nope'),
  () => M.warp(0, 60, 4, 10), () => M.warp(10, 0, 4, 10), () => M.warp(10, 60, 4, 0), () => M.warp(10, 60, -1, 10),
  () => M.weft(0, 10, 60, 100), () => M.weft(10, 0, 60, 100), () => M.weft(10, 10, 0, 100), () => M.weft(10, 10, 60, -5),
];
const msgs = ['wraps per inch must be positive','wraps per inch must be positive','wraps per inch must be positive','unknown structure',
  'width must be positive','length must be positive','ends per inch must be positive','fringe cannot be negative',
  'width must be positive','picks per inch must be positive','length must be positive','stash must be zero or positive'];
errs.forEach((f, i) => {
  n++;
  try { f(); fail++; console.error('FAIL no-throw', i); }
  catch (e) { if (e.message !== msgs[i]) { fail++; console.error('FAIL msg', i, e.message, 'want', msgs[i]); } }
});
console.log(fail ? fail + ' FAILURES / ' + n : n + '/' + n + ' checks pass');
process.exit(fail ? 1 : 0);
