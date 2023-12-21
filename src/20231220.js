// 20231220
// 二種類の虹色流体を合成

let base_h0;
let base_h;
let cv;

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
    //colorMode(RGB, 1, 1, 1, 1);
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
  fillrect(x0, y0, cell_size);
  // 枠線
  stroke('#444');
  strokeWeight(1);
  noFill();
  rect(x0, y0, cell_size);

  dr_j++;
}

function fillrect(x0, y0, s) {
  let cnt = random(10);
  let zoom = random(0.002) + 0.003;
  let imax = int(random(15) + 5);  
  let offset_x = random(5);
  let offset_y = random(5);

  let cnt2 = random(10);
  let zoom2 = random(0.002) + 0.003;
  let imax2 = int(random(5) + 10);  
  let offset_x2 = random(5) + 3;
  let offset_y2 = random(5) + 3;
  
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      let px = zoom * x + offset_x;
      let py = zoom * y + offset_y;
      let npx = px;
      let npy = py;

      let px2 = zoom2 * x + offset_x2;
      let py2 = zoom2 * y + offset_y2;
      let npx2 = px2;
      let npy2 = py2;      
      
      for (let i = 1; i < imax; i++) {
        npx += 1.1 / i * sin(i * py + cnt * 3.0 / 20 + 0.3 * i) + 4;     
        npy += 0.8 / i * cos(i * px + cnt * 2.0 / 20 + 0.3 * i) - 4;
        px = npx;
        py = npy;
      }

      for (let i = 1; i < imax2; i++) {
        npx2 += 1.1 / i * sin(i * py2 + cnt2 * 3.0 / 20 + 0.3 * i) + 4;     
        npy2 += 0.8 / i * cos(i * px2 + cnt2 * 2.0 / 20 + 0.3 * i) - 4;
        px2 = npx2;
        py2 = npy2;
      }
      
      let g = 0.3 * sin(3 * px) + 0.7;
      let b = 0.1 * sin(1 * px) + 0.1;
      let r = 0.3 * sin(py) + 0.7;

      let g2 = 0.3 * sin(1 * py2) + 0.7;
      let b2 = 0.1 * sin(3 * py2) + 0.1;
      let r2 = 0.3 * sin(px2) + 0.7;
      
      let v = (r + g + b) / 3;
      let v_s = floor(v * 8 * 16);
      let v2 = (r2 + g2 + b2) / 3;
      let v2_s = floor(v2 * 8 * 16);

      let hh, sat, br;
      if (((v_s + v2_s) % 8) == 7) {
        hh = 0;
        sat = 0;
        br = 10;        
      } else {
        hh = (360 / 7 * (v_s % 8) + 360 / 7 * (v2_s % 8 + 4)) % 360;
        sat = 90;
        br = 100;
      }
      stroke(hh, sat, br);
      strokeWeight(2);
      point(x0 + x, y0 + y);
      
    }
  }
  
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