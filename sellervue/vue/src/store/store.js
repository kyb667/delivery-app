// store.js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    loginId: null,
    sc_connection: null,
    order_list: [],
    login_uid: null,
  },
  getters: {
    getScConnection: function(state) {
      return state.sc_connection;
    },
    getOrderList: function(state) {
      return state.order_list;
    },
    getLoginId: function(state) {
      return state.loginId;
    },
    getLogin_uid: function(state) {
      return state.login_uid;
    },
  },
  mutations: {
    //connection websocket
    setSc: function(state, id) {
      console.log("Starting connection to WebSocket Server");
      return (state.sc_connection = new WebSocket(
        "ws://localhost:8000/chat/ws/" + id
      ));
    },
    // open websocket
    setOpenSc: function(state) {
      state.sc_connection.open;
      console.log("Successfully connected to the echo websocket server...");
    },
    setScMsg: function(state, msg) {
      state.order_list.push(msg);
    },
    setloginId: function(state, id) {
      return (state.loginId = id);
    },
    setLogin_uid: function(state, uid) {
      return (state.login_uid = uid);
    },
  },
  actions: {
    sc_conn: function(context, id) {
      context.commit("setSc", id);
      context.commit("setOpenSc");
    },
    sc_getMsg: function(context, msg) {
      var message = JSON.parse(msg);
      console.log(message);
      context.commit("setScMsg", {
        message: message["message"],
        writer: message["writer"],
      });
    },
  },
});
