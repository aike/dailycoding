// 20231119
// 矩形の再帰にブラウン管グリッチ

let base_h0;
let base_h1;
let base_h;
let cv;

let floor_is_drawn = false;
let image_is_drawn = false;
let frame_is_drawn = false;
let shadow_is_drawn = false;

let depth = 0;
let max_depth;

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
  base_h = int(base_h0 + random(120)) % 360;
  max_depth = int(random(4) + 2);

  let g = createGraphics(w * 3, w * 3);
  g.pixelDensity(pixelDensity());
  fillrect(g, x0, y0, w);
  image(g, x0, y0, w, w, w, w, w, w);  

  // 枠線
  stroke('#444');
  strokeWeight(1);
  noFill();
  rect(x0, y0, w);

  dr_j++;
}

function fillrect(g, x0, y0, w) {
  g.colorMode(HSB, 360, 100, 100);
  let h = int(base_h + random(180)) % 360;
  g.fill(h, 40, 80);
  g.rect(0, 0, w * 3, w * 3);  
  
  let o = w + 4;
  rect_recursive(g, o, o, o + w, o, o + w, o + w, o, o + w);
  
  // glitch
  g.colorMode(RGB, 255, 255, 255, 255);

  let rx0 = random(4) + 1;
  let ry0 = random(4) + 1;
  let rx1 = random(4) + 1;
  let ry1 = random(4) + 1;
  
  for (let y = 0; y < w; y++) {
    for (let x = 0; x < w; x++) {
      let crgb0 = g.get(w + x, w + y);
      let crgb1 = g.get(w + x - rx0, w + y - ry0);
      let crgb2 = g.get(w + x - rx1, w + y - ry1);
      g.strokeWeight(2);
      g.stroke(crgb0[0], crgb1[1], crgb1[2]);
      g.point(w + x - rx0, w + y -ry0);
      g.stroke(crgb2[0], crgb0[1], crgb2[2]);
      g.point(w + x - rx1, w + y - ry1);
    }      
  }


  // pink noise
  if (random() < 0.12) {
    g.fill(250, 250, 250);
    g.noStroke();
    g.rect(0, 0, w * 3);    
    let nsize = w / 100;
    for (let y = 0; y < w; y += nsize) {
      for (let x = 0; x < w; x += nsize) {
        let nc = random(230);
        g.fill(nc, nc, nc);
        g.rect(w + x, w + y, nsize);
      }
    }
  }

  // stripe
  for (let y = 0; y < w; y += w / 20) {
    g.noFill();
    g.stroke(0, 0, 0, 30 + random(30));
    g.strokeWeight(2);
    g.line(0, w + y, w * 3, w + y);
  }
  
  
  // tube frame
  for (let y = 0; y < w; y++) {
    for (let x = 0; x < w; x++) {
      let d0 = dist(x, y, w / 2, w * 3);
      d0 = max(d0, dist(x, y, w / 2, - w * 2));
      if (d0 > w * 2.94) {
        g.stroke(20, 20, 20, 255);
        if (d0 < w * 2.97) {
          g.stroke(20, 20, 20, 20 + (d0 - w * 2.94) * 35);
        }
        g.strokeWeight(2);
        g.point(w + x, w + y);
      }

      let d1 = dist(x, y, w * 3, w / 2);
      d1 = max(d1, dist(x, y, - w * 2, w / 2));
      if (d1 > w * 2.95) {
        g.stroke(20, 20, 20, 255);
        if (d1 < w * 2.98) {
          g.stroke(20, 20, 20, 20 + (d1 - w * 2.95) * 35);
        }
        g.strokeWeight(2);
        g.point(w + x, w + y);
      }
    
    }
  }
  
  
  
}


function rect_recursive(g, x0, y0, x1, y1, x2, y2, x3, y3) {
  let h = int(base_h + random(180)) % 360;
  let v = (depth % 2 == 0) ? 80 : 50;
  g.fill(h, 40, v);
  g.noStroke();

  
  g.beginShape();
  g.vertex(x0, y0);
  g.vertex(x1, y1);
  g.vertex(x2, y2);
  g.vertex(x3, y3);
  g.endShape(CLOSE);   

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
    rect_recursive(g, nx0, ny0, nx1, ny1, nx2, ny2, nx3, ny3);
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