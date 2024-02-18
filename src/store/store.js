import { createStore } from "vuex";
import auth from "./modules/auth/index";
import { LODING_SPINNER_SHOW_MUTATION } from "./storeconstants";

const store = createStore({
    modules: {
        auth,
    },
    state() {
        return {
            showLoading: false,
        }
    },
    mutations: {
        [LODING_SPINNER_SHOW_MUTATION](state, payload) {
            state.showLoading = payload;
        }
    }
})

export default store;