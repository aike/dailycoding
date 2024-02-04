// 20240204
// 星形の成長するライフゲーム

let base_h;

let cv;
let g;

let floor_is_drawn = false;
let image_is_drawn = false;
let frame_is_drawn = false;
let shadow_is_drawn = false;

let csize = 50;
let cell = [];
let cellage = [];
let xysize;
let xy = 0;
let gen = -1;
let genmax = 0;

let col0, col1;


function setup() {
  cv = createCanvas(800, 800);
  pixelDensity(pixelDensity());
  angleMode(RADIANS);
  colorMode(HSB, 360, 100, 100, 100);

  xysize = (csize + 2) * (csize + 2);
  for (let n = 0; n < 2; n++) {
    for (let y = -1; y < csize + 1; y++) {
      for (let x = -1; x < csize + 1; x++) {
        cset(n, x, y, 0);
      }
    }
  }
  base_h = random(360);
}

function cget(n, x, y) {
  return cell[n * xysize + (y + 1) * (csize + 2) + (x + 1)];
}

function cset(n, x, y, v) {
  cell[n * xysize + (y + 1) * (csize + 2) + (x + 1)] = v;
}

function aget(x, y) {
  return cellage[(y + 1) * (csize + 2) + (x + 1)];
}

function aset(x, y, v) {
  cellage[(y + 1) * (csize + 2) + (x + 1)] = v;
}

function ainc(x, y, v) {
  cellage[(y + 1) * (csize + 2) + (x + 1)] += 1;
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
    draw_image(xpos, ypos, box_size, cell_num);
    if (!image_is_drawn) {
      return;
    }
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
  
  let w = int(size / cell_num);
  let x0 = x + dr_j * w;
  let y0 = y + dr_i * w;

  if (gen == -1) {
    gen = 0;
    genmax = int(random(25)) + 80;
    g = createGraphics(w, w);
    g.pixelDensity(pixelDensity());
    fillrect_init(g, x0, y0, w);
    image(g, x0, y0, w, w, 0, 0, w, w);  
    return;
  } else {
    fillrect(g, x0, y0, w);
    image(g, x0, y0, w, w, 0, 0, w, w);  
    if (gen < genmax) {
      return;
    }
  }  

  // 枠線
  stroke('#444');
  strokeWeight(1);
  noFill();
  rect(x0, y0, w);

  gen = -1;
  dr_j++;
}

function fillrect_init(g, x0, y0, w) {
  g.colorMode(HSB, 360, 100, 100, 100);
  h = int(base_h + random(60)) % 360;
  col0 = color(h, 100, 100, 100);
  col1 = color(h, 20, 100, 100);
  coli = color(int(h + 180) % 360, 30, 80, 10);
 
  // background
  g.fill(180, 100, 10);
  g.noStroke();
  g.rect(0, 0, w, w);
  
  // set initial generation
  for (let y = -1; y < csize + 1; y++) {
    for (let x = -1; x < csize + 1; x++) {
      let v = (random() > 0.8) ? 1 : 0;
      cset((1 - xy), x, y, v);
      aset(x, y, 0);
    }
  }
  drawdots(g, w);  
}

function fillrect(g, x0, y0, w) {
  // calc next generation
  for (let y = 0; y < csize; y++) {
    for (let x = 0; x < csize; x++) {
      let s =
          cget(xy, x - 1, y - 1) + cget(xy, x, y - 1) + cget(xy, x + 1, y - 1) +
          cget(xy, x - 1, y    ) +                      cget(xy, x + 1, y    ) +
          cget(xy, x - 1, y + 1) + cget(xy, x, y + 1) + cget(xy, x + 1, y + 1)
      let v;
      switch (s) {
        case 2:
          v = cget(xy, x, y);
          if (v == 1) {
            ainc(x, y);
          }
          break;
        case 3:
          v = cget(xy, x, y);
          if (v == 0) {
            ainc(x, y);
          } else {
            aset(x, y, 0);
          }          
          v = 1;
          break;
        default:
          v = 0;
          break;          
      }
      cset((1 - xy), x, y, v);
    }
  }
  
  // background
  g.fill(180, 100, 10, 50);
  g.noStroke();
  g.rect(0, 0, w, w);  
  drawdots(g, w); 
}

function drawdots(g, w) {
  xy = 1 - xy;

  g.noFill();
  let c;
  let ps = w / (csize - 1);
  for (let y = 0; y < csize; y++) {
    for (let x = 0; x < csize; x++) {
      if (cget(xy, x, y) == 1) {
        g.noStroke();
        let a = aget(x, y);
        let s = 4 + a / 2;
        let rx = noise(x, y, 0) * w / 10;
        let ry = noise(x, y, 1) * w / 10;
        g.fill((h + a) % 360, 40, 100, 50);
        stardot(g, rx + x * ps - s / 2, ry + y * ps - s / 2, s, 5);
      }
    }
  }
  gen++;
}



function stardot(g, x, y, size, vnum) {
  angleMode(DEGREES)
  let hs = size / 2;
  let theta1 = 360 / vnum / 2;
  let theta2 = 90 - (360 / vnum);
  let theta3 = theta1 + theta2;
  let r1 = size * 0.48;
  let r2 = r1 * sin(theta2) / sin(theta3);
  let px, py;
  let p = [];
  let n = 0;
  let t = 0;
  // calc vertex
  for (let i = 0; i < vnum; i++) {
    px = 0;
    py = -r1;
    p[n++] = hs + px * cos(t) - py * sin(t);
    p[n++] = hs + px * sin(t) + py * cos(t);
    t += theta1;
    px = 0;
    py = -r2;
    p[n++] = hs + px * cos(t) - py * sin(t);
    p[n++] = hs + px * sin(t) + py * cos(t);
    t += theta1;
  }

  // create mask
  g.beginShape();
  for (let i = 0; i < vnum; i++) {
    n = i * 4;
    g.vertex(x + p[n + 0], y + p[n + 1]);
    g.vertex(x + p[n + 2], y + p[n + 3]);
  }  
  g.endShape(CLOSE);
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