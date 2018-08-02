<template>
    <div class="pos">
        <div>
            <el-row>
                <el-col :span="7" class="pos-order order-list order-list">
                    <!-- 将tape设置为border-card -->
                    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="订单" name="order">
                            <!-- 表格，使用border属性带有表格，还有添加classname -->
                            <el-table :data="tableData" border style="width:100%" :row-class-name="tableRowClassName">
                                <el-table-column prop="goodsName" label="商品">
                                </el-table-column>
                                <el-table-column prop="price" label="金额" width="50%">
                                </el-table-column>
                                <el-table-column prop="count" label="数量" width="50%">
                                </el-table-column>
                                <el-table-column  label="操作" fixed="right">
                                     <template slot-scope="scope">
                                        <el-button type="text" size="mini" @click="delSingleGoods(scope.row)" >删除</el-button>
                                        <el-button type="text" @click="addOrderList(scope.row)" >增加</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="total-box">
                                <p><small>总数量：</small>{{totalCount}}</p>
                                <p><small>总金额：</small>{{totalMoney}}元</p>
                            </div>
                        </el-tab-pane>
                        <!-- 挂单 -->
                        <el-tab-pane label="挂单" name="bill">
                                <el-table :data="outBillData" border style="width:100%" :row-class-name="tableRowClassName">
                                <el-table-column prop="goodsName" label="商品">
                                </el-table-column>
                                <el-table-column prop="price" label="金额" width="50%">
                                </el-table-column>
                                <el-table-column prop="count" label="数量" width="50%">
                                </el-table-column>
                                <el-table-column  label="操作" fixed="right">
                                     <template slot-scope="scope">
                                        <el-button type="text" size="mini" @click="deleteBillGoods(scope.row)" >删除</el-button>
                                        <el-button type="text" @click="addBillGoods(scope.row)" >增加</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="total-box">
                                <p><small>总数量：</small>{{billTotalCount}}</p>
                                <p><small>总金额：</small>{{billTotalMoney}}元</p>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="外卖" name="takeOut">外卖</el-tab-pane>
                    </el-tabs>
                    
                    <div class="bottom-button">
                        <el-button type="primary" @click="addOutBill">挂单
                            <i class="el-icon-goods el-icon--right"></i>
                        </el-button>
                        <el-button type="danger" @click="dialogVisible = true">清除
                            <i class="el-icon-delete el-icon--right"></i>
                        </el-button>
                        <el-button type="success" @click="addSettleData">结账
                            <i class="el-icon-tickets el-icon--right"></i>
                        </el-button>
                    </div>
                </el-col>
                <el-col :span="17" class="order-list product">
                    <div class="often-goods">
                        <div class="title">热门套餐</div>
                        <div class="often-goods-list">
                            <ul>
                                <li v-for="meal in hotSetMeal" :key='meal.goodsId' @click="addOrderList(meal)">
                                    <span>{{meal.goodsName}}</span>
                                    <span class="o-price">{{meal.price}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!-- 下部分，tabs -->
                    <div class="foodlist-box">
                        <div class="list-tabs">
                            <el-tabs type="card">
                                <el-tab-pane label="主食">
                                    <ul class="foodlist">
                                        <li :key="foodlist.goodsId" v-for="foodlist in type0Foodlists" @click="addOrderList(foodlist)">
                                            <img :src="foodlist.goodsImg" alt="">
                                            <div class="more">
                                                <span class="foodName">{{foodlist.goodsName}}</span>
                                                <span class="foodPrice">￥{{foodlist.price}}元</span>
                                            </div>
                                        </li>
                                    </ul>
                                </el-tab-pane>
                                <el-tab-pane label="小吃">
                                    <ul class="foodlist">
                                    <li :key="foodlist.goodsId" v-for="foodlist in type1Foodlists" @click="addOrderList(foodlist)">
                                            <img :src="foodlist.goodsImg" alt="">
                                            <div class="more">
                                                <span class="foodName">{{foodlist.goodsName}}</span>
                                                <span class="foodPrice">￥{{foodlist.price}}元</span>
                                            </div>
                                    </li>
                                    </ul>
                                </el-tab-pane>
                                <el-tab-pane label="饮品">
                                    <ul class="foodlist">
                                    <li :key="foodlist.goodsId" v-for="foodlist in type2Foodlists" @click="addOrderList(foodlist)">
                                            <img :src="foodlist.goodsImg" alt="">
                                            <div class="more">
                                                <span class="foodName">{{foodlist.goodsName}}</span>
                                                <span class="foodPrice">￥{{foodlist.price}}元</span>
                                            </div>
                                    </li>
                                    </ul>
                                </el-tab-pane>
                                <el-tab-pane label="甜品">
                                    <ul class="foodlist">
                                    <li :key="foodlist.goodsId" v-for="foodlist in type3Foodlists" @click="addOrderList(foodlist)">
                                            <img :src="foodlist.goodsImg" alt="">
                                            <div class="more">
                                                <span class="foodName">{{foodlist.goodsName}}</span>
                                                <span class="foodPrice">￥{{foodlist.price}}元</span>
                                            </div>
                                    </li>
                                    </ul>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 提示框 -->
        <el-dialog 
        title="提示"
        :visible.sync="dialogVisible"
        width="30%">
            <span>真的要清除订单上的全部商品吗？</span>
            <span class="dialog-footer" slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="delAllGoods">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import Qs from 'qs'
export default {
    data() {
        return {
            activeName: 'order',//选中的tab
            dialogVisible: false,//控制提示框
            totalCount: 0,//总数量
            totalMoney:  0,//总价格
            billTotalCount: 0,//挂单的数量
            billTotalMoney: 0,//挂单的金钱
            tableData:[],//订单的数据
            outBillData: [],//挂单的数据
            hotSetMeal: [],//热门套餐数据
            type0Foodlists: [],//主食
            type1Foodlists: [],//小吃
            type2Foodlists: [],//饮品
            type3Foodlists: []//甜品
        }
    },
    mounted: function() {
        //给分栏添加height。(因为element-ui的原因，高度无法起作用。)
        var orderHeight = document.body.clientHeight;
        document.getElementsByClassName('order-list')[0].style.height = orderHeight + 'px';
        document.getElementsByClassName('order-list')[1].style.height = orderHeight + 'px';
    },
    created() {
        axios.get('http://localhost:3000/foodmeal')
        .then(res => {            
            this.hotSetMeal = res.data; 
            console.log(this.hotSetMeal);
        }).catch(error => {
            alert('hotSetMeal网络错误，不能访问')
        }),
        axios.get('http://localhost:3000/foods')
            .then(res => {
                this.type0Foodlists = res.data[0];
                this.type1Foodlists = res.data[1];
                this.type2Foodlists = res.data[2];
                this.type3Foodlists = res.data[3];
            }).catch(error =>{
                alert('typefoodlists网络错误，不能访问！')
            })
    },
    methods: {
        handleClick(tab,event) {
             console.log(tab, event);
             console.log(this.activeName);
        },
        //添加类名
        tableRowClassName({row,rowIndex}){
            if(rowIndex %2 == 0){
                return 'wanring-row';
            }else if(rowIndex %2 !== 0){
                return 'success-row';
            }
            return '';
        },
        //添加数据给tableData
        addOrderList(goods) {
            // console.log(goods);
            let isHave = false;
            //判断这个商品是否在订单中
            for(let i = 0;i < this.tableData.length;i++){
                // console.log(this.tableData[i].goodsId);
                if(this.tableData[i].goodsId == goods.goodsId){
                    isHave = true;
                }
            }
            //根据isHave的值判断订单列表中是否有这个商品
            if(isHave) {
                let arr = this.tableData.filter(o => o.goodsId === goods.goodsId);
                arr[0].count++;
            }else{
                let newGoods = {
                    goodsId:goods.goodsId,
                    goodsName:goods.goodsName,
                    price:goods.price,
                    count:1
                }
                this.tableData.push(newGoods);
                // console.log(this.tableData);
            }
            //进行数量和价格的总计算
            this.getAllMoney();
        },
        //删除订单中的某个食品
        delSingleGoods(goods){
            //返回一个全部和goods的id不一样的数组。（也就是不一样id的被删除，其实重新给tableData赋值）
            // this.tableData = this.tableData.filter(o => o.goodsId != goods.goodsId);
            //只减少件数,如果只剩下一件，则返回除了这个对象的其他对象（删除）
            if(goods.count > 1){
                this.tableData.forEach(o =>{
                if(o.goodsId == goods.goodsId){
                    o.count = o.count-1
                }
                });
            }else if(goods.count == 1){
                this.tableData = this.tableData.filter(o => o.goodsId != goods.goodsId);
            }
            console.log(this.tableData);
            this.getAllMoney();
        },
        //删除挂单中的商品
        deleteBillGoods(goods){
            if(goods.count > 1){
                this.outBillData.forEach(o =>{
                if(o.goodsId == goods.goodsId){
                    o.count = o.count-1
                }
                });
            }else if(goods.count == 1){
                this.outBillData = this.outBillData.filter(o => o.goodsId != goods.goodsId);
            }
            //算账
            this.getAllMoney();
        },
        //添加挂单的份数
        addBillGoods(goods) {
            this.outBillData.forEach(item => {
                if(item.goodsId == goods.goodsId){
                    item.count++;
                }
            })
            //算钱
            this.getAllMoney();
        },
        //订单总计算（价格和数量）
        getAllMoney(){
            //这里初始化所有的商品件数和价格，因为每次进来的tableData都是重新进行赋值的，如果不删除，会进行操作前的数据相加
            this.totalCount = 0;
            this.totalMoney = 0;
            this.billTotalCount = 0;
            this.billTotalMoney = 0;
            if(this.tableData){
                this.tableData.forEach((element) => {
                    this.totalCount += element.count;
                    this.totalMoney = this.totalMoney+ (element.price*element.count)
                })
            }
            if(this.outBillData){
                this.outBillData.forEach((element) => {
                    this.billTotalCount += element.count;
                    this.billTotalMoney = this.billTotalMoney+ (element.price*element.count)
                })
            }
        },
        //清除所有的商品
        delAllGoods() {
            this.tableData = [];
            this.totalCount = 0;
            this.totalMoney = 0;
            this.dialogVisible = false;
            this.$message({
                message: '订单清除成功',
                type: 'success'
            });
        },
        //询问用户是否真的需要全部清除
        inquiryUser() {
            this.dialogVisible = true;
        },
        //时间转换
        getLocalTime() {
            let now = new Date();
            let year = now.getFullYear();
            let month = now.getMonth() + 1;
            let date = now.getDate();
            if(month< 10) {
                month = "0" +month;
            }
            if(date < 10){
                date = '0' +date;
            }
            let time = `${year}-${month}-${date}`;
            return time;
        },
        //结账，把结账后的所有数据插入detail集合
        //结账根据activeName(进入了哪个tab)来知道需要结账哪个的数据
        addSettleData() {
            //给订单和挂单的数据添加日期
            if(this.totalCount != 0){
                this.tableData.forEach(item => item['time'] = this.getLocalTime())
            }
            if(this.billTotalCount != 0){
                this.outBillData.forEach(item => item['time'] = this.getLocalTime())
            }
            if(this.activeName == 'order'){
                //判断是否已经有商品
                if(this.totalCount != 0){
                    //进行post请求，提交json数据
                    axios({
                        url:'http://localhost:3000/settle_post',
                        method:'post',
                        data:JSON.stringify(this.tableData),
                        //transformRequest 表示可以在这里进行修改post数据
                        // transformRequest: [function(data){
                        //     return data;
                        // }],
                        //请求头类型改为josn数据
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    //清空所有数据
                    this.tableData = [];
                    this.totalCount = 0;
                    this.totalMoney = 0;
                    this.$message({
                        message: '订单结账成功',
                        type: 'success'
                    });
                }else{
                    this.$message.error('请先键入商品，不能进行空结')
                }
            }else if(this.activeName == 'bill'){
                if(this.outBillData != 0){
                    axios({
                        url:'http://localhost:3000/settle_post',
                        method:'post',
                        data:JSON.stringify(this.outBillData),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    this.outBillData = [];
                    this.billTotalCount = 0;
                    this.billTotalMoney = 0;
                    this.$message({
                        message: '挂单结账成功',
                        type: 'success'
                    });
                }else{
                    this.$message.error('请先键入商品，不能进行空结')
                }
            }            
        },
        //挂单。把当前订单的数据转给挂单，如果挂单有数据了，则提示不能挂单
        addOutBill() {
            if(this.totalCount == 0){
                this.$message.error('请先键入商品才能进行挂单!')  
            }else{
                //挂单没数据的话，直接转过来即可
                if(this.outBillData.length == 0){
                    this.outBillData = this.tableData;
                }else{
                    //存放数组的对象
                    let arr = {};
                    //把有相同id的商品，添加份数
                    for(let i = 0;i < this.tableData.length;i++){
                        for(let t = 0;t < this.outBillData.length;t++){
                            if(this.outBillData[t]['goodsId'] == this.tableData[i]['goodsId']){
                                this.outBillData[t]['count']++;
                                break;
                            }
                        }
                    }
                    //去重
                    this.tableData.forEach(item => this.outBillData.push(item));
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
                    
                }
                console.log(this.outBillData.length);
                //清空订单的所有数据
                this.tableData = [];
                this.totalCount = 0;
                this.totalMoney = 0;
                this.getAllMoney();
                this.$message({
                    message: '挂单成功',
                    type: 'success'
                })
            }
        }
    },
    
}
</script>

<style lang="scss" scoped>
    .el-table tr.wanring-row{
        background-color: aqua;
    }
    .pos-order{
        background-color: #f9fafc;
        border-right: 1px solid #ccc;
        .total-box{
            display: flex;
            justify-content: space-around;
            align-items: center;
            border:1px solid #eee;
            border-top-width: 0;
        }
        .bottom-button{
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-around;
            margin-top: 2rem;
        }
    }
    .product{
       background-color: #f9fafc; 
       .title{
           color:orange;
           height: 20px;
           border-bottom: 1px solid #d3dce6;
           background-color: #f9fafc;
           padding: 10px;
       }
       .often-goods-list ul {
           list-style: none;
           display: flex;
           flex-direction: row;
           flex-wrap: wrap;
           justify-content: center;
           align-content: flex-start;
           padding: 0;
           li{
                cursor: pointer;
                width:8rem;
                border:1px solid #e5e9f2;
                padding: 10px;
                margin: 5px;
                background-color: #fff;
                .o-price{
                    color:#58b7ff;
                }
           }
        }

        .foodlist-box{
            // background-color: #eee;
            .foodlist {
                list-style: none;
                display: flex;
                flex-flow: row;
                justify-content: space-around;
                padding-left: 0;
                flex-wrap: wrap;
                align-items: flex-end;
                align-content: flex-start;
                li{
                    cursor: pointer;
                    width: 11rem;
                    background-color: #FBFBFB;
                    display: flex;
                    margin-right: 1rem;
                    margin-top: 1rem;
                    // flex-wrap: wrap;
                    justify-content: space-around;
                    box-shadow: -1px 2px 3px #888;
                    margin-bottom: .7rem;
                        img{
                            width: 47%;
                            height: 85%;
                            margin: .3rem 0 0.3rem;
                        }
                    
                    .more{
                        display: flex;
                        flex-flow: column;
                        align-items: center;
                        justify-content: center;
                        .foodName{
                            color:orange;
                            font-size: 1em;
                            margin-bottom: .5rem;
                        }
                    }
                }
            }
        }
    }
    
</style>
