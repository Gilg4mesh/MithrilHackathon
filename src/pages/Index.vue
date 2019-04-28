<template>
	<div class="container" v-show="loaded">
		<br>
		<h1>Current Address: {{ current_address }}</h1>
		<br>
		<div class="row">
			<div class="card col-3">
			  <div class="card-body">
			    <h4 class="card-title">Amount</h4>
			    <h2 class="card-text">{{ amount }}</h2>
			    <button type="button" class="btn btn-primary form-control" @click="withdrawMith()">Withdraw Mith</button>
			  </div>
			</div>
			<div class="card col-3">
			  <div class="card-body">
			    <h4 class="card-title">Reward Today</h4>
			    <h2 class="card-text">{{ reward }}</h2>
			  </div>
			</div>
			<div class="card col-3">
			  <div class="card-body">
			    <h4 class="card-title">Estimated Interest</h4>
			    <h2 class="card-text">{{ (amount / 100).toFixed(6) }}</h2>
			  </div>
			</div>
			<div class="card col-3">
			  <div class="card-body">
			    <h4 class="card-title">Health</h4>
			    <h2 class="card-text">{{ healthPercent }}%</h2>
			  </div>
			</div>
		</div>
		<br>
		<h1>Daily 1st win: {{ win ? "open for claiming" : "already taken :c" }}</h1>
		<br>
		<div class="row">
			<h3 class="col-2">Game Address: </h3>
			<input class="col-5 form-control" type="text" v-model="game_address">
			<div class="col-1"></div>
			<button type="button" class="btn btn-primary col-4 form-control" @click="endGame()">Redeem award</button>
		</div>
		<br>
		<br>
		<table class="table table-hover">
		  <thead>
		    <tr>
		      <th scope="col">tx_hash</th>
		      <th scope="col">amount</th>
		      <th scope="col">status</th>
		      <th scope="col">date</th>
		    </tr>
		  </thead>
		  <tbody>

		    <tr v-for="tx in txs">
		      <th scope="row">{{ tx.tx_hash }}</th>
		      <td>{{ tx.amount }}</td>
		      <td>{{ tx.status }}</td>
		      <td>{{ tx.date }}</td>
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
      loaded: false,
    	binded_mith: false,
    	current_address: null,
    	amount: 0,
    	reward: 0,
    	win: false,
    	game_address: null,
     	txs: []
    }
  },
  computed: {
    healthPercent() {
      const {reward, amount} = this
      if (amount * 0.01 == 0) {
        return 100
      }
      if (reward/(amount * 0.01) * 100 >= 100) {
        return 100
      }
      return Math.floor(reward/(amount * 0.01) * 100)
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
					this.txs = result.data.vault.tx;
				})
  	},
  	getReward() {
  		let config = {
		  headers: {
		  	'info': localStorage.getItem('mith_ramiel_user_name'),
		  	'signature': localStorage.getItem('mith_ramiel_token')
		   }
		};

		if (localStorage.getItem('mith_ramiel_user_name'))
		    axios.post('/res/get_reward',
				{ user_name: localStorage.getItem('mith_ramiel_user_name') }, config)
				.then(result => {
					this.reward = result.data.reward;
				})
  	},
  	getInterest() {
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
					this.amount = result.data.user.interest;
				})
  	},
  	firstWinExist() {
  		let config = {
		  headers: {
		  	'info': localStorage.getItem('mith_ramiel_user_name'),
		  	'signature': localStorage.getItem('mith_ramiel_token')
		   }
		};

		if (localStorage.getItem('mith_ramiel_user_name'))
		    axios.post('/res/first_win_exist',
				{ user_name: localStorage.getItem('mith_ramiel_user_name') }, config)
				.then(result => {
					this.win = result.data.first_win_exist;
				})
  	},
  	endGame() {
  		let config = {
		  headers: {
		  	'info': localStorage.getItem('mith_ramiel_user_name'),
		  	'signature': localStorage.getItem('mith_ramiel_token')
		   }
		};

		if (localStorage.getItem('mith_ramiel_user_name'))
		    axios.post('/res/end_game',
				{ game_address: this.game_address }, config)
				.then(result => {
					if (result.data.ok) {
						this.getReward();
						this.getInterest();
						this.game_address = null;
						alert("Success!");
					}
					else
						alert("This is not a valid game address.");
				})
  	},
  	withdrawMith() {
  		let config = {
		  headers: {
		  	'info': localStorage.getItem('mith_ramiel_user_name'),
		  	'signature': localStorage.getItem('mith_ramiel_token')
		   }
		};

		if (localStorage.getItem('mith_ramiel_user_name'))
		    axios.post('/res/withdraw_mith',
				{ user_name: localStorage.getItem('mith_ramiel_user_name') }, config)
				.then(result => {
					if (result.data.ok) {
						this.amount = 0;
						this.getVault();
					}
				})
  	}
  },
  mounted() {
  	if (localStorage.getItem('mith_ramiel_token') == null) {
  		window.location.href = '/login';
    } else {
      this.loaded = true;
    }
  	this.getReward();
  	this.getVault();
  	this.getInterest();
  	this.firstWinExist();
  }
};
</script>