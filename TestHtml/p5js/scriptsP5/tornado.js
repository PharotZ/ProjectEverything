
let particles = [];
const partNum = 5000;
const noiseScale = 0.05;

function setup() {
  createCanvas(800, 800);
  for(let i = 0; i < partNum; i++){
    particles.push(createVector(random(width), random(height)));
  }
  stroke(0, 255, 0);
}

function draw() {
  background(100, 100, 100,10);
  for(let i = 0 ; i < partNum ; i++) {
    let p = particles[i];
    point(p.x, p.y);
    let n = noise(p.x * noiseScale, p.y * noiseScale);
    let angle = TAU * n;
    p.x += cos(angle);
    p.y += sin(angle);
    if(!onScreen(p)){
      p.x = random(width);
      p.y = random(height);
  }
}
  function onScreen(v){
    return v.x > 0 && v.x < width && v.y > 0 && v.y < height;
  }
}
