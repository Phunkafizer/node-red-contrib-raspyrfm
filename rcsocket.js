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
            let payload = {
                "action": "send"
            };

            if (typeof msg.payload === "object")
                for (const [key, value] of Object.entries(msg.payload)) {
                    n[key] = value;
                }

            switch (n.datatype) {
                case 'IT':
                    payload.protocol = "ittristate";
                    payload.house = n.house;
                    payload.unit = parseInt(n.unit);
                    payload.state = n.state == "on" ? 1 : 0;
                    break;

                case 'TRISTATE':
                    payload.protocol = "ittristate";
                    payload.code = n.code;
                    break;

                case 'BRENNENSTUHL':
                    payload.protocol = "ittristate";
                    payload.code = "";
                    for (let i=0; i<5; i++)
                        payload.code += n.dips[i] === true ? "0" : "f";
                    for (let unit of "1234")
                        payload.code += n.unit === unit ? "0" : "f";
                    payload.code += "f";
                    payload.code += n.state == "on" ? "0f" : "f0";
                    break;

                case 'IT32':
                    payload.protocol = "it32";
                    payload.id = parseInt(n.rcid);
                    payload.unit = parseInt(n.unit);
                    payload.state = n.state == "on" ? 1 : 0;
                    break;

                case 'PDM32':
                    payload.protocol = "pdm32";
                    payload.code = n.code
                    break;

                case 'VOLTCRAFT':
                    payload.protocol = "voltcraft";
                    payload.id = parseInt(n.rcid);
                    payload.unit = parseInt(n.unit);
                    payload.state = msg.payload == "on" ? 2 : 0;
                    break;

                case 'SWITCH15':
                    payload.protocol = "switch15";
                    payload.id = parseInt(n.rcid);
                    payload.unit = parseInt(n.unit);
                    payload.state = msg.payload == "on" ? 1 : 0;
                    break;

                case 'EMYLO':
                    payload.protocol = "emylo";
                    payload.id = parseInt(n.rcid);
                    payload.key = n.key;
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
