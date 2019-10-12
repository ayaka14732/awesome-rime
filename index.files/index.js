(async () => {
	const response = await fetch('list.json');
	const schemata = await response.json();
	console.log(JSON.stringify(schemata));
})()
