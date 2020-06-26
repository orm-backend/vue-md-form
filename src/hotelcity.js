import HotelForm from './HotelForm.vue'

document.addEventListener("DOMContentLoaded", function() {

	Object.defineProperty(Vue.prototype, "$bus", {
		get: function() {
			return this.$root.bus;
		}
	});

	new Vue({
		el: '#app',

		components: {
			'md-form': HotelForm
		},

		data: function () {
			return {
				bus: new Vue({})
			}
		}

	});
});