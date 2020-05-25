## Jquery 中的Ajax

#### $.ajax()

##### 方法的概述：

- 作用1: 发送Ajax请求。

  ```js
   $.ajax({
       type: 'get',
       url: 'http://www.example.com',
       data: { name: 'zhangsan', age: '20' },
       contentType: 'application/x-www-form-urlencoded',
       beforeSend: function () {
           return false
       },
       success: function (response) {},
       error: function (xhr) {}
  });

  ```

- 作用2: 发送jsonp请求。

  ```js
  $.ajax({
      url: 'http://www.example.com',
      // 指定当前发送jsonp请求
      dataType: 'jsonp',
      // 修改callback参数名称
      jsonp: 'cb',
      // 指定函数名称
      jsonpCallback: 'fnName',
      success: function (response) {} 
  })
  
  ```

  

##### serialize方法

作用：将表单中的数据自动拼接成字符串类型的参数

```js
var params = $('#form').serialize();
// name=zhangsan&age=30

```

####  $.get

作用: 用于发送get请求

```js
$.get('http://www.example.com', {name: 'zhangsan', age: 30}, function (response) {}) 
```

#### $.post

作用: 用于发送post请求

```js
$.post('http://www.example.com', {name: 'lisi', age: 22}, function (response) {})
```



#### Todo案例

 ##### 为todo数据库添加账号

1. 使用mongo命令进入mongodb数据库
2. 使用use admin命令进入到admin数据中
3. 使用db.auth(‘root’, ‘root’)命令登录数据库
4. 使用use todo命令切换到todo数据库
5. 使用db.createUser({user: ‘itcast’, pwd: ‘itcast’, roles: [‘readWrite’]})创建todo数据库账号
6. 使用exit命令退出mongodo数据库

##### 展示任务列表

1. 准备一个放置任务列表的数组

2. 向服务器端发送请求，获取已存在的任务

3. 将已存在的任务存储在任务列表数组中

4. 通过模板引擎将任务列表数组中的任务显示在页面中

   ```javascript
               // 向服务器端发送请求 获取已经存在的任务
               $.ajax({
                   url: '/todo/task',
                   type: 'get',
                   success: function (response) {
                       // 将已存在的任务存储在taskAry变量中
                       taskAry = response;
                       // 拼接字符串 将拼接好的字符串显示在页面中
                       // 字符串拼接
                       var html = template('taskTpl', {
                           tasks: taskAry
                       });
                       // 将拼接好的字符串显示在ul标签中
                       taskBox.html(html);
                   }
               })

   ```

   

##### 添加任务

1. 为文本框绑定键盘抬起事件，在事件处理函数中判断当前用户敲击的是否是回车键

2. 当用户敲击回车键的时候，判断用户在文本框中是否输入了任务名称

3. 向服务器端发送请求，将用户输入的任务名称添加到数据库中，同时将任务添加到任务数组中

4. 通过模板引擎将任务列表数组中的任务显示在页面中

   ```js
   			// 获取文本框并且添加键盘抬起事件
   			taskInp.on('keyup', function (event) {
   				// 如果用户敲击的是回车键
   				if (event.keyCode == 13) {
   					// 判断用户是否在文本框中输入了任务名称
   					var taskName = $(this).val();
   					// 如果用户没有在文本框中输入内容
   					if (taskName.trim().length == 0) {
   						alert('请输入任务名称')
   						// 阻止代码向下执行
   						return;
   					}
   					// 向服务器端发送请求 添加任务
   					$.ajax({
   						type: 'post',
   						url: '/todo/addTask',
   						contentType: 'application/json',
   						data: JSON.stringify({title: taskName}),
   						success: function (response) {
   							// 将任务添加到任务列表中
   							taskAry.push(response);
                       		  // 拼接字符串 将拼接好的字符串显示在页面中
                       	      // 字符串拼接
                       		  var html = template('taskTpl', {
                            	   		tasks: taskAry
                       			});
                       		  // 将拼接好的字符串显示在ul标签中
                       		  taskBox.html(html);
   						}
   					})
   				}
   			});
   ```

   

##### 删除任务

1. 为删除按钮添加点击事件

2. 在事件处理函数中获取到要删任务的id

3. 向服务器端发送请求，根据ID删除任务，同时将任务数组中的相同任务删除

4. 通过模板引擎将任务列表数组中的任务重新显示在页面中

   ```js
               // 当用户点击删除按钮时触发ul标签身上的点击事件
               taskBox.on('click', '.destroy', function () {
                   // 要删除的任务的id
                   var id = $(this).attr('data-id');
                   // 向服务器端发送请求删除 任务
                   $.ajax({
                       url: '/todo/deleteTask',
                       type: 'get',
                       data: {
                           _id: id
                       },
                       success: function (response) {
                           // 从任务数组中找到已经删除掉的任务的索引
                           var index = taskAry.findIndex(item => item._id == id);
                           // 将任务从数组中删除
                           taskAry.splice(index, 1);
                       	// 字符串拼接
                       	var html = template('taskTpl', {
                            	 tasks: taskAry
                       	});
                       	// 将拼接好的字符串显示在ul标签中
                       	taskBox.html(html);
                       }
                   })
               });

   ```

   

##### 更改任务状态

1. 为任务复选框添加onchange事件

2. 在事件处理函数中获取复选框是否选中

3. 向服务器端发送请求，将当前复选框的是否选中状态提交到服务器端

4. 将任务状态同时也更新到任务列表数组中

5. 通过模板引擎将任务列表数组中的任务重新显示在页面中并且根据任务是否完成为li元素添加completed类名

   ```javascript
   			// 当用户改变任务名称前面的复选框状态时触发
   			taskBox.on('change', '.toggle', function () {
   				// 代表复选框是否选中 true 选中 false 未选中的
   				const status = $(this).is(':checked');
   				// 当前点击任务的id
   				const id = $(this).siblings('button').attr('data-id');
   				// 向服务器端发送请求 更改任务状态
   				$.ajax({
   					type: 'post',
   					url: '/todo/modifyTask',
   					data: JSON.stringify({_id: id, completed: status}),
   					contentType: 'application/json',
   					success: function (response) {
   						// 将任务状态同步到任务数组中
   						var task = taskAry.find(item => item._id == id);
   						// 更改任务状态
   						task.completed = response.completed;
   						// 将数组中任务的最新状态更新到页面中
   						render();

   					}
   				})
   			});
   ```

##### 修改任务名称

1. 为任务名称外层的label标签添加双击事件，同时为当前任务外层的li标签添加editing类名，开启编辑状态

2. 将任务名称显示在文本框中并让文本框获取焦点

3. 当文本框离开焦点时，将用户在文本框中输入值提交到服务器端，并且将最新的任务名称更新到任务列表数组中

4. 使用模板引擎重新渲染页面中的任务列表。

   ```javascript
   			// 当双击事件名称的时候触发
   			taskBox.on('dblclick', 'label', function () {
   				// 让任务处于编辑状态
   				$(this).parent().parent().addClass('editing');
   				// 将任务名称显示在文本框中
   				$(this).parent().siblings('input').val($(this).text())
   				// 让文本框获取焦点
   				$(this).parent().siblings('input').focus();
   			})

   			// 当文本框离开焦点的时候
   			taskBox.on('blur', '.edit', function () {
   				// 最新的任务名称
   				var newTaskName = $(this).val();
   				// 编辑任务的id
   				var id = $(this).siblings().find('button').attr('data-id');
   				// 向服务器端发送请求 修改任务名称
   				$.ajax({
   					url: '/todo/modifyTask',
   					type: 'post',
   					data: JSON.stringify({_id: id, title: newTaskName}),
   					contentType: 'application/json',
   					success: function (response) {
   						// 将当期任务的最新状态同步到任务数组中
   						var task = taskAry.find(item => item._id == id);
   						// 修改任务名称
   						task.title = response.title;
   						// 将任务数组中的任务同步到页面中
   						render();
   					}
   				})
   			});
   ```

##### 计算未完成的任务数量

1. 准备一个用于存储未完成任务数量的变量
2. 将未完成任务从任务数组中过滤出来
3. 将过滤结果数组的长度赋值给任务数量变量
4. 将结果更新到页面中

##### 显示未完成任务

1. 为active按钮添加点击事件
2. 从任务列表数组中将未完成任务过滤出来
3. 使用模板引擎将过滤结果显示在页面中

##### 清除已完成任务

1. 为clear completed按钮添加点击事件
2. 向服务器端发送请求将数据库中的已完成任务删除掉
3. 将任务列表中的已完成任务删除调用
4. 使用模板引擎将任务列表中的最后结果显示在页面中



#### 全局事件

只要页面中有Ajax请求被发送，对应的全局事件就会被触发

```js
.ajaxStart()     // 当请求开始发送时触发
.ajaxComplete()  // 当请求完成时触发
```



#### nprogress 进度条插件

```html
<link rel='stylesheet' href='nprogress.css'/>
<script src='nprogress.js'></script>

```

```js
NProgress.start();  // 进度条开始运动 
NProgress.done();   // 进度条结束运动
```

## RESTful 风格的API

RESTful API 概述

一套关于设计请求的规范。

| GET  | POST | PUT  | DELETE |
| ---- | ---- | ---- | ------ |
| 获取数据 | 添加数据 | 更新数据 | 删除数据   |

![](images/01.png)

## XML基础

##### XML是什么？

XML 的全称是 extensible markup language，代表可扩展标记语言，它的作用是传输和存储数据。

```xml
 <students> 
     <student>
         <sid>001</sid>
         <name>张三</name>
         </student>
     <student>
         <sid>002</sid>
         <name>王二丫</name>
         </student>
 </students>

```

##### XML DOM

XML DOM 即 XML 文档对象模型，是 w3c 组织定义的一套操作 XML 文档对象的API。浏览器会将 XML 文档解析成文档对象模型。