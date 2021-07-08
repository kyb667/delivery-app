<template>
    <v-container fluid fill-height>
        <!-- 
            align = "center" 는 콘텐츠를 행 안쪽에 수직으로 가운데에 배치합니다.
            justify = "center" 는 콘텐츠를 행 안쪽에 가로로 가운데에 배치합니다.
            fill-height 는 페이지와 비교 하여 전체 콘텐츠를 중앙 에 배치합니다
        -->
        <v-row 
        no-gutters
        align="right"
        justify="center">
            <v-col cols="12" sm="4">
                <v-form
                ref="form">
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
                <br/>
                <div>
                    <a style="color:black" @click="$router.push('signup')"> 회원가입 </a> 
                    <a style="color:black" @click="$router.push('a')"> id/pw찾기 </a>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from "axios"
import router from '../router'
import { mapMutations } from 'vuex'

export default {
    data: () => ({
        id : '',
        pw : '',
        idRules: [
        v => !!v || 'id is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
        pwRules: [
        v => !!v || 'pw is required',
        ]
    }),
    methods:{
        ...mapMutations(['setloginId']),
        submit: function(){
            if(this.$refs.form.validate()){
                var t = this
                let data = {
                    'id': this.id,
                    'pw': this.pw
                }
                axios.post('db/login', data)
                .then(function (res){
                    if(res['data']['flag']){
                        t.$store.commit('setloginId',t.id);
                        router.push('main')
                    }else{
                        alert('id 또는 pw가 틀렸습니다.')
                    }
                })
                .catch(function(){
                    alert('다시 시도해주세요')
                })
            }
        },
    }
};
</script>