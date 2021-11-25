module.exports = {
	siteMetadata: {
		siteUrl: "https://www.yourdomain.tld",
		title: "Gastby Timeship",
	},
	plugins: [
		"gatsby-plugin-postcss",
		"gatsby-plugin-gatsby-cloud",
		{
			resolve: "@raae/gatsby-plugin-let-it-snow",
			options: {
				colors: ["#161032", "#5BC0EB", "#CA3C25", "#9BC53D"],
				intensity: "blizzard",
			},
		},
	],
};
