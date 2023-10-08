// 20230920
// 正方形の中点を結ぶ正方形を再帰

let base_h0;
let base_h;
let depth = 0;
let max_depth;
let cv;
let cell_size;
let scale_factor;

function setup() {
  cv = createCanvas(800, 800);
  pixelDensity(pixelDensity());
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100);
  noLoop();
}


function draw() {
  draw_floor();
  let box_size = min(width, height) * 0.5;
  let xpos = (width - box_size) / 2; 
  let ypos = (height - box_size) / 2; 
  let frame_width = 10;
  let cell_num = 5;
  let cell_size = box_size / cell_num;
  draw_image(xpos, ypos, box_size, cell_num);
  draw_frame(xpos, ypos, box_size, frame_width);
  // smart phone shadow
  let sc = 1.4;
  for (let i = 0; i < 10; i++) {
    shadowmaker(sc - 0.02 * i);
  }  
}

///////////////// DRAW IMAGE  ///////////////////////

function draw_image(x, y, size, cell_num) {
  base_h0 = random(360);
  for (let i = 0; i < cell_num; i++) {
    for (let j = 0; j < cell_num; j++) {
      cell_size = int(size / cell_num);
      let x0 = x + i * cell_size;
      let y0 = y + j * cell_size;
      base_h = int(base_h0 + random(150)) % 360;
      max_depth = int(random(4) + 2);

      fillrect_recursive(
        x0, y0, 
        x0 + cell_size, y0,
        x0 + cell_size, y0 + cell_size,
        x0, y0 + cell_size);
      
      stroke('#444');
      noFill();
      rect(x0, y0, cell_size);
    }
  }
}

function fillrect_recursive(x0, y0, x1, y1, x2, y2, x3, y3) {
  let h = int(base_h + random(100)) % 360;
  let v = (depth % 2 == 0) ? 100 : 80;
  fill(h, 30, v);
  stroke('#444');
  
  beginShape();
  vertex(x0, y0);
  vertex(x1, y1);
  vertex(x2, y2);
  vertex(x3, y3);
  endShape(CLOSE);   

  if (depth < max_depth) {
    depth++;
    let nx0 = (x0 + x1) / 2;
    let ny0 = (y0 + y1) / 2;
    let nx1 = (x1 + x2) / 2;
    let ny1 = (y1 + y2) / 2;
    let nx2 = (x2 + x3) / 2;
    let ny2 = (y2 + y3) / 2;
    let nx3 = (x3 + x0) / 2;
    let ny3 = (y3 + y0) / 2;
    fillrect_recursive(nx0, ny0, nx1, ny1, nx2, ny2, nx3, ny3);
    depth--;
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
