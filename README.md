1. 新的json格式参照高斯滤波（改了一些，太多了，改不完，自己改）

2. json中输入种类(defineVarInputWay属性)

   - smartInputWay：类似海康输入源（需要加comboList:{}）
   - directInputWay：直接自己输入
   - selectedInputWay：主要描述枚举用(需要加comboList:{...})

3. 除了输入源，需要加默认参数。直接在fromExpression中加默认参数

4. 以前src一般类型填的object，然后填id.变量名，获得其他模块的输出结果。现在因为要校验类型，所以object要改为具体的类型，如Mat。但是输出模块要接收各种类型，还是用的object

    

    

