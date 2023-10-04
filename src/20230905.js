// 20230905
// vertexで星形にマスク

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

function keyTyped(){
  if(key == 's'){
    let yymmdd = (new Date()).toISOString().replace(/[A-Z].*/,'').replace(/-/g,'');
    saveCanvas(cv, yymmdd, '');    
  }
  return false;
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
        fill_or_split(x0, y0, cell_size, int(random(4)) + 1);
        starwindow(x0, y0, cell_size, 5 + int(random(4)));
      }
    }
  }
  depth--;
}

function fillrect(x, y, s) {
  stroke('#888');
  fill(base_h + random(150) , 20, 100);
  rect(x,y,s);  
}



function starwindow(x, y, size, vnum) {
  
  let h = base_h + random(150);

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
  let g = createGraphics(size, size);
  g.angleMode(DEGREES);
  g.background(color(h, 30, 85));
  g.beginShape();

  g.erase();
  for (let i = 0; i < vnum; i++) {
    n = i * 4;
    g.vertex(p[n + 0], p[n + 1]);
    g.vertex(p[n + 2], p[n + 3]);
  }  
  g.endShape(CLOSE);
  image(g, x, y);

  // draw edging
  stroke(color(h, 50, 50));
  strokeWeight(1);
  noFill();
  beginShape();
  for (let i = 0; i < vnum; i++) {
    n = i * 4;
    vertex(x + p[n + 0], y + p[n + 1]);
    vertex(x + p[n + 2], y + p[n + 3]);
  }  
  endShape(CLOSE);
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

