<template>
	<div class="container">
    <div class="row justify-content-md-center">
    <div class="col-md-4">
	    <div class="form-group">
	    	<legend>🔑 Login</legend>
			<label>user name</label>
			<input type="text" class="form-control" v-model="user_name">
			<label>password</label>
			<input type="password" class="form-control" v-model="password">
			<br>
	    	<button type="button" class="btn btn-primary form-control" @click="login(user_name, password)">Login</button>
	    </div>
    </div>
    </div>
	</div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      user_name: null,
      password: null
    }
  },
  methods: {
  	login(user_name, password) {
	    axios.post('/login',
			{ user_name: user_name,  password: password })
			.then(result => {
				localStorage.setItem('mith_ramiel_user_name', user_name);
				localStorage.setItem('mith_ramiel_token', result.data.token);
				localStorage.setItem('mith_ramiel_uuid', result.data.uuid);
	    		window.location.href = "/";
			})
  	}
  }
};
</script>