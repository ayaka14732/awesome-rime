function HTMLEncode(str) {
	const span = document.createElement('span');
	span.innerText = str;
	return span.innerHTML;
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
		res.push('<h2>Schema Files</h2>')
		configs.schema.map(config => {
			res.push(`<p><a href="${HTMLEncode(config.url)}">${HTMLEncode(config.name)} (${HTMLEncode(config.schema_id)})</a> ${HTMLEncode(config.description)}</p>`);
		});
		res.push('<h2>Dictionary Files</h2>')
		configs.dict.map(config => {
			res.push(`<p><a href="${HTMLEncode(config.url)}">${HTMLEncode(config.name)}</a></p>`);
		});
		res.push('<h2>OpenCC Configuration Files</h2>')
		configs.opencc_config.map(config => {
			res.push(`<p><a href="${HTMLEncode(config)}">File</a></p>`);
		});
		detailTable.innerHTML = res.join('');
	},
});

