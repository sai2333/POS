<template>
    <div class="left-nav">
        <ul>
            <li class="link-tba">
                <router-link to='/'>
                <span class="iconfont icon-wodezichan"></span>
                <p>收银</p>
                </router-link>
            </li>
            <li>
                <span class="iconfont icon-dianpu-copy"></span>
                <p>店铺</p>
            </li>
            <li>
                <span  class="iconfont icon-hanbao"></span>
                <p>商品</p>
            </li>
            <li>
                <span  class="iconfont icon-huiyuan"></span>
                <p>会员</p>
                </li>    
            <li class="link-tba">
                <router-link to="/to_collect_money">
                    <span class="iconfont icon-shezhi"></span>
                    <p>统计</p>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
    .left-nav{
        color:#fff;
        font-size: 10px;
        height: 100%;
        background-color: #1d8ce0;
        float: left;
        width: 5%;
        .iconfont{
            font-size: 24px;
        }
        ul{
            padding: 0;
            margin: 0;
            list-style: none;
            li{
                text-align: center;
                border-bottom: 1px solid #20a0ff;
                padding: .7rem;
            }
        }
    }
    .link-tba{
        a{
            display: inline-block;
            text-decoration: none;
            width: 100%;
            color:#fff;
        }
    }
</style>

