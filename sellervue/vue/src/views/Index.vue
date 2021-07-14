<template>
  <v-container fluid fill-height>
    <v-row no-gutters align="right" justify="center">
      <v-col cols="12" sm="4">
        <v-form ref="form">
          <v-text-field
            v-model="email"
            label="email"
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
import { firebase, db, auth } from "../../firebaseInit";
import { mapMutations } from "vuex";

export default {
  data: () => ({
    email: "",
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
        // let data = {
        //   id: this.id,
        //   pw: this.pw,
        // };
        var email = this.email;
        var pw = this.pw;
        console.log(email);
        console.log(pw);
        firebase
          .auth()
          .signInWithEmailAndPassword(email, pw)
          .then((user) => {
            console.log(user);
            console.log(user.user);
            console.log(firebase.auth().currentUser);
            if (user.user.emailVerified) {
              t.$store.commit("setLogin_uid", user.user.uid);
              //   t.$store.commit("setloginId", email);
              console.log("email success");
              router.push("main");
            } else {
              this.id = "";
              this.pw = "";
              const user = firebase.auth().currentUser;
              if (user) {
                firebase
                  .auth()
                  .signOut()
                  .then(() => {
                    // Sign-out successful.
                  })
                  .catch((error) => {
                    // An error happened.
                  });
              }
              alert("email 認証が必要です。");
            }
          })
          .catch((err) => {
            this.email = "";
            this.pw = "";
            console.log(err);
            alert("会員登録がない。");
          });
        // axios.post('db/login', data)
        // .then(function (res){
        //     if(res['data']['flag']){
        //         t.$store.commit('setloginId',t.id);
        //         router.push('main')
        //     }else{
        //         alert('id 또는 pw가 틀렸습니다.')
        //     }
        // })
        // .catch(function(){
        //     alert('다시 시도해주세요')
        // })
      }
    },
  },
};
</script>
