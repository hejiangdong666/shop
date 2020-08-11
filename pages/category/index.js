// pages/category/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    //  被点击的左侧的菜单
    currentIndex: 0,
    // 右侧商品到顶部的距离
    scrollTop: 0
  },
  //  接口的返回数据
  Cates: [],
  onLoad: function (options) {
    // 1先判断本地储存有没有旧的数据
    // {time:Date.now(),data:[...]}
    // 2没有旧数据 直接发送新请求
    // 3有旧的数据 同时旧的数据也没有过期 就是用本地储存的旧数据即可
    // 1获取本地存储的数据
    const Cates = wx.getStorageSync("cates");
    // 2判断
    if (!Cates) {
      // 不存在 发送请求获取数据
      this.getCates();
    } else {
      // 有旧的数据 定义过期时间10s 改成五分钟
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates();
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },
  // 获取分类数据
  async getCates() {
    // request({
    //   url: "/categories"
    // })
    //   .then(res => {
    //     this.Cates = res.data.message
    //     // 把接口的数据存入到本地存储中
    //     wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    //     // 构造左侧的大菜单数据     
    //     let leftMenuList = this.Cates.map(v => v.cat_name);

    //     // 构造右侧的大菜单数据
    //     let rightContent = this.Cates[0].children;
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })
    //   })
      //  使用ES7的async await
      const res = await request({url:"/categories"});
      // this.Cates = res.data.message
      this.Cates=res
        // 把接口的数据存入到本地存储中
        wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
        // 构造左侧的大菜单数据     
        let leftMenuList = this.Cates.map(v => v.cat_name);
        // 构造右侧的大菜单数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    // 1获取被点击的标题身上的索引
    // 2给data中的currentIndex赋值
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置右侧内容scroll-view到顶部距离
      scrollTop: 0
    })

  }

})