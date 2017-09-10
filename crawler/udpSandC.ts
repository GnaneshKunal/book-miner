import * as dgram from 'dgram';

const server: dgram.Socket = dgram.createSocket('udp4');
const message: Buffer = Buffer.from('Some bytes');
const client: dgram.Socket = dgram.createSocket('udp4');

client.send(message, 41234, 'localhost', (err: Error) => {
    if (err) {
        throw err;
    }
    client.close();
});

server.on('error', (err: Error) => { // tslint:disable-next-line
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => { // tslint:disable-next-line
    console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address: dgram.AddressInfo = server.address(); // tslint:disable-next-line
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
