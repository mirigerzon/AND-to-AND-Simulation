let Network = {
    //check
    cache: {
        ['register']: "100.100.100.100",
        ['login']: "100.100.100.100",
        ['todos']: "200.200.200.200"
    },
    servers: {
        ["100.100.100.100"]: registerDbServer,
        ["200.200.200.200"]: taskDbServer
    },
    send: function (request, callback) {
        const regex = /^(GET|POST|PUT|DELETE) \/([\S]+) HTTP\/1\.1 \n ([^\n]+) \n\n([\s\S]*)/;
        const matches = request.match(regex);
        let url = matches[2];
        setTimeout(() => {
            let serverIp = this.dns(url);
            let response = (this.servers[serverIp]).listen(request);
            callback(response);
        }, 1000);
    },
    dns: function (url) {
        let urlParts = url.split("/");
        return this.cache[urlParts[1]];
    }
}

