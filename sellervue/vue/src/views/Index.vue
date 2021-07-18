<template>
  <v-container fluid fill-height>
    <v-row no-gutters align="right" justify="center">
      <v-col cols="12" sm="4">
        <v-form ref="form">
          <v-text-field
            v-model="id"
            label="id"
            :rules="idRules"
            required
          ></v-text-field>
          <v-text-field
            v-model="pw"
            label="pw"
            :rules="pwRules"
            required
          ></v-text-field>
          <v-spacer />
          <v-btn class="mr-1" @click="submit">submit</v-btn>
        </v-form>
        <br />
        <div>
          <a style="color:black" @click="$router.push('signup')"> 회원가입 </a>
          <a style="color:black" @click="$router.push('a')"> id/pw찾기 </a>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import router from "../router";
import { firebase, db, auth, realTimeDb } from "../../firebaseInit";
import { mapMutations } from "vuex";

export default {
  data: () => ({
    id: "",
    pw: "",
    idRules: [
      (v) => !!v || "id is required",
      (v) => (v && v.length <= 50) || "Name must be less than 10 characters",
    ],
    pwRules: [(v) => !!v || "pw is required"],
  }),
  methods: {
    ...mapMutations(["setloginId"]),
    submit: function() {
      if (this.$refs.form.validate()) {
        var t = this;
        var id = this.id;
        var pw = this.pw;
        firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.SESSION)
          .then(() => {
            realTimeDb
              .ref()
              .child("seller")
              .child(id)
              .get()
              .then((snapshot) => {
                if (snapshot.exists()) {
                  firebase
                    .auth()
                    .signInWithEmailAndPassword(snapshot.val().info.email, pw)
                    .then((user) => {
                      console.log(firebase.auth().currentUser);
                      if (user.user.emailVerified) {
                        t.$store.commit("setLogin_uid", user.user.uid);
                        t.$store.commit("setloginId", snapshot.val().info.id);
                        router.push("main");
                        // db.collection("sellerId")
                        //   .doc(user.user.uid)
                        //   .get()
                        //   .then((doc) => {
                        //     if (doc.exists) {
                        //       t.$store.commit("setLogin_uid", user.user.uid);
                        //       t.$store.commit("setloginId", doc.data().id);
                        //       router.push("main");
                        //     } else {
                        //       // TODO
                        //       console.log("No such document!");
                        //     }
                        //   })
                        //   .catch((error) => {
                        //     console.log("Error getting document:", error);
                        //   });
                      } else {
                        this.id = "";
                        this.pw = "";
                        const user = firebase.auth().currentUser;
                        if (user) {
                          firebase
                            .auth()
                            .signOut()
                            .then(() => {})
                            .catch((error) => {
                              var errorCode = error.code;
                              var errorMessage = error.message;
                              console.log(errorCode);
                              console.log(errorMessage);
                            });
                        }
                        alert("email 認証が必要です。");
                      }
                    })
                    .catch((error) => {
                      this.email = "";
                      this.pw = "";
                      var errorCode = error.code;
                      var errorMessage = error.message;
                      console.log(errorCode);
                      console.log(errorMessage);
                      alert("会員登録がない。");
                    });
                } else {
                  console.log("No data available");
                }
              })
              .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
              });
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            router.push("/");
          });
      }
    },
  },
};
</script>
