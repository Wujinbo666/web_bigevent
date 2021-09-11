$(function() {
  var form = layui.form
  var layer = layui.layer
  initCate()
    // 初始化富文本编辑器
  initEditor()


  //定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {

        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败')
        }
        //调用模板引擎，渲染分类的下拉菜单
        var htmlStr = template('tep-cate', res)
        $('[name=cate_id]').html(htmlStr)
          //一定记得要调用form.render方法
        form.render()
      }
    })
  }


  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)


  // 为选择封面的按钮，绑定点击事件处理函数
  $('#btnSubmitImage').on('click', function() {
      $('#coverFile').click()
    })
    // 监听cover file的change时间
  $('#coverFile').on('change', function(e) {
    // 获取文件的列表数组
    var files = e.target.files[0]
      // 判断是否选择了文件
    if (files.length === 0) {
      return
    }
    // 根据选择的文件，创建一个对应的 URL 地址：
    var newImgURL = URL.createObjectURL(files)
      // 为裁剪区域重新设置图片
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域

  })

  // 定义文章发布状态
  var art_state = '已发布'

  // 为存为草稿按钮，绑定点击事件处理函数
  $('#btnSave2').on('click', function() {
    art_state = '草稿'
  })

  // 为表单绑定submit提交事件
  $('#form-pub').on('submit', function(e) {

    //1、 阻止表单的默认提交行为
    e.preventDefault()
      // 2、基于form表单快速创建一个FormData对象
    var fd = new FormData($('#form-pub')[0])
      // 3、将文章的发布状态存入fd中
    fd.append('state', art_state)
      // 4\、将裁剪过后的图片输出成一个对象
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function(blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        //5、将得到的文件追加到fd上
        fd.append('cover_img', blob)
          //6.发起ajax请求
        publishArticle(fd)
      })
  })

  // 定义一个发文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      //注意 如果使用formdata类型的数据，必须要添加一下两个属性
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function(res) {
        console.log('-- -- -- -- -- --');
        if (res.status !== 0) {
          return layer.msg('发布文章失败')
        }
        layer.msg('发布文章成功')
          //   //发布文章成功后跳转到列表页
          // location.href = '/article/art_pub.html'
        location.href = '/article/art_list.html'
      }

    })
  }

})
