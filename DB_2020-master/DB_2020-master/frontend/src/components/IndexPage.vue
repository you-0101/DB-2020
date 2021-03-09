<template>
  <form v-on:submit.prevent="submitForm">
    <div>
      <label for="userid">id:</label>
      <input id="userid" type="text" v-model="userid" />
    </div>
    <div>
      <label for="password">PW:</label>
      <input id="password" type="password" v-model="password"  />
    </div>
    <button type="submit">회원가입</button>
  </form>
</template>

<script>
export default {
    data(){
        return {
            user:null,
        };
    },
    methods:{
    submitForm:function(){
      var data = {
        userid: this.userid,
        password: this.password
      }
      this.$http.post('/api/sign_up', data)
        .then((response)=>{
          
        })
        .catch(function(error){
          console.log(response);
        });
    }},
    /*
    created(){
        this.$http.get('/api/login')
        .then((res) => {
            const user = res.data.user;
            if(user) this.user = user;
        })
        .catch((err) => {
            console.error(err);
        });
    }*/
}
</script>

<style scoped>

</style>