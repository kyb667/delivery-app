// store.js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state:{// components 간에 공유할 data 속성
        counter : 0,
        num : 1,
        loginId : null
    },
    getters:{
        doubleCounter : function(state){
            return state.counter * 2;
        },
        getCounter : function(state){
            return state.counter;
        },
        getNum : function(state){
            return state.num;
        },
        getLoginId: function(state){
            return state.loginId;
        }
    },
    mutations:{ //setter
        addCnt : function(state, payload){
            return state.counter+=payload;
        },
        minusCnt : function(state, payload){
            return state.counter-=payload;
        },
        setloginId : function(state, id){
            return state.loginId = id
        }
    },
    actions:{
        asyncIncrement: function (context, payload) {
            return setTimeout(function () {
                context.commit('addCnt', payload.by);
            }, payload.duration);
        }
    }
});