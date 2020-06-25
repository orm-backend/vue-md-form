<template>
	<validation-observer ref="validator">
		<form
			v-on:submit.prevent="onSubmit"
			:name="name"
			:method="method"
			:action="action"
			:enctype="enctype"
			novalidate>
			<slot></slot>
		</form>
	</validation-observer>
</template>

<script>
export default {
	name: "ItacesFormData",
	props: {
		name: String,

		method: {
			type: String,
			default: "post"
		},

		action: {
			type: String,
			required: true
		},

		enctype: {
			type: String,
			default: "multipart/form-data"
		}
	},

	data: function() {
		return {
			files: {}
		}
	},

	mounted: function () {
		this.$el.style.visibility = "visible"
	},

	provide: function () {
		return {
			addValidationError: this.addValidationError
		}
	},

	methods: {
		addValidationError(input, message) {
			let errors = this.$refs.validator.errors;

			if (!errors) {
				errors = {};
			}

			errors[input] = [message];

			this.$refs.validator.setErrors(errors);
		},

		addFiles: function(input, files) {
			this.files[input] = files;
		},

		scrollIntoView: function() {
			const errors = Object.entries(this.$refs.validator.refs)
				.map(([key, value]) => ({
					key,
					value
				}))
				.filter(error => {
					if (!error || !error.value || !error.value.failedRules) return false;
					return Object.keys(error.value.failedRules).length > 0;
				});
			
			if (errors && errors.length > 0) {
				this.$refs.validator.refs[errors[0]['key']].$el.scrollIntoView({
					behavior: 'smooth',
					block: 'center'
				});
			}
		},

		onSubmit: function(e) {
			this.$refs.validator.validate().then(success => {
				if (!success) {
					this.scrollIntoView();

					return;
				}

				this.$bus.$emit("form-validated", this);
				var formData = new FormData(e.target);

				if (this.files) {
					for (let [input, files] of Object.entries(this.files)) {
						if (Array.isArray(files)) {
							files.forEach(file => {
								formData.append(input, file, file.name);
							});
						} else if (files) {
							var file = files
							formData.append(input, file, file.name);
						}
					}
				}

 				(async () => {
					let response = await fetch( this.action, {
						headers: {
							"Accept": "application/json"
						},
						method: this.method,
						body: formData
					});

					if (response.ok || response.status == 422) {
						let result = await response.json();
						const contentType = response.headers.get("content-type")
						
						if (!contentType || contentType.indexOf("application/json") === -1) {
							alert("Received unsupported content " + contentType)
							return
						}

						if (result.redirect) {
							window.location.href = result.redirect;
						}

						this.$refs.validator.setErrors(result.errors);

						for (let [input, error] of Object.entries(result.errors)) {
							if (this.$refs.validator.refs[input]) {
								this.$refs.validator.refs[input].$el.scrollIntoView({
									behavior: 'smooth',
									block: 'center'
								});

								break;
							}
						}
					} else {
						alert("Error HTTP: " + response.status);
					}
				})();
			});
		}
	}
}
</script>
