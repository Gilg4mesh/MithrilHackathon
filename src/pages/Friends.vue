<template>
	<div class="container">
<div class="row justify-content-md-center">
    <div class="col-md-6">
        <br>
        <h1>Friends: {{ friends ? friends.length : '...' }}</h1>
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
</div>
</div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
    	new_friend: null,
    	friends: null,
    }
  },
  methods: {
  	getFriends() {
  		let config = {
		  headers: {
		  	'info': localStorage.getItem('mith_ramiel_user_name'),
		  	'signature': localStorage.getItem('mith_ramiel_token')
		   }
		};

		if (localStorage.getItem('mith_ramiel_user_name'))
		    axios.post('/res/get_friends',
				{ user_name: localStorage.getItem('mith_ramiel_user_name') }, config)
				.then(result => {
					this.friends = result.data.friends;
					console.log(result.data.friends)
				})
  	},
  	addFriend() {
  		let config = {
		  headers: {
		  	'info': localStorage.getItem('mith_ramiel_user_name'),
		  	'signature': localStorage.getItem('mith_ramiel_token')
		   }
		};

		if (localStorage.getItem('mith_ramiel_user_name'))
		    axios.post('/res/add_friend',
				{ user_name: localStorage.getItem('mith_ramiel_user_name'), new_friend: this.new_friend }, config)
				.then(result => {
					if (result.data.ok) {
						this.getFriends();
						alert("Success!");
					}
					else
						alert("Something went wrong :(");
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