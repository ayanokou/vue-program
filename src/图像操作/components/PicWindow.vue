<template>
  <div>
    <div class="head-btn-box">
      <el-button title="放大" id="toBig" icon="zoom-in" @click="zoomIn"></el-button>
      <el-button title="缩小" id="toSmall" icon="zoom-out" @click="zoomOut"></el-button>
      <el-button title="复原图像" id="toReset" icon="RefreshLeft"></el-button>
      <el-button title="全屏预览图像" id="onPreview" icon="FullScreen"></el-button>
      <el-button title="绘制点" id="drawDot" @click="drawDotByMouse">绘制点</el-button>
      <el-button title="绘制直线" id="drawLine" @click="drawLineByMouse">绘制直线</el-button>
      <el-button title="绘制矩形" id="drawRect" @click="drawRectByMouse">绘制矩形</el-button>
      <el-button title="绘制圆" id="drawCircle" @click="drawCircleByMouse">绘制圆</el-button>
      <el-button title="绘制槽" id="drawSlot" @click="drawSlotByMouse">绘制槽</el-button>
      <el-button title="绘制椭圆" id="drawEllipse" @click="drawEllipseByMouse">绘制椭圆</el-button>
      <el-button title="绘制同心圆" id="drawConcentricCircles" @click="drawConcentricCirclesByMouse">绘制同心圆</el-button>
      <el-button title="图像拖拽" id="imageDrag" @click="imageDragByMouse">图像拖拽</el-button>
      <el-button title="清空绘制的图形" id="clear" @click="clearCanvas">清空绘制的图形</el-button>
      <el-button title="Roi" id="Roi" @click="openDialog">交互</el-button>
      <el-button title="drawMaskRegion" id="drawMaskRegion" @click="drawMaskRegionByMouse">屏蔽区绘制</el-button>
      <el-button title="drawRoiRct" id="drawRoiRct" @click="drawRoiRctByMouse">绘制互动矩形</el-button>
      <el-dialog v-model="dialogVisible" title="ROI设置">
        <el-form label-width="80px">
          <el-form-item label="选择项">
            <el-radio-group v-model="dialogParams.selectOption">
              <el-radio label="0">矩形</el-radio>
              <el-radio label="1">圆形</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="参数1">
            <el-input v-model="dialogParams.param1"></el-input>
          </el-form-item>
          <el-form-item label="参数2">
            <el-input v-model="dialogParams.param2"></el-input>
          </el-form-item>
          <el-form-item label="参数3">
            <el-input v-model="dialogParams.param3"></el-input>
          </el-form-item>
          <el-form-item label="参数4">
            <el-input v-model="dialogParams.param4"></el-input>
          </el-form-item>
          <!-- 其他参数的表单项 -->
        </el-form>
        <div slot="footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="confirmDialog">确定</el-button>
        </div>
      </el-dialog>

    </div>
    <canvas id="cvs" width="1024" height="768" style="border:1px solid #ccc;margin:20px auto;display: block;">
      当前浏览器不支持canvas
      <!-- 如果浏览器支持canvas，则canvas标签里的内容不会显示出来 -->
    </canvas>
    <div id="statusBar" style="position: fixed;bottom: 10px;right: 10px;background-color: #333333;color: white;
    padding: 10px;"></div>


  </div>
</template>

<!--<script src="../js/picWindow.js">-->

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      canvas: null,
      ctx: null,
      statusBar: null,
      isDrawFromSrv: false,
      isDrawFromMse: false,
      mouseStartX: 0,
      mouseStartY: 0,
      mouseEndX: 0,
      mouseEndY: 0,
      mouseDrawType: null,
      scale: 1,
      drawingArray: [],
      mouseDownPoint: [],
      // img: null,
      image: {
        picture: null,
        imageX: 0,
        imageY: 0,
        imageWidth: 0,
        imageHeight: 0,
      },
      doubleClickPoints: [],
      mouseClickTime: 0,
      concentricCircleMiddleInfo: [],
      isDrawingConCircle: false,
      dialogVisible: false,
      dialogParams: {
        selectOption: '',
        param1: '',
        param2: '',
        param3: '',
        param4: '',
      },
      maskRegionPoints: [],
      isDrawMaskRegion: false,
      roiRecPoints: [],
      roiRecOuterPoints: [],
      roiRecInnerPoints: [],
      isHaveRoiRec: false,
      changeRoiRect: false,
      isInRoiRec: false,
      distThreshold: 7,
      isDragRoiRecEdge: false,
      isDragRoiRecPoint: false,
      changeRoiRectCode: 0,
      imgBase64: ''



    }
  },
  computed: {
    ...mapState(['currentNode', 'runResults', 'showImg'])
  },
  watch: {
    showImg(newVal) {
      if (newVal) {
        //find img
        let tab_result = this.runResults.find(item => item.tab_index === this.currentNode.tabIndex)
        if (!tab_result) {
          this.imgBase64 = ''
          console.log('tab_result is null')
          return
        }
        let node_result = tab_result.results.find(item => item.id === this.currentNode.nodeId)
        if (!node_result) {
          this.imgBase64 = ''
          console.log('node_result is null')
          return
        }

        let results = node_result.outResults

        if (!results) {
          this.imgBase64 = ''
          return
        }

        const ans = results.filter(item => item.type === "Mat")
        if (typeof ans === 'object') {
          this.imgBase64 = ans[0].content

        } else {
          this.imgBase64 = ''
          return
        }
        //close
        this.$store.commit('showImgEvent', false)
      }
    },
    imgBase64(newVal) {

      //canvas标签插入图片
      //创建image对象
      this.image.picture = new Image();
      this.image.picture.src = newVal;

      let startX = 100, startY = 100, endX = 200, endY = 200;

      //检查是否在图片上绘图
      let isDrawing = false;
      let drawType = 4;

      //待图片加载完后，将其显示在canvas上
      this.image.picture.onload = () => {

        //将图像的长和宽保存起来
        this.image.imageWidth = this.image.picture.width;
        this.image.imageHeight = this.image.picture.height;

        this.showImage(this.image.picture, 0, 0);

        if (isDrawing) {
          this.switchDrawCase(drawType, startX, startY, endX, endY);


        }
      }
    },
  },

  mounted() {
    //初始化画布
    this.initCanvas();
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("contextmenu", this.handleContextMenu);
  },

  methods: {
    //初始化画布
    initCanvas() {
      this.canvas = document.getElementById("cvs");
      this.ctx = this.canvas.getContext("2d");
      // this.ctx.globalAlpha = 0.5;
      // const pattern = this.ctx.createPattern(gridPatternImage, 'repeat');
      // this.canvas.style.backgroundColor = 'transparent';
      // 绘制透明方格背景
      const gridSize = 40; // 方格大小
      const rows = this.canvas.height / gridSize;
      const cols = this.canvas.width / gridSize;
      // 交替填充透明方格
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if ((i + j) % 2 === 0) {
            // 偶数行偶数列或奇数行奇数列填充颜色
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // 设置填充颜色，透明度为 0.2
          } else {
            // 奇数行偶数列或偶数行奇数列填充颜色
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // 设置填充颜色，透明度为 0.1
          }
          this.ctx.fillRect(j * gridSize, i * gridSize, gridSize, gridSize); // 绘制矩形
        }
      }
      //初始化状态条
      this.statusBar = document.getElementById("statusBar");

    },

    //显示图片
    showImage(img, X, Y) {
      if (this.ctx === "") {
        alert("ctx is null")
      } else {
        this.ctx.drawImage(img, X, Y);
      }

      let pointFromServer = [[0, 100, 100, 200, 200]];
      // pointFromServer.forEach((point) => {
      //   // alert(point);
      //   let drawTypeFromSrv = point[0];
      //   let startX = point[1];
      //   let startY = point[2];
      //   let endX = point[3];
      //   let endY = point[4];
      //
      //   if (drawTypeFromSrv == 0) {
      //     // 绘制矩形
      //     this.drawRect(startX, startY, endX, endY);
      //
      //
      //   } else if (drawTypeFromSrv == 1) {
      //     this.drawCircle(startX, startY, endX, endY);
      //   }
      //
      //
      // })

    },

    //画矩形 -0
    drawRect(startX, startY, endX, endY) {


      this.ctx.beginPath();
      this.ctx.rect(startX, startY, endX - startX, endY - startY);
      this.ctx.stroke();
    },
    //画圆 -1
    drawCircle(startX, startY, endX, endY) {


      //ctx.clearRect(0,0,cvs.width,cvs.height);
      this.ctx.beginPath();
      let radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      this.ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      this.ctx.strokeStyle = 'red';
      this.ctx.stroke();
      this.ctx.strokeStyle = 'black';
    },
    //画点 -2
    drawDot(startX, startY, endX, endY) {


      this.ctx.beginPath();
      this.ctx.arc(startX, startY, 1, 0, 2 * Math.PI);
      this.ctx.fillStyle = "blue";
      this.ctx.fill();
      this.ctx.stroke();
    },
    //画直线 -3
    drawLine(startX, startY, endX, endY) {


      //ctx.clearRect(0,0,cvs.width,cvs.height);
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
    },
    //画槽 -4
    drawSlot(startX, startY, endX, endY) {


      //先画一条直线
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, startY);
      this.ctx.stroke();

      //再画一条直线
      this.ctx.beginPath();
      this.ctx.moveTo(startX, endY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();


      let radiusLeftX = startX;
      let radiusLeftY = (startY + endY) / 2;
      let radiusRightX = endX;
      let radiusRightY = (startY + endY) / 2;
      let radius = Math.sqrt(Math.pow(endY - startY, 2)) / 2;

      //画左半圆
      this.ctx.beginPath();
      this.ctx.arc(radiusLeftX, radiusLeftY, radius, Math.PI / 2, 3 * Math.PI / 2);
      this.ctx.stroke();
      //画右上半圆
      this.ctx.beginPath();
      this.ctx.arc(radiusRightX, radiusRightY, radius, 0, Math.PI / 2);
      this.ctx.stroke();
      //画右下半圆
      this.ctx.beginPath();
      this.ctx.arc(radiusRightX, radiusRightY, radius, Math.PI * 3 / 2, 2 * Math.PI);
      this.ctx.stroke();
    },
    //画椭圆 -5
    drawEllipse(startX, startY, endX, endY) {

      var axisx = Math.abs((endX - startX) / 2);  //半轴是自然数，所以加了绝对值
      var axisy = Math.abs((endY - startY) / 2);
      var centerx = axisx + Math.min(startX, endX);
      var centery = axisy + Math.min(startY, endY);


      this.ctx.beginPath();  //开始绘制
      this.ctx.lineWidth = 2; // 可以设置椭圆线的宽度
      this.ctx.ellipse(centerx, centery, axisx, axisy, 0, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.ctx.lineWidth = 1; // 可以设置椭圆线的宽度
    },
    //画同心圆 -6
    drawConcentricCircles(startX, startY, endX, endY) {

      //230608添加绘制已存在图形的代码，实现了动态显示
      this.drawLastElements();

      let centerX = this.concentricCircleMiddleInfo[0];
      let centerY = this.concentricCircleMiddleInfo[1];
      let radius = this.concentricCircleMiddleInfo[2];

      let d = Math.abs(Math.sqrt(Math.pow(endX - centerX, 2) + Math.pow(endY - centerY, 2)) - radius);

      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius - d, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius + d, 0, 2 * Math.PI);
      this.ctx.stroke();

      // this.mouseClickTime = 0;
      // this.doubleClickPoints.length = 0;


      //第一次点击，绘制圆形

      //获取圆心和半径
    },
    //图像拖拽 -7
    imageDrag(startX, startY, endX, endY) {

      //this.drawLastElements();

      var dx = endX - startX;
      var dy = endY - startY;
      console.log(startX, startY, endX, endY, dx, dy);

      this.image.imageX = dx;
      if (this.image.imageX > 256) {
        this.image.imageX = 256;
      }
      this.image.imageY = dy;
      if (this.image.imageY > 256) {
        this.image.imageY = 256;
      }

      this.showImage(this.image.picture, this.image.imageX, this.image.imageY);
    },

    //画动态双直线
    drawDoubleLine(startX, startY, endX, endY) {

      //绘制第一个点，最后一点与现在鼠标位置的直线
      const lastIndex = this.maskRegionPoints.length - 1;
      const secondLastIndex = lastIndex - 1;


      //获取首尾点
      const firstPointX = this.maskRegionPoints[0];
      const firstPointY = this.maskRegionPoints[1];
      const lastPointX = this.maskRegionPoints[secondLastIndex];
      const lastPointY = this.maskRegionPoints[lastIndex];

      //绘制直线
      this.ctx.beginPath();
      this.ctx.moveTo(firstPointX, firstPointY);
      this.ctx.lineTo(startX, startY);
      this.ctx.lineTo(lastPointX, lastPointY);
      this.ctx.stroke();
    },

    //绘制动态矩形-9
    drawRoiRec(startX, startY, endX, endY, color) {
      //线绘制一个普通矩形
      this.ctx.beginPath();
      this.ctx.rect(startX, startY, endX - startX, endY - startY);
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
      this.ctx.strokeStyle = 'black';

      // this.isHaveRoiRec = true;

      //将矩形的数据按照顺时针保存起来
      // this.roiRecPoints.length = 0;
      // console.log(startX);
      // console.log(endX);
      // this.roiRecPoints.push(startX);
      // this.roiRecPoints.push(startY);
      // this.roiRecPoints.push(endX);
      // this.roiRecPoints.push(endY);
      //判断鼠标是否悬停在互动矩形上(在鼠标移动事件中监听)
      //如果鼠标悬停矩形内周，点击后可直接移动，鼠标形状改变
      //判断鼠标是否在四个角点上
      //判断鼠标是否在边上
      //判断鼠标是否在旋转圆上
    },


    calculateCircle() {
      // 解构出三个点的坐标
      const [x1, y1, x2, y2, x3, y3] = this.doubleClickPoints;

      // 计算中垂线的斜率
      // const slope1 = (y2 - y1) / (x2 - x1);
      // const slope2 = (y3 - y2) / (x3 - x2);
      const slope1 = -(x2 - x1) / (y2 - y1);
      const slope2 = -(x3 - x2) / (y3 - y2);

      // 计算中点坐标
      const midX1 = (x1 + x2) / 2;
      const midY1 = (y1 + y2) / 2;
      const midX2 = (x2 + x3) / 2;
      const midY2 = (y2 + y3) / 2;

      // 计算圆心坐标
      const centerX = (slope1 * midX1 - slope2 * midX2 + midY2 - midY1) / (slope1 - slope2);
      const centerY = slope1 * (centerX - midX1) + midY1;

      // 计算半径
      const radius = Math.sqrt(Math.pow(centerX - x1, 2) + Math.pow(centerY - y1, 2));

      // 返回圆心坐标和半径
      return [
        centerX,
        centerY,
        radius
      ];
    },


    //
    handleMouseDown(event) {

      this.isDrawFromMse = true;
      const canvasRect = this.canvas.getBoundingClientRect();
      this.mouseStartX = event.clientX - canvasRect.left;
      this.mouseStartY = event.clientY - canvasRect.top;

      //如果是画同心圆
      if (this.mouseDrawType === 6) {

        this.isDrawFromMse = false;
        this.mouseClickTime += 1;
        //将本次点击的点存入
        this.doubleClickPoints.push(this.mouseStartX);
        this.doubleClickPoints.push(this.mouseStartY);
        this.drawDot(this.mouseStartX, this.mouseStartY, 0, 0);

        //如果是第三次点击，则画圆
        if (this.mouseClickTime === 3) {

          //将中间圆数据存入结构
          this.calculateCircle().forEach((x) => {
            this.concentricCircleMiddleInfo.push(x);

          });
          // alert(this.concentricCircleMiddleInfo);

          this.ctx.beginPath();
          this.ctx.arc(this.concentricCircleMiddleInfo[0], this.concentricCircleMiddleInfo[1], this.concentricCircleMiddleInfo[2], 0, 2 * Math.PI);
          this.ctx.stroke();

          this.isDrawingConCircle = true;


        }
        //第四次点击，终止画圆
        if (this.mouseClickTime > 3) {
          this.isDrawingConCircle = false;


          this.drawConcentricCircles(0, 0, this.mouseStartX, this.mouseStartY);
          this.doubleClickPoints.length = 0;
          this.concentricCircleMiddleInfo.length = 0;
          this.mouseClickTime = 0;
        }


      }


      //如果画屏蔽区
      if (event.button === 2) {
        //点击右键则结束绘制屏蔽区
        this.isDrawMaskRegion = false;

      }
      if (this.mouseDrawType === 8) {
        //如果是绘制屏蔽区，则将每一次的鼠标点击坐标存入maskRegionPoints
        if (this.isDrawMaskRegion) {
          this.maskRegionPoints.push(this.mouseStartX);
          this.maskRegionPoints.push(this.mouseStartY);
          this.drawDot(this.mouseStartX, this.mouseStartY, 0, 0);
        }

      }

      //如果是拖拽互动矩形
      if (this.isInRoiRec) {

        //先中断绘制
        this.isHaveRoiRec = false;
        this.isInRoiRec = false;
        this.changeRoiRect = true;
        //最开始拖动的时候没有显示矩形的原因是没有加this.isDrawFromMse = false;
        // 导致鼠标移动的时候又清空了
        this.isDrawFromMse = false;

      }


    },
    //
    handleMouseUp() {
      this.isDrawFromMse = false;
      if (this.mouseDrawType !== 7 && this.mouseDrawType !== 9 && this.mouseDrawType !== -1) {
        this.saveNewElement2Array(this.mouseDrawType, this.mouseStartX, this.mouseStartY, this.mouseEndX, this.mouseEndY);
      }

      if (this.mouseDrawType === 9) {

        //首次绘制互动矩形完成
        this.isHaveRoiRec = true;
        this.isInRoiRec = false;
        this.changeRoiRect = false;


        this.mouseDrawType = -1;
        //将矩形的数据按照顺时针保存起来

        this.updateRecPoints(this.mouseStartX, this.mouseStartY, this.mouseEndX, this.mouseEndY);

      }


      if (this.changeRoiRect) {

        this.changeRoiRect = false;
        this.isInRoiRec = false;


        // let dx = this.mouseEndX - this.mouseStartX;
        // let dy = this.mouseEndY - this.mouseStartY;
        // //更新互动矩形的点的坐标
        //
        // this.updateRecPoints(this.roiRecPoints[0]+dx,this.roiRecPoints[1] + dy,this.roiRecPoints[2] + dx,this.roiRecPoints[3] + dy);

        //  更新点
        this.switchUpdateRoiRectPoints();

        this.drawRoiRec(this.roiRecPoints[0], this.roiRecPoints[1], this.roiRecPoints[2], this.roiRecPoints[3], 'red');

        this.changeRoiRectCode = 0;
        this.isHaveRoiRec = true;
      }


    },
    //
    handleMouseMove(event) {

      //获取相对于图片的坐标
      const canvasRect = this.canvas.getBoundingClientRect();

      let mouseX = event.clientX - canvasRect.left;
      this.mouseEndX = mouseX;
      let mouseY = event.clientY - canvasRect.top
      this.mouseEndY = mouseY;

      //显示像素信息
      this.showPixelInfo();


      if (this.isDrawingConCircle) {
        this.drawConcentricCircles(0, 0, this.mouseEndX, this.mouseEndY);
      }
      //绘制屏蔽区
      if (this.isDrawMaskRegion) {
        //显示已有图形
        this.drawLastElements();

        //绘制屏蔽区前几条边
        const pointLength = this.maskRegionPoints.length;
        this.ctx.beginPath();
        this.ctx.moveTo(this.maskRegionPoints[0], this.maskRegionPoints[1]);
        for (let i = 2; i < pointLength; i += 2) {
          this.ctx.lineTo(this.maskRegionPoints[i], this.maskRegionPoints[i + 1]);
        }
        this.ctx.stroke();

        this.drawDoubleLine(mouseX, mouseY);

      }

      //互动矩形的代码
      if (this.changeRoiRect) {
        // this.dragRoiRec();
        this.changeRect();
      }

      //根据鼠标与互动矩形的位置关系执行相应函数
      if (this.isHaveRoiRec) {
        this.getMouseRegion();
      }


      if (this.isDrawFromMse) {

        this.drawLastElements();

        this.switchDrawCase(this.mouseDrawType, this.mouseStartX, this.mouseStartY, this.mouseEndX, this.mouseEndY);


      }

    },
    //添加鼠标右键事件
    handleContextMenu(event) {

      // 移除之前的选择框
      const existingMenu = document.querySelector('.contextmenu');
      if (existingMenu) {
        existingMenu.remove();
      }


      //阻止默认右键菜单行为
      event.preventDefault();



      const menu = document.createElement('div');
      menu.className = 'context-menu';
      menu.innerHTML = `
      <ul  class="contextmenu">
      <li id="download-image"><a>下载原始图</a></li>
      <li id="download-rendered-image"><a>下载渲染图</a></li>
      </ul>
      `;

      //设置选择框的固定宽度
      menu.style.position = 'fixed';
      menu.style.width = '120px';
      menu.style.left = `${event.clientX}px`;
      menu.style.top = `${event.clientY}px`;
      menu.style.background = 'white';
      menu.style.border = '1px solid black';

      document.body.appendChild(menu);

      //监听菜单选项的点击事件
      const downloadImageOption = menu.querySelector('#download-image');
      const downloadRenderedImageOption = menu.querySelector('#download-rendered-image');

      downloadImageOption.addEventListener("click", this.downloadImage);
      downloadImageOption.addEventListener("mouseenter", this.handleOptionMouseEnter);
      downloadImageOption.addEventListener("mouseleave", this.handleOptionMouseLeave);


      downloadRenderedImageOption.addEventListener("click", this.downloadRenderedImage);
      downloadRenderedImageOption.addEventListener("mouseenter", this.handleOptionMouseEnter);
      downloadRenderedImageOption.addEventListener("mouseleave", this.handleOptionMouseLeave);

      //监听其他区域点击后关闭右键菜单
      document.addEventListener('click', this.closeContextMenu);
    },


    //互动事件
    drawRectByMouse() {
      this.mouseDrawType = 0;
    },
    drawCircleByMouse() {
      this.mouseDrawType = 1;
    },
    drawDotByMouse() {
      this.mouseDrawType = 2;
    },
    drawLineByMouse() {
      this.mouseDrawType = 3;
    },
    drawSlotByMouse() {
      this.mouseDrawType = 4;
    },
    drawEllipseByMouse() {
      this.mouseDrawType = 5;
    },
    drawConcentricCirclesByMouse() {
      this.mouseDrawType = 6;
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.mouseDrawType = "";
      this.drawingArray.length = 0;

      //图片位置刷新
      this.image.imageX = 0;
      this.image.imageY = 0;

      this.drawLastElements();

      // this.doubleClickPoints.length = 0;
      // this.concentricCircleMiddleInfo.length = 0;
      // this.mouseClickTime = 0;

      //清除互动矩形存在
      this.isHaveRoiRec = false;
    },
    imageDragByMouse() {
      this.mouseDrawType = 7;
    },

    //绘制屏蔽区 -8
    drawMaskRegionByMouse() {
      this.mouseDrawType = 8;
      this.isDrawMaskRegion = true;
    },

    //绘制互动矩形-9
    drawRoiRctByMouse() {
      this.mouseDrawType = 9;
      this.roiRecPoints.length = 0;
    },


    openDialog() {
      this.dialogVisible = true;
    },
    //关闭窗口
    closeDialog() {
      this.dialogVisible = false;
      //清除相关数据
      this.dialogParams.selectOption = '';
      this.dialogParams.param1 = '';
      this.dialogParams.param2 = '';
      this.dialogParams.param3 = '';
      this.dialogParams.param4 = '';
    },
    confirmDialog() {
      //处理逻辑
      if (this.dialogParams.selectOption !== null) {
        let _drawType = parseInt(this.dialogParams.selectOption);
        let _startX = parseInt(this.dialogParams.param1);
        let _startY = parseInt(this.dialogParams.param2);
        let _endX = parseInt(this.dialogParams.param3);
        let _endY = parseInt(this.dialogParams.param4);
        this.switchDrawCase(_drawType, _startX, _startY, _endX, _endY);
      }


      this.dialogVisible = false;


      //this.closeDialog();
    },


    //绘制已经存在的图形
    drawLastElements() {
      //先清屏
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //显示图片
      // if (this.image.picture) {
      if (this.image.picture && this.mouseDrawType !== 7) {

        this.showImage(this.image.picture, this.image.imageX, this.image.imageY);
      }

      //绘制先前的图形
      if (this.drawingArray.length > 0) {
        this.drawingArray.forEach((points) => {

          var startX = points[1];
          var startY = points[2];
          var endX = points[3];
          var endY = points[4];
          //根据不同类型去绘画
          this.switchDrawCase(points[0], startX, startY, endX, endY);
        })
      }


    },
    //将新元素保存到数组中
    saveNewElement2Array(drawType, startX, startY, endX, endY) {
      var point = [drawType, startX, startY, endX, endY];
      this.drawingArray.push(point);
    },

    //选择绘制的形状
    switchDrawCase(drawType, startX, startY, endX, endY) {
      switch (drawType) {
        case 0:
          this.drawRect(startX, startY, endX, endY);
          break;
        case 1:
          this.drawCircle(startX, startY, endX, endY);
          break;
        case 2:
          this.drawDot(startX, startY, endX, endY);
          break;
        case 3:
          this.drawLine(startX, startY, endX, endY);
          break;
        case 4:
          this.drawSlot(startX, startY, endX, endY);
          break;
        case 5:
          this.drawEllipse(startX, startY, endX, endY);
          break;
        // case 6:
        //   // this.drawCircle(startX, startY, endX, endY);
        //   this.drawConcentricCircles(startX, startY, endX, endY);
        //   break;
        case 7:
          // this.drawCircle(startX, startY, endX, endY);
          this.imageDrag(startX, startY, endX, endY);
          break;
        case 9:
          // this.drawCircle(startX, startY, endX, endY);
          this.drawRoiRec(startX, startY, endX, endY, 'blue');
          break;
        default:
          break;

      }
    },

    //放大
    zoomIn() {
      this.scale += 0.25;
      if (this.scale > 1) {
        alert("无法继续放大");
        this.scale = 1;
      }
      this.canvas.style.transform = `scale(${this.scale})`;
    },
    zoomOut() {
      this.scale -= 0.25;
      this.canvas.style.transform = `scale(${this.scale})`;
    },

    //右上角显示图像信息
    showImageInfo() {
    },
    //右下角显示鼠标信息和像素信息
    showPixelInfo() {
      if (this.image.picture !== null) {

        //获取指定线束的像素值
        const x = this.mouseEndX - this.image.imageX;
        const y = this.mouseEndY - this.image.imageY;
        const imageData = this.ctx.getImageData(x, y, 1, 1);
        const pixelData = imageData.data;

        //更新statusBar的显示
        this.statusBar.textContent = `${this.mouseEndX}px ${this.mouseEndY}px R:${pixelData[0]} G:${pixelData[1]} B:${pixelData[2]}`;
      } else {
        //更新statusBar的显示
        this.statusBar.textContent = `${this.mouseEndX}px ${this.mouseEndY}px`;
      }


    },


    //判断鼠标与互动矩形的相对位置,然后执行响应代码
    getMouseRegion() {
      const [outerS1, outerS2, outerE1, outerE2] = this.roiRecOuterPoints;
      const [middleS1, middleS2, middleE1, middleE2] = this.roiRecPoints;
      const [innerS1, innerS2, innerE1, innerE2] = this.roiRecInnerPoints;

      if (this.mouseEndX >= outerS1 && this.mouseEndX <= outerE1) {
        if (this.mouseEndY >= outerS2 && this.mouseEndY <= outerE2) {
          //公共状态
          this.drawLastElements();
          this.drawRoiRec(middleS1, middleS2, middleE1, middleE2, 'red');
          this.drawRoiRectReactRegion();
          this.isInRoiRec = true;

          //说明现在在外围矩形里面
          // this.isInRoiRec = true;
          //
          // this.drawLastElements();
          // this.drawRoiRec(middleS1, middleS2, middleE1, middleE2, 'red');

          //首先判断X坐标的位置
          if (this.mouseEndX < innerS1) {
            if (this.mouseEndY < innerS2) {
              //1
              console.log(1);
              this.changeRoiRectCode = 1;
            } else if (this.mouseEndY >= innerS2 && this.mouseEndY <= innerE2) {
              //2
              console.log(2);
              this.changeRoiRectCode = 2;
            } else {
              //3
              console.log(3);
              this.changeRoiRectCode = 3;
            }

          } else if (this.mouseEndX >= innerS1 && this.mouseEndX <= innerE1) {
            if (this.mouseEndY < innerS2) {
              //4
              console.log(4);
              this.changeRoiRectCode = 4;
            } else if (this.mouseEndY >= innerS2 && this.mouseEndY <= innerE2) {
              //5
              //说明现在在外围矩形里面
              console.log(5);
              this.changeRoiRectCode = 5;

              // this.isInRoiRec = true;

              // this.drawLastElements();
              // this.drawRoiRec(middleS1, middleS2, middleE1, middleE2, 'red');
            } else {
              //6
              console.log(6);
              this.changeRoiRectCode = 6;
            }
          } else {
            if (this.mouseEndY < innerS2) {
              //7
              console.log(7);
              this.changeRoiRectCode = 7;
            } else if (this.mouseEndY >= innerS2 && this.mouseEndY <= innerE2) {
              //8
              console.log(8);
              this.changeRoiRectCode = 8;
              // this.isDragRoiRecEdge = true;


            } else {
              //9
              console.log(9);
              this.changeRoiRectCode = 9;
            }
          }

          // //判断是否在内部矩形里面，如果是则将操作改为拖拽
          // if (this.mouseEndX >= innerS1 && this.mouseEndX <= innerE1) {
          //   if (this.mouseEndY >= innerS2 && this.mouseEndY <= innerE2) {
          //
          //     //说明现在在外围矩形里面
          //     this.isInRoiRec = true;
          //
          //     this.drawLastElements();
          //     this.drawRoiRec(middleS1, middleS2, middleE1, middleE2, 'red');
          //
          //     //判断是否在内部矩形里面，如果是则将操作改为拖拽
          //
          //
          //
          //   } else {
          //     this.isInRoiRec = false;
          //     this.drawRoiRec(middleS1, middleS2, middleE1, middleE2, 'blue');
          //     // this.drawRoiRec(this.roiRecPoints[0], this.roiRecPoints[1], this.roiRecPoints[2], this.roiRecPoints[3], 'blue')
          //   }
          // } else {
          //   this.isInRoiRec = false;
          //   this.drawRoiRec(middleS1, middleS2, middleE1, middleE2, 'blue');
          // }


        } else {
          this.isInRoiRec = false;
          this.drawRoiRec(middleS1, middleS2, middleE1, middleE2, 'blue');
          // this.drawRoiRec(this.roiRecPoints[0], this.roiRecPoints[1], this.roiRecPoints[2], this.roiRecPoints[3], 'blue')
        }
      } else {
        this.isInRoiRec = false;
        this.drawRoiRec(middleS1, middleS2, middleE1, middleE2, 'blue');
      }
    },
    //更新互动矩形信息
    updateRecPoints(startX, startY, endX, endY) {

      this.roiRecPoints.length = 0;
      this.roiRecPoints.push(startX);
      this.roiRecPoints.push(startY);
      this.roiRecPoints.push(endX);
      this.roiRecPoints.push(endY);

      //后续可以更改距离边界
      const threshold = this.distThreshold;
      //存入外边界
      this.roiRecOuterPoints.length = 0;
      this.roiRecOuterPoints.push(this.roiRecPoints[0] - threshold);
      this.roiRecOuterPoints.push(this.roiRecPoints[1] - threshold);
      this.roiRecOuterPoints.push(this.roiRecPoints[2] + threshold);
      this.roiRecOuterPoints.push(this.roiRecPoints[3] + threshold);
      //存入内边界
      this.roiRecInnerPoints.length = 0;
      this.roiRecInnerPoints.push(this.roiRecPoints[0] + threshold);
      this.roiRecInnerPoints.push(this.roiRecPoints[1] + threshold);
      this.roiRecInnerPoints.push(this.roiRecPoints[2] - threshold);
      this.roiRecInnerPoints.push(this.roiRecPoints[3] - threshold);
    },
    //根据选择更新动态矩形
    changeRect() {

      this.drawLastElements();

      let dx = this.mouseEndX - this.mouseStartX;
      let dy = this.mouseEndY - this.mouseStartY;

      switch (this.changeRoiRectCode) {
        case 0:
          break;
        case 1:
          this.drawRect(this.roiRecPoints[0] + dx, this.roiRecPoints[1] + dy, this.roiRecPoints[2], this.roiRecPoints[3]);
          break;
        case 2:
          this.drawRect(this.roiRecPoints[0] + dx, this.roiRecPoints[1], this.roiRecPoints[2], this.roiRecPoints[3]);
          break;
        case 3:
          this.drawRect(this.roiRecPoints[0] + dx, this.roiRecPoints[1], this.roiRecPoints[2], this.roiRecPoints[3] + dy);
          break;
        case 4:
          this.drawRect(this.roiRecPoints[0], this.roiRecPoints[1] + dy, this.roiRecPoints[2], this.roiRecPoints[3]);
          break;
        case 5:
          this.drawRect(this.roiRecPoints[0] + dx, this.roiRecPoints[1] + dy, this.roiRecPoints[2] + dx, this.roiRecPoints[3] + dy);
          break;
        case 6:
          this.drawRect(this.roiRecPoints[0], this.roiRecPoints[1], this.roiRecPoints[2], this.roiRecPoints[3] + dy);
          break;
        case 7:
          this.drawRect(this.roiRecPoints[0], this.roiRecPoints[1] + dy, this.roiRecPoints[2] + dx, this.roiRecPoints[3]);
          break;
        case 8:
          this.drawRect(this.roiRecPoints[0], this.roiRecPoints[1], this.roiRecPoints[2] + dx, this.roiRecPoints[3]);
          break;
        case 9:
          this.drawRect(this.roiRecPoints[0], this.roiRecPoints[1], this.roiRecPoints[2] + dx, this.roiRecPoints[3] + dy);
          break;
        default:
          break;

      }
    },

    switchUpdateRoiRectPoints() {

      let dx = this.mouseEndX - this.mouseStartX;
      let dy = this.mouseEndY - this.mouseStartY;

      switch (this.changeRoiRectCode) {
        case 0:

          break;
        case 1:
          this.updateRecPoints(this.roiRecPoints[0] + dx, this.roiRecPoints[1] + dy,
            this.roiRecPoints[2], this.roiRecPoints[3]);

          break;
        case 2:
          this.updateRecPoints(this.roiRecPoints[0] + dx, this.roiRecPoints[1],
            this.roiRecPoints[2], this.roiRecPoints[3]);

          break;
        case 3:
          this.updateRecPoints(this.roiRecPoints[0] + dx, this.roiRecPoints[1],
            this.roiRecPoints[2], this.roiRecPoints[3] + dy);

          break;
        case 4:
          this.updateRecPoints(this.roiRecPoints[0], this.roiRecPoints[1] + dy,
            this.roiRecPoints[2], this.roiRecPoints[3]);


          break;
        case 5:

          this.updateRecPoints(this.roiRecPoints[0] + dx, this.roiRecPoints[1] + dy,
            this.roiRecPoints[2] + dx, this.roiRecPoints[3] + dy);
          break;
        case 6:
          this.updateRecPoints(this.roiRecPoints[0], this.roiRecPoints[1],
            this.roiRecPoints[2], this.roiRecPoints[3] + dy);

          break;
        case 7:
          this.updateRecPoints(this.roiRecPoints[0], this.roiRecPoints[1] + dy,
            this.roiRecPoints[2] + dx, this.roiRecPoints[3]);

          break;
        case 8:
          this.updateRecPoints(this.roiRecPoints[0], this.roiRecPoints[1],
            this.roiRecPoints[2] + dx, this.roiRecPoints[3]);


          break;
        case 9:
          this.updateRecPoints(this.roiRecPoints[0], this.roiRecPoints[1],
            this.roiRecPoints[2] + dx, this.roiRecPoints[3] + dy);

          break;

        default:
          break;

      }
    },
    //绘制互动矩形局部提示框，后续可以改为局部变量而不是频繁的访问
    drawRoiRectReactRegion() {

      const [x1, y1, x2, y2] = this.roiRecOuterPoints;
      const [x3, y3, x4, y4] = this.roiRecInnerPoints;
      const [p1, p2, p3, p4] = this.roiRecPoints;

      let arrowDist = 7;

      // 画四个角的矩形框
      this.drawRect(x1, y1, x3, y3);
      this.drawRect(x1, y4, x3, y2);
      this.drawRect(x4, y1, x2, y3);
      this.drawRect(x4, y4, x2, y2);

      // 画两个箭头
      // 先绘制左边的
      this.drawLine(p1, (y1 + y2) / 2, p1 - arrowDist, (y1 + y2) / 2 - arrowDist);
      this.drawLine(p1, (y1 + y2) / 2, p1 + arrowDist, (y1 + y2) / 2 - arrowDist);
      // 绘制右边的
      this.drawLine(p3, (y1 + y2) / 2, p3 - arrowDist, (y1 + y2) / 2 - arrowDist);
      this.drawLine(p3, (y1 + y2) / 2, p3 + arrowDist, (y1 + y2) / 2 - arrowDist);
      // 绘制旋转区域
      this.drawLine((p1 + p3) / 2, p2, (p1 + p3) / 2, p2 - arrowDist);
      this.drawCircle((p1 + p3) / 2, p2 - arrowDist * 2, (p1 + p3) / 2, p2 - arrowDist);

    },


    //     //下载图片
    //     async downloadImage() {
    //       this.closeContextMenu();
    //
    //       const savePath = await window.showSaveFilePicker({
    //         types: [
    //           {
    //             description: 'PNG 图像',
    //             accept: {
    //               'image/png': ['.png'],
    //             },
    //           },
    //         ],
    //       });
    //
    //       if (savePath) {
    //         // 将 Canvas 内容转换为 Blob 对象
    //         this.canvas.toBlob(async (blob) => {
    //           // 保存 Blob 对象为文件
    //           await this.saveBlobToFile(blob, savePath);
    //         }, 'image/png');
    //       }
    //
    //     },
    //
    //     // 将 Data URL 转换为 Blob 对象
    //     dataURLToBlob(dataURL) {
    //       const arr = dataURL.split(',');
    //       const mime = arr[0].match(/:(.*?);/)[1];
    //       const bstr = atob(arr[1]);
    //       let n = bstr.length;
    //       const u8arr = new Uint8Array(n);
    //
    //       while (n--) {
    //         u8arr[n] = bstr.charCodeAt(n);
    //       }
    //
    //       return new Blob([u8arr], { type: mime });
    //     },
    //
    // // 将 Blob 对象保存为文件
    //     async saveBlobToFile(blob, savePath) {
    //       const fileHandle = await window.showSaveFilePicker();
    //
    //       if (fileHandle) {
    //         const writable = await fileHandle.createWritable();
    //         await writable.write(blob);
    //         await writable.close();
    //       }
    //     },

    //点击右键保存图片
    downloadImage() {
      this.closeContextMenu();
      //执行保存图片的逻辑
      const dataURL = this.canvas.toDataURL('image/jpg');

      //创建一个下载链接
      const downloadLink = document.createElement('a');
      downloadLink.href = dataURL;
      downloadLink.download = 'canvas_image.jpg';

      //触发点击下载链接的操作
      downloadLink.click();
    },
    downloadRenderedImage() {
      this.closeContextMenu();
      //执行保存图片的逻辑
      const dataURL = this.canvas.toDataURL('image/jpg');

      //创建一个下载链接
      const downloadLink = document.createElement('a');
      downloadLink.href = dataURL;
      downloadLink.download = 'canvas_image.jpg';

      //触发点击下载链接的操作
      downloadLink.click();
    },
    closeContextMenu() {
      const menu = document.querySelector('.context-menu');
      if (menu) {
        // 清除选择框样式和内容
        menu.innerHTML = '';
        menu.className = '';
        menu.remove();
        document.removeEventListener('click', this.closeContextMenu);
      }
    },
    handleOptionMouseEnter(event) {
      // 添加选项的选择效果样式
      event.target.style.backgroundColor = 'lightgray';
      event.target.style.cursor = 'pointer';
    },
    handleOptionMouseLeave(event) {
      // 移除选项的选择效果样式
      event.target.style.backgroundColor = '';
      event.target.style.cursor = '';
    },

  }

}

</script>

<style scoped>
.head-btn-box {
  margin-bottom: 20px;
}

.img {
  width: 200px;
}
</style>


