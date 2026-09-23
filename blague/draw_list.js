var imgs = [undefined, undefined, undefined, undefined];

var DL_IMG_CHARACTER = 0;
var DL_IMG_BULLE = 1;
var DL_IMG_2 = 2;
var DL_IMG_3 = 3;
var DL_TXT_0 = 4;

var dlBackgroundColor = "white";
var dlBackgroundAlpha = 0.0;

class DrawList {
    constructor() {
        const theList = new Map();
        theList.set(DL_IMG_CHARACTER, new DlImage(DL_IMG_CHARACTER, 0, 0, 0, 0));
        theList.set(DL_IMG_BULLE, new DlImage(DL_IMG_BULLE, 0, 0, 0, 0));
        theList.set(DL_IMG_2, new DlImage(DL_IMG_2, 0, 0, 0, 0));
        theList.set(DL_IMG_3, new DlImage(DL_IMG_3, 0, 0, 0, 0));
        theList.set(DL_TXT_0, new DlText(""));
        this.theList = theList;
        this.paused = false;
    }

    get(index) {
        return (this.theList.get(index));
    }

    draw() {
        if(this.paused) {
            return
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var fillStyleTemp = ctx.fillStyle;
        var globalAlphaTemp = ctx.globalAlpha;

        ctx.globalAlpha = dlBackgroundAlpha;
        ctx.fillStyle = dlBackgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalAlpha = globalAlphaTemp;
        ctx.fillStyle = fillStyleTemp;

        this.theList.forEach((elem, key) => {
            if(elem.visible) {
                elem.draw();
            }
        });

    }



    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
        this.draw();
    }


}

class DlElem {
    constructor() {
        this.visible = false;
    }

    draw() {

    }
}

class DlImage extends DlElem {
    constructor(index, x, y, w = undefined, h = undefined) {
        super();
        this.index = index;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    updateParams(x, y, w = undefined, h = undefined) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        if(imgs[this.index] == undefined) {
            return;
        }

        if(this.w == undefined && this.h == undefined) {
            ctx.drawImage(imgs[this.index], this.x, this.y);
        } else {
            ctx.drawImage(imgs[this.index], this.x, this.y, this.w, this.h);
        }
        // return true;
    }
}

class DlText extends DlElem {
    constructor(text, x = 0, y = 0, w = 100, font = "20px Arial", color = "black") {
        super();
        this.text = text;
        this.x = x;
        this.y = y;
        this.w = w;
        this.font = font;
        this.color = color;
    }

    draw() {
        var colorTemp = ctx.fillStyle;
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        printAt(ctx, this.text, this.x, this.y, 25, this.w);
        ctx.fillStyle = colorTemp;
    }
}
