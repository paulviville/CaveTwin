const connections = [];
let mainPort;
let secondary = [];
let screen0;
let screen1;
let screen2;

self.onconnect = function ( event ) {
	const port = event.ports[0];
	connections.push(port);
	event.ports[0].postMessage("connection attempt");

	port.onmessage = function ( e ) {
		const data = e.data;
		

		// if(data.type === "initMain") {
		// 	mainPort = event.ports[0];
		// 	mainPort.postMessage({data: "main connection acknowledged"});
		// 	mainPort.postMessage({data: connections.length});
		// }

		if(data.type === "init") {
			switch(data.data) {
				case 0: 
					mainPort = port;
					mainPort.postMessage({data: "main connection acknowledged"});
					mainPort.postMessage({data: connections.length});
					break;
				case 1:
				case 2:
				case 3:
				// default:
					secondary[data.data] = port;
					secondary[data.data].postMessage({data: `connection ${data.data} acknowledged ${typeof(data.data)}`});
					mainPort.postMessage({type: "screen", data: data.data});;
					break;
				default:
					break;
			}
		}

		if(data.type === "camera") {
			secondary[data.data.target].postMessage({type: "camera", data: data.data });
		}

		if(data.type === "terminate") {
			connections.clear();
			self.close();
		}
	}

	port.start();
}