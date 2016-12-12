var config = {};

if (process.env.CONFIG === 'production') {
    config.twitter = {
        consumerKey:    'GMF4jZG8OJFwoamCWH8Y6zXeZ',
        consumerSecret: '8wCLkJFo8TLYgYzD8djgjbwRZQGaSEJgIoffkPowdSaxwp6OD9',
        accessToken: '143274921-S98qBo2ySGOWIsNKhAWN5nMxB0ew4YSsrutGuhFp',
        accessTokenSecret: 'PCy8UkBxLymyFeUyreN7Upw9gdcXPckhS9GTmFPB4LUzX',
        callback: 'http://yomesumo.red:8001/twitter/callback',
        textToSearch: 'yomesumo', //si hay mas de una palabra, separarlas por coma. https://dev.twitter.com/streaming/overview/request-parameters#track
        enabled:  (process.env.CONFIG === 'production' || process.argv[2]), // si se ejecuta 'node index.js true' o la variable de entorno CONFIG vale production => inicio la escucha en twitter
        interConectionTime: 10000, // si se cierra la conexion es el tiempo que pasa hasta que lo vuelva a intentar
        ymsAccessToken: '799292229223321600-DQaPEBd036l2UFxdmcA346f1hFjPy2x', //usamos esto para tuitear en nombre de yomesumored
        ymsAccessTokenSecret: 'rrkQyg0PNRdixdvhacPlWjioaMYs8tnEX2y8ofuZBxwCG',
        consumerKeyParaTwittear: '3ggZW8sprOOjEOFV6OL2KL0D8',
        consumerSecretParaTwittear: 'Yy95rG16SHacytHizrg0m7ZoyxGaTk6aI7rOSvWKzaJpMAJjVK'
    };

    config.environment = {
        rootUrl: 'http://yomesumo.red/',
        port: 8003
    };
    config.alertas = {
        host: '10.0.0.113',
        port: 8007
    };
    config.requestsTimeoutLimit = 10;
} else {
    config.twitter = {
        consumerKey:    'TQYV0JF0WSQuX3GLbH13KM08r',
        consumerSecret: 'uyCYal8jUXPpUpzN8CNulCektsm3Klim8ztPZIAdmEGxkbOoPC',
        accessToken: '143274921-Dd4FFtKUFNuEfZoaLbVJpltBYf97DmF9US1OKxZp',
        accessTokenSecret: 'yl3UZ3eb1jnwm0vvoKq5hVymI6PuNwDcrhyBo18gDza6r',
        callback: 'http://localhost:8001/twitter/callback',
        textToSearch: 'yomesumo', //si hay mas de una palabra, separarlas por coma. https://dev.twitter.com/streaming/overview/request-parameters#track
        enabled:  true,
        interConectionTime: 10000, // si se cierra la conexion es el tiempo que pasa hasta que lo vuelva a intentar
        ymsAccessToken: '799292229223321600-DQaPEBd036l2UFxdmcA346f1hFjPy2x', //usamos esto para tuitear en nombre de yomesumored
        ymsAccessTokenSecret: 'rrkQyg0PNRdixdvhacPlWjioaMYs8tnEX2y8ofuZBxwCG',
        consumerKeyParaTwittear: '3ggZW8sprOOjEOFV6OL2KL0D8',
        consumerSecretParaTwittear: 'Yy95rG16SHacytHizrg0m7ZoyxGaTk6aI7rOSvWKzaJpMAJjVK'
    };

    config.environment = {
        rootUrl: 'http://localhost:8000/',
        port: 8003
    };
    config.alertas = {
        host: 'localhost',
        port: 8007
    };
    config.requestsTimeoutLimit = 10;

}

module.exports = config;
