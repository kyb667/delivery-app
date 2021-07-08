<template>
  <v-data-table
    :headers="recipeInfoheaders"
    :items="recipeInfo"
    v-model="recipeInfodialog"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>My recipe</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="recipeInfodialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              add recipe
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="recipeInfoEditedItem.recipename"
                      label="recipename"
                      :disabled="validated == 1"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="recipeInfoEditedItem.price"
                      label="price"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-autocomplete
                      v-model="recipeInfoEditedItem.food_name_id"
                      :items="foodList"
                      label="food_name_id"
                      :disabled="validated == 1"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="recipeInfoEditedItem.delivary_flag"
                      :items="flag"
                      item-text="val"
                      item-value="key"
                      label="delivary_flag"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="recipeInfoEditedItem.takeout_flag"
                      :items="flag"
                      item-text="val"
                      item-value="key"
                      label="takeout_flag"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close('info')">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="save('info')">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >이 레시피를 삭제하시겠습니까?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item)">
        mdi-delete
      </v-icon>
      <v-icon small @click="show(item.recipeid)" color="mr-2">
        mdi-pencil
      </v-icon>
      <template>
        <v-dialog
          v-model="recipeDetailDialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="detailclose">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>recipe detail</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark text @click="detailsave(item)">
                  Save
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-data-table
              :headers="detailheaders"
              sort-by="recipedetailnum"
              :items="recipedetailList"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>recipe detail list</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="addRecipeDetailDialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        class="mb-1"
                        v-bind="attrs"
                        v-on="on"
                      >
                        add recipedetail
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="recipeDetailEditedItem.recipedetailnum"
                                label="recipedetailnum"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="
                                  recipeDetailEditedItem.recipedetailtext
                                "
                                label="recipedetailtext"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="recipeDetailEditedItem.recipedetailtip"
                                label="recipedetailtip"
                              ></v-text-field>
                            </v-col>
                            <!-- <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                          v-model="recipeDetailEditedItem.recipedetailimage"
                            <input type="file" id="file"
                              label="recipedetailimage"
                              @change="onImageUploaded()"
                            />
                          </v-col> -->
                            <v-col>
                              <input
                                type="file"
                                id="file"
                                @change="onImageUploaded"
                                label="recipedetailimage"
                              />
                              <!-- <v-img :src="url" /> -->
                            </v-col>
                            <v-col>
                              <img v-bind:src="image" style="width:100%" />
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="close('detail')"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="save('detail', item.recipeid)"
                        >
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-card-title class="headline"
                        >Are you sure you want to delete this
                        item?</v-card-title
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDelete"
                          >Cancel</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="deleteItemConfirm"
                          >OK</v-btn
                        >
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:item.recipedetailimage="{ item }">
                <img v-bind:src="item.recipedetailimage" style="width:50%" />
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-dialog>
      </template>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    foodList: [],
    recipeInfo: [],
    recipedetailList: [],
    dialogDelete: false,
    validated: 0,
    flag: [
      { key: true, val: "가능" },
      { key: false, val: "불가능" },
    ],
    recipeInfodialog: false,
    recipeInfoheaders: [
      { text: "recipename", align: "start", value: "recipename" },
      { text: "price", value: "price" },
      { text: "recipelove", value: "recipelove" },
      { text: "recipehate", value: "recipehate" },
      { text: "food_name_id", value: "food_name_id" },
      { text: "delivary_flag", value: "delivary_flag" },
      { text: "takeout_flag", value: "takeout_flag" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    recipeInfoEditedItem: {
      recipename: "",
      price: 0,
      recipelove: 0,
      recipehate: 0,
      food_name_id: "",
      delivary_flag: "",
      takeout_flag: "",
    },
    recipeInfodefaultItem: {
      recipename: "",
      price: 0,
      recipelove: 0,
      recipehate: 0,
      food_name_id: "",
      delivary_flag: "",
      takeout_flag: "",
    },

    recipeDetailDialog: false,
    detailheaders: [
      { text: "recipedetailnum", align: "start", value: "recipedetailnum" },
      { text: "recipedetailtext", align: "start", value: "recipedetailtext" },
      { text: "recipedetailtip", value: "recipedetailtip", sortable: false },
      {
        text: "recipedetailimage",
        value: "recipedetailimage",
        sortable: false,
      },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    recipeDetailEditedItem: {
      recipedetailnum: 0,
      recipedetailtext: "",
      recipedetailtip: "",
      recipedetailimage: "",
      recipe_id: "",
    },
    recipeDetailDefaultItem: {
      recipedetailnum: 0,
      recipedetailtext: "",
      recipedetailtip: "",
      recipedetailimage: "",
      recipe_id: "",
    },
    addRecipeDetailDialog: false,
    image: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  created() {
    this.getRecipe();
    this.getFood();
  },

  methods: {
    getRecipe() {
      let data = { id: this.$store.getters.getLoginId };
      axios
        .post("/db/getRecipe", data)
        .then((res) => {
          this.recipeInfo = res["data"]["recipeInfo"];
        })
        .catch(function() {
          alert("다시 시도해주세요");
        });
    },
    getFood() {
      axios
        .get("/db/getFood")
        .then((res) => {
          console.log(res["data"]["foodList"]);
          this.foodList = res["data"]["foodList"];
        })
        .catch(function() {
          alert("다시 시도해주세요");
        });
    },
    editItem(item) {
      console.log(123);
      this.editedIndex = this.recipeInfo.indexOf(item);
      this.recipeInfoEditedItem = Object.assign({}, item);
      this.validated = 1;
      this.recipeInfodialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.recipeInfo.indexOf(item);
      this.recipeInfoEditedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.recipeInfo.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    onImageUploaded(e) {
      console.log(e);
      var p = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(p);
      reader.onload = (e) => {
        console.log(e.target.result);
        this.image = e.target.result;
        this.recipeDetailEditedItem.recipedetailimage = p;
        console.log(this.recipeDetailEditedItem);
      };
    },
    close(obj) {
      console.log(obj);
      if (obj == "detail") {
        this.addRecipeDetailDialog = false;
        this.$nextTick(() => {
          this.recipeDetailEditedItem = Object.assign(
            {},
            this.recipeDetailDefaultItem
          );
          this.validated = 0;
          this.editedIndex = -1;
        });
      } else {
        this.recipeInfodialog = false;
        this.$nextTick(() => {
          this.recipeInfoEditedItem = Object.assign(
            {},
            this.recipeInfodefaultItem
          );
          this.validated = 0;
          this.editedIndex = -1;
        });
      }
    },
    detailclose() {
      this.recipeDetailDialog = false;
    },
    detailsave(item) {
      console.log(456);
      console.log(item);
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.recipeInfoEditedItem = Object.assign(
          {},
          this.recipeInfodefaultItem
        );
        this.validated = 0;
        this.editedIndex = -1;
      });
    },
    show(id) {
      console.log(id);
      axios
        .post("/db/getRecipeDetail", { id: id })
        .then((res) => {
          console.log(res);
          if (res["status"] == 200) {
            if (res["data"]["recipeInfo"]) {
              this.recipedetailList = res["data"]["recipeInfo"];
            } else {
              this.recipedetailList = [];
            }
          } else {
            alert("다시 시도해주세요");
          }
        })
        .catch(function() {
          alert("다시 시도해주세요");
        });
      this.recipeDetailDialog = true;
    },

    save(obj, id) {
      console.log(id);
      if (obj == "info") {
        let recipe = this.recipeInfoEditedItem;
        recipe["seller_id_id"] = this.$store.getters.getLoginId;
        if (this.editedIndex > -1) {
          Object.assign(
            this.recipeInfo[this.editedIndex],
            this.recipeInfoEditedItem
          );
        } else {
          let data = { recipeInfo: recipe };
          axios
            .post("/db/insertRecipe", data)
            .then((res) => {
              if (res["data"]["flag"]) {
                delete recipe.seller_id_id;
                if (recipe["delivary_flag"]) {
                  recipe["delivary_flag"] = "가능";
                } else {
                  recipe["delivary_flag"] = "불가능";
                }
                if (recipe["takeout_flag"]) {
                  recipe["takeout_flag"] = "가능";
                } else {
                  recipe["takeout_flag"] = "불가능";
                }
                this.recipeInfo.push(recipe);
              } else {
                alert("다시 시도해주세요");
              }
            })
            .catch(function() {
              alert("다시 시도해주세요");
            });
        }
        this.close("info");
      } else if (obj == "detail") {
        // console.log(this.recipeDetailEditedItem.recipedetailimage)
        // console.log(this.recipeDetailEditedItem.recipedetailimage.path)
        // document.getElementById("myFile").files[0].path
        let recipe = this.recipeDetailEditedItem;
        // recipe['recipedetailimage'] = this.image
        // console.log(this.image.length)
        console.log(recipe);
        if (this.editedIndex > -1) {
          Object.assign(
            this.recipedetailList[this.editedIndex],
            this.recipeDetailEditedItem
          );
        } else {
          recipe["recipe_id"] = id;
          const blob = new Blob([JSON.stringify(recipe)], {
            type: "application/json",
          });
          let formData = new FormData();
          formData.append("document", blob);
          formData.append("file", recipe["recipedetailimage"]);
          console.log(formData);
          // ,
          //   { headers: {'X-CSRFToken': csrftoken}}
          axios
            .post("/db/insertRecipeDetail", formData)
            .then((res) => {
              if (res["data"]["flag"]) {
                delete recipe.recipe_id;
                this.recipedetailList.push(recipe);
              } else {
                alert("다시 시도해주세요");
              }
            })
            .catch(function() {
              alert("다시 시도해주세요");
            });
        }
        this.close("detail");
      }
    },
  },
};
</script>
