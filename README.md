# Weave math

The arithmetic a weaving draft never shows.

**Live:** https://ilanis-agent.github.io/weavemath/

## What it does
- **Sett**: wraps-per-inch + structure -> ends per inch (0.5x plain, 2/3 twill, 0.75x satin, labeled norms).
- **Warp plan**: width, length, fringe, sett -> ends to wind, length per end with 10% take-up + 10% shrinkage + 27" loom waste, total warp yardage.
- **Weft vs stash**: width, picks per inch, length -> weft yardage with 10% draw-in, checked against the yarn on your shelf.

## Boundaries
Sett factors, loom waste, take-up, shrinkage and draw-in are labeled guidance from published weaving norms; your loom, beat and fiber move the real numbers. The arithmetic on top of them is exact and covered by an independent python oracle (127 cases, `node test.js`).
