const generator = require('../generator')
test('requests are get', () => {
   
    const headers = {}
 
    const requests = [{
        method: 'GET',
        urlBase: 'http://apple.com',
        headers: headers,
        getHeaderByName: jest.fn(param => {
            return headers[param]
        })
    }]
   
    const value = generator({}, requests, {})

    expect(value).toContain('\\Illuminate\\Support\\Facades\\Http::get("http://apple.com")')

});

test('requests are posts', () => {
   

    const headers = {}
 
    const requests = [{
        method: 'POST',
        urlBase: 'http://apple.com',
        headers: headers,
        getHeaderByName: jest.fn(param => {
            return headers[param]
        })
    }]
   
    const value = generator({}, requests, {})

    expect(value).toContain('\\Illuminate\\Support\\Facades\\Http::post("http://apple.com", [])')
    expect(value).toContain(', [])')

});

test('requests are puts', () => {
    
    const headers = {}
    const requests = [{
        method: 'PUT',
        urlBase: 'http://apple.com',
        headers: headers,
         getHeaderByName: jest.fn(param => {
            return headers[param]
        })
    }]
   
    const value = generator({}, requests, {})

    expect(value).toContain('\\Illuminate\\Support\\Facades\\Http::put("http://apple.com", [])')

});

test('requests are patch', () => {
    
    const headers = {}
    const requests = [{
        method: 'PATCH',
        urlBase: 'http://apple.com',
        headers: headers,
        getHeaderByName: jest.fn(param => {
            return headers[param]
        })
    }]
   
    const value = generator({}, requests, {})

    expect(value).toContain('\\Illuminate\\Support\\Facades\\Http::patch("http://apple.com", [])')

});

test('requests are delete', () => {
    
    const headers = {}
    const requests = [{
        method: 'DELETE',
        urlBase: 'http://apple.com',
        headers: headers,
        getHeaderByName: jest.fn(param => {
            return headers[param]
        })
    }]
   
    const value = generator({}, requests, {})

    expect(value).toContain('\\Illuminate\\Support\\Facades\\Http::delete("http://apple.com")')

});

test('delete requests can have a body', () => {
    
    const headers = {}
    const requests = [{
        method: 'DELETE',
        urlBase: 'http://apple.com',
        headers: headers,
        getHeaderByName: jest.fn(param => {
            return headers[param]
        }),
        body: { foo: 'bar' }
    }]
   
    const value = generator({}, requests, {})

    expect(value).toContain("\\Illuminate\\Support\\Facades\\Http::delete(\"http://apple.com\", [\n\t\"foo\" => \"bar\"\n])")

});


test('can provide basic auth credentials', () => {
    
    const headers = {}
    const requests = [{
        method: 'GET',
        urlBase: 'http://apple.com',
        headers: {},
         getHeaderByName: jest.fn(param => {
            return headers[param]
        }),
        httpBasicAuth: {
            username: "test",
            password: "pass"
        }
    }]
   
    const value = generator({}, requests, {})

    expect(value).toContain("withBasicAuth")

});


test('uses pretty token method', () => {
    
    const headers = {
        Authorization: "Bearer super-secret-value"
    }
  
    const requests = [{
        method: 'GET',
        urlBase: 'http://apple.com',
        headers: headers,
        getHeaderByName: jest.fn(param => {
            return headers[param]
        })
    }]
   
    const value = generator({}, requests, {})

    expect(value).toContain("withToken('super-secret-value')")

});


test('can send multipart/form', () => {
    
    const headers = {
        'Content-Type': "application/x-www-form-urlencoded"
    }
  
    const requests = [{
        method: 'POST',
        urlBase: 'http://apple.com',
        headers: headers,
        getHeaderByName: jest.fn(param => {
            return headers[param]
        }),
        body: { foo: 'bar' }
    }]
   
    const value = generator({}, requests, {})

    expect(value).not.toContain("Content-Type")
    expect(value).toContain("asForm()->post(\"http://apple.com\", [\n\t\"foo\" => \"bar\"\n])")

});

test('can send custom headers', () => {
    
    const headers = {
        foo: "bar"
    }
  
    const requests = [{
        method: 'POST',
        urlBase: 'http://apple.com',
        headers: headers,
        getHeaderByName: jest.fn(param => {
            return headers[param]
        }),
    }]
   
    const value = generator({}, requests, {})

    expect(value).toContain("withHeaders([\n\t\"foo\" => \"bar\"\n])")

});

test('can send query params', () => {
    
    const headers = {}
  
    const requests = [{
        method: 'POST',
        urlBase: 'http://apple.com',
        headers: headers,
        getHeaderByName: jest.fn(param => {
            return headers[param]
        }),
        urlParameters: { foo: "bar", bar: "baz" }
    }]
   
    const value = generator({}, requests, {})
expect(value).toContain("$queryString = http_build_query([\n\t\"foo\" => \"bar\",\n\t\"bar\" => \"baz\"\n]);")

    expect(value).toContain("http://apple.com?{$queryString}")

});

test('can provide a timeout', () => {

    const headers = {}

    const requests = [{
        method: 'POST',
        urlBase: 'http://apple.com',
        headers: headers,
        getHeaderByName: jest.fn(param => {
            return headers[param]
        }),
        timeout: 5000
    }]

    const value = generator({}, requests, {})
    expect(value).toContain("->timeout(5)")

});