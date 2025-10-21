let objs = [];
let colors = ['#52489c', '#4062bb', '#59c3c3', '#ebebeb', '#f45b69', '#454545'];

// 新增：選單與狀態變數
let menuDiv;
let menuButtons = [];
let currentArtwork = 1; // 1,2,3
let bgColors = ['#ffc2d1', '#f0f8ff', '#fff7e6'];

// 新增 iframe 相關變數與目標 URL
let iframeEl;
const iframeUrls = {
    1: 'https://jenny0225p-bot.github.io/20251014_3/',
    2: 'https://hackmd.io/@uumP-3ncSdqWuO_Q9gDn6g/r1j5Kdyhle'
};

function setup() {
    // 全螢幕 canvas 並移除 body 預設 margin
    createCanvas(windowWidth, windowHeight);
    let bd = select('body');
    if (bd) bd.style('margin', '0');
    rectMode(CENTER);
    INIT();

    // 建立左側半透明選單（固定定位，確保在畫布之上）
    menuDiv = createDiv();
    menuDiv.style('position', 'fixed');
    menuDiv.style('left', '12px');
    menuDiv.style('top', '12px');
    menuDiv.size(160, 130);
    menuDiv.style('background', 'rgba(255,255,255,0.85)');
    menuDiv.style('padding', '10px');
    menuDiv.style('border-radius', '8px');
    menuDiv.style('box-shadow', '0 6px 18px rgba(0,0,0,0.08)');
    menuDiv.style('z-index', '10000');
    menuDiv.style('font-family', 'sans-serif');
    menuDiv.style('user-select', 'none');

    let title = createP('選擇作品');
    title.parent(menuDiv);
    title.style('margin', '0 0 8px 0');
    title.style('font-weight', '600');
    title.style('font-size', '14px');

    // 建三個按鈕（點選僅切換作品，不再開新分頁）
    for (let i = 1; i <= 3; i++) {
        let btn = createButton('作品' + i);
        btn.parent(menuDiv);
        btn.style('display', 'block');
        btn.style('width', '100%');
        btn.style('margin', '6px 0');
        btn.style('padding', '6px 8px');
        btn.style('text-align', 'left');
        btn.style('background', i === currentArtwork ? '#e9e9e9' : 'transparent');
        btn.style('border', 'none');
        btn.style('cursor', 'pointer');
        btn.mousePressed(((id) => {
            return () => {
                setArtwork(id);
            };
        })(i));
        menuButtons.push(btn);
    }

    // 初始隱藏選單，只有滑鼠靠左時才顯示
    menuDiv.style('display', 'none');

    // 建立 iframe（預設隱藏），寬度為視窗的 80%（使用 vw/vh）
    iframeEl = createElement('iframe');
    iframeEl.attribute('src', 'about:blank');
    iframeEl.style('position', 'fixed');
    iframeEl.style('left', '10vw');   // 保持置中（左右各10%）
    iframeEl.style('top', '10vh');
    iframeEl.style('width', '80vw');  // 寬度為全螢幕的 80%
    iframeEl.style('height', '80vh');
    iframeEl.style('border', '0');
    iframeEl.style('display', 'none');
    iframeEl.style('z-index', '9999'); // 在畫布之上，但 menuDiv z-index 較高
    iframeEl.style('background', '#ffffff');
}

function draw() {
    // 根據滑鼠 X 座標顯示或隱藏選單（靠左 100px 時顯示）
    // mouseX 初始為 0，若視窗外或未移動仍會正確處理
    if (mouseX <= 100) {
        menuDiv.style('display', 'block');
    } else {
        menuDiv.style('display', 'none');
    }

    // 使用依作品切換的背景色
    background(bgColors[(currentArtwork - 1) % bgColors.length]);
    for (let i of objs) {
        i.show();
        i.move();
    }

    if (frameCount % 95 == 0) {
        INIT();
    }
}

// 新增：顯示 / 隱藏 iframe 的輔助函式
function showIframeFor(id) {
    const url = iframeUrls[id];
    if (!url) return hideIframe();
    iframeEl.attribute('src', url);
    iframeEl.style('display', 'block');
}

function hideIframe() {
    if (iframeEl) {
        iframeEl.attribute('src', 'about:blank');
        iframeEl.style('display', 'none');
    }
}

// 新增：切換作品
function setArtwork(id) {
    if (currentArtwork === id) return;
    currentArtwork = id;

    // 更新按鈕樣式（標示選取）
    for (let i = 0; i < menuButtons.length; i++) {
        menuButtons[i].style('background', (i + 1) === id ? '#e9e9e9' : 'transparent');
    }

    // 可根據不同作品調整參數或色盤
    if (currentArtwork === 1) {
        colors = ['#52489c', '#4062bb', '#59c3c3', '#ebebeb', '#f45b69', '#454545'];
    } else if (currentArtwork === 2) {
        colors = ['#2b2d42', '#8d99ae', '#edf2f4', '#ef233c', '#ffb4a2', '#2a9d8f'];
    } else if (currentArtwork === 3) {
        colors = ['#0b3c5d', '#1e576a', '#3aa0a8', '#f6f7f8', '#ffd166', '#f25f5c'];
    }

    // 若選作品一或作品二，顯示對應 iframe；否則隱藏 iframe 並回到 canvas 顯示
    if (id === 1 || id === 2) {
        showIframeFor(id);
    } else {
        hideIframe();
    }

    INIT();
}

function INIT() {
    objs = [];
    let num1 = int(random(3, 7));
    let num2 = int(random(40, 80));
    for (let i = 0; i < num1; i++) {
        objs.push(new OMP());
    }

    for (let i = 0; i < num2; i++) {
        objs.push(new SBM(i / 8));
    }
}

function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

function easeInQuart(x) {
    return x * x * x * x;
}

class SBM {
    constructor(t) {
        this.x0 = 0;
        this.y0 = 0;
        this.r = random(0.4) * width;
        let a = random(10);
        this.x1 = this.r * cos(a);
        this.y1 = this.r * sin(a);
        this.x = this.x0;
        this.y = this.y0;
        this.d0 = 0;
        this.d1 = random(5, 40);
        this.d = 0;
        this.t = -int(t);
        this.t1 = 40;
        this.t2 = this.t1 + 0;
        this.t3 = this.t2 + 40;
        this.rot1 = PI * random(0.5);
        this.rot = random(10);
        this.col = random(colors);
        this.rnd = int(random(3));
    }

    show() {
        push();
        translate(width / 2, height / 2);
        rotate(this.rot);
        if (this.rnd == 0) {
            fill(this.col);
            strokeWeight(0);
            circle(this.x, this.y, this.d);
        } else if (this.rnd == 1) {
            fill(this.col);
            strokeWeight(0);
            rect(this.x, this.y, this.d, this.d);
        }
        else if (this.rnd == 2) {
            noFill();
            stroke(this.col);
            strokeWeight(this.d * 0.3);
            line(this.x - this.d *0.45, this.y - this.d *0.45, this.x + this.d *0.45, this.y + this.d *0.45);
            line(this.x - this.d *0.45, this.y + this.d *0.45, this.x + this.d *0.45, this.y - this.d *0.45);
        }
        pop();
    }

    move() {
        if (0 < this.t && this.t < this.t1) {
            let n = norm(this.t, 0, this.t1 - 1);
            this.x = lerp(this.x0, this.x1, easeOutQuart(n));
            this.y = lerp(this.y0, this.y1, easeOutQuart(n));
            this.d = lerp(this.d0, this.d1, easeOutQuart(n));

        } else if (this.t2 < this.t && this.t < this.t3) {
            let n = norm(this.t, this.t2, this.t3 - 1);
            this.x = lerp(this.x1, this.x0, easeInQuart(n));
            this.y = lerp(this.y1, this.y0, easeInQuart(n));
            this.d = lerp(this.d1, this.d0, easeInQuart(n));
        }
        this.t++;
        this.rot += 0.005;
    }
}

class OMP {
    constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.d = 0;
        this.d1 = width * random(0.1, 0.9) * random();

        this.t = -int(random(20));
        this.t1 = 40;
        this.t2 = this.t1 + 40;
        this.sw = 0;
        this.sw1 = this.d1 * random(0.05);
        this.col = random(colors);
    }

    show() {
        noFill();
        stroke(this.col);
        strokeWeight(this.sw);
        circle(this.x, this.y, this.d);
    }

    move() {
        if (0 < this.t && this.t < this.t1) {
            let n = norm(this.t, 0, this.t1 - 1);
            this.d = lerp(0, this.d1, easeOutQuart(n));
            this.sw = lerp(0, this.sw1, easeOutQuart(n));
        } else if (this.t1 < this.t && this.t < this.t2) {
            let n = norm(this.t, this.t1, this.t2 - 1);
            this.d = lerp(this.d1, 0, easeInQuart(n));
            this.sw = lerp(this.sw1, 0, easeInQuart(n));
        }
        this.t++;
    }
}

// 新增：視窗大小改變時調整畫布並重置物件（保持圖像置中）
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    INIT();
}