package opencvmodule;

import com.sun.jna.Library;
import com.sun.jna.Native;
import com.sun.jna.Pointer;
import com.sun.jna.ptr.PointerByReference;

import java.util.Arrays;

//public class CommonData {
//    public interface CLibrary extends Library {
//
//        CLibrary INSTANCE = (CLibrary) Native.loadLibrary("handle",
//                CLibrary.class);
//
//        Pointer CommonData_ctor1(int nb);
//        Pointer CommonData_ctor2(int nb,String s);
//        int CommonData_getValue(Pointer self);
//
//        String CommonData_getJson(Pointer self);
//    }
//
//    private Pointer self;
//
//    public CommonData(int nb)
//    {
//        self = CLibrary.INSTANCE.CommonData_ctor1(nb);
//    }
//    public CommonData(int nb,String s)
//    {
//
//        self = CLibrary.INSTANCE.CommonData_ctor2(nb,s);
//    }
//    public int getValue()
//    {
//        return CLibrary.INSTANCE.CommonData_getValue(self);
//    }
//
////    public String getJson()
////    {
////        Native.setProtected(true);  // 设置 JNA 保护模式
////        System.out.println(CLibrary.INSTANCE.CommonData_getJson(self));
////        return CLibrary.INSTANCE.CommonData_getJson(self);
////
////    }
//    public String getJson()
//    {
//        Native.setProtected(true);  // 设置 JNA 保护模式
//        System.out.println(CLibrary.INSTANCE.CommonData_getJson(self));
//        return CLibrary.INSTANCE.CommonData_getJson(self);
//
//    }
//}
public class CommonData {
    public interface CLibrary extends Library {
        CLibrary INSTANCE = (CLibrary) Native.loadLibrary("handle", CLibrary.class);
        Pointer CommonData_ctor1(int nb);
        Pointer CommonData_ctor2(int nb, String s);
        int CommonData_getValue(Pointer self);
        String CommonData_getJson(Pointer self);
        String CommonData_getImgRet(Pointer self);
        void CommonData_eventHandle(Pointer self,int event, String para);
    }

    private Pointer self;

    public CommonData(int nb) {
         self= CLibrary.INSTANCE.CommonData_ctor1(nb);
    }

    public CommonData(int nb, String s) {
        self = CLibrary.INSTANCE.CommonData_ctor2(nb, s);
    }

    public int getValue() {
        return CLibrary.INSTANCE.CommonData_getValue(self);
    }


    public String getJson()
    {
        Native.setProtected(true);  // 设置 JNA 保护模式
        String a=CLibrary.INSTANCE.CommonData_getJson(self);
        return CLibrary.INSTANCE.CommonData_getJson(self);
    }
    public String getImgRet()
    {
        Native.setProtected(true);  // 设置 JNA 保护模式
        String a=CLibrary.INSTANCE.CommonData_getImgRet(self);
        return CLibrary.INSTANCE.CommonData_getImgRet(self);
    }
    public void eventHandle(int event, String para){
        CLibrary.INSTANCE.CommonData_eventHandle(self,event,para);
    }
}
