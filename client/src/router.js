import Vue from 'vue'
import Router from 'vue-router'
import config from './config';
import fetch from 'node-fetch';
Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [{
            path: '/',
            redirect: '/studio/login'
        },
        {
            path: '/studio',
            redirect: '/studio/login'
        },
        {
            path: '/login',
            redirect: '/studio/login'
        },
        {
            path: '/studio/login',
            name: 'PKIIdLogin',
            component: () => import(/* webpackChunkName: "login" */ './views/PKIIdLogin.vue'),
        },
        {
            path: '/studio/dashboard',
            name: 'dashboard',
            component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/studio/schema',
            name: 'schema',
            component: () => import(/* webpackChunkName: "Schema" */ './views/Schema.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/studio/apps',
            name: 'apps',
            component: () => import(/* webpackChunkName: "Application" */ './views/Application.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/studio/subscription',
            name: 'presentation',
            component: () => import(/* webpackChunkName: "Subscription" */ './views/Subscription.vue'),
            meta: {
                requiresAuth: false
            }
        },
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            const url = `${config.studioServer.BASE_URL}hs/api/v2/auth/protected`
                //console.log(url)
                //console.log('...............')
            fetch(url, {
                    headers: {
                        "Authorization": `Bearer ${authToken}`
                    },
                    method: "POST"
                }).then(res => res.json())
                .then(json => {
                    //console.log('...............')
                    //console.log(json.message)
                    if (json.status == 403) {
                        next({
                            path: '/studio/login',
                            params: { nextUrl: to.fullPath }
                        })
                    } else {
                        //console.log(json.message)
                        localStorage.setItem("user", JSON.stringify(json.message));
                        /studio/ / next()
                        if (!json.message.isSubscribed) {
                            next({
                                path: '/studio/subscription',
                                params: { nextUrl: to.fullPath }
                            })
                        } else {
                            next()
                        }
                    }
                })
                .catch((e) => {
                    next({
                        path: '/studio/login',
                        params: { nextUrl: to.fullPath }
                    })
                })
        } else {
            next({
                path: '/studio/login',
                params: { nextUrl: to.fullPath }
            })
        }
    } else {
        next()
    }
})
export default router