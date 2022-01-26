const fs = require('fs');
const express = require('express');
const app = express();

const { proxy, scriptUrl } = require('rtsp-relay')(app);

fs.readFile('./servers.json', (err, data) => {
    let file = JSON.parse(data.toString());
    let servers = file.servers;
    servers.forEach(({ username, password, ip, channel }) => {
        app.ws('/api/stream/:channel', (ws, req) =>
            proxy({
                url: `rtsp://${username}:${password}@${ip}/Streaming/Channels/${req.params.channel}`,
            })(ws)
        );

        // this is an example html page to view the stream
        app.get(`/${channel}`, (req, res) =>
            res.send(`
    <canvas id='canvas'></canvas>
  
    <script src='${scriptUrl}'></script>
    <script>
      loadPlayer({
        url: 'ws://' + location.host + '/api/stream/${channel}',
        canvas: document.getElementById('canvas')
      });
    </script>
  `)
        );

    });
});

app.listen(2000);