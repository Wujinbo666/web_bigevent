var form = layui.form
var layer = layui.layer


$(function() {
  // 引入form  义了de规则校验，它会在 form 模块内部完成。

  // 定义模块
  form.verify({
    nickname: function(value) {
      if (value.length > 6) {
        return '昵称长度必须在1~6之间！'
      }
    }
  })

  userInfo()

  // 获取用户信息 初始化用户的基本信息
  function userInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('用户信息获取失败！')
        }
        console.log(res);
        form.val('formUserInfo', res.data)
      }
    })
  }

  // 重置表单的数据
  $('#btnReset').on('click', function(e) {
    e.preventDefault()
    userInfo()
  })


  // 监听表单提交事件
  $('.layui-form').on('submit', function(e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('用户修改数据失败！')
        }
        layer.msg('数据修改成功')

        // iframe是在index中嵌套的，只需要重新调用html.js中的usserinfo(),即可重新渲染新头像名字
        window.parent.getUserInfo()

      }
    })
  })


})
