$(function() {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage;

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormate = function(date) {
      const dt = new Date(date)

      var y = dt.getFullYear()
      var m = addZero(dt.getMonth() + 1)
      var d = addZero(dt.getDate())


      var hh = addZero(dt.getHours())
      var mm = addZero(dt.getMinutes())
      var ss = addZero(dt.getSeconds())

      return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零按钮
  function addZero(m) {
    return m < 9 ? '0' + m : m
  }

  // 定义一个查询参数，将来请求数据的时候，需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, //页码值,默认请求第一页的数据
    pagesize: 2, //每页显示多少条数据，默认每页显示2条
    cate_id: '', //文章分类的 Id
    state: '' //文章的状态，可选值有：已发布、草稿
  }
  initTable()
  initCate()
    // 获取文章列表的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取列表失败')
        }

        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)

        // 渲染分页的方法
        renderPage(res.total)

      }
    })
  }


  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('分类列表获取失败！')
        }

        // 调用模板引擎的方法渲染分类的可选项
        var htmlStr = template('tep-cate', res)

        $('[name=cate_id]').html(htmlStr)
        form.render()
      }
    })
  }

  //为筛选表单绑定submit时间
  $('#form-search').on('submit', function(e) {
    e.preventDefault()
    var id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()

    q.cate_id = id
    q.state = state
      // $.ajax({
      //   method: 'GET',
      //   url: '/my/article/list',
      //   data: q,
      //   success: function(res) {
      //     if (res.status !== 0) {
      //       return layer.msg('筛选图书列表失败')
      //     }
      //     layer.msg('筛选成功')

    //   }
    // })
    initTable()
  })

  //定义渲染分页的方法
  function renderPage(total) {
    // 调用layerPage方法，来渲染分页的结构

    laypage.render({
      elem: 'pageBox', //分页容器的id  此处不能加#
      count: 10, //总数据条数
      limit: q.pagesize, //每次显示几条数
      curr: q.pagenum, //设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 1、分页触发的时候，将触发jump回调
      //2、只要调用了laypage.render()方法，就会触发jump回调
      jump: function(obj, first) {
        // 可以通过first值来判断时通过哪种方式调用的renderpage true为第二种，undefined为第一种
        //把最新的页码值，赋值到q这个查询参数对象中
        q.pagenum = obj.curr
          // 把最新的条目数，赋值到q这个查询对象参数对象的pagesize属性中
        q.pagesize = obj.limit
          // 根据最新的q渲染最新的数据
        if (!first) {
          initTable()
        }
      }
    })
  }

  //通过代理的形式，为删除按钮绑定点击事件处理函数
  $('tbody').on('click', '.btn-delate', function() {
    //获取按钮的个数
    var len = $('.btn-delate').length
    var del_id = $('.btn-delate').attr('del-id')
    layer.confirm('是否要删除该列表？', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + del_id,
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('删除该列表失败')
          }
          layer.msg('删除成功')

          //当数据删完后，需要判断当前这一页中是否还有剩余的数据
          //如果没有剩余的数据了，则让页码值-1之后，
          //在重新调用initTable()

          if (len === 1) {
            //如果len=1，则证明删除完毕之后，页面上就没有任何数据了
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          layer.close(index);
          initTable()
        }
      })


    });
  })
})
