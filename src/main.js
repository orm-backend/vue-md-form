import Vue from 'vue'
import ItacesForm from './components/ItacesForm.vue'

/*Vue.config.productionTip = false

new Vue({
  render: h => h(MdForm),
}).$mount('#app')*/

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
