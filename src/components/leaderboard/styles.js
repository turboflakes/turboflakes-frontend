const styles = (theme) => ({
	root: {
		backgroundColor: theme.palette.neutrals[200],
		height: "100%"
	},
	searchIcon: {
		position: "absolute",
		right: theme.spacing(2)
	},
	list: {
		overflow: "auto",
    height: "80vh",
		borderTop: `1px solid ${theme.palette.neutrals[400]}`
	},
	light:{
		background: theme.palette.text.secondary,
	},
	network: {
		padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0 ${theme.spacing(2)}px`,
		position: "relative",
		display: "flex",
		alignItems: "center",
	},
	networkLabel: {
		margin: `0 ${theme.spacing(1)}px`,
	},
	networkLogo: {
		width: 49,
		height: 49
	},
	title: {
		padding: `0 ${theme.spacing(2)}px`,
		marginBottom: theme.spacing(1)
	},
	subTitle: {
		display: "flex",
		justifyContent: "space-between",
		flexWrap: "wrap"
	},
	rootIconClasses: {
		color: theme.palette.text.primary,
		width: 10
	},
	info: {
		textTransform: "uppercase",
		margin: `${theme.spacing(2)}px ${theme.spacing(2)}px 0 0`,
	},
})
export default styles