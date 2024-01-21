// 20240120
// 扇型弾幕パーティクル

let base_h0;
let base_h;
let cv;

let init = false;
let gen = -1;
let genmax = 500;

let generators = [];
let bullets = [];
let num_shoot = 2;
let bulletsize;
let diroffset;

let floor_is_drawn = false;
let image_is_drawn = false;
let frame_is_drawn = false;
let shadow_is_drawn = false;

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

class Generator {
  constructor(w, h) {
    this.age = 0;
    this.w = w;
    this.h = h;
    this.rx = this.w / 2 + random(this.w / 4);
    this.ry = this.h / 4 + random(this.h / 4);
    this.x0 = random(this.rx) + w / 2;
    this.y0 = random(h / 2) + h / 8;
    this.x_theta = random(TWO_PI);
    this.x_delta = TWO_PI / 800 + random(TWO_PI / 800);
    this.y_theta = random(TWO_PI);
    this.y_delta = TWO_PI / 800 + random(TWO_PI / 800);
    this.x = this.x0 + sin(this.x_theta) * this.rx;
    this.y = this.y0 + cos(this.y_theta) * this.ry;
  }

  show() {
    //g.fill(0, 100, 100, 50);
    //g.noStroke();
    //g.ellipse(this.x, this.y, this.w / 10, this.h / 10);
  }

  move() {
    this.age++;
    this.x_theta += this.x_delta;
    this.y_theta += this.y_delta;
    this.x = this.x0 + sin(this.x_theta) * this.rx;
    this.y = this.y0 + cos(this.y_theta) * this.ry;
    
    if (this.x < 0) this.x += this.w;
    if (this.x > this.w) this.x -= this.w;
    
  }

}


class Bullet {
  constructor(g, x, y, w, h, zm, col, angle, dh) {
    this.age = 0;
    this.g = g;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.sz = w / 15 * zm;
    this.speed = this.w / 100;
    this.col = col;
    this.angle = angle;
    this.dx = cos(angle) * this.speed;
    this.dy = sin(angle) * this.speed;
    this.hu = g.hue(col);
    this.st = g.saturation(col);
    this.br = g.brightness(col);
    this.dh = dh;
  }

  show() {
    this.hu = int(this.hu + this.dh) % 360;
    g.fill(this.hu, this.st, this.br, 10 + 10 * cos(this.age / 200));
    noStroke();
    g.ellipse(this.x, this.y, this.sz, this.sz);
  }

  move() {
    this.age++;
    this.x += this.dx;
    this.y += this.dy;
    if (this.y < 0 || this.y > this.h) {
      this.dy = -this.dy
    }
    if (this.x < 0 || this.x > this.w) {
      this.dx = -this.dx
    }
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
    
  }

  if (gen == -1) {
    gen = 0;
    base_h = int(base_h0 + random(60)) % 360;
    fillrect_init(x0, y0, cell_size);
    image(g, x0, y0, cell_size, cell_size, 0, 0, cell_size, cell_size);  
    return;
  } else {
    fillrect(x0, y0, cell_size);
    image(g, x0, y0, cell_size, cell_size, 0, 0, cell_size, cell_size);
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
  generators = [];
  bullets = [];  
  bulletsize = 0.2 + pow(2, random(2)) * 0.5;
  diroffset = random(360);
  
  // background
  g.fill(0, 0, 5);
  g.noStroke();
  g.rect(0, 0, s, s);
}

function fillrect(x0, y0, s) {
  g.fill(0, 0, 5, 3);
  g.noStroke();
  g.rect(0, 0, s, s);

  if (frameCount % 60 === 0) {
    if (generators.length < 2) {
      generators.push(new Generator(s, s));
    }
  }

  let angleStep = PI / 8;
  
  for (let i = generators.length - 1; i >= 0; i--) {
    generators[i].show();
    generators[i].move();
    if (generators[i].age % 80 === 1) {
      if (bullets.length < num_shoot * 30) {
        let c = g.color(int(base_h + random(60)) % 360, 60, 100);
        let cd = 0.2 + random(0.5);
        for (let j = 0; j < 5; j++) {
          bullets.push(new Bullet(g, generators[i].x, generators[i].y, s, s, bulletsize, c, PI / 2 - angleStep * 2 + angleStep * j, cd));
        }
      }
    }
  }

  for (let bullet of bullets) {
    bullet.show();
    bullet.move();
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