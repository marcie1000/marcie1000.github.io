class ConditionObj {
    constructor(value = undefined) {
        this.value = value;
    }

    setValue(value) {
        this.value = value;
    }
}

class GScript {
    constructor(/*scriptNodes*/) {
        // this.gsNodes = scriptNodes;
        console.log("A new GScript has been instancied.");
        this.gsNodes = [];
        this.count = 0;
        this.paused = false;
        this.listener = undefined;
        this.conditionObj = new ConditionObj();
    }

    getCounter() {
        return this.count;
    }

    copyNodes(scriptNodes) {
        this.gsNodes = scriptNodes;
    }

    appendNodes(nodes) {
        this.gsNodes = this.gsNodes.concat(nodes);
    }

    insertAtCount(newGsNodes) {
        // var count = this.theScript.count;
        // var originalArray = this.theScript.gsNodes;
        var oaStart = this.gsNodes.slice(0, this.count + 1);
        var oaEnd   = this.gsNodes.slice(this.count + 1);
        var result  = oaStart.concat(newGsNodes, oaEnd);
        this.gsNodes = result;
        // return true;
    }

    registerListener(listener) {
        this.listener = listener;
    }

    executeListener(buttonName) {
        this.conditionObj.setValue(buttonName);
        this.listener.click();
    }

    execute(name = "") {
        this.paused = false;
        console.log("executing from: " + name);
        while (this.count < this.gsNodes.length && !this.paused) {
            if (this.gsNodes[this.count].execute()) {
                console.log("count = " + this.count);
                this.count++;
            }
        }
        console.log("leaving execution from: " + name);
    }

    pause() {
        this.paused = true;
    }
}

class GsNode {
    constructor() {

    }

    execute() {

    }
}

class GsChangeZIndex extends GsNode {
    constructor(elementId, zindex) {
        super ();
        this.elementId = elementId;
        this.zindex = zindex;
    }

    execute() {
        document.getElementById(this.elementId).style["z-index"] = this.zindex;
        return true;
    }
}

class GsApparition extends GsNode {
    constructor(theScript, index, delay, x = undefined, y = undefined, /*w, h*/) {
        super(null);
        this.theScript = theScript;
        this.index = index;
        this.x = x;
        this.y = y;
        // this.w = w;
        // this.h = h;
        this.delay = delay;
        this.end = false;
        this.dynamic = false;
        
        // this.inProgress = false;
    }

    // endMethod() {
    //     this.end = true;
    // }

    zoom(index, scale, x, y) {
        let dlimage = dl.get(index);
        let image = imgs[index];

        // ctx.restore();
        // ctx.save();
        let w = image.width * scale;
        let h = image.height * scale;
        let realx = x + (image.width - w) / 2;
        let realy = y + (image.height - h) / 2;

        dlimage.x = realx;
        dlimage.y = realy;
        dlimage.w = w;
        dlimage.h = h;
        // ctx.clearRect(realx, realy, w, h);
        // ctx.drawImage(dlimage, realx, realy, w, h);
        window.requestAnimationFrame(dl.draw.bind(dl));
    }

    execute() {
        if(this.end) {
            this.end = false;
            return true;
        }

        // if (this.inProgress) {
        //     return false;
        // }

        this.theScript.pause();
        // this.inProgress = true;

        let dlimage = dl.get(this.index);
        dlimage.visible = true;

        var self = this;

        var scale = 0.00;

        interval = setInterval( function() {
            console.log("i'm in interval " + interval);
            if(scale >= 1.00) {
                console.log("clear interval" + interval);
                clearInterval(interval);
                self.end = true;
                var fn = self.theScript.execute.bind(curScr);
                console.log("at the end of setinterval count=" + curScr.count);
                fn("apparition");
                return;
                // if( != null) {
                //     callback();
                // }
                // this.callbackMethod();
            }

            if(self.x == undefined || self.y == undefined) {
                self.dynamic = true;
            }

            if(self.dynamic) {
                if(self.index == DL_IMG_CHARACTER) {
                    self.x = 0;
                    self.y = 0;
                } else if(self.index == DL_IMG_BULLE) {
                    self.x = bulleX;
                    self.y = bulleY;
                }
            }

            self.zoom(self.index, scale, self.x, self.y);
            scale += 0.02;
        }, this.delay);

        return false;
    }
}

class GsClearTypewrite extends GsNode {
    constructor() {
        super();
    }

    execute() {
        dl.get(DL_TXT_0).text = "";
        window.requestAnimationFrame(dl.draw.bind(dl));
        return true;
    }
}

class GsTypewrite extends GsNode {
    constructor(theScript, text, delay = 16, x = undefined, y = undefined, w = undefined, font = "20px Arial", color = "black") {
        super();
        this.theScript = theScript;
        this.text = text;
        this.x = x;
        this.y = y;
        this.w = w;
        this.delay = delay;
        this.font = font;
        this.color = color;
        this.end = false;
    }

    execute() {
        if (this.end) {
            this.end = false;
            return true;
        }

        console.log("textX = ", textX, "; textY = ", textY, "; textW = ", textW);
        if(this.x == undefined) {
            this.x = textX;
        }

        if(this.y == undefined) {
            this.y = textY;
        }

        if(this.w == undefined) {
            this.w = textW;
        }

        this.theScript.pause();

        var counter = 0;
        ctx.font = this.font;
        var self = this;

        var dltext = dl.get(DL_TXT_0);
        dltext.x = this.x;
        dltext.y = this.y;
        dltext.w = this.w;
        dltext.font = this.font;
        dltext.color = this.color;
        dltext.visible = true;

        interval = setInterval(function() {
            if(counter < self.text.length) {
                var textToShow = self.text.slice(0, counter);
                // ctx.clearRect(bulleX, bulleY, bulleImg.width, bulleImg.height);
                // ctx.drawImage(bulleImg, bulleX, bulleY);
                // ctx.fillStyle = "white";
                // printAt(ctx, textToShow, self.x, self.y, 25, self.w);
                // ctx.fillStyle = self.color;
                // printAt(ctx, textToShow, self.x, self.y, 25, self.w);
                dltext.text = textToShow;
                counter++;
            } else {
                // ctx.fillStyle = "white";
                // printAt(ctx, self.text, self.x, self.y, 25, self.w);
                // ctx.fillStyle = self.color;
                // printAt(ctx, self.text, self.x, self.y, 25, self.w);
                dltext.text = self.text;
                clearInterval(interval);
                self.end = true;
                self.theScript.execute("typewrite");
            }
            window.requestAnimationFrame(dl.draw.bind(dl));
        }, this.delay);

        return false;
    }
}

class GsPreloadImgs extends GsNode {
    constructor(theScript) {
        super();
        this.theScript = theScript;
        this.end = false;
        this.total = 2;
        this.count1 = 0;
    }

    processLoading() {
        this.count1++;
        if(this.count1 >= this.total) {
            console.log("Both images loaded.");
            this.end = true;
            console.log("after processloading : this.count1 = " + this.count1 + " ; curScr.count = " + curScr.count);
            const fn = curScr.execute.bind(curScr);
            fn("preload");
            return true;
        }
        return false;
    }

    execute() {
        if (this.end) {
            this.end = false;
            return true;
        }

        // dl.get(this.index).visible = false;
        curScr.pause();

        var self = this;
        imgs[DL_IMG_BULLE] = bulleImg;

        // imgs[this.index] = (new Image());
        bulleImgWide.src = bulleImgFileWide;
        bulleImgNarrow.src = bulleImgFileNarrow;



        // var self = this;
        bulleImgWide.onload = function() {
            // debugger
            console.log("before processloading 1 : self.count1 = " + self.count1 + " ; curScr.count = " + curScr.count);
            let fn1 = self.processLoading.bind(self);
            fn1();
        }

        bulleImgNarrow.onload = function() {
            console.log("before processloading 2 : self.count1 = " + self.count1 + " ; curScr.count = " + curScr.count);
            let fn1 = self.processLoading.bind(self);
            fn1();
            // debugger
        }

        return false;
    }
}

class GsLoadImg extends GsNode {
    constructor(theScript, index, src) {
        super();
        this.theScript = theScript;
        this.index = index;
        this.src = src;
        this.end = false;
    }

    execute() {
        if (this.end) {
            this.end = false;
            return true;
        }

        // dl.get(this.index).visible = false;
        this.theScript.pause();

        imgs[this.index] = (new Image());
        var img = imgs[this.index];
        img.src = this.src;

        var self = this;
        img.onload = function() {
            self.end = true;
            self.theScript.execute("loadimg");
            window.requestAnimationFrame(dl.draw.bind(dl));
        }

        return false;
    }
}

class GsClearImg extends GsNode {
    constructor(index) {
        super();
        this.index = index;
    }

    execute() {
        let dlimage = dl.get(this.index);
        // dlimage.w = 0;
        // dlimage.h = 0;
        dlimage.visible = false;
        window.requestAnimationFrame(dl.draw.bind(dl));
        return true;
    }
}

class GsDrawImg extends GsNode {
    constructor(index, x = 0, y = 0, w = undefined, h = undefined) {
        super();
        this.index = index;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    execute() {

        let dlimage = dl.get(this.index);
        dlimage.x = this.x;
        dlimage.y = this.y;
        dlimage.w = this.w;
        dlimage.h = this.h;
        dlimage.visible = true;
        window.requestAnimationFrame(dl.draw.bind(dl));

        // if(this.w == undefined && this.h == undefined) {
        //     ctx.drawImage(imgs[this.index], this.x, this.y);
        // } else {
        //     ctx.drawImage(imgs[this.index], this.x, this.y, this.w, this.h);
        // }

        return true;
    }
}


class GsInjectHTML extends GsNode {
    constructor(html, id, style) {
        super();
        this.html = html;
        this.id = id;
        this.style = style;
    }

    execute() {
        var node = document.createElement("div");
        node.id = this.id;
        node.style = this.style;
        node.innerHTML = this.html;
        document.getElementById("theBody").appendChild(node);
        return true;
    }
}

class GsWaitForButton extends GsNode {
    constructor(theScript) {
        super();
        this.theScript = theScript;
        this.buttonClicked = false;
    }

    click() {
        this.buttonClicked = true;
        this.theScript.execute("waitforbutton");
    }

    execute() {
        if(this.buttonClicked) {
            console.log("youhouuuu");
            this.buttonClicked = false;
            return true;
        }
        this.theScript.registerListener(this);
        this.theScript.pause();
        return false;
    }
}

class GsClearRect extends GsNode {
    constructor(x, y, w, h) {
        super();
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    execute() {
        ctx.clearRect(this.x, this.y, this.w, this.h);
        return true;
    }
}

class GsConsoleLog extends GsNode {
    constructor(text) {
        super();
        this.text = text;
    }

    execute() {
        console.log(this.text);
        return true;
    }
}

class GsRemoveHTMLAttribute extends GsNode {
    constructor(htmlNodeId, attribute) {
        super();
        this.htmlNodeId = htmlNodeId;
        this.attribute = attribute;
    }

    execute() {
        document.getElementById(this.htmlNodeId).removeAttribute(this.attribute);
        return true;
    }
}

class GsChangeHTMLAttribute extends GsNode {
    constructor(htmlNodeId, attribute, value) {
        super();
        this.htmlNodeId = htmlNodeId;
        this.attribute = attribute;
        this.value = value;
    }

    execute() {
        document.getElementById(this.htmlNodeId).setAttribute(this.attribute, this.value);
        return true;
    }
}

class GsChangeHTMLInner extends GsNode {
    constructor(htmlNodeId, value) {
        super();
        this.htmlNodeId = htmlNodeId;
        this.value = value;
    }

    execute() {
        document.getElementById(this.htmlNodeId).innerHTML = this.value;
        return true;
    }
}

// class GsDecisionTree extends GsNode {
//     constructor(theScript, value1, nodesList1, value2, nodesList2) {
//         super();
//         this.theScript = theScript;
//         this.value1 = value1;
//         this.nodesList1 = nodesList1;
//         this.value2 = value2;
//         this.nodesList2 = nodesList2;
//     }

//     execute() {
//         if(this.theScript.conditionObj.value == this.value1) {
//             this.theScript.appendNodes(this.nodesList1);
//         } else if (this.theScript.conditionObj.value == this.value2) {
//             this.theScript.appendNodes(this.nodesList2);
//         }
//         return true;
//     }
// }

class GsDecisionTree extends GsNode {
    constructor(theScript, value1, nodesList1, value2, nodesList2) {
        super();
        this.theScript = theScript;
        this.value1 = value1;
        this.nodesList1 = nodesList1;
        this.value2 = value2;
        this.nodesList2 = nodesList2;
    }

    execute() {
        if(this.theScript.conditionObj.value == this.value1) {
            this.theScript.insertAtCount(this.nodesList1);
        } else if (this.theScript.conditionObj.value == this.value2) {
            this.theScript.insertAtCount(this.nodesList2);
        }
        return true;
    }
}

class GsDelay extends GsNode {
    constructor(theScript, delay) {
        super();
        this.theScript = theScript;
        this.delay = delay;
        this.end = false;
    }

    execute() {
        if (this.end) {
            this.end = false;
            return true;
        }

        this.theScript.pause();
        var self = this;

        interval = setInterval(function() {
            self.end = true;
            clearInterval(interval);
            self.theScript.execute("gsdelay");
        }, this.delay);

        return false;
    }
}

class GsExecuteJS extends GsNode {
    constructor(func) {
        super();
        this.func = func;
    }

    execute() {
        this.func();
        return true;
    }
}

function getCurrentMilliseconds() {
    const now = new Date();
    return now.getMilliseconds();
}

class GsColorFadeIn extends GsNode {
    constructor(theScript, color, delay) {
        super();
        this.theScript = theScript;
        this.alphaIncrement = 0.0;
        this.color = color;
        this.delay = delay;
        // this.repeats = repeats;
        this.end = false;
        this.count = 0;
    }

    execute() {
        if (this.end) {
            this.end = false;
            return true;
        }

        this.theScript.pause();
        this.originalColor = ctx.fillStyle;
        this.originalAlpha = ctx.globalAlpha;
        this.delta = 1000 / 60 / this.delay;
        // this.millisecondsBegin = getCurrentMilliseconds();
        var self = this;

        interval = setInterval(function() {
            if(self.alphaIncrement >= 1.0) {
                self.end = true;
                clearInterval(interval);
                self.alphaIncrement = 1.0;
                dlBackgroundAlpha = 1.0;
                dlBackgroundColor = "black";
                self.theScript.execute("GsColorFadeIn");
            }
            dl.draw.bind(dl);
            ctx.fillStyle = self.color;
            ctx.globalAlpha = self.alphaIncrement;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            self.alphaIncrement += self.delta;
            self.count++;
            ctx.globalAlpha = self.originalAlpha;
            ctx.fillStyle = self.originalColor
        }, 16);

        return false;
    }
}

class GsSetFillStyle extends GsNode {
    constructor(color) {
        super();
        this.color = color;
    }

    execute() {
        ctx.fillStyle = this.color;
        return true;
    }
}

// class GsInsertInScript extends GsNode {
//     constructor(theScript, newGsNodesArray) {
//         super();
//         this.theScript = theScript;
//         this.newGsNodesArray = newGsNodesArray;
//     }

//     execute() {
//         var count = this.theScript.count;
//         var originalArray = this.theScript.gsNodes;
//         var oaStart = originalArray.slice(0, count + 1);
//         var oaEnd   = originalArray.slice(count + 1);
//         var result  = oaStart.concat(this.newGsNodesArray, oaEnd);
//         this.theScript.gsNodes = result;
//         return true;
//     }
// }

var curScr = new GScript();
var dl = new DrawList();

function testScripting() {
    var list = [];
    // list.push(new GsSetFillStyle("white"));
    list.push(new GsPreloadImgs(curScr));
    list.push(new GsLoadImg(curScr, DL_IMG_CHARACTER, "img/glucks_stop.png"));
    list.push(new GsChangeZIndex("mainDialog", -1));

    // *********************
    list.push(new GsApparition(curScr, DL_IMG_CHARACTER, 16));
    // list.push(new GsDrawImg(DL_IMG_CHARACTER, 50, 50, 50, 50));


    // list.push(new GsLoadImg(curScr, DL_IMG_BULLE, bulleImgFile));
    list.push(new GsApparition(curScr, DL_IMG_BULLE, 16));
    list.push(new GsTypewrite(curScr, "STOP !! Je suis Raphaël GLUCKSMANN. Rassure-moi, tu ne viens pas de cliquer sur ce bouton quand même ????", 40))
    // // list.push(new GsInjectHTML(
    // //     "<div class='window' style='margin: 32px; width: 200px;'>\
    // //         <div class='title-bar'>\
    // //         <div id='spTitleBarText' class='title-bar-text'>\
    // //             Question\
    // //         </div>\
    // //         \
    // //         <div class='title-bar-controls'>\
    // //             <button aria-label='Close'></button>\
    // //         </div>\
    // //         </div>\
    // //         <div class='window-body'>\
    // //             <div id='spBody'></div>\
    // //             <section class='field-row' style='justify-content: flex-end'>\
    // //                 <button id='spButton1' onclick='curScr.executeListener(\x22spButton1\x22)'>Euuuuh...</button>\
    // //                 <button id='spButton2' onclick='curScr.executeListener(\x22spButton2\x22)'>Non non tkt ^^</button>\
    // //             </section>\
    // //         </div>\
    // //     </div>",
    // //     "spDial",
    // //     "z-index: 3; position: absolute; left: 675px; top: 200px;"
    // // ));
    list.push(new GsRemoveHTMLAttribute("spDial", "hidden"));
    list.push(new GsWaitForButton(curScr));
    list.push(new GsClearImg(DL_IMG_CHARACTER));
    list.push(new GsClearTypewrite());
    // list.push(new GsClearRect(0, 0, 500, 700));
    // list.push(new GsClearRect(600, 125, 390, 140));
    list.push(new GsChangeHTMLAttribute("spDial", "hidden", "true"));

    /* Decisions about the buttons */
    var lc1 = [];
    lc1.push(new GsConsoleLog("C'est la condition 1!!! Euuuuh..."));
    lc1.push(new GsLoadImg(curScr, DL_IMG_CHARACTER, "img/glucks_mal_de_crane2.png"));
    lc1.push(new GsDrawImg(DL_IMG_CHARACTER, -350, 0));
    lc1.push(new GsTypewrite(curScr, "C'est une blague??? Tu as vraiment cliqué dessus ??", 40))
    lc1.push(new GsChangeHTMLInner("spButton1", "Oui..."));
    lc1.push(new GsChangeHTMLInner("spButton2", "Non M. Raphaël GLUCKSMANN"));
    lc1.push(new GsRemoveHTMLAttribute("spDial", "hidden"));
    lc1.push(new GsWaitForButton(curScr));
    // lc1.push(new GsClearRect(600, 125, 390, 140));
    lc1.push(new GsClearTypewrite());
    lc1.push(new GsChangeHTMLAttribute("spDial", "hidden", "true"));


    var lc1_1 = [];
    var lc1_2 = [];
    {
    /*  buttons */
        lc1_1.push(new GsTypewrite(curScr, "Malédiction... Tu as cru que ton ordinateur était infecté par un virus... Alors que le vrai virus... C'est Jean-Luc Mélenchon...", 40));

        // lc1_2.push(new GsClearRect(0, 0, 500, 700));
        lc1_2.push(new GsLoadImg(curScr, DL_IMG_CHARACTER, "img/glucks_mal_de_crane1.png"));
        lc1_2.push(new GsDrawImg(DL_IMG_CHARACTER, -80, 200));
        lc1_2.push(new GsTypewrite(curScr, "Ouf !!... Ton ordinateur n'est pas infecté parun virus... Parce que le vrai virus... C'est    Jean-Luc Mélenchon...", 40));
        lc1_2.push(new GsConsoleLog("C'est la condition 2!!! non tkt..."));
    /*  --------*/
    }
    lc1.push(new GsDecisionTree(curScr, "spButton1", lc1_1, "spButton2", lc1_2));

    var lc2 = lc1_2;
    /* --------------------------- */

    list.push(new GsDecisionTree(curScr, "spButton1", lc1, "spButton2", lc2));
    // list.push(new GsClearRect(600, 125, 390, 140));
    // list.push(new GsClearTypewrite());
    list.push(new GsChangeHTMLAttribute("spDial", "hidden", "true"));

    // COOKIES

    // list.push(new GsConsoleLog("cookies : count = "));

    list.push(new GsDelay(curScr, "1000"));
    list.push(new GsRemoveHTMLAttribute("cookieBaniere", "hidden"));
    list.push(new GsDelay(curScr, "2000"));
    list.push(new GsChangeZIndex("cookieBaniere", "2"));
    list.push(new GsChangeHTMLInner("spButton1", "?????"));
    list.push(new GsChangeHTMLAttribute("spButton2", "hidden"));
    list.push(new GsRemoveHTMLAttribute("spDial", "hidden"));
    list.push(new GsWaitForButton(curScr));
    list.push(new GsChangeHTMLAttribute("spDial", "hidden"));
    list.push(new GsClearImg(DL_IMG_BULLE));
    list.push(new GsClearTypewrite());
    list.push(new GsChangeZIndex("cookieBaniere", "-1"));
    list.push(new GsLoadImg(curScr, DL_IMG_CHARACTER, "img/glucks_content.webp"));
    list.push(new GsDrawImg(DL_IMG_CHARACTER));
    list.push(new GsDelay(curScr, 500));
    list.push(new GsApparition(curScr, DL_IMG_BULLE, 14));
    list.push(new GsTypewrite(curScr, "WOW !!! Regarde !!! Une bannière de cookies ! Elle est magnifique !!"));
    list.push(new GsRemoveHTMLAttribute("spDial", "hidden"));
    list.push(new GsWaitForButton(curScr));
    list.push(new GsChangeHTMLAttribute("spDial", "hidden"));
    list.push(new GsTypewrite(curScr, "Tu sais, si ces bannières existent, c'est grâce à L'UNION EUROPÉENNE. C'est un peu grâce à moi en fait!!! (je suis députer européen)"));
    list.push(new GsExecuteJS(function() { (alert("Ce site utilise des cookies.")) }));
    list.push(new GsChangeHTMLInner("spButton1", "Raphaël GLUCKSMANN stp je veux juste refuser les cookies comment je fais là"));
    list.push(new GsRemoveHTMLAttribute("spDial", "hidden"));
    list.push(new GsWaitForButton(curScr));
    list.push(new GsChangeHTMLAttribute("spDial", "hidden"));
    list.push(new GsLoadImg(curScr, DL_IMG_CHARACTER, "img/glucks_remise_en_question.jpeg"));
    list.push(new GsDrawImg(DL_IMG_CHARACTER));
    list.push(new GsLoadImg(curScr, DL_IMG_2, "img/laptop.png"));
    list.push(new GsDrawImg(DL_IMG_2, -25, 150, 400, 300));
    list.push(new GsTypewrite(curScr, "Hmmm... Attends.... Voyons voir... Je code sur mon ordinateur informatique... Ah voilà !", 50));
    list.push(new GsRemoveHTMLAttribute("button-refuser-cookies", "hidden"));
    list.push(new GsDelay(curScr, 1000));
    list.push(new GsChangeZIndex("cookieBaniere", "4"));
    list.push(new GsWaitForButton(curScr));
    list.push(new GsChangeHTMLAttribute("cookieBaniere", "hidden"));
    list.push(new GsChangeZIndex("cookieBaniere", "2"));
    list.push(new GsClearImg(DL_IMG_BULLE));
    list.push(new GsClearTypewrite());
    list.push(new GsColorFadeIn(curScr, "black", 2000));
    list.push(new GsSetFillStyle("black"));
    list.push(new GsClearImg(DL_IMG_CHARACTER));
    list.push(new GsClearImg(DL_IMG_2));
    list.push(new GsApparition(curScr, DL_IMG_BULLE));
    list.push(new GsTypewrite(curScr, "Hahahahahahahahaha"));
    list.push(new GsDelay(curScr, 1500));
    list.push(new GsChangeHTMLInner("spButton1", "Euuuuuh.... ????"));
    list.push(new GsRemoveHTMLAttribute("spDial", "hidden"))
    list.push(new GsWaitForButton(curScr));
    list.push(new GsChangeHTMLAttribute("spDial", "hidden"));
    list.push(new GsTypewrite(curScr, "Je t'ai bien eu·e !!! Je ne suis pas du tout Raphaël GLUCKSMANN... Je suis en réalité....", 50));
    list.push(new GsDelay(curScr, 1500));
    list.push(new GsLoadImg(curScr, DL_IMG_CHARACTER, "img/guedj_fier.jpeg"));
    list.push(new GsApparition(curScr, DL_IMG_CHARACTER, 14));
    list.push(new GsDelay(curScr, 750));
    list.push(new GsChangeHTMLInner("spButton1", "Jérôme GUEDJ !!!! 😱"));
    list.push(new GsRemoveHTMLAttribute("spDial", "hidden"))
    list.push(new GsWaitForButton(curScr));
    list.push(new GsChangeHTMLAttribute("spDial", "hidden"));
    list.push(new GsTypewrite(curScr, "Avant que tu cliques sur ce bouton, j'ai rajouté une petite ligne de texte... 3 fois rien... Je te laisse vérifier par toi même !!", 40));
    list.push(new GsChangeHTMLAttribute("button-refuser-cookies", "disabled"));
    list.push(new GsDelay(curScr, 750));
    list.push(new GsRemoveHTMLAttribute("cookieBaniere", "hidden"));
    list.push(new GsDelay(curScr, 250));
    list.push(new GsRemoveHTMLAttribute("ligne-cachee-guedj", "hidden"))
    list.push(new GsDelay(curScr, 250));
    list.push(new GsChangeHTMLAttribute("ligne-cachee-guedj", "hidden"));
    list.push(new GsDelay(curScr, 250));
    list.push(new GsRemoveHTMLAttribute("ligne-cachee-guedj", "hidden"))
    list.push(new GsDelay(curScr, 250));
    list.push(new GsChangeHTMLAttribute("ligne-cachee-guedj", "hidden"));
    list.push(new GsDelay(curScr, 250));
    list.push(new GsRemoveHTMLAttribute("ligne-cachee-guedj", "hidden"))
    list.push(new GsDelay(curScr, 250));
    list.push(new GsChangeHTMLAttribute("ligne-cachee-guedj", "hidden"));
    list.push(new GsDelay(curScr, 250));
    list.push(new GsRemoveHTMLAttribute("ligne-cachee-guedj", "hidden"))
    list.push(new GsDelay(curScr, 2500));

    list.push(new GsChangeHTMLInner("spButton1", "Oh non...."));
    list.push(new GsRemoveHTMLAttribute("spDial", "hidden"))
    list.push(new GsWaitForButton(curScr));

    list.push(new GsChangeHTMLAttribute("spDial", "hidden"));
    list.push(new GsChangeHTMLAttribute("cookieBaniere", "hidden"));
    list.push(new GsTypewrite(curScr, "Un immense merci pour ta contribution !! Grâce à toi, la dynamique Guedj est lancée !!", 40));

    list.push(new GsDelay(curScr, 2000));
    list.push(new GsColorFadeIn(curScr, "black", 3000));
    list.push(new GsClearTypewrite());
    list.push(new GsClearImg(DL_IMG_CHARACTER));
    list.push(new GsClearImg(DL_IMG_BULLE));

    list.push(new GsChangeHTMLInner("mainDialogText", "Quelle horreur ! Jérôme Guedj, le candidat à la Primaire Socialiste, vient de " +
                                   "te manipuler dans le seul but de remporter les élections !! La démocratie française est-elle menacée ? " +
                                   "Jérôme Guedj vient-il de sortir de l'arc républicain ?? Mais surtout... Qu'a-t-il fait à Raphaël " +
                                    "Glucksmann ??? Est-il en danger ??? Histoire à suivre...."));
    list.push(new GsChangeHTMLInner("mainDialogTitle", "Quelle horreur !"))
    list.push(new GsChangeHTMLAttribute("jeSouhaite", "hidden"));
    list.push(new GsChangeZIndex("mainDialog", 1));


    curScr.copyNodes(list);
    curScr.execute("initial");
}
