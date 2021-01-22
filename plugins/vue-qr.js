import Vue from 'vue'
import vueQr from 'vue-qr'

Vue.use(vueQr)

Vue.mixin({
    methods: {
        async callApi(method, url, dataObj) {
            try {

                let data = await this.$axios ({
                    method: method,
                    url: url,
                    data: dataObj
                })
                return data

            } catch (e) {

                return e.response

            }
        },
    }
})