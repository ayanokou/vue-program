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
    </div>
    <canvas id="cvs" width="1024" height="768"
            style="border:1px solid #ccc;margin:20px auto;display: block;">
      当前浏览器不支持canvas
      <!-- 如果浏览器支持canvas，则canvas标签里的内容不会显示出来 -->
    </canvas>
  </div>
</template>

<!--<script src="../js/picWindow.js">-->

<script>
import {mapState} from "vuex";

export default {
  data() {
    return {
      canvas: null,
      ctx: null,
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


    }
  },
  computed: {
    ...mapState(['imgBase64'])
  },
  watch: {
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

        this.showImage(this.image.picture,0,0);

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
  },

  methods: {
    //初始化画布
    initCanvas() {
      this.canvas = document.getElementById("cvs");
      this.ctx = this.canvas.getContext("2d");
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
    },
    //画同心圆 -6
    drawConcentricCircles(startX, startY, endX, endY) {

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
      console.log(startX,startY,endX,endY,dx,dy);

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

    },
    //
    handleMouseUp() {
      this.isDrawFromMse = false;
      if (this.mouseDrawType !== 7){
        this.saveNewElement2Array(this.mouseDrawType, this.mouseStartX, this.mouseStartY, this.mouseEndX, this.mouseEndY);
      }


    },
    //
    handleMouseMove(event) {
      if (this.isDrawFromMse) {

        const canvasRect = this.canvas.getBoundingClientRect();
        this.mouseEndX = event.clientX - canvasRect.left;
        this.mouseEndY = event.clientY - canvasRect.top;

        this.drawLastElements();

        this.switchDrawCase(this.mouseDrawType, this.mouseStartX, this.mouseStartY, this.mouseEndX, this.mouseEndY);


      }
      if (this.isDrawingConCircle) {
        this.drawConcentricCircles(0, 0, this.mouseEndX, this.mouseEndY);
      }
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
      this.image.imageX=0;
      this.image.imageY=0;

      this.drawLastElements();

      // this.doubleClickPoints.length = 0;
      // this.concentricCircleMiddleInfo.length = 0;
      // this.mouseClickTime = 0;
    },
    imageDragByMouse() {
      this.mouseDrawType = 7;
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
    }


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


