function HTMLEncode(str) {
	const span = document.createElement('span');
	span.innerText = str;
	return span.innerHTML;
}

function getFileName(str) {
	const xs = str.split('/');
	return xs[xs.length - 1];
}

var table = new Tabulator('#schemaTable', {
	height: 205,
	ajaxURL: 'list.json',
	layout: "fitColumns",
	columns:
		[ { title: "Name"
			, field: "name"
			, headerFilter: true
			}
		, {	title: "Repository"
			, field: "repository"
			, headerFilter: true
			, formatter: "link"
			, formatterParams:
				{ labelField: "repository"
				, urlPrefix: "https://github.com/"
				}
			}
		, { title: "License"
			, field: "license"
			, headerFilter: true
			, formatter: "link"
			, formatterParams:
				{ label: cell => cell.getValue().spdx_id
				, url: cell => cell.getValue().url
				}
			}
		, { title: "Description"
			, field: "config"
			, headerFilter: true
			, formatter: function (cell, formatterParams, onRendered) {
					if (cell.getValue().schema.length == 1)
						return cell.getValue().schema[0].description;
					else
						return 'See details';
				}
			}
		],
	rowClick: function(e, row) {
		floatDiv.style.visibility = 'visible';
		const configs = row.getData().config;
		const res = [];

		res.push('<ul>');

		configs.schema.map(config => {
			res.push(`<li><a href="${HTMLEncode(config.url)}">${HTMLEncode(config.name)} (${HTMLEncode(config.schema_id)})</a> ${HTMLEncode(config.description)}</li>`);
		});

		configs.dict.map(config => {
			res.push(`<li><a href="${HTMLEncode(config)}">${HTMLEncode(getFileName(config))}</a></li>`);
		});

		configs.opencc_config.map(config => {
			res.push(`<li><a href="${HTMLEncode(config)}">${HTMLEncode(getFileName(config))}</a></li>`);
		});

		res.push('</ul>');

		detailTable.innerHTML = res.join('');
	},
});

