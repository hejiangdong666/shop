// pages/cart/index.js
import { getSetting, chooseAddress, openSetting, showToast } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //  1获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart");
    this.setData({ address });
    this.setCart(cart);
  },
  //  点击获取 收货地址
  async handleChooseAddress() {
    try {
      //1获取 权限状态 
      const res1 = await getSetting();
      const scopedAddress = res1.authSetting["scope.address"];
      // 2判断 权限状态
      if (scopedAddress === false) {
        await openSetting();
      }
      // 4调用获取收获地址的api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // 5存入到缓存中
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error)
    }
  },
  // 商品的选中
  handleItemChange(e) {
    // 1获取被修改商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 2获取购物车数组
    let { cart } = this.data;
    // 3找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id)
    // 4选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);

  },
  // 设置购物车状态 同时重新计算底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    this.setData({
      cart
    });
    wx.setStorageSync("cart", cart);
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked:false
    });
  },
  //商品的全选功能
  handleItemAllCheck() {
    // 1获取data中的数据
    let { cart, allChecked } = this.data;
    // 2修改值
    allChecked = !allChecked; 
    // 3循环修改cart数组中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 4把修改后的值填充回data或者缓存中
    this.setCart(cart);
  },
  // 商品数量的编辑功能
  handleItemNumEdit(e) {
    // 1获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // 2获取购物车数组
    let { cart } = this.data;
    // 3找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id)
    // 4判断是否要删除
    if (cart[index].num === 1 && operation === -1) {
      // 4.1弹窗提示
      wx.showModal({
        title: '提示',
        content: '您是否要删除?',
        success: (res) => {
          if (res.confirm) {
            cart.splice(index, 1)
            this.setCart(cart);
          } else if (res.cancle) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      // 4进行修改数量
      cart[index].num += operation;
      // 设置回缓存和data中
      this.setCart(cart);
    }
  },
  // 点击结算
  async handlePay() {
    // 1判断收货地址
    const { address, totalNum } = this.data
    if (!address.userName) {
      await showToast({ title: "您还没有选择收货地址" });
      return;
    }
    // 2判断用户有没选购商品
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    // 3跳转到支付页面
    wx.navigateTo({
      url:'/pages/pay/index'
    });
  }
})