var resX = 1080; var resY = 1350; let showResX = 400; let showResY = showResX * 1.25;
var addSize = 0;
var showedCanvas;
let pg; let pg2; let pg3;

let menuList;let toolBox;let titularDrop;let subtitularDrop;let fondoDrop;let bordeDrop;let rotacionDrop;let animacionDrop;let descargarDrop;

let titleText; let titleColor; let titleAlign; let titleFont; 
var titleSize = 150; var titleLeading = 0; let titlePosX = 50; let titlePosY = 50;
let titleSliderPlus = 1; let titleSliderMinus = 0; let titleDistance = 300;

let subtitleText; let subtitleColor; let subtitleAlign; let subtitleFont;
var subtitleSize = 100; var subtitleLeading = 0; var subtitlePosX = 50; var subtitlePosY = 50; var subAmount = 1; var subDistance = 200;

var imageScale = 1;
var showImage = false;
var borderSize = 0;
var borderColor;
var documentName = "";
var xIs = false; var yIs = false; var zIs = false;

var bkColor = 'white';

let xRotation = 0; let speedX = 0; let accX =0;
let yRotation = 0; let speedY = 0; let accY =0;
let zRotation = 0; let speedZ = 0; let accZ =0;
let counter = 0; let counterOff = 0;

let canvasRotation = 0;

let recordBtn; let recorder; let recordCounter = 1;
let timeBar;

let input;
let img;

var sketch = function(p){

  p.capturer = new CCapture( { 
    format: 'webm',
    framerate: 60,
	  verbose: true
  } );

  p.setup = function(){
    
    p.canvas = p.createCanvas(resX,resY, p.WEBGL);
    p.myRender = p.canvas.canvas;

    gl = this._renderer.GL;
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.disable(gl.CULL_FACE);

    pg = p.createGraphics(resX,resY);
    pg2 = p.createGraphics(resX,resY);
    pg3 = p.createGraphics(resX,resY);
    manageViews();

    p.allSelectors();

    p.texture(pg);
    p.noStroke();


    //ALL SLIDER SELECTOR
    var sliderInput = p.selectAll(".slider");
    for(var i = 0; i < sliderInput.length; i++){
      sliderInput[i].changed(moveSlider);
    }

    //ALL TEXTAREA
    var textInput = p.selectAll("textarea");
    for(var i = 0; i < textInput.length; i++){
      textInput[i].input(changeText);
    }

    //ALL COLORS
    var colorInput = p.selectAll(".coloree");
    for(var i = 0; i < colorInput.length; i++){
      colorInput[i].input(changeColor);
    }

    //ALL LINKS
    var links = p.selectAll("a");
    for(var i = 0; i < links.length; i++){
      links[i].mousePressed(linkPressed);
    }

    input = p.createFileInput(p.handleFile);
    input.position(0, 0);
    input.id('uploadBtnId');
  

    //INITIALS
    subtitleColor = p.color(0);
    subtitleFont = 'Open Sans';
    titleColor = p.color('#414141');
    titleFont = 'Roboto';
    titleAlign = p.CENTER;
    borderColor = p.color(0);

    p.imageMode(p.CENTER);
  }

  p.draw = function(){

    p.background(bkColor);

    p.rotateZ(p.radians(0 + canvasRotation));
    p.rotateY(p.radians(0 + canvasRotation));


    if (showImage == true) {
      p.push();
      p.scale(imageScale);
      p.image(img, 0, 0);
      p.pop();
    }

    p.push();
    p.rotateX(p.radians(xRotation) + p.radians(speedX));
    p.rotateY(p.radians(yRotation) + p.radians(speedY));
    p.rotateZ(p.radians(zRotation) + p.radians(speedZ));

    pg.clear();
    p.showTitle();
    p.texture(pg);
    for(var i = -titleSliderMinus; i < titleSliderPlus; i++){
      p.push();
      p.translate(0,0,i * titleDistance);
      p.plane(resX,resY);
      p.pop();
    }

    pg2.clear();
    p.showSubtitle();
    p.texture(pg2);
    p.plane(resX,resY);
    p.pop();

    pg3.clear();
    p.showBorder();
    p.showFooter();
    p.image(pg3,0,0);

    speedX+= accX;
    speedY+= accY;
    speedZ+= accZ;

    counter +=counterOff;
    if(counter == 720){
      counter = 0;
      speedX=0;
      speedY=0;
      speedZ=0;
    }

    copyAll();

    if(recorder < 720){
      recorder+=recordCounter;
      recordThis();
    } else if(recorder == 720){
      recorder = 0;
      recordCounter = 0;
      counter = 0;
      counterOff = 0;
      speedX=0;
      speedY=0;
      speedZ=0;
      endThis();
    }

    timeBar.style('width:' + p.map(counter,0,720,0,100) + '%');
  }


  //FUNCTIONS ON SKETCH

  //BORDER PAGE STUFF
  p.showBorder = function(){
    pg3.noFill();
    pg3.strokeWeight(borderSize);
    pg3.stroke(borderColor);
    pg3.rect(0,0,pg2.width,pg2.height - 35);
  }
  //TITLE PAGE STUFF
  p.showTitle = function(){
    pg.fill(titleColor);
    pg.textSize(titleSize);
    pg.textLeading(titleSize + titleLeading);
    pg.textAlign(titleAlign, p.CENTER);
    pg.textFont(titleFont);
    let titleX = p.map(titlePosX,0,100,0,pg.width);
    let titleY = p.map(titlePosY,0,100,0,pg.height);
    pg.text(titleText,titleX,titleY);
  }
  //SUBTITLE PAGE STUFF
  p.showSubtitle = function(){
    pg2.fill(subtitleColor);
    pg2.textSize(subtitleSize);
    pg2.textLeading(subtitleSize + subtitleLeading);
    pg2.textAlign(subtitleAlign);
    pg2.textFont(subtitleFont);
    let subtitleX = p.map(subtitlePosX,0,100,0,pg2.width);
    let subtitleY = p.map(subtitlePosY,0,100,0,pg2.height);
    pg2.text(subtitleText,subtitleX,subtitleY);
  }
  //SHOW FOOTER
  p.showFooter = function(){
    pg3.fill(0);
    pg3.noStroke();
    pg3.rect(0,pg3.height -35,pg3.width, pg3.height);
    pg3.fill(255);
    pg3.textAlign(p.LEFT);
    pg3.textFont('IBM Plex Mono');
    pg3.textSize(16);
    pg3.text("Poster Generator",15,pg3.height - 12);
    pg3.textAlign(p.RIGHT);
    pg3.text(documentName, pg3.width - 15, pg3.height - 12);
  }
  //NECESARY SELECTORS
  p.allSelectors = function(){
    menuList = p.selectAll(".menuList");
    toolBox = p.selectAll(".tool");

    titularDrop = p.select("#titular");
    subtitularDrop = p.select("#subtitular");
    fondoDrop = p.select("#fondo");
    bordeDrop = p.select("#borde");
    rotacionDrop = p.select("#rotacion");
    animacionDrop = p.select("#animacion");
    descargarDrop = p.select("#descargar");
    infoPage = p.select("#info");

    sliderAccX = p.select("#speedX");

    recordBtn = p.select("#downloadVideo");
    recordBtn.mousePressed(startThis);

    timeBar = p.select("#timeBar");

    showedCanvas = p.select("#canvasContainer");
  }

  p.handleFile = function(file){
    if (file.type === 'image') {
    img = p.createImg(file.data, '');
    showImage = true;
  } else {
    img = null;
  }
  }
}

var show = new p5(sketch);
var ren = new p5(sketch);



//FUNCTIONS OFF SKETCH

function linkPressed(){

  //INFO BTN
  if(this.id() == 'infoLink'){
    infoPage.style("display:none");
  } else if(this.id() == 'closeInfo'){
    infoPage.style('display: none');
  }

  //ROTATE BTN
  if(this.id() == "rotateBtn"){
    canvasRotation += 180;
  }

  //DOWNLOAD STUFF
  if(this.id() == "downloadImage"){
    ren.saveFrames(documentName,'png',1,1);
  }

  //ANIMATION STUFF
  if(this.id() == "onX"){
    accX = 0.5;
    xIs = true;
  } else if(this.id() == "offX"){
    accX = 0;
    speedX = 0;
    xIs = false;
  }
  if(this.id() == "onY"){
    accY = 0.5;
    yIs = true;
  } else if(this.id() == "offY"){
    accY = 0;
    speedY = 0;
    yIs = false;
  }
  if(this.id() == "onZ"){
    accZ = 0.5;
    zIs = true;
  } else if(this.id() == "offZ"){
    accZ = 0;
    speedZ = 0;
    zIs = false;
  }
  if(this.id() == "playBtn"){
    counterOff = 1;
    speedX = 0;
    speedY = 0;
    speedZ = 0;
  }
  if(this.id() == "stopBtn"){
    counter = 0;
    counterOff = 0;
    accX = 0;
    accY = 0;
    accZ = 0;
    speedX = 0;
    speedY = 0;
    speedZ = 0;
    xIs = false;
    yIs = false;
    zIs = false;
  }
  if(xIs == false){
    ren.select("#offX").style("color:red");
    ren.select("#onX").style("color:black");
  } else{
    ren.select("#onX").style("color:red");
    ren.select("#offX").style("color:black");
  }
  if(yIs == false){
    ren.select("#offY").style("color:red");
    ren.select("#onY").style("color:black");
  } else{
    ren.select("#onY").style("color:red");
    ren.select("#offY").style("color:black");
  }
  if(zIs == false){
    ren.select("#offZ").style("color:red");
    ren.select("#onZ").style("color:black");
  } else{
    ren.select("#onZ").style("color:red");
    ren.select("#offZ").style("color:black");
  }

  //BACKGROUND STUFF
  if(this.id() == "deleteImage"){
    if(showImage == 1){
      showImage = false;
    }
  }
  //SUBTITLE STUFF
  //SUBTITLE ALIGNMENTS
  if(this.id() == "subtitleIzq"){
    subtitleAlign = ren.LEFT;
  } else if(this.id() == "subtitleCen"){
    subtitleAlign = ren.CENTER;
  } else if(this.id() == "subtitleDer"){
    subtitleAlign = ren.RIGHT;
  }
  //SUBTITLE FONT
  if(this.id() == "subtitleTypeOpen"){
    var subtSelector = ren.select("#subtitleTypeSelector");
    subtSelector.style("display:block");
  } else if(this.id() == "closeSubtitle"){
    var subtSelector = ren.select("#subtitleTypeSelector");
    subtSelector.style("display:none");
  }
  if(this.id() == "sRoboto"){
    subtitleFont = 'Roboto';
  } else if(this.id() == "sOswald"){
    subtitleFont = 'Oswald';
  } else if(this.id() == "sPlayfair"){
    subtitleFont = 'Playfair Display';
  } else if(this.id() == "sIBM"){
    subtitleFont = 'IBM Plex Mono';
  } else if(this.id() == "sAnton"){
    subtitleFont = 'Anton';
  } else if(this.id() == "sOpen"){
    subtitleFont = 'Open Sans';
  } else if(this.id() == "sCormorant"){
    subtitleFont = 'Cormorant Garamond';
  } else if(this.id() == "sVolkhov"){
    subtitleFont = 'Volkhov';
  } else if(this.id() == "sLimilight"){
    subtitleFont = 'Limelight';
  }

  //TITLE STUFF
  //TITLE ALIGNMENTS
  if(this.id() == "titleIzq"){
    titleAlign = ren.LEFT;
  } else if(this.id() == "titleCen"){
    titleAlign = ren.CENTER;
  } else if(this.id() == "titleDer"){
    titleAlign = ren.RIGHT;
  }
  //TITLE FONT
  if(this.id() == "titleTypeOpen"){
    var titleSelector = ren.select("#titleTypeSelector");
    titleSelector.style("display:block");
  } else if(this.id() == "closeTitle"){
    var titleSelector = ren.select("#titleTypeSelector");
    titleSelector.style("display:none");
  }
  if(this.id() == "tRoboto"){
    titleFont = 'Roboto';
  } else if(this.id() == "tOswald"){
    titleFont = 'Oswald';
  } else if(this.id() == "tPlayfair"){
    titleFont = 'Playfair Display';
  } else if(this.id() == "tIBM"){
    titleFont = 'IBM Plex Mono';
  } else if(this.id() == "tAnton"){
    titleFont = 'Anton';
  } else if(this.id() == "tOpen"){
    titleFont = 'Open Sans';
  } else if(this.id() == "tCormorant"){
    titleFont = 'Cormorant Garamond';
  } else if(this.id() == "tVolkhov"){
    titleFont = 'Volkhov';
  } else if(this.id() == "tLimilight"){
    titleFont = 'Limelight';
  }

  //MENU
  if(this.class() == "menuList"){
    for (var i = 0; i < toolBox.length; i++){
      toolBox[i].style("display:none");
      menuList[i].style("text-decoration:none");
    }
  }
  if(this.id() == "titularLink"){
    titularDrop.show();
    this.style("text-decoration:underline");
  } else if(this.id() == "subtitularLink"){
    subtitularDrop.show();
    this.style("text-decoration:underline");
  } else if(this.id() == "fondoLink"){
    fondoDrop.show();
    this.style("text-decoration:underline");
  } else if(this.id() == "bordeLink"){
    bordeDrop.show();
    this.style("text-decoration:underline");
  } else if(this.id() == "rotacionLink"){
    rotacionDrop.show();
    this.style("text-decoration:underline");
  } else if(this.id() == "animacionLink"){
    animacionDrop.show();
    this.style("text-decoration:underline");
  } else if(this.id() == "descargarLink"){
    descargarDrop.show();
    this.style("text-decoration:underline");
  }

}
function changeColor(){
  if(this.id() == "titleColorPicker"){
    titleColor = this.value();
  } else if(this.id() == "subtitleColorPicker"){
    subtitleColor = this.value();
  } else if(this.id() == "bkColorPicker"){
    bkColor = this.value();
  } else if(this.id() == "borderColorPicker"){
    borderColor = this.value();
  }
}
function changeText(){
  if(this.id() == "titularTextarea"){
    titleText = this.value();
  } else if(this.id() == "subtitularTextarea"){
    subtitleText = this.value();
  } else if(this.id() == "documentNameTextarea"){
    documentName = this.value();
  }
}
function moveSlider(){

  //SIZE SLIDER
  if(this.id() == "canvasScale"){
    showResX = this.value();
    showResY = this.value() * 1.25;
    manageViews();
    showedCanvas.style("width", this.value());
  }

  //ROTATION SLIDERS
  if(this.id() == "rotateX"){
    xRotation = this.value();
  } else if(this.id() == "rotateY"){
    yRotation = this.value();
  } else if(this.id() == "rotateZ"){
    zRotation = this.value();
  }

  //BORDER SLIDERS
  if(this.id() == "borderSize"){
    borderSize = this.value();
  }

  //BACKGROUND SLIDERS
  if(this.id() == "SuperScaleSlider"){
    imageScale = this.value();
  }

  //SUBTITLE SLIDERS
  if(this.id() == "subtSizeSlider"){
    subtitleSize = this.value();
  } else if(this.id() == "subtLeadingSlider"){
    subtitleLeading = this.value();
  } else if(this.id() == "subtPosXSlider"){
    subtitlePosX = this.value();
  } else if(this.id() == "subtPosYSlider"){
    subtitlePosY = this.value();
  }
  else if(this.id() == "planesAmountSubtitle"){
    subAmount = this.value();
  }
  else if(this.id() == "planesDistanceSubtitle"){
    subDistance = this.value();
  }

  //TITLE SLIDERS 
  if(this.id() == "titleSizeSlider"){
    titleSize = this.value();
  } else if(this.id() == "titleLeadingSlider"){
    titleLeading = this.value();
  } else if(this.id() == "titlePosXSlider"){
    titlePosX = this.value();
  } else if(this.id() == "titlePosYSlider"){
    titlePosY = this.value();
  } else if(this.id() == "titlePlanesZPlusSlider"){
    titleSliderPlus = this.value();
  } else if(this.id() == "titlePlanesZMinusSlider"){
    titleSliderMinus = this.value();
  } else if(this.id() == "titlePlanesDistanceSlider"){
    titleDistance = this.value();
  }
}

function manageViews(){
  show.resizeCanvas(showResX + addSize,showResY + addSize);
  show.canvas.parent("#canvasContainer");
  ren.canvas.parent("#noCanvas");
}
function copyAll(){
  show.copy(ren.canvas, 0,0,resX,resY,-showResX/2,-showResY/2,showResX,showResY);
}



//RECORD FUNCTIONS
function startThis(){
  for (var i = 0; i < toolBox.length; i++){
    toolBox[i].style("display:none");
    menuList[i].style("text-decoration:none");
  }
  rotacionDrop.show();
  ren.select("#rotacionLink").style("text-decoration:underline");

  counter = 0;
  counterOff = 1;
  recorder = 0;
  speedX=0;
  speedY=0;
  speedZ=0;
  ren.capturer.start();
  // recorder+=recordCounter;
}

function recordThis(){
  ren.capturer.capture(ren.myRender);
}

function endThis(){
  ren.capturer.save();
  ren.capturer.stop();
}

