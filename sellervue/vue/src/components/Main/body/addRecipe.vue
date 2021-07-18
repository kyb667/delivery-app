<template>
  <div>
    <!-- show recipeinfo table -->
    <div>
      <v-data-table :headers="recipeInfoheaders" :items="recipeInfo">
        <!-- add recipe -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>recipe</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="recipeInfodialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
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
                          v-model="recipeInfoEditedItem.food_name"
                          :items="foodList"
                          item-text="foodname"
                          item-value="foodname"
                          label="food_name"
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
          </v-toolbar>
        </template>
        <!-- add recipe -->

        <template v-slot:item.actions="{ item }">
          <v-icon small @click="show(item)" color="mr-2">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)" color="mr-2">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </div>
    <!-- show recipeinfo table -->

    <!-- recipe info, detail crud -->
    <div>
      <v-dialog
        v-model="recipeDetailDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark>
            <v-btn icon dark @click="close('detail')">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>recipe detail</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <!-- recipe info crud -->
          <v-card-title>
            <span>RECIPE INFO</span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card>
            <v-data-table
              :headers="recipeInfoheaders"
              :items="recipeInfoDetailList"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-menu bottom left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(k, i) in detailItems"
                      :key="i"
                      @click="recipeInfoCRUD(k.title, item)"
                    >
                      <v-list-item-title>{{ k.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-card>
          <!-- recipe info crud -->

          <!-- recipe detail crud -->
          <v-card-title>
            <span>RECIPE DETAIL INFO</span>
            <v-spacer></v-spacer>
            <v-menu bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(k, i) in detailDeleteItems"
                  :key="i"
                  @click="recipeDetailCRUD(k.title, i)"
                >
                  <v-list-item-title>{{ k.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-card>
            <v-data-table
              :headers="recipeDetailheaders"
              sort-by="recipedetailnum"
              :items="recipedetailList"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-menu bottom left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(k, i) in detailItems"
                      :key="i"
                      @click="recipeDetailCRUD(i, item)"
                    >
                      <v-list-item-title>{{ k.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-card>
          <!-- recipe detail crud -->
        </v-card>
      </v-dialog>
    </div>
    <!-- recipe info, detail crud -->

    <!-- recipe delete -->
    <div>
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="headline"
            >이 레시피를 삭제하시겠습니까?
          </v-card-title>
          <v-card-text>
            ※ 레시피를 삭제할 경우 상세 레시피도 삭제됩니다.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close('delete')"
              >Cancel</v-btn
            >
            <v-btn color="blue darken-1" text @click="deleteItemConfirm"
              >OK</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <!-- recipe delete -->

    <div>
      <v-dialog v-model="recipeDetailUpsertDialog" max-width="500px">
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
                    :disabled="validated == 1"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-file-input
                    show-size
                    label="recipedetailimage"
                    @change="selectFile"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-textarea
                    v-model="recipeDetailEditedItem.recipedetailtext"
                    outlined
                    name="input-7-4"
                    label="recipedetailtext"
                    value=""
                  ></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-textarea
                    v-model="recipeDetailEditedItem.recipedetailtip"
                    outlined
                    name="input-7-4"
                    label="recipedetailtip"
                    value=""
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close('detailItem')">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="save('detailItem')">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { firebase, db, auth, realTimeDb } from "../../../../firebaseInit";

export default {
  data: () => ({
    foodList: [],
    recipeInfo: [],
    recipeInfoDetailList: [],
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
      { text: "food_name", value: "food_name" },
      { text: "delivary_flag", value: "delivary_flag" },
      { text: "takeout_flag", value: "takeout_flag" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    recipeInfoEditedItem: {
      recipename: "",
      price: 0,
      recipelove: 0,
      recipehate: 0,
      food_name: "",
      delivary_flag: "",
      takeout_flag: "",
    },
    recipeInfodefaultItem: {
      recipename: "",
      price: 0,
      recipelove: 0,
      recipehate: 0,
      food_name: "",
      delivary_flag: "",
      takeout_flag: "",
    },

    recipeDetailDialog: false,
    recipeDetailheaders: [
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
    image: "",
    detailItems: [
      { title: "update" },
      {
        title: "delete",
      },
    ],
    detailDeleteItems: [
      {
        title: "add",
      },
      {
        title: "allDelete",
      },
    ],

    deleteRecipeName: null,

    recipeDetailUpsertDialog: false,

    file: null,
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
    // delete recipe
    // ok
    recipeInfoCRUD(i, item) {
      if (i == "update") {
        this.editedIndex = this.recipeInfo.indexOf(item);
        this.validated = 1;
        this.recipeInfoEditedItem["recipename"] = item["recipename"];
        this.recipeInfoEditedItem["food_name"] = item["food_name"];
        this.recipeInfodialog = true;
      } else if (i == "delete") {
        this.deleteItem(item);
      }
    },

    recipeDetailCRUD(i, item) {
      console.log(i);
      console.log(item);
      if (i == "add") {
        console.log(i);
        this.recipeDetailUpsertDialog = true;
      } else if (i == "allDelete") {
        console.log(i);
      } else if (i == "delete") {
        console.log(i);
      }
    },
    // TODO image
    selectFile(file) {
      console.log(file);
      this.file = file;
    },

    // get recipe
    // ok
    getRecipe() {
      const pushList = [];
      const user = firebase.auth().currentUser;
      console.log(user);
      // realTimeDb.
      // db.collection("recipe")
      //   .where("seller_id", "==", this.$store.getters.getLoginId)
      //   .get()
      //   .then((querySnapshot) => {
      //     querySnapshot.forEach((doc) => {
      //       console.log(doc.data());
      //       var d = doc.data();
      //       if (d.takeout_flag == true) {
      //         d.takeout_flag = "가능";
      //       } else {
      //         d.takeout_flag = "불가능";
      //       }
      //       if (d.delivary_flag == true) {
      //         d.delivary_flag = "가능";
      //       } else {
      //         d.delivary_flag = "불가능";
      //       }
      //       pushList.push(d);
      //     });
      //     this.recipeInfo = pushList;
      //   })
      //   .catch((error) => {
          console.log("Error getting documents: ", error);
        });
      // let data = { id: this.$store.getters.getLoginId };
      // axios
      //   .post("/db/getRecipe", data)
      //   .then((res) => {
      //     this.recipeInfo = res["data"]["recipeInfo"];
      //   })
      //   .catch(function() {
      //     alert("다시 시도해주세요");
      //   });
    },

    // get food
    // ok
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

    // dataTableからdeleteボタンを押す
    // ok
    deleteItem(item) {
      console.log("deleteItem");
      console.log(item);
      this.deleteRecipeName = item.recipename;
      this.dialogDelete = true;
    },
    // recipe delete 確認ボタン
    // ok
    deleteItemConfirm() {
      console.log("deleteItemConfirm");
      console.log(this.editedIndex);
      if (this.deleteRecipeName) {
        db.collection("recipe")
          .doc(this.deleteRecipeName)
          .delete()
          .then(() => {
            this.recipeInfo.splice(this.editedIndex, 1);
            this.recipedetailList = [];
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            alert(error.message);
          });
        //   axios
        //     .post("/db/deleteRecipe", { recipeid: this.deleteRecipeName })
        //     .then((res) => {
        //       if (res["data"]["flag"]) {
        //         this.recipeInfo.splice(this.editedIndex, 1);
        //         this.recipedetailList = [];
        //       } else {
        //         alert("다시 시도해주세요");
        //       }
        //     })
        //     .catch(function() {
        //       alert("다시 시도해주세요");
        //     });
        //   this.deleteRecipeName = null;
        // }
        this.close("delete");
      }
    },

    // TODO image
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

    // close dialog
    close(obj) {
      // detail Main dialog close
      // ok
      if (obj == "detail") {
        this.recipeDetailDialog = false;
        this.recipeInfoEditedItem = this.recipeInfodefaultItem;
        this.recipeDetailEditedItem = this.recipeDetailDefaultItem;
        this.validated = 0;
        this.editedIndex = -1;
      }
      // recipeinfo insert update dialog close
      // ok
      if (obj == "info") {
        this.recipeInfodialog = false;
        this.recipeInfoEditedItem = this.recipeInfodefaultItem;
        this.validated = 0;
      }
      // delete dialog close
      // ok
      if (obj == "delete") {
        this.dialogDelete = false;
        this.editedIndex = -1;
      }

      if (obj == "detailItem") {
        this.recipeDetailUpsertDialog = false;
        this.recipeInfoEditedItem = this.recipeInfodefaultItem;
        this.editedIndex = -1;
      }
    },

    detailsave(item) {
      console.log(456);
      console.log(item);
    },

    // get recipe detail
    // ok
    show(itemObj) {
      var id = itemObj.recipeid;
      this.recipeInfoDetailList = [itemObj];
      this.editedIndex = this.recipeInfo.indexOf(itemObj);
      axios
        .post("/db/getRecipeDetail", { id: id })
        .then((res) => {
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

    //
    save(obj, id) {
      console.log(obj);
      console.log(id);
      console.log(this.editedIndex);
      if (obj == "info") {
        let recipe = this.recipeInfoEditedItem;
        if (this.editedIndex > -1) {
          console.log("recipe update");
          console.log(this.recipeInfo[this.editedIndex]);
          recipe["recipeid"] = this.recipeInfo[this.editedIndex]["recipeid"];
          let data = { recipeInfo: recipe };
          axios
            .post("/db/updateRecipe", data)
            .then((res) => {
              if (res["data"]["flag"]) {
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
                Object.assign(this.recipeInfo[this.editedIndex], recipe);
                Object.assign(this.recipeInfoDetailList[0], recipe);
                this.editedIndex = -1;
              } else {
                alert("다시 시도해주세요");
                this.editedIndex = -1;
              }
            })
            .catch(function() {
              alert("다시 시도해주세요");
              this.editedIndex = -1;
            });
        } else {
          console.log("new recipe insert");
          recipe["seller_id"] = this.$store.getters.getLoginId;
          recipe["modify"] = 0;
          let data = { recipeInfo: recipe };
          axios
            .post("/db/insertRecipe", data)
            .then((res) => {
              if (res["data"]["flag"]) {
                delete recipe.seller_id;
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
                this.editedIndex = -1;
              } else {
                alert("다시 시도해주세요");
                this.editedIndex = -1;
              }
            })
            .catch(function() {
              alert("다시 시도해주세요");
              this.editedIndex = -1;
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
      } else if (obj == "detailItem") {
        var recipeid = this.recipeInfoDetailList[0].recipeid;
        var recipedetail = this.recipeDetailEditedItem;
        recipedetail["recipe_id"] = recipeid;
        console.log(recipedetail);
        console.log(this.file);
        console.log(recipedetail.recipedetailimage);
        recipedetail.recipedetailimage = this.file.name;
        console.log(recipedetail);
        axios
          .post("/db/insertRecipeDetail", { recipedetail: recipedetail })
          .then((res) => {
            if (res["data"]["flag"]) {
              console.log(res["data"]["flag"]);
            } else {
              alert("다시 시도해주세요");
            }
          })
          .catch(function() {
            alert("다시 시도해주세요");
          });
        this.close("detailItem");
      }
    },
  },
};
</script>
