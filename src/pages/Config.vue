<template>
	<div class="container">
  <div class="row justify-content-md-center">
    <div class="col-md-6">
		<br>
		<h1>Vault: {{ binded_mith ? 'Binded' : 'Not binded' }}</h1>
		<button type="button" class="btn btn-primary form-control" @click="bindMith()">Bind Vault</button>

		<br>
		<br>
		<h1>Wallet address</h1>
    <p>Current binded address: {{ current_address || 'none' }}</p>
		<input class="form-control" type="text" v-model="new_address">
		<button type="button" class="btn btn-primary form-control" @click="setWallet()">Set New Address</button>
  </div>
</div>
	</div>

</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
    	binded_mith: false,
    	current_address: null,
    	new_address: null
    }
  },
  methods: {
  	getVault() {
  		let config = {
		  headers: {
		  	'info': localStorage.getItem('mith_ramiel_user_name'),
		  	'signature': localStorage.getItem('mith_ramiel_token')
		   }
		};

		if (localStorage.getItem('mith_ramiel_user_name'))
		    axios.post('/res/get_vault',
				{ user_name: localStorage.getItem('mith_ramiel_user_name') }, config)
				.then(result => {
					this.binded_mith = result.data.ok;
				})
  	},
  	bindMith() {
  		let mith_ramiel_uuid = localStorage.getItem('mith_ramiel_uuid');
  		window.location.href = "https://mith.ramiel.io/api/bindURL?uid=" + mith_ramiel_uuid;
  	},
  	getAddress() {
  		let config = {
		  headers: {
		  	'info': localStorage.getItem('mith_ramiel_user_name'),
		  	'signature': localStorage.getItem('mith_ramiel_token')
		   }
		};

		if (localStorage.getItem('mith_ramiel_user_name'))
		    axios.post('/res/get_user',
				{ user_name: localStorage.getItem('mith_ramiel_user_name') }, config)
				.then(result => {
					this.current_address = result.data.user.current_address;
				})
  	},
  	setWallet() {
  		let config = {
		  headers: {
		  	'info': localStorage.getItem('mith_ramiel_user_name'),
		  	'signature': localStorage.getItem('mith_ramiel_token')
		   }
		};

		if (localStorage.getItem('mith_ramiel_user_name'))
		    axios.post('/res/set_wallet',
				{ user_name: localStorage.getItem('mith_ramiel_user_name'), address: this.new_address }, config)
				.then(result => {
					this.current_address = result.data.address;
					if (result.data.ok)
						alert("Success!");
					else
						alert("Nope!");
				})
  	}
  },
  mounted() {
  	this.getVault();
  	this.getAddress();
  	if (localStorage.getItem('mith_ramiel_token') == null)
  		window.location.href = '/login';
  }
};
</script>