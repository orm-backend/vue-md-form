<template>
	<div
		class="bitmask" :class="fieldClasses">
		
		<input
			type="hidden"
			v-model="model"
			v-on="listeners"
			v-bind="{ id, name, required }" />
		
		<transition name="md-input-action" appear>
			<md-button tabindex="-1"
				class="md-icon-button md-dense md-input-action md-clear"
				@click="clearField" v-if="hasValue && mdClearable"
				:disabled="disabled">
				<md-icon class="md-icon-image" v-once>
					<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" v-once>
						<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
						<path d="M0 0h24v24H0z" fill="none"/>
					</svg>
				</md-icon>
			</md-button>
		</transition>
		
		<slot
			v-bind="{ values, disabled }" />
	</div>
</template>

<script>
export default {
	name: "ItacesBitmask",
	props: {
		id: {
			type: String,
			default: () => 'bitmask-' + Math.random().toString(36).slice(4)
		},
		name: {
			type: String,
			required: true
		},
		required: Boolean,
	    disabled: Boolean,
	    mdClearable: Boolean
	},
	data: function () {
		return {
			localValue: 0,
			values: []
		}
	},
	methods: {
		clearField () {
			this.values = []
		},
		bitmaskToValues(mask) {
			let values = []
			let bit = 1
			
			while (bit <= mask) {
				bit = bit << 1
				let value = bit & mask

				if (value) {
					values.push(value)
				}
			}
			
			return values
		}
	},
	watch: {
		values: function() {
			this.localValue = this.values.reduce(function(bitmask, value) {
				return bitmask | value;
			}, 0)
		},
		localValue: function() {
			this.$emit('input', this.localValue)
		}
	},
	computed: {
 		model: {
			get () {
				return this.localValue
			},
			set (value) {
				console.log(value)
				this.values = this.bitmaskToValues(value)
			}
		},
		listeners () {
			var l = {...this.$listeners}
			delete l.input
			return l
		},
		attributes () {
			return {
				id: this.id,
				name: this.name,
				disabled: this.disabled,
				required: this.required
			}
		},
		hasValue () {
			return this.localValue > 0
		},
		fieldClasses () {
			return {
				'md-clearable': this.mdClearable,
				'md-disabled': this.disabled,
				'md-required': this.required,
				'md-has-value': this.hasValue
			}
		}
	}
}
</script>

<style lang="scss">
.bitmask {
    margin: 4px 0 24px;
    font-family: inherit;
    display: block;
    position: relative;
    padding-bottom: 46px;

	.bitmask-checkboxes,
	.bitmask-messages {
	    position: relative;
	    top: 46px;
	    white-space: normal;
	}
	
	.md-checkbox .md-checkbox-label {
	    padding-left: 8px;
	}
	
	&>label {
	    position: absolute;
	    top: 23px;
	    left: 0;
	    pointer-events: none;
	    transition: .4s cubic-bezier(.25,.8,.25,1);
	    transition-duration: .3s;
	    font-size: 16px;
	    line-height: 20px;
	    color: rgba(0, 0, 0, 0.54);
	}
	
	&.md-required>label:after {
	    position: absolute;
	    top: 2px;
	    right: 0;
	    transform: translateX(calc(100% + 2px));
	    content: "*";
	    line-height: 1em;
	    vertical-align: top;
	    color: var(--md-theme-default-accent);
	}
	
	.md-helper-text,
	.md-error {
	    height: 20px;
	    position: absolute;
	    bottom: -22px;
	    font-size: 12px;
	    transition: .3s cubic-bezier(.4,0,.2,1);
	}
	
	.md-helper-text {
	    color: rgba(0, 0, 0, 0.54);
	}
	
	.md-error {
	    color: var(--md-theme-default-fieldvariant, #ff1744);
	}
	
	.md-input-action {
	    position: absolute;
	    top: 16px;
	    right: 0;
	}
}
</style>
