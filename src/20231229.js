// 20231229
// ダイアモンド－スクエア・アルゴリズム＋ガウシアンフィルター


let cell;
let csize;
let cinit = false;
let amp;

let base_h0;
let base_h;
let cv;

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
  base_h = int(base_h0 + random(100)) % 360;

  if (!cinit) {
    csize = cell_size;
    cell = Array(csize);
    for (let i = 0; i < csize; i++) {
      cell[i] = Array(csize);
      for (let j = 0; j < csize; j++) {
        cell[i][j] = 0;
      }
    } 
    cinit = true;
  }  
  fillrect(x0, y0, csize);
    
  // 枠線
  stroke('#444');
  strokeWeight(1);
  noFill();
  rect(x0, y0, cell_size);

  dr_j++;
}

cttt = 0;

function fillrect(x0, y0, s) {
  noFill();
  amp = 80;
  
  h = base_h + random(360);
  
  diamondSquare(x0, y0, s);
  
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      let val = gaussianFilter5(x, y);
      if (cttt < 50) {
        console.log(val, cell[y][x]);
        cttt++;
      }
      let cstep = int(val / 16) % 7;
      let hu = (h + 360 / 7 * cstep) % 360;
      let st = 40;
      let br = 20 + 80 * (int(val / 160) % 2);
      stroke(hu, st, br);
      strokeWeight(2);
      point(x0 + x, y0 + y);
    }
  }
  
}


function gaussianFilter(x, y) {
  let cval = cell[y][x];
  let sum = 0;
  sum += gget(x - 1, y - 1, cval) * 1 / 16;
  sum += gget(x + 0, y - 1, cval) * 2 / 16;
  sum += gget(x + 1, y - 1, cval) * 1 / 16;
  sum += gget(x - 1, y + 0, cval) * 2 / 16;
  sum += gget(x - 0, y + 0, cval) * 4 / 16;
  sum += gget(x + 1, y + 0, cval) * 2 / 16;
  sum += gget(x - 1, y + 1, cval) * 1 / 16;
  sum += gget(x + 0, y + 1, cval) * 2 / 16;
  sum += gget(x + 1, y + 1, cval) * 1 / 16;
  
  return sum;  
}

function gaussianFilter5(x, y) {
  let cval = cell[y][x];
  let sum = 0;
  sum += gget(x - 2, y - 2, cval) * 1 / 256;
  sum += gget(x - 1, y - 2, cval) * 4 / 256;
  sum += gget(x + 0, y - 2, cval) * 6 / 256;
  sum += gget(x + 1, y - 2, cval) * 4 / 256;
  sum += gget(x + 2, y - 2, cval) * 1 / 256;

  sum += gget(x - 2, y - 1, cval) *  4 / 256;
  sum += gget(x - 1, y - 1, cval) * 16 / 256;
  sum += gget(x + 0, y - 1, cval) * 24 / 256;
  sum += gget(x + 1, y - 1, cval) * 16 / 256;
  sum += gget(x + 2, y - 1, cval) *  4 / 256;

  sum += gget(x - 2, y + 0, cval) *  6 / 256;
  sum += gget(x - 1, y + 0, cval) * 24 / 256;
  sum += gget(x + 0, y + 0, cval) * 36 / 256;
  sum += gget(x + 1, y + 0, cval) * 24 / 256;
  sum += gget(x + 2, y + 0, cval) *  6 / 256;

  sum += gget(x - 2, y + 1, cval) *  4 / 256;
  sum += gget(x - 1, y + 1, cval) * 16 / 256;
  sum += gget(x + 0, y + 1, cval) * 24 / 256;
  sum += gget(x + 1, y + 1, cval) * 16 / 256;
  sum += gget(x + 2, y + 1, cval) *  4 / 256;
  
  sum += gget(x - 2, y + 2, cval) * 1 / 256;
  sum += gget(x - 1, y + 2, cval) * 4 / 256;
  sum += gget(x + 0, y + 2, cval) * 6 / 256;
  sum += gget(x + 1, y + 2, cval) * 4 / 256;
  sum += gget(x + 2, y + 2, cval) * 1 / 256;
  
  return sum;  
}


function gget(x, y, cval) {
  if (x < 0 || y < 0 || x >= csize || y >= csize) {
    return cval;
  }
  return cell[y][x];
}

function diamondSquare(x0, y0, s) {
  let l = s - 1;
  let hl;

  cell[0][0] = rnd(s);
  cell[0][l] = rnd(s);
  cell[l][0] = rnd(s);
  cell[l][l] = rnd(s);  

  while (l > 1) {
    hl = floor(l / 2);
    // Diamond Step
    for (let y = 0; y < s - 1 - hl; y += l) {
      for (let x = 0; x < s - 1 - hl; x += l) {
        let px, py;
        let cnt = 0;
        let sum = 0;
        py = y;
        px = x;
        if ((px >= 0) && (px < csize) && (py >= 0) && (py < csize)) {
          sum += cell[py][px];
          cnt++;
        }
        py = y;
        px = x + l;
        if ((px >= 0) && (px < csize) && (py >= 0) && (py < csize)) {
          sum += cell[py][px];
          cnt++;
        }
        py = y + l;
        px = x;
        if ((px >= 0) && (px < csize) && (py >= 0) && (py < csize)) {
          sum += cell[py][px];
          cnt++;
        }
        py = y + l;
        px = x + l;
        if ((px >= 0) && (px < csize) && (py >= 0) && (py < csize)) {
          sum += cell[py][px];
          cnt++;
        }
                
        let ave = sum / cnt;
        cell[y + hl][x + hl] = ave + rnd(s);
      }
    }

    // Square Step
    for (let y = 0; y < s - 1; y += l) {
      for (let x = 0; x < s - 1; x += l) {
        let py, px;
        py = y + hl * 0;
        px = x + hl * 1;
        if ((px >= 0) && (px < csize) && (py >= 0) && (py < csize)) {
          cell[py][px] = getSquare(px, py, hl) + rnd(s);
        }
        py = y + hl * 1;
        px = x + hl * 0;
        if ((px >= 0) && (px < csize) && (py >= 0) && (py < csize)) {
          cell[py][px] = getSquare(px, py, hl) + rnd(s);
        }
        py = y + hl * 1;
        px = x + hl * 2;
        if ((px >= 0) && (px < csize) && (py >= 0) && (py < csize)) {
          cell[py][px] = getSquare(px, py, hl) + rnd(s);
        }
        py = y + hl * 2;
        px = x + hl * 1;
        if ((px >= 0) && (px < csize) && (py >= 0) && (py < csize)) {
          cell[py][px] = getSquare(px, py, hl) + rnd(s);
        }
      }
    }
    l = hl;
    amp *= 0.5;
  }
}

function rnd(s) {
  return s * random() * amp; // * (random() > 0.5) ? 1 : -1;
} 

function getSquare(x, y, s) {
  let cnt = 0;
  let sum = 0;
  let py, px;
  
  py = y - s;
  px = x;
  if ((px >= 0) && (px < csize) && (py >= 0) && (py < csize)) {
    sum += cell[px][py];
    cnt++;
  }
  py = y;
  px = x - s;
  if ((px >= 0) && (px < csize) && (py >= 0) && (py < csize)) {
    sum += cell[px][py];
    cnt++;
  }
  py = y;
  px = x + s;
  if ((px >= 0) && (px < csize) && (py >= 0) && (py < csize)) {
    sum += cell[px][py];
    cnt++;
  }
  py = y + s;
  px = x;
  if ((px >= 0) && (px < csize) && (py >= 0) && (py < csize)) {
    sum += cell[px][py];
    cnt++;
  }
  sum /= cnt;
  
  return sum;
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