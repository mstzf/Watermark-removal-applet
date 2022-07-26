// pages/other/dailyaricle/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    return: {
      title: '',
      author: '',
      post: '',
      posts: [],
    }
  },
  showMenu() {
    var temp = this.data.isMenu
    this.setData({
      isMenu: !temp
    })
  },
  choosePost(e){
    this.selectAricle(this.data.posts[e.currentTarget.id])
  },
  selectAricle(res) {
    this.setData({
      isMenu: false,
      title: res.title,
      author: res.author,
      post: res.content
    })
  },
  getAricles() {
    wx.request({
      url: 'https://api.mstzf.cn:8080/dailyaricles',
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        this.setData({
          posts: res.data.data
        })
        this.selectAricle(this.data.posts[0])
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getAricles()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})