// 20240116
// 雪形のパーティクルにブラーエフェクト

let base_h0;
let base_h;
let cv;

let init = false;
let inc = 0.1;
let scl = 10;
let cols, rows;
let zoff = 0;
let particles = [];
let flowfield;
let num_particle = 40;

let gen = -1;
let genmax = 30;
;

let floor_is_drawn = false;
let image_is_drawn = false;
let frame_is_drawn = false;
let shadow_is_drawn = false;

let pixel = Array(200 * 200);

function setup() {
  cv = createCanvas(800, 800);
  pixelDensity(pixelDensity());
  angleMode(RADIANS);
  colorMode(HSB, 360, 100, 100, 100);

  base_h0 = random(360);

}

function draw() {
  if (!floor_is_drawn) {
    floor_is_drawn = true;
    draw_floor();    
  }

  let box_size = min(width, height) * 0.5;
  let xpos = (width - box_size) / 2; 
  let ypos = (height - box_size) / 2; 
  let frame_width = 10;
  let cell_num = 5;
  
  
  if (!image_is_drawn) {
    angleMode(RADIANS);
    draw_image(xpos, ypos, box_size, cell_num);
    if (!image_is_drawn) {
      return;
    }
    angleMode(DEGREES);
    colorMode(HSB, 360, 100, 100, 100);
  }
    
  if (!frame_is_drawn) {
    frame_is_drawn = true;
    draw_frame(xpos, ypos, box_size, frame_width);    
  }
  
  if (!shadow_is_drawn) {
    shadow_is_drawn = true;
    // smart phone shadow
    let sc = 1.4;
    for (let i = 0; i < 10; i++) {
      shadowmaker(sc - 0.02 * i);
    }  
  }

}

class Particle {
  constructor(w, h, g) {
    this.w = w;
    this.h = h;
    this.g = g;
  }

  reset(sz) {
    this.pos = createVector(random(this.w), random(this.h));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxspeed = 2;

    this.sz = (2 + pow(2, random(3))) * sz;
    this.interval = 1 + int(this.sz) * 3;
  }
  
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  follow(vectors) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = vectors[index];
    this.applyForce(force);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  show(ox, oy, w, gn) {
    if (gn % this.interval != 0) return;
    
    let sz = this.sz * (0.3 + random(2));
    
    let hu = int(360 / 12 * floor(random(12))) % 360;
    this.g.fill(hu, 0, 100, 50);
    this.g.stroke(hu, 0, 100, 50);
    snowdot(g, this.pos.x % w, this.pos.y % w, sz, 6);
    
    //this.g.ellipse(this.pos.x % w, this.pos.y % w, sz, sz);
  }

  edges() {
    if (this.pos.x > this.w) {
      this.pos.x = 0;
    }
    if (this.pos.x < 0) {
      this.pos.x = this.w;
    }
    if (this.pos.y > this.h) {
      this.pos.y = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = this.h;
    }
  }
}


function snowdot(g, x, y, size) {
  let vnum = 6;
  angleMode(DEGREES)
  let theta1 = 360 / vnum;
  let theta2 = 90 - (360 / vnum);
  let theta3 = theta1 + theta2;
  let r1 = size * 0.2;
  let px, py;
  let p = [];
  let n = 0;
  let t = 0;
  let r;
  // calc vertex
  for (let i = 0; i < vnum; i++) {
    py = -r1;
    p[n++] = sin(t);
    p[n++] = cos(t);
    t += theta1;
  }

  // hex
  g.beginShape();
  for (let i = 0; i < vnum; i++) {
    n = i * 2;
    r = size * 0.2;
    g.vertex(x + p[n + 0] * r, y + p[n + 1] * r);
  }  
  g.endShape(CLOSE);

  g.strokeWeight(size / 16);
  for (let i = 0; i < vnum; i++) {
    n = i * 2;
    r = size / 2 * 0.9;
    g.line(x, y, x + p[n + 0] * r, y + p[n + 1] * r);
  }  

  g.strokeWeight(size / 16);
  for (let b = 0; b < vnum; b++) {
    let n0 = ((b + 3) * 2) % (vnum * 2);
    let n1 = ((b + 4) * 2) % (vnum * 2);
    let n2 = ((b + 2) * 2) % (vnum * 2);
    
    r1 = size / 2 * 0.65;
    r2 = size * 0.1;
    let px0 = x + p[b * 2 + 0] * r1 + p[n0 + 0] * r2;
    let py0 = y + p[b * 2 + 1] * r1 + p[n0 + 1] * r2;
    let px1 = x + p[b * 2 + 0] * r1 + p[n1 + 0] * r2;
    let py1 = y + p[b * 2 + 1] * r1 + p[n1 + 1] * r2;
    g.line(px0, py0, px1, py1);
    px0 = x + p[b * 2 + 0] * r1 + p[n0 + 0] * r2;
    py0 = y + p[b * 2 + 1] * r1 + p[n0 + 1] * r2;
    px1 = x + p[b * 2 + 0] * r1 + p[n2 + 0] * r2;
    py1 = y + p[b * 2 + 1] * r1 + p[n2 + 1] * r2;
    g.line(px0, py0, px1, py1);
  }  
  
  
  for (let b = 0; b < vnum; b++) {
    g.beginShape();
    for (let i = 0; i < vnum; i++) {
      n = i * 2;
      r1 = size / 2 * 0.8;
      r2 = size * 0.07;
      let px = x + p[b * 2 + 0] * r1 + p[n + 0] * r2;
      let py = y + p[b * 2 + 1] * r1 + p[n + 1] * r2;
      g.vertex(px, py);
    }  
    g.endShape(CLOSE);
  }
  
}


///////////////// DRAW IMAGE  ///////////////////////

let dr_i = 0;
let dr_j = 0;

function draw_image(x, y, size, cell_num) {
  if (dr_j >= cell_num) {
    dr_j = 0;
    dr_i++;
  }
  if (dr_i >= cell_num) {
    image_is_drawn = true;
    return;
  }
  
  let cell_size = int(size / cell_num);
  let x0 = x + dr_j * cell_size;
  let y0 = y + dr_i * cell_size;

  if (!init) {
    init = true;
    g = createGraphics(cell_size, cell_size);
    g.pixelDensity(pixelDensity());
    g.angleMode(RADIANS);
    g.colorMode(HSB, 360, 100, 100, 100);
    cols = floor(cell_size / scl);
    rows = floor(cell_size / scl);
    flowfield = new Array(cols * rows);
    for (let i = 0; i < num_particle; i++) {
      particles[i] = new Particle(cell_size, cell_size, g);
    }  
  }
  
  if (gen == -1) {
    gen = 0;
    base_h = int(base_h0 + random(100)) % 360;
    fillrect_init(x0, y0, cell_size);
    image(g, x0, y0, cell_size, cell_size, 0, 0, cell_size, cell_size);  
    return;
  } else {
    fillrect(x0, y0, cell_size);
    image(g, x0, y0, cell_size, cell_size, 0, 0, cell_size, cell_size);  
    if (random() > 0.8) {
      let bk = random();
      g.filter(BLUR, bk);
    }
    if (gen < genmax) {
      return;
    }
  }  
  
  
  fillrect(x0, y0, cell_size);
  image(g, x0, y0, cell_size, cell_size, 0, 0, cell_size, cell_size);
  
  // 枠線
  stroke('#444');
  strokeWeight(1);
  noFill();
  rect(x0, y0, cell_size);

  gen = -1;
  
  dr_j++;
}

function fillrect_init(x0, y0, s) {
  // background
  g.fill(240, 100, 10);
  g.noStroke();
  g.rect(0, 0, s, s);

  let r = 0.1 + pow(3, random(2)) / 4;
  for (let i = 0; i < particles.length; i++) {
    particles[i].reset(r);
  }  
}

function fillrect(x0, y0, s) {
   
  let yoff = y0;
  for (let y = 0; y < rows; y++) {
    let xoff = x0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(5);
      flowfield[index] = v;
      xoff += inc;
    }
    yoff += inc;
    zoff += 0.03;
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show(x0, y0, s, gen);
  }  

  gen++;
}

//////////////////////////////////////////////////

function draw_frame(x, y, box_size, frame_size) {
  // frame
  strokeWeight(frame_size * 2);
  noFill();
  drawingContext.shadowOffsetX = 25;
  drawingContext.shadowOffsetY = 25;
  drawingContext.shadowBlur = 40;

  stroke(color(30, 30, 65));
  drawingContext.shadowColor = '#0005';  
  rect(x - frame_size, y - frame_size, box_size + frame_size * 2);    
  drawingContext.shadowColor = '#0000';  
  for (let i = 0; i < 5; i++) {
    rect(x - frame_size - i, y - frame_size - i, box_size + frame_size * 2);    
  }
  stroke(color(30, 35, 80));
  rect(x - frame_size - 5, y - frame_size - 5, box_size + frame_size * 2);    

  // frame high light
  stroke(30, 30, 90);
  strokeWeight(1);
  let lx0 = x - frame_size - 15;
  let ly0 = y - frame_size - 15;
  let lx1 = lx0 + box_size + 40;
  let ly1 = ly0;
  line(lx0, ly0, lx1, ly1); 
  lx1 = lx0;
  ly1 = ly0 + box_size + 40;
  line(lx0, ly0, lx1, ly1); 
  ly0 = ly0 + 20;
  ly1 = ly1 - 20;
  line(lx0 + box_size + 20, ly0, lx0 + box_size + 20, ly1); 
  ly0 = ly1;
  line(lx0 + 20, ly0, lx0 + box_size + 20, ly1); 
}

function draw_floor() {
  background(color(20, 10, 90));

  // floor
  let split_num = 5;
  let h = height / split_num;
 
  for (let i = 0; i < 500; i++) {
    let y = random(height);
    let c = 85 + random(8);
    stroke(color(30, 10, c));
    line(0, y + 0, width, y + 0);        
  }
  
  // floor seems
  for (let i = 0; i < split_num; i++) {
    let y = i * h;
    stroke(color(30, 10, 70));
    line(0, y + 0, width, y + 0);    
    line(0, y + 1, width, y + 1);    
    stroke(color(30, 10, 95));
    line(0, y + 2, width, y + 2);    
    line(0, y + 3, width, y + 3);    
    
    if (random() > 0.4) {
      let x = random(width);
      stroke(color(30, 10, 70));
      line(x + 0, y + 0, x + 0, y + h);    
      line(x + 1, y + 0, x + 1, y + h);    
      stroke(color(30, 10, 95));
      line(x + 2, y + 2, x + 2, y + h);    
      line(x + 3, y + 2, x + 3, y + h);          
    }
  }  
}

function shadowmaker(sc) {
  colorMode(HSB, 360, 100, 100, 100);
  
  fill(color(0, 0, 0, 1));
  stroke('black');
  strokeWeight(1);
  noStroke();
  
  beginShape();

  let gx = width;
  let gy = height;
  let cx = gx / 2;
  let cy = gy / 2;  
  let r = 15;
  let sc2 = sc - 1;  
  let x;
  let y;
  let w = min(gx,gy) * 0.2 * sc;
  let h = w * 1.7;
  
  x = cx - w / 2;
  y = cy - w / 2 * sc * 0.5;
  vertex(x, y + r);
  vertex(x + r, y);
  vertex(x + w - r, y);
  vertex(x + w, y + r);  
  vertex(x + w, y + h * 0.4);
  let hand_x = x + w;
  let hand_y = y;
  let tx;
  let ty;
  let arm_w = 200;
  tx = hand_x + w * 0.1;
  ty = hand_y + h * 0.6;
  vertex(tx, ty);  
  tx = hand_x - w * 0.05 + 100 * sc2;
  ty = min(gy * 0.8, y + h * 0.9);
  vertex(tx, ty);  
  tx = hand_x - w * 0.06 + 100 * sc2;
  ty = ty + (gy - ty) / 2;
  vertex(tx, ty);  
  tx = hand_x + w * 0.06 + 100 * sc2;
  ty = gy;
  vertex(tx, ty);  
  tx = hand_x - w * 0.2 - 200 * sc2;
  ty = gy;
  vertex(tx, ty);  
  tx = hand_x - w * 0.3 - 200 * sc2;
  ty = y + (gy - y + h) / 2;
  vertex(tx, ty);  
  tx = cx + arm_w / 2 - 100 * sc * 1.2;
  vertex(tx, y + h);  
  vertex(x + r, y + h);
  vertex(x, y + h - r);
  
  endShape(CLOSE);  
}

function keyTyped(){
  if(key == 's'){
    let yymmdd = (new Date()).toISOString().replace(/[A-Z].*/,'').replace(/-/g,'');
    saveCanvas(cv, yymmdd, '');    
  }
  return false;
}