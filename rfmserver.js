var net = require('net');

module.exports = function(RED) {
    function RfmServerNode(n) {
        RED.nodes.createNode(this,n);
        this.host = n.host;
        this.port = n.port;
        this.socket = new net.Socket();
        var node = this;

        this.clients = [];
        this.registerClient = function(client) {
            node.clients.push(client);
        };

        var setClientsStatus = function(status) {
            node.clients.forEach(function(item, index) {
                item.setStatus(status);
            });
        };

        this.on('close', function(done) {
            node.socket.destroy();
            done();
        });

        this.socket.on('close', function(err) {
            node.timer = setTimeout(function() {
                if (node.socket.pending) {
                    node.socket.connect(node.port, node.host);
                }
            }, 2000);

            setClientsStatus({fill:"red",shape:"ring",text:"disconnected"});
        });

        this.socket.on('error', function(err) {
        });

        this.socket.on('connect', function(err) {
            clearTimeout(node.timer);
            node.timer = 0;
            setClientsStatus({fill:"green",shape:"ring",text:"connected"});
        });

        this.socket.connect(node.port, node.host);
    }
    RED.nodes.registerType("rfmserver", RfmServerNode);
}