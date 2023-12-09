// 20231209
// 二値化と影をつけた対称チューリングパターン

let base_h, h;
let cv;
let g;

let floor_is_drawn = false;
let image_is_drawn = false;
let frame_is_drawn = false;
let shadow_is_drawn = false;

let frame_width = 10;
let cell_num = 5;

let csize = 80;
let cell;
let xysize;
let xsize;
let xy = 0;
let gen = -1;
let genmax = 0;

const valA = 0;
const valB = 1;

const DA = 1.0;
const DB = 0.5;
const feedrate0 = 0.055;
const killrate0 = 0.062;
let feedrate;
let killrate;

let initdots;
let cellh;
let current_cell = 0;

let col0;

function setup() {
  cv = createCanvas(800, 800);
  pixelDensity(pixelDensity());
  angleMode(RADIANS);
  colorMode(HSB, 360, 100, 100, 100);

  base_h = random(360);

  xsize = (csize + 2) * 2;
  xysize = (csize + 2) * xsize;
  cell = Array(xysize * 2);
  for (let n = 0; n < 2; n++) {
    for (let y = -1; y < csize + 1; y++) {
      for (let x = -1; x < csize + 1; x++) {
        cset(n, x, y, valA, 0);
        cset(n, x, y, valB, 0);
      }
    }
  }

  let box_size = min(width, height) * 0.5;
  let w = int(box_size / cell_num);
  initdots = Array(cell_num * cell_num);
  for (let y = 0; y < cell_num; y++) {
    for (let x = 0; x < cell_num; x++) {
      initdots[y * cell_num + x] = [];
    }
  }

  cellh = Array(cell_num * cell_num);
  
  for (let y = 0; y < cell_num; y++) {
    for (let x = 0; x < ceil(cell_num / 2); x++) {
      let imax = int(random(3)) + 5;
      for (let i = 0; i < imax; i++) {
        let rx = csize / 4 + int(random(csize / 2));
        let ry = csize / 4 + int(random(csize / 2));
        initdots[y * cell_num + x].push({x:rx, y:ry});
        initdots[y * cell_num + (cell_num - x - 1)].push({x:csize - rx, y:ry});
        
        cellh[y * cell_num + x] = int(base_h + random(150)) % 360;
        cellh[y * cell_num + (cell_num - x - 1)] = cellh[y * cell_num + x];
      }       
    }
  }
  
}

function cget(n, x, y, ab) {
  x = (x + csize) % csize;
  y = (y + csize) % csize;
  return cell[n * xysize + (y + 1) * xsize + (x + 1) * 2 + ab];
}

function cset(n, x, y, ab, v) {
  x = (x + csize) % csize;
  y = (y + csize) % csize;
  cell[n * xysize + (y + 1) * xsize + (x + 1) * 2 + ab] = v;
}


function draw() {
  if (!floor_is_drawn) {
    floor_is_drawn = true;
    draw_floor();    
  }

  let box_size = min(width, height) * 0.5;
  let xpos = (width - box_size) / 2; 
  let ypos = (height - box_size) / 2; 
  
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
    genmax = 5000;                     ///////////// GEN ////

    feedrate = feedrate0;
    killrate = killrate0;
    
    g = createGraphics(w, w);
    g.pixelDensity(pixelDensity());
    fillrect_init(g, x0, y0, w);
    image(g, x0, y0, w, w, 0, 0, w, w);  
    return;
  } else {
    for (let i = 0; i < 100; i++) {
      fillrect_silent(g, x0, y0, w);     
    }
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
  h = cellh[current_cell];
  col0 = color(h, 10, 10);
 
  // background
  g.fill(col0);
  g.noStroke();
  g.rect(0, 0, w, w);
  
  // set initial generation
  for (let y = -1; y < csize + 1; y++) {
    for (let x = -1; x < csize + 1; x++) {
      cset((1 - xy), x, y, valA, 1);
      cset((1 - xy), x, y, valB, 0);
    }
  }

  // initial dots
  let sz = csize / 20;
  let imax = initdots[current_cell].length;
  for (let i = 0; i < imax; i++) {
    let px = initdots[current_cell][i].x;
    let py = initdots[current_cell][i].y;
    for (let y = py - sz; y < py + sz; y++) {
      for (let x = px - sz; x < px + sz; x++) {
        if (dist(x, y, px, py) < sz) {
          cset((1 - xy), x, y, valA, 0);
          cset((1 - xy), x, y, valB, 0.5);          
        }      
      }
    }
  }
  current_cell++;
  
  drawdots(g, w);  

}

function fillrect(g, x0, y0, w) {

  // calc next generation
  for (let y = 0; y < csize; y++) {
    for (let x = 0; x < csize; x++) {
      let a = cget(xy, x, y, valA);
      let b = cget(xy, x, y, valB);
      let lap_a = laplacian(xy, x, y, valA);
      let lap_b = laplacian(xy, x, y, valB);
      let feed_a = feedrate * (1.0 - a);
      let kill_b = (killrate + feedrate) * b;
      let new_a = a + (DA * lap_a) - (a * b * b) + feed_a;
      let new_b = b + (DB * lap_b) + (a * b * b) - kill_b;
      cset((1 - xy), x, y, valA, new_a);
      cset((1 - xy), x, y, valB, new_b);
    }
  }
  drawdots(g, w); 
}

function fillrect_silent(g, x0, y0, w) {

  // calc next generation
  for (let y = 0; y < csize; y++) {
    for (let x = 0; x < csize; x++) {
      let a = cget(xy, x, y, valA);
      let b = cget(xy, x, y, valB);
      let lap_a = laplacian(xy, x, y, valA);
      let lap_b = laplacian(xy, x, y, valB);
      let feed_a = feedrate * (1.0 - a);
      let kill_b = (killrate + feedrate) * b;
      let new_a = a + (DA * lap_a) - (a * b * b) + feed_a;
      let new_b = b + (DB * lap_b) + (a * b * b) - kill_b;
      cset((1 - xy), x, y, valA, new_a);
      cset((1 - xy), x, y, valB, new_b);
    }
  }
  xy = 1 - xy;
  gen++;
}

function drawdots(g, w) {
  xy = 1 - xy;

  // background
  g.fill(h, 5, 100);
  g.noStroke();
  g.rect(0, 0, w, w);  
  
  g.noFill();
  g.strokeWeight(w / csize * 1.5);
  let c;
  let ps = w / (csize - 1);
  for (let y = 0; y < csize; y++) {
    for (let x = 0; x < csize; x++) {      
      let v = cget(xy, x, y, valA);
      let vv = pow((1-v), 0.5); // thickness
      let n = sigmoid(vv * 100 - 50); //
      if (n > 0.9999) {
        g.stroke(h, 0, 0, 18);
        g.point((x + 1) * ps, (y + 3) * ps);        
        g.stroke(h, 0, 0, 8);
        g.point((x + 4) * ps, (y + 3) * ps);        
        g.stroke(h, 0, 0, 5);
        g.point((x + 6) * ps, (y + 3) * ps);        
        g.stroke(h, 30 + 20 * n, 100 - (10 * n), 100);
        g.point(x * ps, y * ps);
      }
    }
  }
  gen++;
}

function laplacian(n, x, y, v) {
  return (
    cget(n, x-1, y-1, v) * 0.05 + cget(n, x, y-1, v) * 0.2 + cget(n, x+1, y-1, v) * 0.05 + 
    cget(n, x-1, y  , v) * 0.2  + cget(n, x, y  , v) * -1  + cget(n, x+1, y  , v) * 0.2  +
    cget(n, x-1, y+1, v) * 0.05 + cget(n, x, y+1, v) * 0.2 + cget(n, x+1, y+1, v) * 0.05);
}

function sigmoid(x) {
  return 1 / (1 + exp(-x));
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