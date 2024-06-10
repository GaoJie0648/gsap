import { gsap } from "gsap"; // 引入 gsap

// ================================
// 由於"SplitText"為付費插件(Plugin)無法使用
// 所以將所有有關SplitText的部分
// 全部拿掉了
// ================================
// gsap備忘錄: https://gsap.com/community/cheatsheet/

// document.querySelectorAll = 元素選擇器
// ================================
// 說明: 獲取頁面上的元素
// 用法: document.querySelectorAll(<element、class、ID>)
// 舉例: 今天有一個標籤 <span class="a" id="b">Hello World!</span>
//       | element = span | class = a | id = b |
//       用element抓 = document.querySelectorAll("span")
//       用class抓   = document.querySelectorAll(".a")
//       用ID抓      = document.querySelectorAll("#b")
// 備註: document.querySelectorAll 所獲取的資料會以NodeList的一種數據結構儲存，雖然類似陣列但有些區別
// ================================
const sections = document.querySelectorAll("section");
const images = document.querySelectorAll(".bg");
// const headings = gsap.utils.toArray(".section-heading"); 付費插件相關
const outerWrappers = gsap.utils.toArray(".outer"); // gsap.utils.toArray 將獲取的元素以陣列(array)型態來儲存
const innerWrappers = gsap.utils.toArray(".inner");

// 在網頁上按F12的主控台那邊看到NodeList跟Array的區別
console.log("NodeList與Array的區別\n\n","NodeList:",sections,images,'\n\n',"Array:",'\n',outerWrappers,"\n",innerWrappers);

// document.addEventListener = 監聽事件
// ================================
// 說明: 監聽頁面上的動作，例如 滾動、點擊、......
// 用法: document.addEventListener(<動作>,<函數(當事件發生時要做的事)>)
// 舉例: document.addEventListener("wheel", handleWheel);
//       function handleWheel(event){
//       ...
//       }
// 備註1: 網頁有很多事件，有興趣可以至Mozilla查看 https://developer.mozilla.org/zh-TW/docs/Web/Events
// 備註2: 函數都是自己定的，作者將用到的函數寫在該檔案的底部
// ================================
document.addEventListener("wheel", handleWheel);

// 創建變數
// ================================
// listening = 目前是否要監聽事件 (這是用來阻止網頁在滾動時還未完成動畫就繼續偵測下一次的事件)
// direction = 方向，網頁往哪個方向滾動
// current = 目前的畫面
// next = 下一個畫面
// tlDefaults = 動畫時間軸的設定
// tlDefaults.ease = 動畫移動方式 (更多移動方式請至官網查詢: https://gsap.com/docs/v3/Eases/)
// tlDefaults.duration = 動畫時間
// 備註1: let 為可變變數，const 為常量變數 (使用時就聲明了值，不可變)
// 備註2: 上面的tl是timeline的簡寫，所以tlDefaults = timelineDefaults
// ================================
let listening = false,
  direction = "down",
  current,
  next = 0;

const tlDefaults = {
  ease: "slow.inOut",
  duration: 1.25
};

// gsap.set = 給予元素CSS樣式
// ================================
// 說明: 在使用後直接賦予CSS的樣式
// 用法: gsap.set(<element、class、ID、array>,<CSS樣式(object)>)
// 舉例: 今天有一個標籤 <span class="a" id="b">Hello World!</span>
//       gsap.set(".a", { x: 100, y: 50, opacity: 0 });
// 備註: 可以設定的樣式有很多，但我找不到全部可以設定的樣式表QQ
// ================================
// 下面兩行是為了在畫面第一次滑動時能夠順利滑動不會卡
gsap.set(outerWrappers, { yPercent: 100 }); // yPercent: 100 = translate(0%, 100%)，y座標移動到畫面之下
gsap.set(innerWrappers, { yPercent: -100 }); // yPercent: -100 = translate(0%, -100%)，y座標移動到畫面之上

// 往下滑動動畫
function slideIn() {
  // 備註: zIndex 是用來排序疊在一起的元素的順序，zIndex越高越前面，詳細的用法: https://developer.mozilla.org/zh-CN/docs/Web/CSS/z-index
  // 第一次滑動時因為current未設值，所以不會觸發下面這一行
  if (current !== undefined) gsap.set(sections[current], { zIndex: 0 }); // 將目前的畫面的顯示順序降低

  gsap.set(sections[next], { autoAlpha: 1, zIndex: 1 }); // 將下一個滑動進來的畫面的alpha值(透明度) 0 = 完全透明, 1 = 不透明
  gsap.set(images[next], { yPercent: 0 }); // 從下移動上來

  // gsap.timeline = 動畫過渡時的設定
  // gsap.to = 將指定元素進行對應的動畫
  // gsap.from = 將指定元素設定動畫之前的狀態
  // ================================
  // 說明: 可以把動畫移動順序分為三個階段 timeline -> from -> to 
  //       timeline: 設定動畫移動時的細節設定，例如動畫過渡所需時間、過渡完之後要做的事情(onComplete)
  // 
  //       from:     在動畫開始之前將目標先設置好起始的狀態，舉個例子，
  //                 假設目標座標目前在 x=-100 而我們是要將目標的座標從 x=0 移動到 x=100
  //                 就要先設置讓目標回到 x=0，否則你會看到目標從 x=-100 飛奔過去 x=100
  // 
  //       to:       設定目標過渡完後的狀態
  // 
  // 用法: 
  //       gsap.timeline: https://gsap.com/docs/v3/GSAP/gsap.timeline()/
  //       gsap.to:       https://gsap.com/docs/v3/GSAP/gsap.to()/
  //       gsap.from:     https://gsap.com/docs/v3/GSAP/gsap.from()/
  // 
  // 補充1: 如果看不懂可以先看一下css的animation與transform
  //       CSS Animation: https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation
  //       CSS Transform: https://developer.mozilla.org/zh-TW/docs/Web/CSS/transform
  // 
  // 補充2: 相關的屬性列表
  //       timeline: https://gsap.com/docs/v3/GSAP/Timeline/#special-properties-and-callbacks
  //       to:       https://gsap.com/docs/v3/GSAP/gsap.to()/#special-properties
  //       from:     https://gsap.com/docs/v3/GSAP/gsap.from()/#special-properties
  // ================================
  const tl = gsap
    .timeline({
      paused: true,
      defaults: tlDefaults,
      onComplete: () => { // 過渡完後的動作
        listening = true; // 繼續監聽滾動事件
        current = next; // 更新目前的畫面是哪個
      }
    })
    .to([outerWrappers[next], innerWrappers[next]], { yPercent: 0 }, 0) // 將畫面的y軸移動到0px，所以原本yPercent: 100的畫面會從下面往上移動
    .from(images[next], { yPercent: 15 }, 0) // 讓圖片看起來也有移動

  // 如果不是第一次載入畫面的話 加入更多選項
  if (current !== undefined) {
    // add 用法: https://gsap.com/docs/v3/GSAP/Timeline/add()/
    tl.add(
      gsap.to(images[current], {
        yPercent: -15, // 讓上一個畫面的圖片有上滑的效果
        ...tlDefaults // 將時間軸內的設定拿來使用
      }),
      0
    ).add(
      gsap
        .timeline() // 使用官放預設的時間軸設定
        .set(outerWrappers[current], { yPercent: 100 }) // 目前畫面的最外層往下移動
        .set(innerWrappers[current], { yPercent: -100 }) // 目前畫面的最外層往上移動
        .set(images[current], { yPercent: 0 }) // 目前圖片移動到畫面上
        .set(sections[current], { autoAlpha: 0 }) // 將目前的畫面隱藏
    );
  }

  tl.play(0); // 播放動畫
}

// 向上滑動動畫
// 這裡跟向下滑動一樣，只是有些數值的調整和不需要處理第一次載入時的動畫
function slideOut() {
  gsap.set(sections[current], { zIndex: 1 });
  gsap.set(sections[next], { autoAlpha: 1, zIndex: 0 });
  gsap.set([outerWrappers[next], innerWrappers[next]], { yPercent: 0 });
  gsap.set(images[next], { yPercent: 0 });

  gsap
    .timeline({
      defaults: tlDefaults,
      onComplete: () => {
        listening = true;
        current = next;
      }
    })
    .to(outerWrappers[current], { yPercent: 100 }, 0)
    .to(innerWrappers[current], { yPercent: -100 }, 0)
    .to(images[current], { yPercent: 15 }, 0)
    .from(images[next], { yPercent: -15 }, 0)
    .set(images[current], { yPercent: 0 });
}

// 處理滑動方向
function handleDirection() {
  listening = false; // 停止監聽事件

  // 向下滾動，如果到最後一個畫面繼續往下會以第一個開始顯示
  if (direction === "down") {
    next = current + 1;
    if (next >= sections.length) next = 0;
    slideIn(); 
  }

  // 向上滾動，如果到第一個畫面繼續往上會以最後個來顯示
  if (direction === "up") {
    next = current - 1;
    if (next < 0) next = sections.length - 1;
    slideOut(); // 處理滑動方向
  }
}

// 處理滾動事件
function handleWheel(e) {
  if (!listening) return;
  direction = e.wheelDeltaY < 0 ? "down" : "up"; // e.wheelDeltaY = 往哪個方向滾動
  handleDirection();
}

slideIn(); // 當畫面載入時滑動至第一個畫面
