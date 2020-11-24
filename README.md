# Nodes for sending and receiving with RaspyRFM radio module
## Nodes
- rcpulse
Node for sending RC codes. Supports intertechno, logilight, brennenstuhl, emylo & many others
All settings are configurable in node's properties. The settings can optionally be overridden using msg.payload as an object:
|Property|Description|Example|
|--------|-----------|-------|
|"state"|State, "on" or "off"|"on"|
|"house"|Housecode, type-dependent|"A"| 

