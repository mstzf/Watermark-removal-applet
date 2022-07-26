// pages/other/news/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    return:{
      img:'',
      content:'',
      news:[],
      isMenu:false,
    }
  },
  showMenu(){
    var temp=this.data.isMenu
    this.setData({
      isMenu:!temp
    })
  },
  selectNews(res){
    var text=res.news
    var temp=text.split(",")
    var news=''
    for (var i = 0; i < temp.length; i++) {
      
      news += temp[i] + '\n'
  }
  this.setData({
    img:res.img,
    content:news
  })
  },
  getNews(){
    wx.request({
      url: 'https://api.mstzf.cn:8080/news',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:res=>{
        this.selectNews(res.data.data[0])
        this.setData({
          news:res.data.data
        })
      }
    })
  },
  chooseNews(e){
    this.selectNews(this.data.news[e.currentTarget.id])
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getNews()
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