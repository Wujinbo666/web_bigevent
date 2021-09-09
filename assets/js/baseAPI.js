$.ajaxPrefilter(function(options) {

  options.url = 'http://api-breakingnews-web.itheima.net' + options.url
  console.log(options.url);

  // 统一为ajax请求配置Authorization
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token')
    }
  }


  // 每次调用ajax前都会先调用ajaxPrefilter可以把 complete也挂在到这个上面
  options.complete = function(res) {

    // 在complete回调函数中，可以使res.responseJSON拿到服务器相应回来的数据
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      localStorage.removeItem('token')
      location.href = '/login.html'
    }
  }

})
