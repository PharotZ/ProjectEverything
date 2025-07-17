// Function for first canvas
function sketch1(p) {
  let particles = [];
  const partNum = 2000;
  const noiseScale = 0.05;

  p.setup = function () {
    p.createCanvas(400, 400);
    for(let i = 0; i < partNum; i++){
      particles.push(p.createVector(p.random(p.width), p.random(p.height)));
    }
    p.stroke(255, 0, 0);
    };
    
    p.draw = function () {
      p.background(0, 0, 0,10);
    for(let i = 0 ; i < partNum ; i++) {
      let part = particles[i];
      p.point(part.x, part.y);
      let n = p.noise(part.x * noiseScale, part.y * noiseScale);
      let angle = p.TAU * n;
      part.x += p.cos(angle);
      part.y += p.sin(angle);
      if(!onScreen(part)){
        part.x = p.random(p.width);
        part.y = p.random(p.height);
  }
}
  function onScreen(v){
    return v.x > 0 && v.x < p.width && v.y > 0 && v.y < p.height;
  }
  };
}

// Run first p5 instance
new p5(sketch1, 'flow');

// Function for second canvas

// Run second p5 instance
//new p5(sketch2, 'fluid');