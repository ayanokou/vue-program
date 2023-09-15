const { BrowserWindow, app } = require('electron')
const path = require('path')

//创建并控制浏览器窗口
const createWindow = () => {
  const win = new BrowserWindow({ //窗口参数设置
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), //预加载
    },
    frame:true
  });
  win.loadFile("./dist/index.html");
};

app.whenReady().then(() => {
  createWindow();
  

});
