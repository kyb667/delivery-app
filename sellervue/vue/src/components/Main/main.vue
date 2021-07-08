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
          <TEST />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card>
          <!-- Parent counter : {{ $store.state.counter }} <br> -->
          {{ anoterCounter }} <br />
          Parent counter : {{ getCounter }} <br />
          <button @click="addCounter">+</button>
          <button @click="subCounter">-</button>
          <!-- Child 컴포넌트를 등록하고 counter 데이터 속성을 props로 전달한다. -->
          <!-- <child v-bind:num="counter"></child> -->
          <!-- <child></child> -->
          <Child />
          <!-- by 와 duration 등의 여러 인자 값을 넘길 경우, 객체안에 key - value 형태로 여러 값을 넘길 수 있다 -->
          <button @click="asyncIncrement({ by: 50, duration: 500 })">
            Increment
          </button>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import AddRecipe from "./body/addRecipe";
import TEST from "./body/test";
import Chart from "./body/chart";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  data: () => ({
    tab: null,
  }),
  components: {
    // Child 컴포넌트를 하위 컴포넌트로 등록
    AddRecipe: AddRecipe,
    Chart: Chart,
    TEST: TEST,
  },
  methods: {
    // 이벤트 추가
    ...mapMutations(["addCnt"]),
    ...mapActions(["asyncIncrement"]),
    subCounter() {
      this.$store.commit("minusCnt", 10);
      console.log(this.$store);
    },
    addCounter() {
      this.addCnt(1);
    },
  },
  computed: {
    ...mapGetters(["getCounter"]),
    anoterCounter() {
      return this.$store.getters.getNum;
    },
  },
};
</script>
