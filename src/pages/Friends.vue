<template>
	<div class="container">
		<br>
		<h1>Friends: {{ friends.length }}</h1>
		<input class="form-control" type="text" v-model="new_friend">
		<button type="button" class="btn btn-primary form-control" @click="addFriend()">Add New Friend</button>

		<br>
		<br>
		<table class="table table-hover">
		  <thead>
		    <tr>
		      <th scope="col">name</th>
		      <th scope="col">address</th>
		    </tr>
		  </thead>
		  <tbody>

		    <tr v-for="friend in friends">
		      <th scope="row">{{ friend.name }}</th>
		      <td>{{ friend.current_address }}</td>
		    </tr>
		    
		  </tbody>
		</table>
	</div>

</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
    	new_friend: null,
    	friends: []
    }
  },
  methods: {
  	getFriends() {
  		let config = {
		  headers: {
		  	'user_name': localStorage.getItem('mith_ramiel_user_name'),
		  	'signature': localStorage.getItem('mith_ramiel_token')
		   }
		};

		if (localStorage.getItem('mith_ramiel_user_name'))
		    axios.post('/api2/get_friends', 
				{ user_name: localStorage.getItem('mith_ramiel_user_name') }, config)
				.then(result => {
					this.friends = result.data.friends;
					console.log(result.data.friends)
				})
  	},
  	addFriend() {
  		let config = {
		  headers: {
		  	'user_name': localStorage.getItem('mith_ramiel_user_name'),
		  	'signature': localStorage.getItem('mith_ramiel_token')
		   }
		};

		if (localStorage.getItem('mith_ramiel_user_name'))
		    axios.post('/api2/add_friend', 
				{ user_name: localStorage.getItem('mith_ramiel_user_name'), new_friend: this.new_friend }, config)
				.then(result => {
					if (result.data.ok) {
						this.getFriends();
						alert("Success!");
					}
					else
						alert("Nope!");
				})
  	}
  },
  mounted() {
  	this.getFriends();
  	if (localStorage.getItem('mith_ramiel_token') == null)
  		window.location.href = '/login';
  }
};
</script>