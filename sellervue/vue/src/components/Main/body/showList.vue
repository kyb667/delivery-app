<template>
  <div>
    <div>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
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
      </v-row>
    </div>
    <div>
      <v-date-picker
        v-model="date2"
        :event-color="(date) => (date[9] % 2 ? 'red' : 'yellow')"
        :events="functionEvents"
      ></v-date-picker>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    done: [false, false, false],
    mouseMonth: null,
    date2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
  }),

  methods: {
    contextMenu(_, event) {
      this.$set(this.done, 2, true);
      event.preventDefault();
    },
    dblClick() {
      this.$set(this.done, 0, true);
    },
    mouseEnter(month) {
      this.$set(this.done, 1, true);
      this.mouseMonth = month;
    },
    mouseLeave() {
      this.mouseMonth = null;
    },
    functionEvents(date) {
      const [, , day] = date.split("-");
      if ([12, 17, 28].includes(parseInt(day, 10))) return true;
      if ([1, 19, 22].includes(parseInt(day, 10))) return ["red", "#00f"];
      return false;
    },
  },
};
</script>
