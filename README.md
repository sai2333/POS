# 使用vuejs+axios+elementUI+nodejs+vueRouter制作的项目。
### 目前完成的功能：
* 商品的基本数据库（菜单）
* 商品的增删改查
* 营业的商品，数量，金额查询功能（可指定某天进行查询）
<<<<<<< HEAD
* 挂单功能，允许用户把订单的商品添加到挂单，并且可以无限次把订单转到挂单。
* 挂单和订单两个不同的数据，当点击挂单界面，所有操作属于挂单界面的数据，反正，订单也一样。
后续想完成的功能：
* 通过后台接口，在用户界面实现新商品的加入（这样不懂的用户也可以自己加入新的菜品）
* 结账后，当前账单添加时间（以便后续数据库查询添加具体详细时间的查询）
* 时间的查询（例如：6点到8点的查询）
* ~~挂单功能~~
## 界面设计
=======
### 后续想完成的功能：
* 通过后台接口，在用户界面实现新商品的加入（这样不懂的用户也可以自己加入新的菜品）
* 结账后，当前账单添加时间（以便后续数据库查询添加具体详细时间的查询）
* 时间的查询（例如：6点到8点的查询）
* 挂单功能
### 界面设计
>>>>>>> a03a3ae12cd7a8922f43506e92ed1f00ef554fe1
参考了市场上的收银系统，然后决定先把基本需求做好了先，也就是录入数据，一开始是没考虑后台的，打算把数据都存储在客户端就可以了。后来觉得客户端的存储有点小（虽然不考虑安全性的问题）。毕竟朋友的需求是最少一个月的记录，当时有点犯愁，我不会后端啊，也没学过数据库。但想来想去也只能自己写接口了，然后就临阵磨枪学了nodejs和MongoDB。
通过[MongoDB官网](https://docs.mongodb.com/manual/reference/mongo-shell/)很快就入门了。nodejs的话就先过了一遍基础教程，然后自己模拟了一下get请求和post请求也顺利摸清该怎么写目前的API。
### 期间遇到的问题
1. nodejs操作MongoDB插入数据，MongoDB查询集合无效？
2. 跨域取数据
3. 后台编码解析出现问题。无法正确的拿到数据
4. 订单无限次把订单数据转给挂单
5. 怎么在用户切换页面（挂单页面或者订单页面）的时候，让数据知道自己处于什么页面？
### 问题解决思路
1. 一开始是在菜鸟教程学的nodejs操作MongoDB，（其实是有插入数据的了，但中间因为我查询数据的方法不对，导致以为没有插入数据）。后来想着是否这教程太老啦，版本问题还是。所以决定去官网学。发现官网的也不行。后来才发现原因。用来在进入数据库的时候还需要查询集合，然后才能进入集合。代码为：use 数据库名称 => show collections(查询集合) => db.food.find({})(进入集合并且查询所有数据)
2. 跨域的话，一开始打算用jsonp，然后前端通过创建script来执行回调即可。
```
//通过request事件来响应request请求
server.on('request',function(req,res) {
    //解析url的路径
    let urlPath = url.parse(req.url).pathname;
    let qs = querystring.parse(req.url.split('?')[1]);
    //如果urlPath为jsonp，就认定该请求为携带jsonp方法的http请求
    if(urlPath === '/jsonp' && qs.callback){
        res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
        var data = fs.readFile('foods.json','utf8',function(err,data){
            if(err) return console.log(err);
            console.log(data);
            //通过querystring模块来解析query字符串
            //这样在前端就可以按照回调方法来进行跨域了
            var callback = qs.callback + '(' + data + ')';
            res.end(callback);
        });
    }else{
        //如果不是jsonp请求，则返回其他请求
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
        res.end('hello wodrl!')
    }
}).listen(8081);
```
还有一个方案是后台自己设置跨域，因为刚学的nodejs，索性就采用了这种方法。
```
//设置跨域访问
app.all('*',function(req,res,next) {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    //json数据
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})
```
3. 后台编码解析，使用的是axios进行post请求的，一开始在前端使用JSON.stringify()但是不行，nodejs解析出来是这样的：
```
data = [{'goodsId':1,'goodsName':'鸡米花','price':10}] ==> {'{'goodsId':1,'goodsName':'鸡米花','price':10}': ''}
```
还试过直接post数据过去后端，但后端拿到的是[obejct object]
通过搜索后，我试了QS模块，使用了Qs.stringify(data),后端终于拿到数据了，但是只能拿一条。如果我试图在data里面添加多一个对象，它无法正确的解析2条数据，会把同样属性的叠加进去。
```
//QS.stringify(data)解析出来的。
{ goodsId: '1',
  goodsName: [ '香辣鸡腿堡', '田园鸡腿堡' ],
  price: [ '18', '15' ],
  count: [ '1,goodsId=2', '1' ] }
```
后来才得知，直接提交json数据的话，前端必须告知服务器端数据是json格式。所以把headers改下就可以了。最终修改axios的headers属性为：application/json;
4. 这个是个数组对象去重的问题。一开始我用遍历来完成数据的去重，但发现有点麻烦。写的代码也比较长。后来我利用了对象的唯一性，emmm，就是一个对象里面的属性，只能出现一次，（你写两个name属性，它也只会拿你后面的那个）。所以我利用对象的goodsId来作为对象的属性。属性值当然就是数据啦。
```
//这里翻转数组是因为，对象的唯一性去重会把前面相同的去掉。
//而我需要的数据是在前面，所以需要翻转一下。
this.outBillData.reverse();
for(let i = 0;i < this.outBillData.length;i++){
    //利用对象的唯一性进行去重
    //现在的arr是一个用goodsid做属性的对象
    arr[this.outBillData[i]['goodsId']] = this.outBillData[i];
}
//把arr里面对象的属性值赋值给挂单数据
this.outBillData = [];//先清空
console.log(arr);
for(let item in arr){
    this.outBillData.push(arr[item]);
}
```
> Tabs 组件提供了选项卡功能，默认选中第一个标签页，你也可以通过 value 属性来指定当前选中的标签页。
5. 本来想自己写vue实例属性来进行判断的，后来我重新看了ElementUI的文档，也就是上面的这句话，然后我使用了activeName属性来进行控制挂单和订单。这样非常方便了我的数据交互。
### 修改代码
[![pos.png](https://s6.postimg.cc/tcqhdub0h/pos.png)](https://postimg.cc/image/5yii1wt31/)
这是主要的代码结构，如果想添加主要功能的话可以到pos.vue里面进行，数据库在collectMoney.vue查询。vue-router配置，在router的index.js。每个功能在当前页面都是有注释的，如果实在还是有看不懂的地方，可以联系我。
### 效果图，点击图片可查看gif图
[![toGKf.md.gif](https://cuntuku.com/images/2018/08/01/toGKf.md.gif)](https://cuntuku.com/image/toGKf)
[![toiEc.md.gif](https://cuntuku.com/images/2018/08/01/toiEc.md.gif)](https://cuntuku.com/image/toiEc)
### 这个项目起源一个好友的需求，目前项目功能还不完善，不过对于日常还是能使用的。后续出现bug，也会反馈，记录在这里。
### 改善
如果有哪些问题，或者需要添加的功能。希望可以联系我。适合的话我会添加到项目里面去。
最后，如果您喜欢这个项目的话，可以给我个start，这是目前给我最大的动力。
