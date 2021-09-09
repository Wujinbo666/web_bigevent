$(function() {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
    // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 为上传文件绑定点击事件
  $('#btnChooseImage').on('click', function() {
      $('#file').click()
    })
    // 可以用change 属性监控input:file中的的改变
  $('#file').on('change', function(e) {
    var filelist = e.target.files
    console.log(filelist);
    if (filelist.length === 0) {
      layer.msg('未上传头像')
    }


    // 1.拿上传的图片
    var file = e.target.files[0]
      // 2.把拿到的图片转换出一个url
    var ImgURL = URL.createObjectURL(file)
      // 3.重新初始化裁剪区域
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', ImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域


    $('#btnUpload').on('click', function() {
      // 1.拿到要调用的图片
      var dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
          width: 100,
          height: 100
        })
        .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

      // 2、调用上传头像的接口
      $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
          avatar: dataURL
        },
        success: function(res) {
          if (res.status !== 0) {
            layer.msg('头像更新失败')
          }
          layer.msg('更换头像成功')
          window.parent.getUserInfo()
        }
      })
    })
  })
})
