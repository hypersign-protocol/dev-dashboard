import Vue from 'vue'
import Router from 'vue-router'
import PKIIdLogin from './views/PKIIdLogin.vue';
import config from './config';
import Application from './views/Application.vue';
import Subscription from './views/Subscription.vue';
import Dashboard from './views/Dashboard.vue';
import fetch from 'node-fetch';
import Schema from './views/Schema.vue';
import FourOFour from './views/404.vue';

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
            path: '/*',
            component: FourOFour
        },
        {
            path: '/login',
            redirect: '/studio/login'
        },
        {
            path: '/studio/login',
            name: 'PKIIdLogin',
            component: PKIIdLogin
        },
        {
            path: '/studio/dashboard',
            name: 'dashboard',
            component: Dashboard,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/studio/schema',
            name: 'schema',
            component: Schema,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/studio/apps',
            name: 'apps',
            component: Application,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/studio/subscription',
            name: 'presentation',
            component: Subscription,
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
            const url = `${config.studioServer.BASE_URL}protected`
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