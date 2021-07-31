const { connect } = require("nats");

const servers = [
    { port: 4222 },
];

runPublisher()

function toByte(str) {
    var bytes = [];
    for (var i = 0; i < str.length; ++i) {
        var code = str.charCodeAt(i);
        bytes = bytes.concat([code & 0xff, code / 256 >>> 0]);
    }

    return new Uint8Array(bytes);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function runPublisher() {
    await servers.forEach(async (v) => {
        while (true) {
            try {
                await sleep(1000);
                const nc = await connect(v);
                console.log(`connected to ${nc.getServer()}`);
                const payload = toByte("Data from node")
                msg = await nc.request("foo", payload, {
                    timeout: 3000
                })
                const done = nc.closed();

                await nc.close();
                // check if the close was OK
                const err = await done;
                if (err) {
                    console.log(`error closing:`, err);
                }

                const messageData = msg.data.toString("utf8")
                console.log("message response is", messageData)
            } catch (err) {
                console.log(err.code)
            }
        }
    });
}