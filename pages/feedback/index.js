Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    chooseImgs: [],
    textVal: ""
  },
  // 外网的图片的路径数组
  UpLoadImgs: [],
  handleTabsItemChange(e) {
    // 1获取被点击的标题索引
    const { index } = e.detail;
    // 2修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3赋值到data中
    this.setData({
      tabs
    })
  },
  // 点击 + 选择图片
  handleChooseImg() {
    // 电泳小程序内助的选择图片api
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        console.log(result)
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      },
    });

  },
  // 点击自定义图片组件
  handleRemoveImg(e) {
    // 获取被点击的组件的索引
    const { index } = e.currentTarget.dataset;
    // 获取data中的图片数组
    let { chooseImgs } = this.data;
    // 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },
  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交按钮的点击事件
  handleFormSubmit() {
    // 1获取文本域的内容 图片数组
    const { textVal, chooseImgs } = this.data;
    // 2合法性的验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });
      return;
    }
    // 3准备上传图片到专门的图片服务器
    // 上传的api不支持多个文件同时上传  遍历数组 挨个上传
    // 显示正在等待的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true,
    });
      
    chooseImgs.forEach((v, i) => {


      wx.uploadFile({
        // 图片要上传到哪里
        url: 'https://images.ac.cn/',
        // 被上传的文件的路径
        filePath: v,
        // 上传的文件的名称  后台来获取文件
        name: "file",
        // 顺带的文本信息
        formData: {},
        success: (result) => {
          console.log(result);
          let url = JSON.parse(result.data).url;
          this.UpLoadImgs.push(url);
          // 所以的图片都上传完毕了才触发
          if (i === chooseImgs.length - 1) {
            console.log("把文本的内容提交到后台中")
            this.setData({
              textVal: "",
              chooseImgs: []
            })
            // 返回上一个页面
            wx.navigateBack({
              delta: 1
            });

          }

        }
      });
    })
  },

})