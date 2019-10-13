function filterFunction() {
	schemaTable.querySelectorAll('#schemaTable > li:not(:first-child)').forEach(row => row.style.display =
		(row.searchText.indexOf(filterInput.value.toUpperCase()) == -1) ? "none" : "");
}

function HTMLEncode(str) {
	const span = document.createElement('span');
	span.innerText = str;
	return span.innerHTML;
}

function getFileName(str) {
	const xs = str.split('/');
	return xs[xs.length - 1];
}

const ul = document.createElement('ul');
ul.setAttribute('id', 'schemaTable');
const title = document.createElement('li');
['Name', 'Repository', 'License', 'Author', 'Description', 'Files'].map(x => {
	const span = document.createElement('span');
	span.innerText = x;
	title.appendChild(span);
})
ul.appendChild(title);

(async () => {
	const response = await fetch('list.json');
	const schemata = await response.json();
	schemata.map(schema => {
		const row = document.createElement('li');
		// Name
		let span = document.createElement('span');
		span.innerHTML = '<ul>' + [...new Set(schema.config.schema.map(x => x.name))].map(x => '<li>' + HTMLEncode(x) + '</li>').join('') + '</ul>';
		row.appendChild(span);
		// Repository
		span = document.createElement('span');
		span.innerHTML = `<a href="https://github.com/${escape(schema.repository)}">${HTMLEncode(schema.repository)}</a>`;
		row.appendChild(span);
		// License
		span = document.createElement('span');
		span.innerHTML = !schema.license ? 'Not specified' : `<a href="${escape(schema.license.url)}">${HTMLEncode(schema.license.spdx_id)}</a>`;
		row.appendChild(span);
		// Author
		span = document.createElement('span');
		span.innerHTML = '<ul>' + [...new Set(schema.config.schema.map(x => x.author).flat())].map(x => '<li>' + HTMLEncode(x) + '</li>').join('') + '</ul>';
		row.appendChild(span);
		// Description
		span = document.createElement('span');
		span.innerHTML = '<ul>' + [...new Set(schema.config.schema.map(x => x.description))].map(x => '<li>' + HTMLEncode(x) + '</li>').join('') + '</ul>';
		row.appendChild(span);
		// Files
		span = document.createElement('span');
		const res = [];
		res.push('<ul>');
		const configs = schema.config;
		configs.schema.map(config => {
			res.push(`<li><a href="${HTMLEncode(config.url)}">${HTMLEncode(getFileName(config.url))}</a></li>`);
		});
		configs.dict.map(config => {
			res.push(`<li><a href="${HTMLEncode(config)}">${HTMLEncode(getFileName(config))}</a></li>`);
		});
		configs.opencc_config.map(config => {
			res.push(`<li><a href="${HTMLEncode(config)}">${HTMLEncode(getFileName(config))}</a></li>`);
		});
		res.push('</ul>');
		span.innerHTML = res.join('');
		row.appendChild(span);
		// Append
		row.searchText =
			( schema.name + ' '
			+ schema.repository + ' '
			+ (!schema.license ? '' : schema.license.spdx_id) + ' '
			+ schema.config.schema.map(s => s.description).join(' ')
			).toUpperCase();
		ul.appendChild(row);
	});
})()

document.body.appendChild(ul);
