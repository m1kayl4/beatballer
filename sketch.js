var loopMode = true;
var hitMode = false;

var loopControls = true;
var hitControls = false;

let kickIndex = 0;
let snareIndex = 0;
let hihatIndex = 0;

let lastKeyPressTime = 0;
let mode = 0;

let lowpass;
let highpass;
let delay;

let soundFiles = [];
let currentLoop;

let kicks = [];
let currentKick;

let snares = [];
let currentSnare;

let hihats = [];
let currentHihat;

let xpos;
let ypos = 50;
let xspeed;
let yspeed;

let xpos2;
let ypos2 = 50;
let xspeed2;
let yspeed2;

let ballVisible = false;
let ball2Visible = false;
let filterEnabled = false;
let ballFrozen = false;
let ball2Frozen = false;
let dragging = false;
let dragging2 = false;

let r = 50;

function preload() {
  soundFormats("wav");

  for (let i = 1; i <= 15; i++) {
    soundFiles.push(loadSound(`loops/loop${i}.wav`));
  }

  for (let i = 1; i <= 5; i++) {
    kicks.push(loadSound(`kicks/kick${i}.wav`));
  }
  for (let i = 1; i <= 5; i++) {
    snares.push(loadSound(`snares/snare${i}.wav`));
  }
  for (let i = 1; i <= 5; i++) {
    hihats.push(loadSound(`hihats/hihat${i}.wav`));
  }
}

function setup() {
  currentLoop = random(soundFiles);
  lowpass = new p5.LowPass();
  highpass = new p5.HighPass();
  delay = new p5.Delay();

  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(canvasPressed);
}

function draw() {
  if (loopMode == true) {
    // draw scene 1
    background(191, 245, 230);
    textAlign(CENTER);
    textSize(88);
    textStyle(BOLD);
    fill(79, 168, 144);
    text("beatballer", windowWidth / 2, windowHeight / 5.5);
    
  if (loopControls) {
      // Display controls
      textAlign(CENTER);
      textSize(20);
      textStyle(BOLD);
      fill(79, 168, 144);
      text(
        "press space bar to generate loop",
        windowWidth / 2,
        windowHeight / 2
      );
      textAlign(LEFT);
      textSize(18);
      textStyle(BOLD);
      fill(79, 168, 144);
      text("esc to hide controls", windowWidth /28, 50);
      textSize(12);
      text("shift to toggle modes", windowWidth /28, 75);
      text("1 for lowpass", windowWidth /28, 90);
      text("2 for highpass", windowWidth /28, 105);
      text("3 for delay", windowWidth /28, 120);
      text("+ and - to change playback rate", windowWidth /28, 135);
      text("double tap space bar to stop loop", windowWidth /28, 150);
    } else {
      // Hide controls
      textAlign(LEFT);
      textSize(18);
      textStyle(BOLD);
      fill(79, 168, 144);
      text("esc to show controls", windowWidth /28, 50);
    }
    
    if (filterEnabled && ballVisible) {
      let filterFreq = map(xpos, 0, windowWidth, 20, 2250);
      let filterRes = map(ypos, 0, windowHeight, 1, 20);
      lowpass.set(filterFreq, filterRes);
      highpass.set(filterFreq, filterRes);
    }

    if (ballVisible) {
      //lowpass ball
      noStroke();
      fill(xpos / 6, xpos / 6, 240);
      ellipse(xpos, ypos, r * 2, r * 2);
      xpos += xspeed;
      ypos += yspeed;
      if (xpos > width - r || xpos < r) {
        xspeed = -xspeed;
      }
      if (ypos > height - r || ypos < r) {
        yspeed = -yspeed;
      }
    }

    if (ballFrozen) {
      return;
    }

    if (dragging) {
      xpos = mouseX;
      ypos = mouseY;
    }
    
  } else if (hitMode == true) {
    // draw scene 2
    background(224, 224, 224);
      textAlign(CENTER);
      textSize(88);
      textStyle(BOLD);
      fill(128, 128, 128);
      text("beatballer", windowWidth / 2, windowHeight / 5.5);
    
if (hitControls) {
      // Display controls
      textAlign(LEFT);
      textSize(18);
      textStyle(BOLD);
      fill(128, 128, 128);
      text("esc to show controls", windowWidth /28, 50);
    } else {
      textAlign(CENTER);
      textSize(20);
      textStyle(BOLD);
      fill(128, 128, 128);
      text(
        "press space bar to change drum kit",
        windowWidth / 2,
        windowHeight / 2
      );
      // Hide controls
      textAlign(LEFT);
      textSize(18);
      textStyle(BOLD);
      fill(128, 128, 128);
      text("esc to hide controls", windowWidth /28, 50);
      textSize(12);
      text("shift to toggle modes", windowWidth /28, 75);
      text("1 to add/remove ball", windowWidth /28, 90);
      text("2 to add/remove ball", windowWidth /28, 105);
      text("tap space bar to change drum kit", windowWidth /28, 120);
    }
    
    
    if (ballVisible) {
      //ball
      noStroke();
      fill(255, xpos / 6, ypos / 6);
      ellipse(xpos, ypos, r * 2, r * 2);
      xpos += xspeed;
      ypos += yspeed;
      if (xpos > width - r || xpos < r) {
        xspeed = -xspeed;
      }
      if (ypos > height - r || ypos < r) {
        yspeed = -yspeed;
      }
    }

    if (ballFrozen) {
      return;
    }

    if (dragging) {
      xpos = mouseX;
      ypos = mouseY;
    }

    // play kick when ball hits bottom of window
    if (ypos > height - r) {
      currentKick = kicks[kickIndex];
      currentKick.play();
    }

    // play snare when ball hits top of window
    if (ypos < r) {
      currentSnare = snares[snareIndex];
      currentSnare.play();
    }

    // play hihat when ball hits either side of the window
    if (xpos < r || xpos > width - r) {
      currentHihat = hihats[hihatIndex];
      currentHihat.play();
    }

    if (ball2Visible) {
      noStroke();
      fill(255, xpos2 / 6, ypos2 / 6);
      ellipse(xpos2, ypos2, r * 2, r * 2);
      xpos2 += xspeed2;
      ypos2 += yspeed2;
      if (xpos2 > width - r || xpos2 < r) {
        xspeed2 = -xspeed2;
      }
      if (ypos2 > height - r || ypos2 < r) {
        yspeed2 = -yspeed2;
      }
    }

    if (ball2Frozen) {
      return;
    }

    if (dragging2) {
      xpos2 = mouseX;
      ypos2 = mouseY;
    }

    // play kick when ball hits bottom of window
    if (ypos2 > height - r) {
      currentKick = kicks[kickIndex];
      currentKick.play();
    }

    // play snare when ball hits top of window
    if (ypos2 < r) {
      currentSnare = snares[snareIndex];
      currentSnare.play();
    }

    // play hihat when ball hits either side of the window
    if (xpos2 < r || xpos2 > width - r) {
      currentHihat = hihats[hihatIndex];
      currentHihat.play();
    }
  }
/////////////////////////////////////////  

   if (loopMode){
    textAlign(CENTER);
    textSize(88);
    textStyle(BOLD);
    fill(79, 168, 144);
    text("beatballer", windowWidth / 2, windowHeight / 5.5); 
    if (loopControls) {
      // Display controls
      textAlign(CENTER);
      textSize(20);
      textStyle(BOLD);
      fill(79, 168, 144);
      text(
        "press space bar to generate loop",
        windowWidth / 2,
        windowHeight / 2
      );
      textAlign(LEFT);
      textSize(18);
      textStyle(BOLD);
      fill(79, 168, 144);
      text("esc to hide controls", windowWidth /28, 50);
      textSize(12);
      text("shift to toggle modes", windowWidth /28, 75);
      text("1 for lowpass", windowWidth /28, 90);
      text("2 for highpass", windowWidth /28, 105);
      text("3 for delay", windowWidth /28, 120);
      text("+ and - to change playback rate", windowWidth /28, 135);
      text("double tap space bar to stop loop", windowWidth /28, 150);
    } else {
      // Hide controls
      textAlign(LEFT);
      textSize(18);
      textStyle(BOLD);
      fill(79, 168, 144);
      text("esc to show controls", windowWidth /28, 50);
    }
   }
    if (hitMode){
    textAlign(CENTER);
    textSize(88);
    textStyle(BOLD);
    fill(128, 128, 128);
    text("beatballer", windowWidth / 2, windowHeight / 5.5);
  
  if (hitControls) {
      // Display controls
      textAlign(LEFT);
      textSize(18);
      textStyle(BOLD);
      fill(128, 128, 128);
      text("esc to show controls", windowWidth /28, 50);
    } else {
      textAlign(CENTER);
      textSize(20);
      textStyle(BOLD);
      fill(128, 128, 128);
      text(
        "press space bar to change drum kit",
        windowWidth / 2,
        windowHeight / 2
      );
      // Hide controls
      textAlign(LEFT);
      textSize(18);
      textStyle(BOLD);
      fill(128, 128, 128);
      text("esc to hide controls", windowWidth /28, 50);
      textSize(12);
      text("shift to toggle modes", windowWidth /28, 75);
      text("1 to add/remove ball", windowWidth /28, 90);
      text("2 to add/remove ball", windowWidth /28, 105);
      text("tap space bar to change drum kit", windowWidth /28, 120);
    }
    }
}
function keyPressed() {
  if (keyCode === 32 && hitMode) {
  kickIndex = (kickIndex + 1) % kicks.length;
  snareIndex = (snareIndex + 1) % snares.length;
  hihatIndex = (hihatIndex + 1) % hihats.length;
}
  if (keyCode === 27) {
    // check if escape key is pressed
    loopControls = !loopControls; // toggle loopControls variable
  }
  if (keyCode === 27) {
    hitControls = !hitControls;
  }
  if (loopMode == true) {
    if (keyCode === 16) {
      hitMode = true;
      loopMode = false; // Set loopMode to false
      currentLoop.stop();
      ballVisible = false;
    }
  } else if (hitMode == true) {
    if (keyCode === 16) {
      loopMode = true;
      hitMode = false; // Set hitMode to false
      ballVisible = false;
    }
  }
  if (loopMode) {
    if (keyCode === 32) {
      // play and cycle through loops using space bar, double tap space bar to stop playback

      if (!currentLoop.isPlaying()) {
        currentLoop.loop();
      } else if (millis() - lastKeyPressTime < 200) {
        currentLoop.stop();
      } else {
        lastKeyPressTime = millis();
        currentLoop.stop();
        currentLoop = random(soundFiles);
        if (ballVisible) {
          currentLoop.connect(lowpass);
        } else {
          currentLoop.connect();
        }
        //
        currentLoop.loop();
      }
    }
  }
  if (loopMode == true) {
    if (keyCode === 49) {
      // ball appears and filter is applied when a number key is pressed, if number is pressed again, the ball dissappears and the loop continues playing without the filter

      //press 1 for lowpass
      if (ballVisible) {
        ballVisible = false;
        filterEnabled = false;
        currentLoop.disconnect();
        currentLoop.connect();
      } else {
        xpos = random(50, windowWidth - 50);
        ypos = 50;
        xspeed = random(-25, 25);
        yspeed = random(-25, 25);
        ballVisible = true;
        filterEnabled = true;
        currentLoop.disconnect();
        currentLoop.connect(lowpass);
        dragging = false; // reset dragging
      }
      if (ballFrozen) {
        if (dist(mouseX, mouseY, xpos, ypos) < r) {
          return;
        }

        ballFrozen = false;
        xspeed = random(-25, 25);
        yspeed = random(-25, 25);
      }
    }
  }

  if (hitMode == true) {
    if (keyCode === 49) {
      // ball appears and filter is applied when a number key is pressed, if number is pressed again, the ball dissappears and the loop continues playing without the filter
      //press 1 for lowpass
      if (ballVisible) {
        ballVisible = false;
      } else {
        xpos = random(50, windowWidth - 50);
        ypos = 50;
        xspeed = random(-25, 25);
        yspeed = random(-25, 25);
        ballVisible = true;
        dragging = false; // reset dragging
      }
      if (ballFrozen) {
        if (dist(mouseX, mouseY, xpos, ypos) < r) {
          return;
        }

        ballFrozen = false;
        xspeed = random(-25, 25);
        yspeed = random(-25, 25);
      }
    }
  }

  if (loopMode == true) {
    //press 2 for highpass
    if (keyCode === 50) {
      if (ballVisible) {
        ballVisible = false;
        filterEnabled = false;
        currentLoop.disconnect();
        currentLoop.connect();
      } else {
        xpos = random(50, windowWidth - 50);
        ypos = 50;
        xspeed = random(-25, 25);
        yspeed = random(-25, 25);
        ballVisible = true;
        filterEnabled = true;
        currentLoop.disconnect();
        currentLoop.connect(highpass);
        dragging = false; // reset dragging
      }
      if (ballFrozen) {
        if (dist(mouseX, mouseY, xpos, ypos) < r) {
          return;
        }

        ballFrozen = false;
        xspeed = random(-25, 25);
        yspeed = random(-25, 25);
      }
    }
  }
  if (hitMode == true) {
    if (keyCode === 50) {
      // ball appears and filter is applied when a number key is pressed, if number is pressed again, the ball dissappears and the loop continues playing without the filter
      //press 1 for lowpass
      if (ball2Visible) {
        ball2Visible = false;
      } else {
        xpos2 = random(50, windowWidth - 50);
        ypos2 = 50;
        xspeed2 = random(-25, 25);
        yspeed2 = random(-25, 25);
        ball2Visible = true;
        dragging2 = false; // reset dragging
      }
      if (ball2Frozen) {
        if (dist(mouseX, mouseY, xpos2, ypos2) < r) {
          return;
        }

        ball2Frozen = false;
        xspeed2 = random(-25, 25);
        yspeed2 = random(-25, 25);
      }
    }
  }
  //press 3 for delay (this one isnt effected by xpos or ypos)
  if (loopMode == true) {
    if (keyCode === 51) {
      delay.process(currentLoop, 0.25, 0.5, 2000);
      if (ballVisible) {
        ballVisible = false;
        filterEnabled = false;
        currentLoop.disconnect();
        currentLoop.connect();
      } else {
        xpos = random(50, windowWidth - 50);
        ypos = 50;
        xspeed = random(-25, 25);
        yspeed = random(-25, 25);
        ballVisible = true;
        delay.process(currentLoop, 0.25, 0.5, 2000);
        currentLoop.disconnect();
        currentLoop.connect(delay);
        dragging = false; // reset dragging
      }

      if (ballFrozen) {
        if (dist(mouseX, mouseY, xpos, ypos) < r) {
          return;
        }

        ballFrozen = false;
        xspeed = random(-25, 25);
        yspeed = random(-25, 25);
      }
    }
  }
  //
  if (loopMode == true) {
    if (keyCode === 189) {
      if (currentLoop.rate() > 0.5) {
        currentLoop.rate(currentLoop.rate() - 0.25);
      }
    }

    if (keyCode === 187) {
      if (currentLoop.rate() < 1.5) {
        currentLoop.rate(currentLoop.rate() + 0.25);
      }
    }
  }
}

function canvasPressed() {
  //you can catch the ball and drag it around and place it in different areas of the window, click anywhere on the canvas to resume the ball's previous movement

  if (dist(mouseX, mouseY, xpos, ypos) < r) {
    ballFrozen = !ballFrozen;
    xspeed = 0;
    yspeed = 0;
  }
  if (dist(mouseX, mouseY, xpos, ypos) < r) {
    dragging = true;
    xspeed = 0;
    yspeed = 0;
  } else {
    dragging = false;
  }
  if (ballFrozen && !dragging) {
    xspeed = random(-25, 25);
    yspeed = random(-25, 25);
    ballFrozen = false;
  }
  //
  if (dist(mouseX, mouseY, xpos2, ypos2) < r) {
    ball2Frozen = !ball2Frozen;
    xspeed2 = 0;
    yspeed2 = 0;
  }
  if (dist(mouseX, mouseY, xpos2, ypos2) < r) {
    dragging2 = true;
    xspeed2 = 0;
    yspeed2 = 0;
  } else {
    dragging2 = false;
  }
  if (ball2Frozen && !dragging2) {
    xspeed2 = random(-25, 25);
    yspeed2 = random(-25, 25);
    ball2Frozen = false;
  }
}

function canvasReleased() {
  dragging = false;
  if (ballFrozen) {
    xpos = mouseX;
    ypos = mouseY;
  } else {
    xspeed = random(-25, 25);
    yspeed = random(-25, 25);
  }
  dragging2 = false;
  if (ball2Frozen) {
    xpos2 = mouseX;
    ypos2 = mouseY;
  } else {
    xspeed2 = random(-25, 25);
    yspeed2 = random(-25, 25);
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}