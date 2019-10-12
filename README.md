# Risi

Risi (pronounced raisai) is a schema index for Rime.

## Design

The Risi infrastructure consists of 3 parts:

1. a manually maintained schema list in JSON format
1. a script that adding necessary attributes to each schema record in the JSON file
1. the resulting schema list in JSON format
1. A web interface that displays the JSON file

Risi users access the schema list via (4) the web interface, while developers are able to do further processing with (3) the JSON file.

## Data Format

### The (1) Manually Maintained Schema List

**NOTE** Users should not rely on this format. It may be changed in later versions.

Each record is in the following format:

```json
{
  "repository": "sgalal/rime-kunyomi",
  "license_url": "/LICENSE",
  "config": {
    "schema_url": [ "/kunyomi.schema.yaml" ],
    "dict_url": [ "/kunyomi.dict.yaml" ],
    "opencc_config_url": [ "/opencc/t2jp.json", "/opencc/JPVariants.txt" ]
  }
}
```

### The (3) Automatically Generated Schema List

Each record is in the following format:

```json
{
  "repository": "sgalal/rime-kunyomi",
  "license": {
    "spdx_id": "GPL-3.0",
    "url": "https://raw.githubusercontent.com/sgalal/rime-kunyomi/07199e2beca0a529489d15476a33b0d9cb3e745a/LICENSE"
  },
  "config": {
    "schema": [
      {
        "name": "訓読み",
        "url": "https://raw.githubusercontent.com/sgalal/rime-kunyomi/07199e2beca0a529489d15476a33b0d9cb3e745a/kunyomi.schema.yaml",
        "schema_id": "kunyomi",
        "version": "20181007 V1.0.01",
        "author": [
          "其弦有余 <1727246457@qq.com>"
        ],
        "description": "This is the kunyomi input method for rime.\nThis schema uses OpenCC to convert the characters to Japanese style. Please put JPVariants.txt and t2jp.json in the opencc folder in advance.\n"
      }
    ],
    "dict": [
      {
        "name": "kunyomi",
        "url": "https://raw.githubusercontent.com/sgalal/rime-kunyomi/07199e2beca0a529489d15476a33b0d9cb3e745a/kunyomi.dict.yaml",
        "version": "20181009 V1.0.04"
      }
    ],
    "opencc_config": [
      "https://raw.githubusercontent.com/sgalal/rime-kunyomi/07199e2beca0a529489d15476a33b0d9cb3e745a/opencc/t2jp.json",
      "https://raw.githubusercontent.com/sgalal/rime-kunyomi/07199e2beca0a529489d15476a33b0d9cb3e745a/opencc/JPVariants.txt"
    ]
  }
}
```

## Workflow of the (2) Build Script

Use `sgalal/rime-kunyomi` as a example:

`sha`: **GET** <https://api.github.com/repos/sgalal/rime-kunyomi/commits/master>, `/sha`

* `/repository`: `/repository`
* `/license/spdx_id`: **GET** <https://api.github.com/repos/sgalal/rime-kunyomi>, `/license/spdx_id`
* `/license/url`: `https://raw.githubusercontent.com/sgalal/rime-kunyomi/{sha}{license_url}`
* `/config/schema`: for each schema, **GET** `https://raw.githubusercontent.com/sgalal/rime-kunyomi/{sha}{schema_url}`, then get the defined fields
* `/config/dict`: for each dictionary, **GET** `https://raw.githubusercontent.com/sgalal/rime-kunyomi/{sha}{dict_url}`, then get the defined fields
* `/config/opencc_config`: for each OpenCC configuration file, prefix the path with `https://raw.githubusercontent.com/sgalal/rime-kunyomi/{sha}`
