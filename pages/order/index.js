// pages/order/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "代付款",
        isActive: false
      },
      {
        id: 2,
        value: "代发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款退货",
        isActive: false
      }
    ],

  },
  onShow(options) {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }

    // 1获取当前的小程序的页面数组  长度最大是10页面
    let pages = getCurrentPages();
    // 2数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 3获取url上的type参数
    const { type } = currentPage.options
    // 4激活选中页面标题
    this.changeTitleByIndex(type-1);
    this.getOrders(type);
  },
  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", method: "GET", data: { type } })
    this.setData({
      orders: res.orders
    })

  },
  // 根据标题索引来激活选中标题数组
  changeTitleByIndex(index) {
    // 2修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3赋值到data中
    this.setData({
      tabs
    })
  },
  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    // 1获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    // 2重新发送请求type=1 index=0
    this.getOrders(index+1);
  },
})