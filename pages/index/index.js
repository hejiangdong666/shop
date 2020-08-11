import { request } from "../../request/index.js"

wx - Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    cateList: [],
    // 楼层数组
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  1发送异步请求来获取轮播图数据
    //  wx.request({
    //    url:"https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata",
    //    success:(result=>{
    //      this.setData({
    //        swiperList:result.data.message
    //      })
    //    })
    //  });
    // 1发送异步请求获取轮播图数据，优化的手段可以通过es6的promise 来解决这个问题
    // request({url:"https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata"})
    // .then(result=>{
    //   this.setData({
    //     swiperList:result.data.message
    //      })
    // })
    this.getSwiperList();
    this.getcateList();
    this.getfloorList();
  },
  // 获取轮播图数据
  getSwiperList() {
    request({ url: "/home/swiperdata" })
      .then(result => {
        this.setData({
          swiperList: result
        })
      })
  },
  //  获取分类导航分类数据
  getcateList() {
    request({ url: "/home/catitems" })
      .then(result => {
        this.setData({
          cateList: result
        })
      })
  },
  //  获取楼层数据
  getfloorList() {
    request({ url: "/home/floordata" })
      .then(result => {
        this.setData({
          floorList: result
        })
      })
  },
})