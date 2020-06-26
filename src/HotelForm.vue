<script>
import MdForm from './components/MdForm.vue'
import MdUuid from 'vue-material/src/core/utils/MdUuid'

export default {
	name: "HotelForm",

	mixins: [MdForm],

	methods: {
		isLastListing: function(index) {
			return this.hotel.listings.length == index + 1
		},

		canRemoveListing: function() {
			return this.hotel.listings.length > 1
		},

		addListing: function() {
			var cleanClone = JSON.parse(JSON.stringify(this.$options.listing))
			cleanClone.uuid = 'listing-' + MdUuid()
			cleanClone.activeTab = true
			this.addRoomType(cleanClone, "single")
			this.$set(this.hotel.listings, this.hotel.listings.length, cleanClone)
		},

		removeListing: function(index) {
			var length = this.hotel.listings.length;
			
			if (length > 1) {
				this.hotel.listings.splice(index, 1)
				this.hotel.listings[length - 2].activeTab = true
			}
		},
		
		addRoomType: function(listing, code) {
			if (listing && this.$options.roomTypesAvailable[code]) {
				var cleanClone = JSON.parse(JSON.stringify(this.$options.roomTypesAvailable[code])) // !!!
				//cleanClone.uuid = listing.uuid + '-' + code
				this.$set(listing.roomTypes, code, cleanClone)
			}
		},
		
		removeRoomType: function(listing, code) {
			if (listing && listing.roomTypes[code]) {
				this.$set(listing.roomTypes, code, null)
			}
		}
	},
	
	created() {
/* 		for (let [code, type] of Object.entries(this.$options.roomTypesAvailable)) {
			type.uuid = 'type-template-' + code
		} */
		
		if (Object.keys(this.hotel.listings).length === 0) {
			this.addListing()
		}
	}
}
</script>