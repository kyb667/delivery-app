<template>
  <v-container fluid fill-height>
    <v-row no-gutters align="right" justify="center">
      <v-form ref="form">
        <v-card>
          <v-card-title>
            <span class="headline">sign up</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="id*"
                    required
                    v-model="id"
                    :rules="idRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Password*"
                    type="password"
                    v-model="pw"
                    :rules="idRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="name*"
                    v-model="name"
                    :rules="idRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Email*"
                    :rules="idRules"
                    v-model="email"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-row>
                    <v-col>
                      <v-text-field
                        label="postcode*"
                        :rules="addressRules"
                        v-model="postcode"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-btn @click="showApi">주소</v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="roadAddress*"
                    required
                    :rules="addressRules"
                    v-model="roadAddress"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="jibunAddress*"
                    :rules="addressRules"
                    v-model="jibunAddress"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="detailAddress*"
                    :rules="addressRules"
                    v-model="detailAddress"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="submit">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import router from "../router";
import { fb, db, auth, realTimeDb } from "../../firebaseInit";

export default {
  data: () => ({
    id: "",
    pw: "",
    name: "",
    email: "",
    idRules: [(v) => !!v || "email is required"],
    pwRules: [(v) => !!v || "pw is required"],
    addressRules: [(v) => !!v || "address is required"],
    postcode: "",
    roadAddress: "",
    jibunAddress: "",
    detailAddress: "",
  }),
  methods: {
    submit: function() {
      if (this.$refs.form.validate()) {
        let data = {
          id: this.id,
          pw: this.pw,
          name: this.name,
          email: this.email,
          postcode: this.postcode,
          roadaddress: this.roadAddress,
          jibunaddress: this.jibunAddress,
          detailaddress: this.detailAddress,
        };
        var t = this;
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.pw)
          .then(() => {
            let user = firebase.auth().currentUser;
            user
              .sendEmailVerification()
              .then(function() {
                data.email = user.email;
                realTimeDb.ref("seller/" + t.id + "/info").set(data);
                // db.collection("sellerId")
                //   .doc(user.uid)
                //   .set(data);
                router.push("/");
              })
              .catch((error) => {
                console.log(error);
                alert("email 送信失敗", error.message);
              });
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            alert(error.message);
          });
      }
    },
    showApi: function() {
      new window.daum.Postcode({
        oncomplete: (data) => {
          let fullRoadAddr = data.roadAddress;
          let extraRoadAddr = "";
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraRoadAddr += data.bname;
          }
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraRoadAddr +=
              extraRoadAddr !== ""
                ? ", " + data.buildingName
                : data.buildingName;
          }
          if (extraRoadAddr !== "") {
            extraRoadAddr = " (" + extraRoadAddr + ")";
          }
          if (fullRoadAddr !== "") {
            fullRoadAddr += extraRoadAddr;
          }
          this.postcode = data.zonecode;
          this.jibunAddress = data.jibunAddress;
          this.roadAddress = fullRoadAddr;
        },
      }).open();
      // .embed(this.$refs.embed)
    },
  },
};
</script>
