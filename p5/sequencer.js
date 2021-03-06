// import oscP5.*;
// import netP5.*;
let canvas;
let waveform = new Tone.Waveform(256);
let w;
let columns;
let rows;
let board;
let next;
let paused;
let emptiness;
let send_message;
let step=0;
let board_sent = false;
let save_send_num;
let nSteps;
let init_shape_x, init_shape_y;
let play_dir=0;
let notes = {0:'C3',1:'C#3',2:'D3',3:'D#3',4:'E3',5:'F3',6:'F#3',7:'G3',8:'G#3',9:'A3',10:'A#3'
,11:'B3',12:'C4',13:'C#4',14:'D4',15:'D#4',16:'E4',17:'F4',18:'F#4',19:'G4'}

let major = {0:'C3',1:'D3',3:'E3',4:'F3',5:'G3',8:'A3',9:'B3',10:'C4',11:'D4',12:'E4',13:'F4',14:'G4',15:'A4',16:'B4',17:'C5',18:'D5',19:'E5'}

let pentatonic = { 0:'C3',1:'D3',2:'E3',3:'G3',4:'A3',5:'C4',6:'D4',7:'E4',8:'G4',9:'A4',10:'C5',11:'D5',12:'E5',13:'G5',14:'A5',15:'C6',16:'D6',17:'E6',18:'G6',19:'A6'}

//var faces;
//var shapes;

// OscP5 osc;
// NetAddress sonic_pi;

////var xebraState;
//function preload(){
//    faces = loadImage('images/happyface.png');

//}

function setup() {
  emptiness = 155;
  paused = false;
  send_message = true;

  t0 = new Tone.PolySynth(6, Tone.FMSynth,{
    oscillator: {
      type: 'sine'
    }
  }).toMaster();
  // t0.chain(waveform, Tone.Master);

  // t0.envelope.attack = 0.2;
  // t0.envelope.decay = 0.1;
  // t0.envelope.sustain = 0.1;
  // t0.envelope.release = 0.1;

  // osc = new OscP5(this, 12000);
  // sonic_pi = new NetAddress("127.0.0.1", 4559);
  canvas = createCanvas(500,650);
  canvas.parent('grid');
  // size(500, 500);
  w = 31;
 // connectXebra();
  // Adjust frameRate to change speed of generation/tempo of music
  frameRate(2);
  // Calculate columns and rows
  columns = floor(width / w);
  rows = floor(height / w);
  console.log('Grid size:',rows,columns);
  cellWidth = width / columns;
  cellHeight = height/rows;
  nSteps = columns;

  board = new Array(columns);
  next = new Array(columns); 
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
    next[i] = new Array(rows);
  }

  init();
  draw_board(board);
}

function draw() {

  let num_ones = 0;
  if (play_dir == 'forward'){
   forward();
  }
  else if (play_dir == 'backward'){
    backward();
  }

  function forward() {
    for (let j = 0; j < rows; j++) {
      if (board[step][j] == 1) {
        num_ones += 1;
        fill(255,0,0);
        ellipse((step * w)+w/2, (j * w)+w/2, w, w);
        console.log(j);
        t0.triggerAttackRelease(pentatonic[j], '4n');
      }
      else {
        // let highlight = (step)% nSteps;
        let highlight_color = color(169, 169, 169);
        highlight_color.setAlpha(8);
        fill(highlight_color);
        noStroke();
        rect((step % nSteps)*w, 0, w, height)
        // ellipse((step * w)+w/2, (j * w)+w/2, w, w);
      }
    }
    
    if (step > 0) {
      // OscMessage msg1 = new OscMessage("/trigger/notes");
      // msg1.add(save_send_num);
      // osc.send(msg1, sonic_pi);
      for (let j = 0; j < rows; j++) {
        if (board[step][j] == 1) {
          fill(127, 255, 0);
          ellipse(((step) * w)+w/2, (j * w)+w/2, w, w);
        }
        // else {
        //   var highlight = (step - 1 )% nSteps;
        //   fill(200, 60);
        //   noStroke();
        //   rect(highlight*27, 0,27, height)
        //   ellipse((step * w)+w/2, (j * w)+w/2, w, w);
        // }
      }
    }

  let send_num = new Array(num_ones);
  let counter = 0;
  for (let j = 0; j < rows; j++) {
    if (board[step][j] == 1) {
      send_num[counter] = j;
      counter += 1;
    }
  } 
  save_send_num = send_num;
  // setTimeout(draw,00);
  step += 1;
  if (step == columns ) {
    step = 0;
    board_sent = true;
    }
  }
  
  function backward() {
    for (let j = rows-1; j>=0 ; j--) {
      if (board[step][j] == 1) {
        num_ones += 1;
        fill(255,0,0);
        ellipse((step * w)+w/2, (j * w)+w/2, w, w);
        console.log(j);
        t0.triggerAttackRelease(pentatonic[j], '4n');
      }
      else {
        let highlight_color = color(169, 169, 169);
        highlight_color.setAlpha(8);
        fill(highlight_color);
        noStroke();
        rect((step % nSteps)*w, 0, w, height)
        // ellipse((step * w)+w/2, (j * w)+w/2, w, w);
      }
    }
    
    if (step > 0) {
      // OscMessage msg1 = new OscMessage("/trigger/notes");
      // msg1.add(save_send_num);
      // osc.send(msg1, sonic_pi);
      for (let j = columns-1; j >=0; j--) {
        if (board[step-1][j] == 1) {
          fill(127, 255, 0);
          ellipse(((step-1) * w)+w/2, (j * w)+w/2, w, w);
        }
        // else {
        //   var highlight = (step - 1 )% nSteps;
        //   fill(200, 60);
        //   noStroke();
        //   rect(highlight*27, 0,27, height)
        //   ellipse((step * w)+w/2, (j * w)+w/2, w, w);
        // }
      }
    }
    let send_num = new Array(num_ones);
    let counter = 0;
    for (let j = 0; j < rows; j++) {
      if (board[step][j] == 1) {
        send_num[counter] = j;
        counter += 1;
      }
    } 
    save_send_num = send_num;
    // setTimeout(draw,00);
    step = step - 1;
    if (step < 0) {
      step = columns-1;
      board_sent = true;
    }
  }

  if (paused===false && board_sent==true) {
    generate();
    console.log(board);
  }
  
  if (board_sent) { 
    board_sent = false;
    background(emptiness);
    draw_board(board);
  } 
}

function play_direction(dir) {
  play_dir = dir;
}

function rotation(dir) {
  console.log(dir);
  let temp = board;
  let radians = (Math.PI / 180) * 90, cos = Math.cos(radians), sin = Math.sin(radians);
  let nx, ny;
  if (dir == "clockwise"){
    for ( let i = 0; i < columns; i++) {
      for ( let j = 0; j < rows; j++) {
        nx = (cos * (i - 8)) + (sin * (j - 10)) + 8;
        ny = (cos * (j - 10)) - (sin * (i - 8)) + 10;
        temp[nx][ny] = board[i][j];
      }
    }
    console.log('clockwise');
  }
  else if (dir == "anticlockwise"){
    for ( let i = 0; i < columns; i++) {
      for ( let j = 0; j < rows; j++) {
      
      }
    }
  }
  board = temp;
}

function draw_board(board) {
  for ( let i = 0; i < columns; i++) {
    for ( let j = 0; j < rows; j++) {
      if (board[i][j] == 1) {
        fill(46,230,237);
        ellipse((i * w)+w/2, (j * w)+w/2, w, w);
      }
      else {
        stroke(emptiness);
        //image(faces,(i * w)+w/2, (j * w)+w/2,w);
        fill(5);
        ellipse((i * w)+w/2, (j * w)+w/2, w, w);
      }
   }
  }
}


// Fill board randomly
function init(key) {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // Padding adds complexity, Lining the edges with 0s
      // if (i == 0 || j == 0 || i == columns-1 || j == rows-1){
      //    board[i][j] = 0;
      //  }
      // Filling the rest randomly   
      if (key === "random") {
        board[i][j] = floor(random(2));
      }
      else if(key === "clear"){
        board[i][j] = 0;
      }
      else {
        board[i][j]=0;
      }
    }
  }
}

function initblock() {
  console.log('block init');
  board[init_shape_x][init_shape_y] = 1;
  board[init_shape_x+1][init_shape_y+1] = 1;
  board[init_shape_x][init_shape_y+1] = 1;
  board[init_shape_x+1][init_shape_y] = 1;
}


function initblinker() {
  console.log('blinker init');
  board[init_shape_x][init_shape_y] = 1;
  board[init_shape_x-1][init_shape_y] = 1;
  board[init_shape_x+1][init_shape_y] = 1;
}

function inittoad() {
  console.log('toad init');
  board[init_shape_x][init_shape_y] = 1;
  board[init_shape_x+1][init_shape_y] = 1;
  board[init_shape_x+2][init_shape_y] = 1;

  board[init_shape_x-1][init_shape_y+1] = 1;
  board[init_shape_x][init_shape_y+1] = 1;
  board[init_shape_x+1][init_shape_y+1] = 1;
}

function initbeacon() {
  console.log('beacon init');
  console.log(init_shape_x, init_shape_y)
  board[init_shape_x][init_shape_y] = 1;
  board[init_shape_x+1][init_shape_y+1] = 1;
  board[init_shape_x][init_shape_y+1] = 1;
  board[init_shape_x+1][init_shape_y] = 1; 

  board[init_shape_x-1][init_shape_y-1] = 1; 
  board[init_shape_x-2][init_shape_y-1] = 1;
  board[init_shape_x-2][init_shape_y-2] = 1;
  board[init_shape_x-1][init_shape_y-2] = 1;
  
}

function initglider() {
  console.log('glider init');
  console.log(init_shape_x, init_shape_y)
  board[init_shape_x-1][init_shape_y+1] = 1; 
  board[init_shape_x][init_shape_y+1] = 1;
  board[init_shape_x+1][init_shape_y+1] = 1;
  board[init_shape_x+1][init_shape_y] = 1;
  board[init_shape_x][init_shape_y-1] = 1;

}

function initspaceship() {
  console.log('spaceship init');
  console.log(init_shape_x, init_shape_y);
  board[init_shape_x][init_shape_y-1] = 1; 
  board[init_shape_x+1][init_shape_y-1] = 1; 

  board[init_shape_x-1][init_shape_y] = 1; 
  board[init_shape_x-2][init_shape_y] = 1; 
  board[init_shape_x+1][init_shape_y] = 1;
  board[init_shape_x+2][init_shape_y] = 1;

  board[init_shape_x-1][init_shape_y+1] = 1; 
  board[init_shape_x-2][init_shape_y+1] = 1; 
  board[init_shape_x][init_shape_y+1] = 1;
  board[init_shape_x+1][init_shape_y+1] = 1;

  board[init_shape_x][init_shape_y+2] = 1;
  board[init_shape_x-1][init_shape_y+2] = 1;

}

// The process of creating the new generation
function generate() {
  // Loop through every spot in our 2D array and check spots neighbors
  for (let x = 1; x < columns - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      // Add up all the states in a 3x3 surrounding grid
      let neighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          neighbors += board[x+i][y+j];
        }
      }

      // A little trick to subtract the current cell's state since
      // we added it in the above loop
      neighbors -= board[x][y];
      // Rules of Life
      if      ((board[x][y] == 1) && (neighbors <  2)) next[x][y] = 0;            // Loneliness
      else if ((board[x][y] == 1) && (neighbors >  3)) next[x][y] = 0;            // Overpopulation
      else if ((board[x][y] == 0) && (neighbors == 3)) {                          // Reproduction 
        next[x][y] = 1;
      } 
      else next[x][y] = board[x][y];                                              // Stasis
    }
  }
  // Swap! do we really need to store next here?
  temp = board;
  board = next;
  next = temp;
 }


function mousePressed() {
  // paused= true;

  let i = round((mouseX-(w/2))/w);
  let j = round((mouseY-(w/2))/w);
  
  // Continue if click is outside the grid space
  if (i > columns -3 || j > rows -3 || i < 2 || j < 2) {
    console.log('skipping corners',i,j,rows,columns);
   }
   // initialize the last clicked space in this coordinate of the grid
  else
  { 
    init_shape_x = i;
    init_shape_y = j;
  }
  // Painting board with clicks
  // if (board[i][j] == 0){
  //   board[i][j] = 1;
  // } else {
  //    board[i][j]= 0;
  // }
}

function keyPressed(){
  if (keyCode == DOWN){
      paused = false;
  }
  if (key == ENTER || key == RETURN) {
    paused = false;
    init();
  }
}