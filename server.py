#!/usr/bin/env python
"""
Modification of `python -m SimpleHTTPServer` with a fallback to /index.html
on requests for non-existing files.
This is useful when serving a static single page application using the HTML5
history API.
https://gist.github.com/martijnvermaat/4bec9bcc37d965e43879
"""


import os
import sys
import urlparse
import SimpleHTTPServer
import BaseHTTPServer


class Handler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        urlparts = urlparse.urlparse(self.path)
        request_file_path = urlparts.path.strip('/')

        if not os.path.exists(request_file_path):
            self.path = 'index.html'

        return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)


host = '0.0.0.0'
try:
    port = int(sys.argv[1])
except IndexError:
    port = 8000
httpd = BaseHTTPServer.HTTPServer((host, port), Handler)


print 'Serving HTTP on %s port %d ...' % (host, port)
httpd.serve_forever()