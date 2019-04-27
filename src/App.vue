<template>
  <div id="app">

	<nav class="navbar navbar-expand-lg navbar-light bg-light">
	  <a class="navbar-brand" href="/">Mith</a>
	  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
	    <span class="navbar-toggler-icon"></span>
	  </button>

	  <div class="collapse navbar-collapse" id="navbarColor03">
	    <ul class="navbar-nav mr-auto">
	      <li v-if="isGuest()" class="nav-item">
	        <router-link class="nav-link" to="/register">Register</router-link>
	      </li>
	      <li v-if="isGuest()" class="nav-item">
	        <router-link class="nav-link" to="/login">Login</router-link>
	      </li>
	      <li v-if="!isGuest()" class="nav-item">
	        <a class="nav-link" href="#" @click="logout">Logout</a>
	      </li>
	    </ul>
	  </div>
	</nav>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  methods: {
  	isGuest() {
	    return localStorage.getItem('mith_ramiel_token') ? false : true;
  	},
  	logout() {
	    localStorage.removeItem('mith_ramiel_user_name');
	    localStorage.removeItem('mith_ramiel_token');
	    localStorage.removeItem('mith_ramiel_uuid');
	    location.reload();
  	}
  }
};
</script>
