import re
import urllib.parse
import urllib.request
import http.cookiejar
import urllib.error

BASE = 'http://127.0.0.1:8000'

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

def login(email, password):
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(
        urllib.request.HTTPCookieProcessor(cj),
        NoRedirect(),
    )

    try:
        login_page = opener.open(BASE + '/login').read().decode('utf-8', 'ignore')
    except urllib.error.URLError as e:
        return ('server_error', str(e))

    m = re.search(r'name="_token" value="([^"]+)"', login_page)
    token = m.group(1) if m else None
    if not token:
        return ('csrf_not_found', None)

    data = urllib.parse.urlencode({'_token': token, 'email': email, 'password': password}).encode()
    req = urllib.request.Request(BASE + '/login', data=data, method='POST')
    # Laravel requires a referer for some reason sometimes, or just standard headers
    req.add_header('User-Agent', 'Mozilla/5.0')
    
    try:
        opener.open(req)
        return ('no_redirect', None)
    except urllib.error.HTTPError as e:
        if e.code in (302, 303):
            return (str(e.code), e.headers.get('Location'))
        return (str(e.code), None)

print("Testing Redirects...")
for email in ['staff@sales.local', 'manager@sales.local']:
    status, location = login(email, 'password123')
    print(f"User: {email} -> Status: {status}, Location: {location}")
