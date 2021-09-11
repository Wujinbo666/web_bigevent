$(function() {
  var form = layui.form
  var layer = layui.layer

  artInitCateList()

  function artInitCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      data: '',
      success: function(res) {

        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }
  // 为添加类别点击事件
  var index = null
  $('#btnAddCate').on('click', function() {
    index = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  // 通过代理的形式为form-add绑定submit事件
  $('body').on('submit', '#form-add', function(e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $('.layui-form').serialize(),
      success: function(res) {
        if (res.status !== 0) {
          layer.msg('图书添加失败')
        }
        artInitCateList()
        layer.msg('新增分类成功')
        layer.close(index)
      }
    })
  })

  // 通过代理的形式，为btn-edit按钮点击动态绑定事件 
  $('tbody').on('click', '#btn-edit', function(e) {
      var indexEdit = e.preventDefault()
      indexEdit = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '添加文章分类',
        content: $('#dialog-edit').html()
      })
      var id = $(this).attr('data-id')

      $.ajax({
        method: 'GET',
        url: "/my/article/cates/" + id,
        success: function(res) {
          console.log(res);
          // ID中的值也要保存，加进html中隐藏
          form.val('form-edit', res.data)
        }
      })

      // 通过代理的方法为表单添加动态submit事件
      $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
          method: 'POST',
          url: '/my/article/updatecate',
          data: $(this).serialize(),
          success: function(res) {
            if (res.status !== 0) {
              layer.msg('更新图书失败')
            }
            layer.msg('更新图书成功')
            layer.close(indexEdit)
            artInitCateList()
          }
        })
      })
    })
    // 通过代理的形式为删除按钮绑定点击事件
  $('html').on('click', '#btn-remove', function() {
    var removeId = $(this).attr('remove-id')
    layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {

      console.log(removeId);
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + removeId,
        success: function(res) {
          if (res.status !== 0) {
            layer.msg('图书删除失败')
          }
          layer.msg('删除图书成功')
          layer.close(index);
        }
      })


    });

  })


})
