let video;
let classifier;
let label;
var particleColor;

const myRec = new p5.SpeechRec(); // initiate a new speech rec object
myRec.continuous = true;
myRec.intrimResults = false;

var alph = 5;
var numbPart = 300 // number of particles
var partStroke = []; // line width
var angMult = 50; // 0.1 = straighter lines; 25+ = sharp curves
var angTurn = 10; // adjust angle for straight lines (after adjusting angMult)
var zOffInc = 0.0003; // speed of vector changes
var inc = 0.1;
var scl = 10;
var cols, rows;
var zoff = 0;

var particles = [];
var flowfield;
var hu = 0;
var p = 1;

function preload() {
  classifier = ml5.imageClassifier(
    "https://teachablemachine.withgoogle.com/models/TObVVWJ-P/"
  );
}

function setup() {
  createCanvas(windowWidth - 20, windowHeight - 20);
  myRec.start(); // start engine
  colorMode(RGB);
  particleColor = color(255);

  cols = floor(width / scl);
  rows = floor(height / scl);
  fr = createP("");

  flowfield = new Array(cols * rows);

  for (var i = 0; i < numbPart; i++) {
    particles[i] = new Particle();
  }
  // Create the video
  video = createCapture(VIDEO);
  video.hide();

  // STEP 2: Start classifying
  classifyVideo();
  background(0);
}

// STEP 2 classify!
function classifyVideo() {
  classifier.classify(video, gotResults);
}

function draw() {
  
  if (p > 0) {
    var yoff = 0;
    for (var y = 0; y < rows; y++) {
      var xoff = 0;
      for (var x = 0; x < cols; x++) {
        var index = x + y * cols;
        var angle = noise(xoff, yoff, zoff) * angMult + angTurn;
        var v = p5.Vector.fromAngle(angle);
        v.setMag(1);
        flowfield[index] = v;
        xoff += inc;
      }
      yoff += inc;

      zoff += zOffInc;
    }

    for (var i = 0; i < particles.length; i++) {
      // stroke(particleColor);
      // strokeWeight(partStroke);
      particles[i].follow(flowfield);
      particles[i].update();
      particles[i].edges();
      particles[i].show();
      strokeWeight(partStroke);
      stroke(particleColor);
    }

    console.log(myRec.resultString);
  }
if (myRec.resultString != undefined){
const resultString = myRec.resultString.toLowerCase();
      if (resultString.includes("red")) {
        console.log("I heard red")
        particleColor = color(255, 0, 0); // red
      } else if (resultString.includes("orange")) {
        particleColor = color(255, 165, 0); // orange
      } else if (resultString.includes("yellow")) {
        particleColor = color(255, 255, 0); // yellow
      } else if (resultString.includes("green")) {
        particleColor = color(0, 255, 0); // green
      } else if (resultString.includes("blue")) {
        console.log("Iheard blue")
        particleColor = color(0, 0, 255); // blue
      } else if (resultString.includes("purple")) {
        particleColor = color(128, 0, 128); // purple
      }
      }
}

function mousePressed() {
  p = p * -1;
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  // Get the label from the results
  const label = results[0].label;

  // Modify the partStroke variable based on the label value

  switch (label) {
    case "0":
      partStroke = 0.5;
  angMult = 0.1;
      break;
      
    case "1":
      partStroke = 0.75;
  angMult = 0.5;
      break;
      
    case "2":
      partStroke = 1;
    angMult = 1;
      break;
      
    case "3":
      partStroke = 1.4;
    angMult = 10;
  break;
    
    case "4":
      partStroke = 2;
      angMult = 25;
      break;
    case "5":
      partStroke = 3;
      angMult = 50;
      break;
   
  }
  classifyVideo();
}
// Save art as jpg.
function keyTyped() {
  if (key === "s") {
    save("myCanvas.jpg");
  }
}
