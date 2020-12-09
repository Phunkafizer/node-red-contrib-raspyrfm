# Node-RED support for sending and receiving with RaspyRFM[1] radio module
## Nodes
### RC pulse
Node for sending & receiving RC codes. Control RC sockets and receive buttons and sensors. Supports intertechno, logilight, brennenstuhl, emylo & many others
All settings are configurable in node's properties. The settings can optionally be overridden using msg.payload as an object.

##Installation
    npm install node-red-contrib-raspyrfm

##Supported devices
- Intertechno (old tristate and newer 32 bit) sockets & remote controls
- Hama sockets & remote controls
- Brennenstuhl RCS1000 sockets & remote controls
- Logilight sockets & remote controls
- Pilota casa sockets & remote controls
- Emylo sockets & remote controls
- ELV FS20 sockets & remote controls
- Voltcraft RC30 sockets & remote controls

##Operation
On a raspberry PI, connect the RaspyRFM[1] radio module, follow the installation instructions and run:
    ./rcpulsegw.py
In Node-RED 

[1]:http://www.seegel-systeme.de/2015/09/02/ein-funkmodul-fuer-den-raspberry-raspyrfm/