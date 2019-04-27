<template>
	<div class="container">
		<button type="button" class="btn btn-primary form-control" @click="bindMith()">Bind Mith</button>
	</div>
</template>


<script>

export default {
  methods: {
  	bindMith() {
  		let mith_ramiel_uuid = localStorage.getItem('mith_ramiel_uuid');
  		window.location.href = "https://mith.ramiel.io/api/bindURL?uid=" + mith_ramiel_uuid;
  	}
  }
};
</script>