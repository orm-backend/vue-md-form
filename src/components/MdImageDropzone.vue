<template>
	<div
		class="image-container"
		v-model="file"
		:key="id">
		
		<input
			class="md-input"
			v-model="fileName"
			v-bind="{ disabled, required, placeholder }"
			readonly
			@blur="onBlur" />

		<vue-dropzone
			ref="vueDropzone"
			class="img-dropzone"
			:id="id"
			:options="dropzoneOptions"
			:use-custom-slot="true"
			:include-styling="false"
			@vdropzone-mounted="onMounted"
			@vdropzone-file-added="onFileAdded"
			@vdropzone-max-files-exceeded="onMaxFilesExceeded"
			@vdropzone-error="onError">
			<slot name="image">
				<svg width="66" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M1 33.5H33M65 33.5H33M33 33.5V1M33 33.5V65" stroke="rgba(0, 0, 0, 0.42)"
						stroke-width="1"
						stroke-linecap="round"
						stroke-linejoin="round" />
				</svg>
			</slot>
		</vue-dropzone>
		<slot />
	</div>
</template>

<script>
export default {
	name: "MdImageDropzone",
	props: {
		placeholder: {
			type: String,
			default: ""
		},
		readonly: Boolean,
		required: Boolean,
		disabled: Boolean,

		id: {
			type: String,
			default: () => 'image-dropzone-' + Math.random().toString(36).slice(4)
		},

		name: {
			type: String,
			required: true
		},

		maxSize: {
			default: 0.5
		},

		accept: {
			type: String,
			default: "image/*"
		}
	},

	data: function () {
		return {
			file: null,
			message: "",
			dropzone: null,

			dropzoneOptions: {
				url: 'http://localhost/?#!',
				paramName: this.name,
				acceptedFiles: this.accept,
				maxFiles: 1,
				parallelUploads: 1,
				maxFilesize: this.maxSize,
				filesizeBase: 1000,
				autoProcessQueue: false,
				previewTemplate: this.template(),
			}
		}
	},

	computed: {
 		fileName: {
			cache: false,
			get () {
				return this.file ? this.file.name : ""
			},
			set (value) {
				this.fileName = value
			}
		},
		clear () {
			return this.MdField.clear
		},
		attributes () {
			return {
				...this.$attrs,
				type: this.type,
				id: this.id,
				name: this.name,
				disabled: this.disabled,
				required: this.required,
				placeholder: this.placeholder,
				readonly: this.readonly
			}
		}
	},

	watch: {
		fileName () {
			this.setFieldValue()
		},
		clear (clear) {
			if (clear) {
				this.clearField()
			}
		},
		placeholder () {
			this.setPlaceholder()
		},
		disabled () {
			this.setDisabled()
		},
		required () {
			this.setRequired()
		},
		file (val) {
/*  			if (this.message) {
				this.$emit('md-input', val)
				this.addValidationError(this.name, this.message)
				this.message = null
			} else {
				this.$emit('input', val)
			} */
 			this.$emit('input', val)
		}
	},

	inject: ['MdField', 'addValidationError'],

	methods: {
		clearField () {
			this.file = null
			this.dropzone.removeAllFiles()
		},
		setFieldValue () {
			this.MdField.value = this.file
		},
		setPlaceholder () {
			this.MdField.placeholder = Boolean(this.placeholder)
		},
		setDisabled () {
			this.MdField.disabled = Boolean(this.disabled)
		},
		setRequired () {
			this.MdField.required = Boolean(this.required)
		},
		onBlur () {
			this.MdField.focused = false
		},
		onFormValidated (formData) {
			if (this.file) {
				formData.addFiles(this.name, this.file)
			}
		},
		template: function () {
			return `<div class="dz-preview dz-image-preview">
				<div class="dz-image"><img data-dz-thumbnail></div>
			</div>`
		},
		onMounted: function() {
			this.dropzone = this.$refs.vueDropzone;
		},
		onFileAdded: function(file) {
			this.file = file
		},
		onError: function(file, message) {
			this.message = message
		},
		onMaxFilesExceeded: function(file) {
			this.clearField()
			
			this.$nextTick().then(() => {
				this.dropzone.addFile(file)
			})
		}
	},

	created () {
		this.setFieldValue()
		this.setPlaceholder()
		this.setDisabled()
		this.setRequired()
	},

	mounted: function () {
		if (this.disabled) {
			this.dropzone.disable()
		}

		this.$bus.$on("form-validated", this.onFormValidated)
	},

	beforeDestroy: function() {
		this.$bus.$off("form-validated", this.onFormValidated)
		this.dropzone.destroy()
	}
}
</script>

<style lang="scss">
/*** Dopzone single image input styles  ***/
.md-field.img-field.md-theme-default {
	display: block;

	.img-container {
		display: -webkit-box;
		display: flex;
		position: relative;
		z-index: 0;
	}

	.img-wrapper {
		display: -webkit-box;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		flex-direction: column;
		margin-right: 8px;
	}

	&:after {
		opacity: 0;
	}

	.img-dropzone {
		position: relative;
		display: -webkit-box;
		display: flex;
		transition: .2s linear;
		background: #f5f5f5;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.42);
		overflow: hidden;
		-webkit-box-pack: center;
		justify-content: center;
		width: 100%;
		padding-bottom: 100%;

		svg {
			margin: auto;
		}
	}

	&:not(.md-disabled) {
		.img-dropzone {
			cursor: copy;

			&:hover {
				box-shadow: inset 0 0 0 2px var(--md-theme-default-accent);
				-webkit-transition: all .25s ease-in-out;
				transition: all .25s ease-in-out;

				svg path {
					stroke: var(--md-theme-default-accent);
					stroke-width: 2px;
					-webkit-transition: all .25s ease-in-out;
					transition: all .25s ease-in-out;
				}
			}

			&:before {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				z-index: 1;
				opacity: 0;
				transition: .4s cubic-bezier(.4,0,.2,1);
				will-change: background-color,opacity;
				content: " ";
			}

			&:active:before,
			&:hover:before {
				background-color: var(--md-theme-default-accent);
				opacity: .05;
			}

			&:active:before {
				opacity: .2;
			}
		}
	}

	.dz-message,
	.dz-preview {
		position: absolute;
		display: -webkit-box;
		display: flex;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.dz-image {
		position: relative;
		display: -webkit-box;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		flex-direction: column;
		border-radius: 5px;
		width: 100%;
		padding-bottom: 100%;
		cursor: pointer;
		margin: 0;

		img {
			position: absolute;
			width: 100%;
			height: auto;
		}
	}
	
	&.md-invalid .md-helper-text {
		display: none;
	}
	
	.md-helper-text,
	.md-error {
		position: static;
		height: auto;
		bottom: auto;
	}
}
</style>