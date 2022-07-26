const app = getApp()

Page({
  data: {
    notice: ["当前服务器不在线，请稍后再试，或联系管理员"],
    oldInput: '待定参数 ! ! !',
    inputValue: '',
    showUrl: '',
    src: "",
    status: 0,
    rate: 0,
    progress_txt: '加载中...',
    isDownload: false,
  },
  onLoad: function (options) {
    this.paste()
    this.getNotice()
  },
  //获取公告
  getNotice() {
    var that = this
    wx.request({
      url: 'https://api.mstzf.cn:8080/notice',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            notice: res.data.data.notice
          })
          console.log(that.data.notice)
        }
        else {
          that.setData({
            notice: '公告获取失败:' + that.data.notice
          })
        }
      }
    })
  },
  //输入框
  inputEdit(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  //粘贴
  copyText(e) {
    this.paste()
  },
  //获取粘贴板内容
  paste() {
    var self = this;
    wx.getClipboardData({
      title: "正在获取粘贴板内容",
      success(res) {
        self.setData({
          inputValue: res.data
        })
      }
    })
  },
  //从分享文字中获取视频链接
  getURLFromString(string) {
    var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
    if (reg.test(string)) { // 包含url链接
      return string.match(reg)[0];
    } else {
      return "";
    }
  },
  //发送请求解析视频
  analysis(e) {
    if (this.data.oldInput == this.data.inputValue) {
      wx.showToast({
        title: '重复粘贴',
        icon: 'none'
      })
      return
    }
    wx.showToast({
      title: '正在解析，请稍后',
      icon: 'none',
      duration: 1500//持续的时间
    })
    this.data.oldInput = this.data.inputValue
    const self = this
    var link = this.getURLFromString(this.data.inputValue)
    if (link == '') {
      wx.showToast({
        title: '粘贴内容错误',
        icon: 'error'
      })
      return
    }
    wx.request({
      url: 'https://api.mstzf.cn:8080/url',
      // method:"POST",
      data: {
        url: link,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },

      success(res) {
        self.setData({
          status: res.data.code,
          showUrl: res.data.data.showurl,
          src: res.data.data.url
        })
        if (res.data.code === 200) {
          self.setData({
            status: res.data.code,
            showUrl: res.data.data.showurl,
            src: res.data.data.url
          })
        } else {
          self.setData({
            status: res.data.code
          })
          wx.showToast({
            title: '获取失败',
            icon: 'error'
          })
        }
      }
    })
  },

  //获取视频保存相册权限
  getDownPhoto() {
    // 获取用户授权
    var that=this
    wx.getSetting({
      success(res) {
        // 如果已授权
        if (res.authSetting['scope.writePhotosAlbum']) {
        that.saveAlbum()
          // 如果没有授权 
        } else if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
          // 调起用户授权
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.saveAlbum()
            },
            fail() {
              wx.showToast({
                title: '您没有授权，无法保存到相册',
                icon: 'none'
              })
            }
          })
          // 如果之前授权已拒绝
        } else {
          wx.openSetting({
            success(res) {
              if (res.authSetting['scope.writePhotosAlbum']) {
                that.saveAlbum()
              } else {
                wx.showToast({
                  title: '您没有授权，无法保存到相册',
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  },

  downloadAlbum(e) {
    if (this.data.status != 200) {
      wx.showToast({
        title: '未获取到有效链接，无法下载',
        icon: 'none'
      });
    } else {
        this.setData({
          isDownload: true,
        })
        setTimeout(() => {
          this.getDownPhoto()
        }, 1000)
      }
    },
  saveAlbum() {
    const that = this
    const downloadTask = wx.downloadFile({
      url: that.data.src,
      header: {},
      success(res) {
        if (res.statusCode === 200) {
          var temp = res.tempFilePath
          wx.saveVideoToPhotosAlbum({
            filePath: temp,
            success(res) {
              const reserrMsg = res.errMsg
              if (reserrMsg == 'saveVideoToPhotosAlbum:ok') {
                that.data.progress_txt = "下载完成"
                setTimeout(() => {
                  that.setData({
                    isDownload:false
                  })
                }, 1000)
              }
            }
          })
        }
      }
    });
    downloadTask.onProgressUpdate((res) => {
      this.onReady(res.progress)
      this.setData({
        rate: res.progress
      });
    });
  },

  countInterval() {
    const count = this.data.rate
    /* 绘制彩色圆环进度条  
    注意此处 传参 step 取值范围是0到2，
    所以 计数器 最大值 100 对应 2 做处理，计数器count=100的时候step=2
    */
    this.drawProgressCircle(count / (100 / 2));
    this.setData({
      progress_txt: count + '%'
    });
  },
  /**
   * 绘制灰色背景
   */
  drawProgressbg() {
    // 使用 wx.createContext 获取绘图上下文 context
    // if(this.data.isDownload){
    var ctx = null;
    const that = this
    wx.createSelectorQuery()
      .select("#canvasProgressbg")
      .context(function (res) {
        // console.log("节点实例：", res);
        // 节点对应的 Canvas 实例。
        ctx = res.context;
        ctx.setLineWidth(4); // 设置圆环的宽度
        ctx.setStrokeStyle('#EEEEEE'); // 设置圆环的颜色
        ctx.setLineCap('round') // 设置圆环端点的形状
        ctx.beginPath(); //开始一个新的路径
        ctx.arc(90, 90, 70, 0, 2 * Math.PI, false);
        //设置一个原点(90,90)，半径为80的圆的路径到当前路径
        ctx.stroke(); //对当前路径进行描边
        ctx.draw();
      })
      .exec();
    // }
  },
  /**
   * 绘制小程序进度
   * @param {*} step 
   */
  drawProgressCircle(step) {
    let ctx = null;
    wx.createSelectorQuery()
      .select("#canvasProgress")
      .context(function (res) {
        ctx = res.context;
        // 设置渐变
        var gradient = ctx.createLinearGradient(200, 100, 100, 200);
        gradient.addColorStop("0", "#2661DD");
        gradient.addColorStop("0.5", "#40ED94");
        gradient.addColorStop("1.0", "#5956CC");

        ctx.setLineWidth(10);
        ctx.setStrokeStyle(gradient);
        ctx.setLineCap('round')
        ctx.beginPath();
        // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
        ctx.arc(90, 90, 70, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
        ctx.stroke();
        ctx.draw()
      })
      .exec();

  },
  onReady() {
    if (this.data.isDownload) {
      this.drawProgressbg();
      this.countInterval()
    }
  },

})