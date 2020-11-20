var net = require('net');

module.exports = function(RED) {
    function RCSocketNode(n) {  
        RED.nodes.createNode(this, n);
        this.server = RED.nodes.getNode(n.server);
        var node = this;

        node.setStatus = function(status) {
            node.status(status);
        };

        this.on('input', function(msg) {
            var payload = {
                "action": "send"
            }

            switch (n.datatype) {
                case 'IT':
                    payload.protocol = "ittristate";
                    payload.house = n.house;
                    payload.unit = parseInt(n.unit);
                    payload.state = msg.payload == "on" ? 1 : 0;
                    break;

                case 'IT32':
                    payload.protocol = "it32";
                    payload.id = parseInt(n.rcid);
                    payload.unit = parseInt(n.unit);
                    payload.state = msg.payload == "on" ? 1 : 0;
                    break;

                case 'PDM32':
                    payload.protocol = "pdm32";
                    payload.code = msg.payload == "on" ? n.codeon : n.codeoff;
                    break;

                case 'VOLTCRAFT':
                    payload.protocol = "voltcraft";
                    payload.id = parseInt(n.rcid);
                    payload.unit = parseInt(n.unit);
                    payload.state = msg.payload == "on" ? 2 : 0;
                    break;
            }

            node.server.socket.write(JSON.stringify(payload));
        });

        this.on('close', function(done) {
            done();
        });

        node.server.registerClient(node);
    }
    RED.nodes.registerType("rcsocket", RCSocketNode);
}
