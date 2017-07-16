怎么开发一个npm包

一、注册npm账号

- 怎么将代码提到github，大家都知道需要一个github账号
- 同样，开发一个npm包，当然也需要一个npm账号，将npm包发布到npm的托管服务器
- 注册地址：http://npmjs.org
- 该实例包含了模块的局部调用和全局调用两种方式

二、开发npm包

1.目录构建

- npm init
- 项目结构：npm包实际是一个存档文件，即一个目录直接打包为.zip或tar.gz格式的文件，安装后解压还原为目录。完全符合CommonJS规范的包目录应该包含如下这些文件。
      .
      ├── bin           //命令配置
      ├── README.md     //说明文档
      ├── index.js      //主入口
      ├── src           //功能文件
      ├── package.json  //包信息
      └── test          //测试用例
  生产package.json文件，里面要注意参数，repository:""一定要填写仓库地址，因为最后npmjs，会从线上仓库获取。
  证明是否登录成功：
  　npm who am i

2.开发模块

- 入口index.js模块
  非全局安装(npm install xxx)，则多有的函数接口都通过index.js暴露给外部调用
      /**
      * Hello World
      * @function hello
      **/
      const hello = function(key){
          console.log('Hello World!');
      };
      
      exports.hello     = hello;
- init.js模块
      const exec = require('child_process').exec;
      
      exports.run = function(name) {
          //初始化一个空文件夹
          exec('mkdir ' + name,function() {
              console.log('king init命令已执行...');
          });
      };
- start.js模块
      const express = require('express');
      const app     = express();
      
      exports.run = function(options) {
          const port = options.port || 3000;
          app.listen(port);
          console.log('服务已启动，正在监听' + port + '端口...');
      };

3.配置全局命令

bin目录下写配置代码

- cli.js自定义命令，主要通过引入commander模块去处理，包括命令描述、参数及执行动作
- king.js文件名称应与全局命令king保持一致，做命令的入口，具体看demo

三、发布npm包

1.npm login

    npm login  //没有注册账号的，npm adduser

2.npm publish

    npm publish .

   如果你以后修改了代码，然后想要同步到 npm 上的话请修改 package.json 中的 version 然后再次 publish，更新的版本上传的版本要大于上次

1.使用 cnpm 的注意报错：

    no_perms Private mode enable, only admin can publish this module

　　设置回原本的就可以了：

    npm config set registry http://registry.npmjs.org 

　　2.npm包package.json中registory属性一定要填写，每次publish npm时package.json中version版本一定要大于上一次。

 　  3.npm publish failed put 500  unexpected status code 401这样的报错信息，往往是没有登录成功，操作npm login

管理包权限：

　　通常，一个包只有一个拥有权限进行发布。如果需要多人进行发布，可以使用npm owner 命令帮助你管理包的所有者：

　　npm owner ls eventproxy

　　使用这个命令，也可以添加包的拥有者，删除一个包的拥有者：

    npm owner ls <package name>
    npm owner add <user> <package name>
    npm owner rm <user> <package name>



四、全局安装和局部安装

1.局部安装

- 所有的函数功能接口都由index.js暴露给外部
- src里面可以放功能代码，src –> index.js只做output，暴露给外部调用
  2.全局安装
- 包全局安装的情况，一般是做自动化工具，关键在于配置全局命令，与index.js无关
- 通过bin目录下与全局命令相同的js文件(如king.js)处理command的输入【如：king start】
- 来，让我们看看运行king –help的效果
  

五、常见问题

1. npm publish出错

    npm ERR! publish Failed PUT 403
    npm ERR! Darwin 16.0.0
    npm ERR! argv "/usr/local/Cellar/node/5.6.0/bin/node" "/usr/local/bin/npm" "publish"
    npm ERR! node v5.6.0
    npm ERR! npm  v3.10.3
    npm ERR! code E403
    
    npm ERR! "You cannot publish over the previously published version 0.0.43." : npm-develop
    npm ERR!
    npm ERR! If you need help, you may report this error at:
    npm ERR!     <https://github.com/npm/npm/issues>
    
    npm ERR! Please include the following file with any support request:
    npm ERR!     /Volumes/work/private/github/npm-develop/npm-debug.log

没有更新package.json的版本号，每次的版本号必须大于上次，否则无法publish

2. 采用sudo npm publish

password应该输入的是本机开机密码，非npm账号密码

3. 全局命令无效

package.json中的bin命令配置，属性值应该和脚本名称一致

    "bin": {
      "king": "./bin/king.js"
    }

1. 发布包过程可能会遇到很多问题，我印象比较深刻的是npm ERR publish 403
   You do not have permission to publish 'somepackage'.Are you logged in as
   the corrent user?:somepackage
   意思是我没权限发布somepackage，并问我是否使用了正确的账号，
   那也许是somepackage被别人发布过了吧，所以我修改了package.json文件
   把name改成somepackage_xiaoguoping.

5.验证

在http://search.npmjs.org/可以查询刚刚发布的package



这里先使用npm install 你发布出去的包的名字，然后看看命令行里面是不是把你的包下载了下来。如果下载成功，就说明你的包已经成功地发布在npm上了。

或者你亲自上npm这个网站（该带梯子的请自带梯子），然后在搜索框里面输入你刚才写下来的关键字。。。不过，如果你的包的星星（点赞）数量不够的话应该会排到很尾。。。所以我建议你用包名直接搜（反正我用关键字找找不到我的包。。。）：

在你执行完npm init这个步骤之后，你把代码扔进这个包里面后，就形成了一个本地的包，可以直接把这个包扔到项目里面node_module这个文件夹里面的，然后在你的项目里面就可以直接：

      var a=require('你的包名');

直接使用包名引入，不用文件路径了，就像引入fs或者http模块一样

测试完确定没有什么bug之后再执行npm publish哦
