new Vue({
	el: "#el",
	data: {
		name: "",
		date: "",
		number: 100,
		notifications: []
	},
	created() {
		let clipboard = new ClipboardJS("li");
		clipboard.on("success", () => {
			let notification = document.querySelector(".notification");
			if (notification) {
				notification.classList.remove("is-hidden");
			}
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

			for (let i = 0; i < this.number; i++) {
				let num = i.toString().padStart(4, "0");
				result.push(`${firstPart}${secondPart}${num}`);
			}
			return result;
		}
	}
});
