import { request } from "../../request/index.js";
import regeneratorRuntime, { values } from '../../lib/runtime/runtime';

Page({
  data:{
    goods:[],
    // 取消按钮是否显示
    isFocus:false,
    inpValue:""
  },
  TimeId:-1,
  // 输入框的值改变 就会触发的事件
  handleInput(e){
    // 1获取输入框的值 
    const{value}=e.detail;
    // 2检测合法性
    if(!value.trim()){
      
      this.setData({
        goods:[],
        isFocus:false
      })
      // 值不合法
      return;
    }
    // 3准备发送请求获取数据
    this.setData({
      isFocus:true
    });
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },
  // 发送请求获取搜索建议数据
  async qsearch(query){
     const res=await request({url:"/goods/qsearch",data:{query}})
     console.log(res)
     this.setData({
       goods:res
     })
  },
  // 点击 取消按钮
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
  }
})