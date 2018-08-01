<template>
    <div class="collect-box">
        <div class="logo">
            <span class="iconfont icon-logo"></span>
            <h1>统计清单</h1>
        </div>
        
        <!-- 查询数据 -->
        <div class="searrchToData">
            <div class="block">
                <!-- <span class="demonstration">请选择时间进行查询数据</span> -->
                <el-date-picker
                v-model="value"
                type="date"
                placeholder="选择日期查询数据"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
        </div>

        <!-- 手风琴插件 -->
        <div class="accordion-box">
            <el-collapse v-model="activeName" accordion class="accordion">
                <el-collapse-item :title="tabletitle" name="1">
                    <!-- 表格显示数据 -->
                    <div class="data-box">
                    <el-table :data="searchData" style="width:100%" :row-class-name="tableRowClassName" max-height="500" v-loading="loading">
                        <el-table-column prop="goodsName"
                            label="商品名称"
                            width="180">
                        </el-table-column>
                        <el-table-column prop="price"
                            label="价格"
                            width="180">
                        </el-table-column>
                        <el-table-column prop="count"
                            label="份数"
                            >
                        </el-table-column>
                    </el-table>
                    <div class="sum">
                        <p><small>总数量：</small>{{sumCount}}份</p>
                        <p><small>今天总营业金额：</small>{{sumMoney}}元</p>
                    </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="已售的所有商品" name="2">
                    <!-- 表格显示数据 -->
                    <div class="data-box">
                    <el-table :data="tableData" style="width:100%" :row-class-name="tableRowClassName" max-height="500" :default-sort="{prop:'time'}">
                        <el-table-column prop="time"
                            label="日期"
                            sortable
                            width="180">
                        </el-table-column>
                        <el-table-column prop="goodsName"
                            label="商品名称"
                            width="180">
                        </el-table-column>
                        <el-table-column prop="price"
                            label="价格"
                            width="180">
                        </el-table-column>
                        <el-table-column prop="count"
                            label="份数">
                        </el-table-column>
                    </el-table>
                    <div class="sum">
                        <p><small>总数量：</small>{{getSumCount}}份</p>
                        <p><small>历史总营业金额：</small>{{getSumMoney}}元</p>
                    </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
        
    </div>
</template>

<script>
import LeftNav from '../leftNav.vue'
import axios from 'axios'
export default {
    data() {
        return {
            activeName: '1',//手风琴绑定的字符串
            tableData: [],//数据库返回过来的数据
            searchData:[],//用户搜索后存储的数据
            totalCount: 0,//历史数据库的件数
            totalMoney: 0,//历史数据库的总金额
            value: '',//用户搜索的日期
            nowTotalMoney:0,//用户搜索||当天的总金额
            nowTotalCount:0,//同上
            loading: true
        }
    },
    updated() {
        setTimeout(() => {
            this.loading = false
        },1000)
    },
    created() {
        axios.get('http://localhost:3000/to_collect_money')
            .then(res => {
                this.tableData = res.data;
                //默认渲染当天的数据
                this.searchData = res.data.filter(item => item['time'] == this.getLocalTime());
            }).catch(error => {
                alert('hotSetMeal网络错误，不能访问')
            });
    },
    methods: {
        //表格绑定class
        tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
            return 'warning-row';
            } else if (rowIndex === 3) {
                return 'success-row';   
            }
            return '';
        },
        //用户使用时间搜索数据
        userSerachData(strTime){
            //返回用户需要的数据
            this.searchData = this.tableData.filter(item => item['time'] == strTime);
        },
        //时间格式化
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
        }
    },
    computed: {
        //计算总数
        getSumCount() {
            if(this.tableData){
                this.tableData.forEach((element) => {
                    this.totalCount += element.count;
                })
            }
            return this.totalCount;
        },
        sumCount(){
            if(this.searchData){
                this.searchData.forEach((element) => {
                    this.nowTotalCount += element.count;
                })
            }
            return this.nowTotalCount
        },
        getSumMoney() {
            if(this.tableData) {
                this.tableData.forEach((element) => this.totalMoney = this.totalMoney+ (element.price*element.count))
            }
            return this.totalMoney;
        },
        sumMoney() {
            if(this.searchData){
                this.searchData.forEach((element) => this.nowTotalMoney = this.nowTotalMoney+ (element.price*element.count))
            }
            return this.nowTotalMoney;
        },
        //绑定表格表头日期,并且获取用户搜索的日期数据
        tabletitle(){
            if(this.value!= ''){
                this.userSerachData(this.value);
                //把钱和件数清零
                this.nowTotalMoney = 0;
                this.nowTotalCount = 0;
                return this.value
            }
            return this.getLocalTime();
        }
    },
    components: {
        LeftNav
    }
}
</script>

<style lang="scss" scoped>
    .collect-box{
        .logo{
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 2.5rem;
            span{
                    font-size: 5rem;
                    color:darkgoldenrod;
            }
        }
        .searrchToData{
            margin-left: 5.5rem;
        }
        .accordion-box{
            box-shadow: -3px 3px 3px rgba(116,115,115,.4);
            width: 90%;
            margin: 0 auto;
            // border:1px solid #333;
            background: #fff;
            .accordion{
                margin: 1rem;
            }
            .data-box{
                border: 1px solid #333;
                .sum{
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    border:1px solid #eee;
                    border-top-width: 0;
                }
            }

        }
    }
</style>
