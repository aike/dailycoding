// 20230913
// noiseをfloorで階段状に色分け

let base_h;
let depth = 0;
let cv;

function setup() {
  base_h = random(360);

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

  stroke('#444');
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

function draw_image(x, y, size, cell_num) {
  for (let i = 0; i < cell_num; i++) {
    for (let j = 0; j < cell_num; j++) {
      let cell_size = int(size / cell_num);
      let x0 = x + i * cell_size;
      let y0 = y + j * cell_size;
      fillrect(x0, y0, cell_size);
    }
  }
}

function fillrect(x, y, s) {
  let h = base_h + random() * 180;
  fill(h, 30, 100);
  noStroke();

  let sc = 0.003 + random() * 0.006;
  let r = random(100);
  let step = int(random(20)) + 10;
  let hues = [];
  for (let i = 0; i < step; i++) {
    hues[i] = (h + int(random(50))) % 360;
  }

  for (let sy = 0; sy < s; sy++) {
    for (let sx = 0; sx < s; sx++) {
      let n = noise(r + sx * sc, r + sy * sc);
      n = floor(n * step);
      let b = (n % 2 == 0) ? 100 : 85;
      let s = (n % 2 == 0) ? 25 : 20;
      stroke(color(hues[n], s, b));
      strokeWeight(2);
      point(x + sx, y + sy);
    }
  }
  
  stroke('#444');
  noFill();
  strokeWeight(1);
  rect(x,y,s);  
}



function draw_imagex(x, y, size) {

  let cell_num = 5;
  let g = createGraphics(size * 2, size * 2);
  g.colorMode(HSB, 360, 100, 100);
  g.angleMode(DEGREES);
  g.pixelDensity(pixelDensity());
  for (let i = 0; i < cell_num; i++) {
    for (let j = 0; j < cell_num; j++) {
      g.clear();

      let cell_size = size / cell_num ;

      let x0 = i * cell_size;
      let y0 = j * cell_size;

      let vnum = 4 + int(random(8));
      let hs = cell_size;
      let theta1 = 360 / vnum;
      let r1 = size * 0.48;
      let px0, py0;
      let px = [];
      let py = [];
      let t = 0;
      // calc vertex
      for (let k = 0; k < vnum; k++) {
        px0 = 0;
        py0 = -r1;
        px[k] = hs + px0 * cos(t) - py0 * sin(t);
        py[k] = hs + px0 * sin(t) + py0 * cos(t);
        t += theta1;
      }
  
      g.strokeWeight(1);
      g.stroke('#222');
      for (let k = 0; k < vnum; k++) {
        let h = (base_h + random(150)) % 360;
        g.fill(h, 30, 100);    
        g.triangle(hs, hs, px[k], py[k], px[(k + 1) % vnum], py[(k + 1) % vnum]);
      }  
      

      let bh = (base_h + random(150)) % 360;      
      stroke('#666');
      strokeWeight(1);
      fill(bh, 30, 100);
      rect(x + x0, y + y0, cell_size, cell_size);
      
      // rotation center
      //g.stroke('black');
      //g.strokeWeight(10);
      //g.point(cell_size, cell_size);
        
      let rot = random(30) + 10;

      for (let sy = -cell_size; sy < cell_size; sy++) {
        for (let sx = -cell_size; sx < cell_size; sx++) {
          let stx = sx + cell_size;
          let sty = sy + cell_size;
          let d = -dist(sx, sy, 0, 0);
          let t = rot * d / 10;
          //let dx = sx  + cell_size / 2;
          //let dy = sy  + cell_size / 2;
          let dx = sx * cos(t) - sy * sin(t) + cell_size / 2;
          let dy = sx * sin(t) + sy * cos(t) + cell_size / 2;
          if (dist(dx, dy, cell_size / 2, cell_size / 2) < cell_size * 0.4) {
            image(g, x + x0 + dx, y + y0 + dy, 1, 1, stx, sty, 1, 1);
          }
        }
      }
      strokeWeight(2);
      stroke(bh, 30, 50, 0.4);
      noFill();
      circle(x + x0 + cell_size / 2, y + y0 + cell_size / 2, cell_size * 0.4 * 2);
    }
  }

}



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
