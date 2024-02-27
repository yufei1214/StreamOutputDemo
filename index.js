const http = require('http');
const { formatISO } = require('date-fns');

http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  let counter = Math.floor(Math.random() * 10) + 1; // a random counter
  const sendEvent = () => {
    const curDate = formatISO(new Date());
    res.write(`event: ping\n`);
    res.write(`data: {"time": "${curDate}"}`);
    res.write('\n\n');

    counter--;
    if (counter === 0) {
      const message = `data: This is a message at time ${curDate}\n\n`;
      res.write(message);
      counter = Math.floor(Math.random() * 10) + 1; // reset random counter
    }

    setTimeout(sendEvent, 1000); // Send event every second
  };

  sendEvent();

  req.on('close', () => {
    res.end();
  });
}).listen(8080);

console.log('Server running at http://localhost:8080/');
