
document.addEventListener("DOMContentLoaded", function() {
	Object.defineProperty(Vue.prototype,"$bus",{
		get: function() {
			return this.$root.bus;
		}
	});
	
	new Vue({
		el: '#app',

		components: {
			'itaces-form': ItacesForm
		},

		data: function () {
			return {
				bus: new Vue({})
			}
		}

	});
});