var net = require('net');

module.exports = function(RED) {
    function RCWeatherNode(n) {  
        RED.nodes.createNode(this, n);
        this.server = RED.nodes.getNode(n.server);
        this.config = n;
        var node = this;

        node.setStatus = function(status) {
            node.status(status);
        };

        this.on('close', function(done) {
            done();
        });

        node.rcreceive = function(payload) {
            if (payload.protocol == node.config.datatype) {
                if (payload.params.id) {
                    Object.defineProperty(payload.params, "rcid",
                        Object.getOwnPropertyDescriptor(payload.params, "id"));
                    delete payload.params["id"];
                }
                if ((node.config.rcid_catchall === true) || (node.config.rcid == payload.params.rcid.toString())) {
                    msg = {
                        protocol: payload.protocol
                    };
                    switch (node.config.payload) {
                        case 'object':
                            msg.payload = payload.params;
                            break;
                        case 'T':
                            msg.payload = payload.params["T"];
                            break;
                        case 'RH':
                            msg.payload = payload.params["RH"];
                            break;
                        case 'AH':
                            msg.payload = payload.params["AH"];
                            break;
                        case 'DEW':
                            msg.payload = payload.params["DEW"];
                            break;
                    }
                    node.send(msg);
                }
            }
        };
        node.server.registerClient(node);
    }
    RED.nodes.registerType("rcweather", RCWeatherNode);
}
