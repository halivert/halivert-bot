module.exports = {
	delay: function(ms) {
		return new Promise((resolve) => {
			return setTimeout(resolve, ms);
		});
	},
};
