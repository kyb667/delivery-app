<template>
  <div>
    <div>
      <v-row>
        <!-- time setting start -->
        <v-col cols="12" sm="6" md="4">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="checkDate"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Picker in menu"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <!-- time setting end -->
        <!-- showmenu setting start -->
        <v-col>
          <v-tabs v-model="tab">
            <v-tab v-for="item in items" :key="item.tab">
              {{ item.tab }}
            </v-tab>
          </v-tabs>
        </v-col>
        <!-- showmenu setting end -->
      </v-row>
    </div>
    <div>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in items" :key="item.tab">
          <v-card flat v-if="item.tab === 'table'">
            <v-row align="center" justify="center">
              <v-col cols="14" sm="8" md="8">
                <v-sheet height="600">
                  <v-calendar
                    ref="calendar"
                    v-model="table"
                    weekdays="[0, 1, 2, 3, 4, 5, 6]"
                    type="month"
                    :events="events"
                    event-overlap-mode="stack"
                    :event-overlap-threshold="30"
                    @click:event="getDialogInfo"
                  ></v-calendar>
                </v-sheet>
              </v-col>
            </v-row>
          </v-card>
          <v-card flat v-if="item.tab === 'chart'">
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-radio-group v-model="row" row>
                    <v-radio label="월별" value="radio-1"></v-radio>
                    <v-radio label="주별" value="radio-2"></v-radio>
                    <v-radio label="일별" value="radio-3"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-card-text>
            <v-row align="center" justify="center">
              <v-col cols="14" sm="8" md="8">
                <div class="chart"></div>
              </v-col>
            </v-row>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </div>
    <div>
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ dialog_date }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="dialog = false">
                Save
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-list three-line subheader>
            <v-subheader>{{ dialog_msg }}</v-subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Content filtering</v-list-item-title>
                <v-list-item-subtitle>{{ dialog_msg }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <div>
            <v-data-table
              :headers="headers"
              :items="dialog_Info_datatable"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)">
                  mdi-delete
                </v-icon>
              </template>
              <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">
                  Reset
                </v-btn>
              </template>
            </v-data-table>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import c3 from "c3";
import "c3/c3.min.css";

export default {
  data: () => ({
    // time setting
    menu: false,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    checkDate: null,

    // showmenu setting
    tab: null,
    items: [
      { tab: "table", content: "Tab 1 Content" },
      { tab: "chart", content: "Tab 2 Content" },
    ],
    row: null,

    // table setting
    table: "",
    events: [],
    colors: { state: "blue", finish: "green" },
    names: {
      state: "진행중",
      finish: "완료",
      cancelled: "취소",
      reserve: "예약",
    },
    orderInfoList: [],
    orderInfoHeaders: [
      { text: "id_uid", align: "start", value: "id_uid" },
      { text: "order_email", align: "start", value: "order_email" },
      { text: "order_phone", value: "order_phone", sortable: false },
      { text: "order_postcode", value: "order_postcode", sortable: false },
      {
        text: "order_roadAddress",
        value: "order_roadAddress",
        sortable: false,
      },
      {
        text: "order_detailAddress",
        value: "order_detailAddress",
        sortable: false,
      },
      { text: "recipe_id_id", value: "recipe_id_id", sortable: false },
      { text: "count", value: "count", sortable: false },
      { text: "price", value: "price", sortable: false },
    ],

    // dialog setting
    dialog: false,
    dialog_date: null,
    dialog_msg: null,
    dialog_Info: [],
    dialog_Info_datatable: [],
    headers: [
      { text: "id_uid", value: "id_uid" },
      { text: "cnt", value: "cnt" },
      { text: "Actions", value: "actions", sortable: false },
    ],

    // chart setting
    chart_x_header: ["x"],
    chart_y_sales: ["sales"],
    chart_y_cnt: ["cnt"],
  }),
  mounted() {
    this.drowChart();
  },
  created() {
    var d = this.timeSet(this.date);
    this.getOrderInfo(d[0], d[1]);
  },
  methods: {
    // date start ~ end setting
    timeSet(t) {
      var now = t.split("-");
      var lastDate = new Date(parseInt(now[0]), parseInt(now[1]), 0);
      for (var i = 1; i <= parseInt(lastDate.getDate()); i++) {
        this.chart_x_header.push(i);
      }
      var startDate = now[0] + "-" + now[1] + "-" + String(1);
      lastDate = now[0] + "-" + now[1] + "-" + String(lastDate.getDate());
      return [startDate, lastDate];
    },
    // drow chart
    drowChart() {
      c3.generate({
        bindto: ".chart",
        data: {
          x: "x",
          columns: [this.chart_x_header, this.chart_y_sales, this.chart_y_cnt],
        },
        axis: {
          x: {
            type: "timeseries",
            tick: {
              format: "%Y-%m-%d",
            },
          },
        },
      });
    },
    // set orderInfoList
    getOrderInfo(startDate, lastDate) {
      axios
        .post("/db/getOrderInfo", {
          id: this.$store.getters.getLoginId,
          start: startDate,
          last: lastDate,
        })
        .then((res) => {
          console.log(res);
          this.orderInfoList = res["data"]["orderInfo"];
        })
        .catch(function() {
          alert("다시 시도해주세요");
        });
    },
    // set dialog_Info
    getDialogInfo({ nativeEvent, event }) {
      console.log(nativeEvent);
      console.log(event.start);
      axios
        .post("/db/getOrderInfoDetail", {
          id: this.$store.getters.getLoginId,
          start: event.start,
          flag: event.n,
        })
        .then((res) => {
          console.log(res);
          this.dialog_Info = res["data"]["getOrderInfoDetail"];
          var b = [];
          for (var i in this.dialog_Info) {
            console.log(i);
            var a = {};
            a["id_uid"] = i;
            a["cnt"] = this.dialog_Info[i].length;
            b.push(a);
          }
          this.dialog_Info_datatable = b;
          console.log(this.dialog_Info);
          console.log(this.dialog_Info_datatable);
          this.dialog_date = event.start;
          this.dialog_msg = event.name;
          this.dialog = true;
        })
        .catch(function() {
          alert("다시 시도해주세요");
        });
    },
  },
  watch: {
    orderInfoList() {
      var events = [];
      for (let i in this.orderInfoList) {
        var data = this.orderInfoList[i];
        if (data[0]) {
          events.push({
            name: this.names["finish"],
            start: i,
            color: this.colors["finish"],
            timed: data[0],
            n: "finish",
          });
        }
        if (data[1]) {
          events.push({
            name: this.names["state"],
            start: i,
            color: this.colors["state"],
            timed: data[1],
            n: "state",
          });
        }
      }
      console.log(events);
      this.events = events;
    },
    checkDate() {
      var now = this.date;
      var d = this.timeSet(now);
      this.drowChart();
      this.getOrderInfo(d[0], d[1]);
    },
  },
};
</script>
