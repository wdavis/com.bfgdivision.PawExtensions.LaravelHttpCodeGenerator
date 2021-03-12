# Laravel Http Code Generator for Paw

Easiest way to generate http request code for [Laravel Http](https://laravel.com/docs/8.x/http-client) – its nicely formatted too!

Supports GET, POST, PUT, PATCH and DELETE requests.

[Paw](https://paw.cloud) – The most advanced API tool for Mac

## Post

```php
$response = \Illuminate\Support\Facades\Http::withToken('full-token-here')->post("https://website.com/api/endpoint", [
	"type" => "transaction",
	"entry" => [
		[
            "resource" => [
                "gender" => "female",
                "address" => [
                    [
                        "use" => "home",
                        "state" => "OK",
                        "city" => "OKC",
                        "country" => "USA",
                        "postalCode" => "73104"
                    ]
                ],
            ]
		]
	],
	"resourceType" => "Bundle"
]);
```

## Form requests
```php
$response = \Illuminate\Support\Facades\Http::asForm()->post("https://website.com/connect/token", [
	"client_id" => "abc",
	"client_secret" => "123",
	"scope" => "order_api",
	"grant_type" => "client_credentials"
]);
```

## Basic Auth

```php
$queryString = http_build_query([
	"max" => "25",
	"calendarID" => "3423206",
	"minDate" => "2019-12-01"
]);

$response = \Illuminate\Support\Facades\Http::withBasicAuth('username', 'password')->withHeaders([
	"Cookie" => "PHPSESSID=odf5956n5hgvf17ifbrmolf7f0"
])->get("https://website.com/api/appointments?{$queryString}");
```

### Paw Extension Documentation
https://paw.cloud/docs/reference/Request

## Contribution Guidelines


## Tests
To run tests:

`npm run test`



## Notes

### Modules
Someone more patient and smarter than I can try and figure out how to get actual modules to work with Paw. This package just uses the minified js directly. 🤷🏻‍♂️

### External modules that were pulled in directly

* https://github.com/oknoorap/jsonar/blob/develop/index.js
* https://github.com/joliss/js-string-escape/blob/master/index.js
* https://cdn.jsdelivr.net/npm/lodash.isplainobject@4.0.6/index.js
* https://cdn.jsdelivr.net/npm/lodash.isempty@4.4.0/index.js
* https://github.com/glayzzle/php-parser/blob/master/dist/php-parser.min.js

### jsonar

Regarding `jsonar.js`, a modification was needed to help with formatting:
modification on line 213 to remove `;` from `    return `${phpArray};``
