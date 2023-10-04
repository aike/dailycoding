// 20230904
// 格子を円形にマスク

let base_h;
let depth = 0;
let cv;

function setup() {
  base_h = random() * 360;

  cv = createCanvas(800, 800);
  pixelDensity(pixelDensity());
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100, 100);
  noLoop();
}

function draw() {
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
  
  let boxSize = min(width, height) * 0.5;
  let xpos = (width - boxSize) / 2; 
  let ypos = (height - boxSize) / 2; 

  let frame_size = 10;

  stroke('#444');
  let cell_num = 5;
  let cell_size = boxSize / cell_num;
  fill_or_split(xpos, ypos, boxSize, 5);
    
  
  // frame
  strokeWeight(frame_size * 2);
  noFill();
  drawingContext.shadowOffsetX = 25;
  drawingContext.shadowOffsetY = 25;
  drawingContext.shadowBlur = 40;

  stroke(color(30, 30, 65));
  drawingContext.shadowColor = '#0005';  
  rect(xpos - frame_size, ypos - frame_size, boxSize + frame_size * 2);    
  drawingContext.shadowColor = '#0000';  
  for (let i = 0; i < 5; i++) {
    rect(xpos - frame_size - i, ypos - frame_size - i, boxSize + frame_size * 2);    
  }
  stroke(color(30, 35, 80));
  rect(xpos - frame_size - 5, ypos - frame_size - 5, boxSize + frame_size * 2);    

  // frame high light
  stroke(30, 30, 90);
  strokeWeight(1);
  let lx0 = xpos - frame_size - 15;
  let ly0 = ypos - frame_size - 15;
  let lx1 = lx0 + boxSize + 40;
  let ly1 = ly0;
  line(lx0, ly0, lx1, ly1); 
  lx1 = lx0;
  ly1 = ly0 + boxSize + 40;
  line(lx0, ly0, lx1, ly1); 
  ly0 = ly0 + 20;
  ly1 = ly1 - 20;
  line(lx0 + boxSize + 20, ly0, lx0 + boxSize + 20, ly1); 
  ly0 = ly1;
  line(lx0 + 20, ly0, lx0 + boxSize + 20, ly1); 

  
  // smart phone shadow
  let sc = 1.4;
  for (let i = 0; i < 10; i++) {
    shadowmaker(sc - 0.02 * i);
  }  
}

function fill_or_split(x, y, size, cell_num) {
  depth++;
  for (let i = 0; i < cell_num; i++) {
    for (let j = 0; j < cell_num; j++) {
      let cell_size = size / cell_num;
      let x0 = x + i * cell_size;
      let y0 = y + j * cell_size;
      if (depth > 1) {
        fillrect(x0, y0, cell_size);
      } else {
        fill_or_split(x0, y0, cell_size, int(random(3)) + 1);
        circlewindow(x0, y0, cell_size);
      }
    }
  }
  depth--;
}

function fillrect(x, y, s) {
  stroke('#444');
  if (random() > 0.05) {
    fill(base_h + random() * 180, 30, 100);
  } else {
    let c = (base_h + 360) % 360;
    fill(c + random() * 30, 50, 100);    
  }
  rect(x,y,s);  
}


function circlewindow(x, y, s) {
  let sc = 0.005;
  let h = base_h + random(100);
  let cx = x + s / 2;
  let cy = y + s / 2;
  let r = s / 2.5;      
  strokeWeight(2);
  for (let sy = 0; sy < s; sy++) {
    for (let sx = 0; sx < s; sx++) {
      let d = dist(x + sx, y + sy, cx, cy);
      if (d > r) {
        stroke(color(h, 40, 100));
        point(x + sx, y + sy);
      }
    }
  }
  stroke(color(h, 40, 40));
  strokeWeight(1);
  noFill();
  circle(cx, cy, r * 2);
  
  stroke('#444');
  noFill();
  strokeWeight(1);
  rect(x,y,s);  
}

function shadowmaker(sc) {

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
