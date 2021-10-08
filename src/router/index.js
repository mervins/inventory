import Vue from 'vue'
import VueRouter from 'vue-router'
//import Home from '../views/Home.vue'
// import Login from '../views/login/login.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Login',
        // component: Login
        component: () => import ( /* webpackChunkName: "about" */ '../views/login/login.vue')
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import ( /* webpackChunkName: "about" */ '../views/Dashboard.vue')
    },
    {
        path: '/inventory',
        name: 'Inventory',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/inventory.vue')
    },
    {
        path: '/supplier',
        name: 'Supplier',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Supplier.vue')
    },
    {
        path: '/customer',
        name: 'Customer',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Customer.vue')
    },
    {
        path: '/track',
        name: 'Track',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Track.vue')
    },
    {
        path: '/stockin',
        name: 'Stockin',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Stockin.vue')
    },
    {
        path: '/stockinview/:stockin_id',
        name: 'Stockinview',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/StockinView.vue')
    },
    {
        path: '/stockout',
        name: 'Stockout',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Stockout.vue')
    },
    {
        path: '/stockoutview/:stockout_id',
        name: 'Stockoutview',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/StockoutView.vue')
    },
    {
        path: '/aging',
        name: 'Aging',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Aging.vue')
    },
    {
        path: '/stockcustomer/:customer_id',
        name: 'Stockcustomer',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/StockCustomer.vue')
    },
    {
        path: '/report',
        name: 'Report',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Report.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/login/registration.vue')
    },
    {
        path: '/alluser',
        name: 'User',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/login/user_list.vue')
    },
    {
        path: '/return',
        name: 'Return',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Return.vue')
    },
    {
        path: '/category',
        name: 'Category',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/cashier/Category.vue')
    },
    {
        path: '/table',
        name: 'Table',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/cashier/Table.vue')
    },
    {
        path: '/product',
        name: 'Product',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/cashier/Product.vue')
    },
    {
        path: '/order',
        name: 'Order',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/cashier/Order.vue')
    },
    {
        path: '/billing',
        name: 'Billing',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/cashier/Billing.vue')
    },
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router