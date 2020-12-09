var net = require('net');

module.exports = function(RED) {
    RED.httpAdmin.post("/raspyrfm/:id", function(req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                let params = overrideParams(node);
                sendRCData(node, params);
                sendMessage(node, params);
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error(RED._("inject.failed",{error:err.toString()}));
            }
        } else {
            res.sendStatus(404);
        }
    });

    function overrideParams(node, params = {}) {
        let result = {};
        for (k of ["house", "group", "unit", "command", "code", "rcid", "dips"]) {
            if (node.config[k])
                result[k] = (params[k]) ? params[k] : node.config[k];
        }
        return result;
    }

    function sendMessage(node, params) {
        let msg = {
            protocol: node.config.datatype,
            payload: params
        };
        node.send(msg);
    }

    function sendRCData(node, params) {
        let payload = {
            action: "send",
            protocol: node.config.datatype,
            params: params
        };

        if (payload.params.rcid) {
            Object.defineProperty(payload.params, "id",
                Object.getOwnPropertyDescriptor(payload.params, "rcid"));
            delete payload.params["rcid"];
        }
        node.server.socket.write(JSON.stringify(payload));
    }

    function RCPulseNode(n) {  
        RED.nodes.createNode(this, n);
        this.server = RED.nodes.getNode(n.server);
        this.config = n;
        var node = this;

        node.setStatus = function(status) {
            node.status(status);
        };

        this.on('input', function(msg) {
            let params = (typeof msg.payload == "object") ? msg.payload : {};
            params = overrideParams(node, params); 
            msg.payload = params;
            node.send(msg);
            sendRCData(node, params);
        });

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
                //compare params
                for (p in payload.params) {
                    if (node.config[p + "_catchall"] === true)
                        continue;
                    if (payload.params[p].toString() != node.config[p]) {
                        return;
                    }
                }
                sendMessage(node, payload.params);
            }
        };

        node.server.registerClient(node);
    }

    RED.nodes.registerType("rcpulse", RCPulseNode);
}
