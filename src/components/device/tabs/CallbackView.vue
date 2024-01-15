<script>
import { systemNameToNormal } from "../../../utils/StringUtils.js"
import InputWithLabel from "../../fields/InputWithLabel.vue"
import Combobox from "../../fields/Combobox.vue"
import { DeviceApi } from "../../../api/device/DeviceApi.js"
import { NEW_CALLBACK_ID } from "./CallbacksView.vue"
import { h } from "vue"
import { toast } from '../../../utils/EventBus.js'
import LoadingButton from "../../controls/LoadingButton.vue"
import DeleteButton from "../../controls/DeleteButton.vue"
import EditButton from "../../controls/EditButton.vue"
import CancelButton from "../../controls/CancelButton.vue"
import SaveButton from "../../controls/SaveButton.vue"

const SYSTEM_FIELDS = ["id", "type", "readonly"]

export default {
	name: "CallbackView",
	props: {
		device: Object,
		callback: Object,
		observable: Object,
		template: Object,
		gateway: Object
	},
	components: {
		InputWithLabel,
		Combobox,
		LoadingButton,
		DeleteButton,
		EditButton,
		CancelButton,
		SaveButton,
	},
	data() {
		return {
			editing: this.callback.id == NEW_CALLBACK_ID,
			haveChanges: this.callback.id == NEW_CALLBACK_ID,
			validationFailed: [],
			loading: false
		}
	},
	computed: {
		visibleFields() {
			return Object.entries(this.callback)
				.filter(([key, _]) => !this.isDefaultField(key))
				.reverse()
		},
		fieldsComponents() {
			return this.visibleFields.map(([field, value]) => {
				const { required } = this.template[field] || false
				return {
					key: field,
					label: this.systemNameToNormal(field),
					required,
					value,
					render: this.getFieldComponent(field)
				}
			})
		}
	},
	methods: {
		systemNameToNormal,
		isDefaultField(key) {
			return SYSTEM_FIELDS.includes(key)
		},
		isFieldDisabled(key) {
			if (!this.editing || this.isDefaultField(key)) {
				return true
			}
			return !(key in this.template)
		},
		getFieldComponent(field) {
			if (this.template[field] && this.template[field]["values"]) {
				return h(
					Combobox,
					{ items: this.template[field]["values"] }
				)
			}
			return h(InputWithLabel, {})
		},
		async saveCallback() {
			if (!this.haveChanges) {
				console.warn("No changes were made")
				this.editing = false
				return
			}
			if (!this.validate()) {
				console.error("Validation failed: " + this.validationFailed)
				toast.error({
					caption: "Validation failed",
					description: `This fields cannot be empty: ${this.validationFailed}`,
				})
				return
			}
			let saveFunc = async () => {}
			this.loading = true
			try {
				if (this.callback.id !== NEW_CALLBACK_ID) {
					saveFunc = DeviceApi.updateCallback
				} else {
					delete this.callback.id;
					saveFunc = DeviceApi.createCallback
				}
				if (await saveFunc(this.device, this.observable, this.callback, this.gateway)) {
					console.info("Callback was saved")
					this.$emit("update")
					this.editing = false
					this.haveChanges = false
				}
			} finally {
				this.loading = false
			}
		},
		async deleteCallback() {
			if (this.callback.id !== 0 && !this.callback.id) {
				console.error("Callback id is missing")
				return
			}
			if (confirm("Are you sure you wan to delete callback " + this.callback.id + "?")) {
				this.loading = true
				try {
					if (await DeviceApi.deleteCallback(this.device, this.observable, this.callback.id, this.gateway)) {
						this.$emit("update")
					}
				} finally {
					this.loading = false
				}
			}
		},
		cancel() {
			this.validationFailed = []
			this.editing = false
			this.$emit('reloadCallback', this.callback)
		},
		validate() {
			this.validationFailed = []
			Object.entries(this.template).forEach(([key, { required }]) => {
				if (required) {
					const value = this.callback[key]
					if (value == null || value == undefined || value === "") {
						this.validationFailed.push(key)
					}
				}
			})
			return this.validationFailed.length == 0
		},
		setValue(key, value) {
			if (!key) {
				console.error("Key is missing")
				return
			}
			let finalValue = value
			const type = this.template[key]["type"]
			if (type) {
				switch (type) {
					case "boolean":
						finalValue = value == "true"
						break
					case "integer":
					case "number":
						finalValue = Number.parseInt(value)
						break
					case "string":
					case "text":
						finalValue = value
					default:
						console.error("Type " + type + " not supported yet")
				}
			}
			this.callback[key] = finalValue
			this.haveChanges = true
		}
	}
}
</script>

<template>
	<div class="bordered">
		<div class="header">
			<h3 class="title" style="flex: 1 1 auto; text-align: start;">
				[{{ callback.id }}] {{ callback.caption || systemNameToNormal(callback.type) }}
			</h3>
			<div class="controls">
				<div v-if="!callback.readonly" class="callback-view-controls">
					<DeleteButton v-if="!editing" :onClick="deleteCallback" :loading="loading" />
					<CancelButton v-if="editing" :onClick="cancel" />
					<EditButton v-if="!editing" :onClick="() => editing = true" />
					<SaveButton v-if="editing" :onClick="saveCallback" :loading="loading" />
				</div>
				<div v-else>
					<h3 style="text-align: center;">Readonly</h3>
				</div>
			</div>
		</div>
		<div class="list">
			<InputWithLabel label="type" :value="callback.type" :disabled="true" />
			<component v-for="{ key, label, value, render, required } in fieldsComponents" :is="render" :key="key"
				:label="label" :value="value" :notBlank="required" :disabled="isFieldDisabled(key)"
				:validationFailed="validationFailed.includes(key)" @input="setValue(key, $event.target.value)" />
		</div>
	</div>
</template>

<style scoped>
.header {
	display: flex;
	flex-direction: row;
	gap: var(--default-gap);
	position: relative;
}

.controls {
	display: flex;
	flex-direction: row;
	padding-top: var(--default-gap);
	gap: var(--default-gap)
}

.controls * {
	flex: 1 1 auto;
}

.callback-view-controls {
	display: flex;
	flex-direction: row-reverse;
	column-gap: var(--default-gap);
	margin-bottom: 5px;
}
</style>