var canvas;
var ctx;
var imgPos = 0;
var img;
var characterImg = new Image();
var interval;

var WIDESCREEN_MIN_W = 1000;

var WIDESCREEN_MODE = 0;
var NARROWSCREEN_MODE = 1;
var screenMode = 0;

var bulleX = 500, bulleY = 100;

const bulleXwide = 500, bulleYwide = 100;
const bulleXnarrow = 0, bulleYnarrow = 400;
const textXwide = 600, textYwide = 150, textWwide = 390;
const textXnarrow = 17, textYnarrow = 530, textWnarrow = 390;
var textX = 0, textY = 0, textW = 0;
const bulleImgFileWide = "img/bulle.png";
const bulleImgFileNarrow = "img/bulle_portrait.png";
var bulleImgWide = new Image();
var bulleImgNarrow = new Image();
var bulleImg = bulleImgWide;
var bulleImgFile = "";

var twDelay = 16, twX = 0, twY = 0, twW = 100, twH = 100, twFont = "20px Arial", twText = "Some text.";

const spDialLeftWide = "675px";
const spDialTopWide = "200px";
const spDialLeftNarrow = "100px";
const spDialTopNarrow = "575px";
var spDialLeft = "675px", spDialTop = "200px";

window.onresize = resizeCanvas;

function reorganizeScreen() {
    // let temp = new GsLoadImg(curScr, DL_IMG_BULLE, bulleImgFile);
    // temp.execute();

    // imgs[DL_IMG_BULLE] = new Image();
    // var img = imgs[DL_IMG_BULLE];
    // img.src = bulleImgFile;

    let spdial = document.getElementById("spDial");

    let dlimage = dl.get(DL_IMG_BULLE);
    dlimage.x = bulleX;
    dlimage.y = bulleY;
    imgs[DL_IMG_BULLE] = bulleImg;
    dlimage.w = imgs[DL_IMG_BULLE].width;

    let dltext = dl.get(DL_TXT_0);
    dltext.x = textX;
    dltext.y = textY;
    dltext.w = textW;

    spdial.style.setProperty("left", spDialLeft);
    spdial.style.setProperty("top", spDialTop);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (window.innerWidth >= 1000) {
        bulleX = bulleXwide;
        bulleY = bulleYwide;
        textX = textXwide;
        textY = textYwide;
        textW = textWwide;
        bulleImgFile = bulleImgFileWide;
        bulleImg = bulleImgWide;
        spDialLeft = spDialLeftWide;
        spDialTop = spDialTopWide;
        if (screenMode == NARROWSCREEN_MODE) {
            reorganizeScreen();
        }
        screenMode = WIDESCREEN_MODE;

    } else {
        bulleX = bulleXnarrow;
        bulleY = bulleYnarrow;
        textX = textXnarrow;
        textY = textYnarrow;
        textW = textWnarrow;
        bulleImgFile = bulleImgFileNarrow;
        bulleImg = bulleImgNarrow;
        spDialLeft = spDialLeftNarrow;
        spDialTop = spDialTopNarrow;
        if (screenMode == WIDESCREEN_MODE) {
            reorganizeScreen();
        }
        screenMode = NARROWSCREEN_MODE;
    }
    window.requestAnimationFrame(dl.draw.bind(dl));
}

function loadCanvas() {
    canvas = document.getElementById("myCanvas");
    let spdial = document.getElementById("spDial");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        if (window.innerWidth >= 1000) {
            screenMode = WIDESCREEN_MODE;
            bulleX = bulleXwide;
            bulleY = bulleYwide;
            textX = textXwide;
            textY = textYwide;
            textW = textWwide;
            bulleImgFile = bulleImgFileWide;
            bulleImg = bulleImgWide;
            spDialLeft = spDialLeftWide;
            spDialTop = spDialTopWide;
            spdial.style.setProperty("left", spDialLeft);
            spdial.style.setProperty("top", spDialTop);
        } else {
            screenMode = NARROWSCREEN_MODE;
            bulleX = bulleXnarrow;
            bulleY = bulleYnarrow;
            textX = textXnarrow;
            textY = textYnarrow;
            textW = textWnarrow;
            bulleImgFile = bulleImgFileNarrow;
            bulleImg = bulleImgNarrow;
            spDialLeft = spDialLeftNarrow;
            spDialTop = spDialTopNarrow;
            spdial.style.setProperty("left", spDialLeft);
            spdial.style.setProperty("top", spDialTop);
        }
        // bulleImgWide.src = bulleImgFileWide;
        // bulleImgNarrow.src = bulleImgFileNarrow;

        // bulleImgW
        // main();
    } else {
        canvas.textContent = "Your browser doesn't support canvas... You fail the spopTCHA!!";
    }
}

// function draw222() {
//   console.log("tt");
//   img = new Image();
//   // img.onload = function () {
//   //   ctx.drawImage(img, 0, 0, 100, 100);
//   // };
//   img.src = "test.png";
//   setInterval(move, 25);
// }

// function apparitionDeGlucksmann() {
//   // window.alert("Raphaël Glucksmann entre dans la pièce");
//   var win = document.getElementById("htmlScene");
//   win.style.zIndex = -1;
//   characterImg = new Image();
//   characterImg.src = "img/glucks_stop.png";
//   // ctx.drawImage(character, 0, 0);

//   imageZoom(apparitionBulle, 16, characterImg, 0, 0);
// }

// function apparitionBulle() {
//   bulleImg = new Image();
//   bulleImg.src = "img/bulle.png";
//   imageZoom(typewriter, 16, bulleImg, bulleX, bulleY);
// }

// function imageZoom(callback, delay, image, x, y) {
//   scale = 0.00;
//   // ctx.save();
//   interval = setInterval(function() {
//     zoom(image, scale, x, y);
//     scale += 0.02;
//     if(scale >= 1.00) {
//       clearInterval(interval);
//       if(callback != null) {
//         callback();
//       }
//     }
//   }, delay);
//   // delay += speed;
// }

function printAt(context , text, x, y, lineHeight, fitWidth)
{
    fitWidth = fitWidth || 0;

    if (fitWidth <= 0)
    {
         context.fillText( text, x, y );
        return;
    }

    for (var idx = 1; idx <= text.length; idx++)
    {
        var str = text.substr(0, idx);
        // console.log(str, context.measureText(str).width, fitWidth);
        if (context.measureText(str).width > fitWidth)
        {
            context.fillText( text.substr(0, idx-1), x, y );
            printAt(context, text.substr(idx-1), x, y + lineHeight, lineHeight,  fitWidth);
            return;
        }
    }
    context.fillText( text, x, y );
}

// function typewriter() {
//   twText = "STOP !! Je suis Raphaël GLUCKSMANN. Rassure-moi, tu ne viens pas de cliquer \
//             surce bouton quand même ????";
//   twDelay = 40;
//   twX = 600;
//   twY = 150;
//   twW = 390;
//   textLen = twText.length;
//   counter = 0;
//   ctx.font = twFont;


//   interval = setInterval(function() {
//     if(counter < textLen) {
//       var textToShow = twText.slice(0, counter);
//       ctx.clearRect(bulleX, bulleY, bulleImg.width, bulleImg.height);
//       ctx.drawImage(bulleImg, bulleX, bulleY);
//       printAt(ctx, textToShow, twX, twY, 25, twW);
//       counter++;
//     } else {
//       clearInterval(interval);
//     }
//   }, twDelay);
// }

// function zoom(image, scale, x, y) {
//   // ctx.restore();
//   // ctx.save();
//   w = image.width * scale;
//   h = image.height * scale;
//   realx = x + (image.width - w) / 2;
//   realy = y + (image.height - h) / 2;
//   ctx.clearRect(realx, realy, w, h);
//   ctx.drawImage(image, realx, realy, w, h);

// }

function main() {
  // var jeSouhaite = document.getElementById("jeSouhaite");
  // // var elementsArray = document.getElementsByClassName('range');
  // draw();
  // let l = elementsArray.length;
  // for(let i = 0; i<l; i++) {
  //   elementsArray.item(i).oninput = function() {
  //     console.log(document.getElementById("b").value);
  //     draw();
  //   };
  // }
}

// function draw() {
//   ctx.setTransform(1, 0, 0, 1, 0, 0);
//   ctx.clearRect(0, 0, 500, 500);
//   let a, b, c, d, e, f;
//   a = document.getElementById("a").value;
//   b = document.getElementById("b").value;
//   c = document.getElementById("c").value;
//   d = document.getElementById("d").value;
//   e = document.getElementById("e").value;
//   f = document.getElementById("f").value;

//   //  console.log(b);
//   ctx.setTransform(a, b, c, d, e, f);
//   ctx.fillRect(0, 0, 100, 100);
// }
