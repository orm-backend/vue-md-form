<script>
import vue2Dropzone from 'vue2-dropzone'
import FormData from './ItacesFormData.vue'
import ImageDropzone from './ItacesImageDropzone.vue'
import Bitmask from './ItacesBitmask.vue'

Vue.use(VueMaterial.default)

Vue.component('validation-provider', VeeValidate.ValidationProvider)
Vue.component('validation-observer', VeeValidate.ValidationObserver)
Vue.component('vue-dropzone', vue2Dropzone)
Vue.component('itaces-form-data', FormData)
Vue.component('itaces-image-dropzone', ImageDropzone)
Vue.component('itaces-bitmask', Bitmask)

export default Object.assign(window.app.options, {
	name: "ItacesForm",

	data: function () {
		return window.app.data
	},
	
	props: window.app.props,
	
	created() {
		if (!window.app.options.localeUrl) {
			console.log("Variable window.app.options.localeUrl does not specified, using default locale")
			return
		}
		
		const code = document.getElementsByTagName("html")[0].getAttribute("lang");
		
		if (!code) {
			console.log("Does not html attribute lang specified, using default locale")
			return
		}
		
			(async () => {
			let response = await fetch( window.app.options.localeUrl + "/" + code + ".json", {
				method: "get"
			})

			if (response.ok) {
				const contentType = response.headers.get("content-type")
				
				if (contentType && contentType.indexOf("application/json") !== -1) {
					const result = await response.json()
					VeeValidate.localize(code, result)
				} else {
					console.log("Received unsupported content " + contentType + ", using default locale")
				}
			} else {
				alert("Error HTTP: " + response.status)
			}
		})()
	}
})
</script>

<style lang="scss">
/*** Accent* on required fields ***/
.md-field.md-theme-default label {
	&:after {
		color: var(--md-theme-default-accent);
	}
}

/*** Border for selected item in list ***/
.md-list.md-theme-default .md-selected .md-list-item-content {
	box-shadow: inset 0 0 0 2px var(--md-theme-default-accent);
}
</style>