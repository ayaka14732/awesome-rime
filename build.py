#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import urllib.request
import yaml

def getJSON(url):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        b = response.read()
        return json.loads(b)

def getYAML(url):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        b = response.read()
        return yaml.safe_load(b)

d = []

with open('proto.yaml') as fproto:
    xs = yaml.safe_load(fproto)
    for x in xs:
        sha = getJSON('https://api.github.com/repos/' + x['repository'] + '/commits/master')['sha']
        repo = getJSON('https://api.github.com/repos/' + x['repository'])

        def get_schema(schema_url):
            schema_url_full = 'https://raw.githubusercontent.com/' + x['repository'] + '/' + sha + schema_url
            schema = getYAML(schema_url_full)['schema']
            return \
                { 'name': schema['name']
                , 'url': schema_url_full
                , 'schema_id': schema['schema_id']
                , 'version': schema['version']
                , 'author': schema['author']
                , 'description': schema['description']
                }

        d.append( \
            { 'name': x['name']
            , 'repository': x['repository']
            , 'license': None if not repo['license'] else
                { 'spdx_id': None if not repo.get('license') else repo['license']['spdx_id']
                , 'url': None if not repo.get('license_url') else 'https://raw.githubusercontent.com/' + x['repository'] + '/' + sha + x['license_url']
                }
            , 'config':
                { 'schema': [get_schema(schema_url) for schema_url in x['config']['schema_url']]
                , 'dict': ['https://raw.githubusercontent.com/' + x['repository'] + '/' + sha + dict_url for dict_url in x['config']['dict_url']]
                , 'opencc_config': ['https://raw.githubusercontent.com/' + x['repository'] + '/' + sha + opencc_connfig_url for opencc_connfig_url in x['config'].get('opencc_config_url', ())]
                }
            })

with open('docs/list.json', 'w') as flist:
    json.dump(d, flist, ensure_ascii=False)
