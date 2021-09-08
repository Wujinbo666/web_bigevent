$(function() {
  getUserInfo()

  var layer = layui.layer
  $('#btn-close').on('click', function() {
    console.log(1);
    layer.confirm('是否退出登录？', { icon: 3, title: '提示' }, function(index) {
      //do something
      console.log('退出成功');
      layer.close(index)
        // 清空本地存储的token
      localStorage.removeItem('token')
      location.href = '/login.html'
    });
  })

})

// 获取用户信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // 发送cookie  在baseapi中用filter写了 暂时不用了
    // headers: {
    //   Authorization: localStorage.getItem('token')
    // },
    success: function(res) {
      if (res.status !== 0) return layui.layer.msg('获取用户信息失败')
      renderAvatar(res.data)
    },
    complete: function(res) {
      console.log('成功与否都会调用我');
      console.log(res);
      // 在complete回调函数中，可以使res.responseJSON拿到服务器相应回来的数据
      if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        location.removeItem('token')
        location.href = '/login.html'
      }
    }
  })

}

// 渲染用户的头像
function renderAvatar(user) {
  // 1.获取用户名称
  var renderName = user.username ? user.username : user.nickname
    // 2.设置用户文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + renderName)
    // 3.按需渲染用户的头像
  if (user.user_pic !== null) {
    // 不为空则说明有图像，渲染图像隐藏文本图像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    // 为空则说明没有图像，则渲染文本图像
    $('.layui-nav-img').hide()
      // 获取第一个字母 并将其转换为大写
    var first = renderName[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}
