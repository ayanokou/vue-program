1. 修改了operation.json中一些属性名

2. 添加了2个成员属性到接口参数类中，故封装dll的函数时，需要传3个参数给构造函数，参数名和类型名与json中outPara中一致。

   ```c++
   #include "object.h"
   
   #define EXPORT extern "C" __declspec(dllexport)
   
   EXPORT void read(ParamPtrArray& params) {
   	cv::Mat* dst = new cv::Mat;
   	*dst = cv::imread(
   		get_data<std::string>(params[0]),
   		get_data<int>(params[1])
   	);
   
   	params.push_back(make_param("dst","Mat",dst));
   }
   ```

   

