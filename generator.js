const window = {}
const jsonar = require('./jsonar.js')

const Mustache = require('./mustache.js')
const qs = require('./qs.js')

module.exports = function(context, requests, options) {
    
    const request = requests[0]

    const requestConfig = {
        method: request.method.toLowerCase(),
        url: request.urlBase,
    }

    let headers = extract(request, 'headers').headers
    let authHeader = request.getHeaderByName('Authorization')
    
    if(authHeader)
    {
        if(authHeader.includes('Bearer'))
        {
            requestConfig.bearerToken = authHeader.replace('Bearer ', '')
            delete headers['Authorization']
        }
        if(authHeader.includes('Basic')) // remove the auth header so we can use the pretty format
        {
            delete headers['Authorization']
        }
    }

    let formContentType = request.getHeaderByName('Content-Type')

    if(formContentType?.includes('application/json')) { // Laravel Http defaults to application/json
        delete headers['Content-Type']
    } else if(formContentType?.includes('application/x-www-form-urlencoded')) {
        delete headers['Content-Type']
        requestConfig.asForm = true
    } else if(formContentType?.includes('application/octet-stream')) {
        delete headers['Content-Type']
        delete requestConfig['asForm']
        requestConfig.asFile = true
    } else if(formContentType?.includes('multipart/form-data')) {
        delete headers['Content-Type']
        delete requestConfig['asForm']
        requestConfig.asMultipart = true
    }

    requestConfig.basicAuth = getBasicAuth(
        extract(request, 'httpBasicAuth', 'auth')
    );

    requestConfig.headers = getHeaders(headers);

    requestConfig.params = getParams(
        extract(request, 'urlParameters', 'params')
    );

    requestConfig.body = getBody(request, requestConfig);

    requestConfig.timeout = getTimeout(
        extract(request, 'timeout')
    );

    let template

    try {
        template = readFile("view.mustache")
    } catch (e) {
        const fs = require('fs')
        const readFile = fs.readFileSync
        template = readFile("view.mustache", 'utf8')
    }

    return Mustache.render(template, requestConfig)

};

const getBasicAuth = (basicAuth) => {
    if (basicAuth.hasOwnProperty('auth')) {
        return `'${basicAuth.auth.username}', '${basicAuth.auth.password}'`
    }
}

const getParams = (params) => {
    if (Object.keys(params).length !== 0 && params.constructor === Object) {
        return jsonar.arrify(JSON.stringify(params.params), {prettify: true})
    }
}

const getBody = (request, config) => {
    if (request.method !== 'GET' && request.method !== 'OPTIONS' && !config.asFile && !config.asMultipart)
    {
        if (!request.body && request.method === 'DELETE') {
            return null
        }

        if (config.asForm) {
            return jsonar.arrify(qs.parse(request.body), {prettify: true})
        }

        return jsonar.arrify(request.jsonBody || request.body || {}, {prettify: true})
    }
}

const getHeaders = headers => {
    if (headers) {
        if (Object.keys(headers).length !== 0 && headers.constructor === Object) {
            return jsonar.arrify(JSON.stringify(headers), {prettify: true})
        }
    }

    return []
}

const getTimeout = (timeout) => {
    if (timeout) {
        return timeout.timeout / 1000; // paw timeout is in ms
    }
}

const isEmpty = (value) => {
    return value === undefined || value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
};

const extract = (request, pawKey, key = pawKey) => {
    if (request[pawKey] && !isEmpty(request[pawKey])) {
        return { [key]: request[pawKey] };
    }
    return {};
};
