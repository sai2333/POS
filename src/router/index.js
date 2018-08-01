import Vue from 'vue'
import Router from 'vue-router'
import Pos from '@/components/page/pos.vue'
import Colletmoney from '@/components/page/collectMoney.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Pos',
      component: Pos
    },
    {
      path: '/to_collect_money',
      name: 'money',
      component: Colletmoney
    }
  ]
})
