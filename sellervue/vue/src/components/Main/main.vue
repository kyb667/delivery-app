<template>
  <div id="app">
    <v-toolbar>
      <v-tabs dark background-color="primary" grow v-model="tab">
        <v-tab>
          <v-badge color="pink" content="6">
            등록
          </v-badge>
        </v-tab>

        <v-tab>
          <v-badge color="green" content="6">
            현황
          </v-badge>
        </v-tab>

        <v-tab>
          <v-badge color="deep-purple accent-4" content="6">
            내 정보
          </v-badge>
        </v-tab>
        <v-tab>
          <v-badge color="deep-purple accent-4" content="6">
            내 정보
          </v-badge>
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card>
          <AddRecipe />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card>
          <Chart />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card>
          <ShowList />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card> </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import AddRecipe from "./body/addRecipe";
import Chart from "./body/chart";
import ShowList from "./body/showList";
import { store } from "../../store/store";
import { firebase, db, auth } from "../../../firebaseInit";

export default {
  data: () => ({
    tab: null,
  }),
  created: function() {
    this.open();
  },
  components: {
    AddRecipe: AddRecipe,
    Chart: Chart,
    ShowList: ShowList,
  },
  methods: {
    open() {
      this.connection.onmessage = function(event) {
        store.dispatch("sc_getMsg", event.data);
      };
    },
  },
  computed: {
    connection() {
      return this.$store.getters.getScConnection;
    },
  },
};
</script>
