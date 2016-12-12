var config;
if (process.env.CONFIG === 'production') {
	config = {
		name: 'images',
		imageFolder: '/images',
		interlive: 5000
	};
} else {
	config = {
		name: 'images',
		imageFolder: '/images',
		interlive: 5000
	};
}
module.exports = config;
