import { writeFileSync } from 'node:fs';

// A deliberately simple torus for demonstrating the download flow.
// This is not a jewelry production model.
const major = 10;
const minor = 1.8;
const around = 48;
const tube = 16;
const point = (u, v) => {
  const a = 2 * Math.PI * u / around;
  const b = 2 * Math.PI * v / tube;
  return [(major + minor * Math.cos(b)) * Math.cos(a), (major + minor * Math.cos(b)) * Math.sin(a), minor * Math.sin(b)];
};
const facet = (a, b, c) => `facet normal 0 0 0\n outer loop\n  vertex ${a.join(' ')}\n  vertex ${b.join(' ')}\n  vertex ${c.join(' ')}\n endloop\nendfacet\n`;
let stl = 'solid yasin_gold_art_demo_nonproduction\n';
for (let u = 0; u < around; u++) for (let v = 0; v < tube; v++) {
  const a = point(u, v), b = point(u + 1, v), c = point(u + 1, v + 1), d = point(u, v + 1);
  stl += facet(a, b, c) + facet(a, c, d);
}
stl += 'endsolid yasin_gold_art_demo_nonproduction\n';
writeFileSync(new URL('../public/sample-ring.stl', import.meta.url), stl);
