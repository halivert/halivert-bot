new Vue({
	el: "#el",
	data: {
		name: "",
		date: "",
		number: 100,
		notifications: []
	},
	created() {
		let clipboard = new ClipboardJS(".copyable");
		clipboard.on("success", e => {
			this.notifications.push({ text: "¡Copiado!", element: e.text });
			window.setTimeout(() => {
				this.notifications.splice(0, 1);
			}, 3000);
			e.trigger.classList.add("is-success");
		});
	},
	computed: {
		elements() {
			let result = [];
			let firstPart = (this.name.match(/\b(\w)/g) || []).join("").toUpperCase();
			let splitDate = this.date.split("-");
			let secondPart = "";
			if (splitDate.length === 3)
				secondPart = splitDate[2] + splitDate[1] + splitDate[0];

			for (let i = 1; i <= this.number; i++) {
				let num = i.toString().padStart(4, "0");
				result.push(`${firstPart}${secondPart}${num}`);
			}
			return result;
		}
	}
});
