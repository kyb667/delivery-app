<template>
  <div>
    <div>
      <div>
        <v-sheet tile height="54" class="d-flex">
          <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon class="ma-2" @click="$refs.calendar.next()">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="value"
            weekdays="[0, 1, 2, 3, 4, 5, 6]"
            type="month"
            :events="events"
            event-overlap-mode="stack"
            :event-overlap-threshold="30"
            :event-color="getEventColor"
            @click:event="getEvents1"
          ></v-calendar>
        </v-sheet>
      </div>
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
    <div>
      <div class="chart"></div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import c3 from "c3";
import "c3/c3.min.css";

export default {
  data: () => ({
    picker: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    value: "",
    events: [],
    colors: { state: "blue", finish: "green" },
    names: {
      state: "진행중",
      finish: "완료",
      cancelled: "취소",
      reserve: "예약",
    },

    dialog: false,
    dialog_date: null,
    dialog_msg: null,

    orderInfoList: [],

    // table
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

    dialog_Info: [],
    dialog_Info_datatable: [],

    search: "",
    calories: "",

    headers: [
      { text: "id_uid", value: "id_uid" },
      { text: "cnt", value: "cnt" },
      { text: "Actions", value: "actions", sortable: false },
    ],

    chart_x_header: ["x"],
  }),
  mounted() {
    this.drowChart();
  },
  created() {
    this.getOrderInfo();
  },
  methods: {
    drowChart() {
      c3.generate({
        bindto: ".chart",
        data: {
          x: "x",
          columns: [
            this.chart_x_header,
            ["data1", 30, 200, 100, 400, 150, 250],
            ["data2", 130, 300, 200, 300, 250, 450],
          ],
        },
        axis: {
          x: {
            type: "timeseries",
            tick: {
              format: "%d",
            },
          },
        },
      });
    },
    getOrderInfo() {
      var now = new Date();
      var lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      for (var i = 1; i <= parseInt(lastDate.getDate()); i++) {
        this.chart_x_header.push(i);
      }
      now =
        String(now.getFullYear()) +
        "-" +
        String(now.getMonth() + 1) +
        "-" +
        String(1);
      lastDate =
        String(lastDate.getFullYear()) +
        "-" +
        String(lastDate.getMonth() + 1) +
        "-" +
        String(lastDate.getDate());
      axios
        .post("/db/getOrderInfo", {
          id: this.$store.getters.getLoginId,
          start: now,
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
    getEvents1({ nativeEvent, event }) {
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
  },
};
</script>
