$(function() {
  // 点击去注册
  $('#link_reg').on('click', function() {
      $('.login-box').hide().siblings('.reg-box').show()
    })
    // 点击去登录
  $('#link_login').on('click', function() {
    $('.reg-box').hide().siblings('.login-box').show()
  })


  var form = layui.form
  var layer = layui.layer
  form.verify({
    //自定义了一个校验规则
    pass: [
      /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
    ],
    repwd: function(value) {

      var pwd = $('.reg-box [name=password]').val()

      if (value !== pwd) {
        return '两次密码输入不一致';
      }
    }
  })

  $('#form_reg').on('submit', function(e) {
    e.preventDefault()
    var data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val()
    }
    $.post('http://api-breakingnews-web.itheima.net/api/reguser', data,
      function(res) {

        if (res.status !== 0) return layer.msg(res.message);
        layer.msg('注册成功,请登录！');
        $('#link_login').click()
      }
    )
  })

  $('#form_login').on('submit', function(e) {
    e.preventDefault()
    console.log($('#form_login [name=username]').val(),
      $('#form_login [name=password]').val());
    $.ajax({
      url: '/api/login',
      method: 'POST',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) return layer.msg(res.message)
        layer.msg('登录成功')
        localStorage.setItem('token', res.token)
        location.href = '/index.html'
      }
    })
  })

})
