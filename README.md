# StreamOutputDemo
流式输出Demo
# 服务器端实时事件流示例

以下是一个基于 Node.js 的服务器端应用程序，用于向客户端发送 Server-Sent Events（SSE）流，不断地发送包含时间信息的事件以及定期发送一些消息。

## 1. 引入必要的模块

```javascript
const http = require('http');
const { formatISO } = require('date-fns');
```
* http: Node.js 内置的 HTTP 模块，用于创建 HTTP 服务器和处理 HTTP 请求。
* date-fns: 一个流行的 JavaScript 日期时间处理库，用于格式化日期时间。
## 2. 创建 HTTP 服务器：
```javascript
http.createServer((req, res) => {
  // 设置响应头
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',  // 指定响应类型为 text/event-stream，表示服务器将发送 Server-Sent Events 流
    'Cache-Control': 'no-cache',          // 禁用缓存
    'Connection': 'keep-alive',            // 保持连接长时间打开
  });

  // 定义计数器，用于控制发送消息的频率
  let counter = Math.floor(Math.random() * 10) + 1; // 随机计数器

  // 定义发送事件的函数
  const sendEvent = () => {
    // 获取当前时间并格式化为 ISO 8601 格式
    const curDate = formatISO(new Date());
    // 发送一个名为 "ping" 的事件，并携带当前时间的 JSON 数据
    res.write(`event: ping\n`);
    res.write(`data: {"time": "${curDate}"}`);
    res.write('\n\n');

    // 计数器递减，当计数器为 0 时发送一条消息
    counter--;
    if (counter === 0) {
      // 发送一条包含当前时间的简单消息
      const message = `data: This is a message at time ${curDate}\n\n`;
      res.write(message);
      // 重置计数器为一个新的随机值，以便下一次定时发送消息
      counter = Math.floor(Math.random() * 10) + 1;
    }

    // 每隔一秒钟调用一次 sendEvent() 函数，继续发送事件和消息
    setTimeout(sendEvent, 1000);
  };

  // 第一次调用 sendEvent() 函数，启动事件流
  sendEvent();

  // 监听客户端连接关闭事件，当客户端断开连接时，结束响应
  req.on('close', () => {
    res.end();
  });
}).listen(8080); // 服务器监听 8080 端口
```
## 3. sendEvent 函数是一个递归函数，它会不断地发送事件和消息：
* 首先获取当前时间，并将其格式化为 ISO 8601 格式，然后发送一个名为 "ping" 的事件，携带当前时间的 JSON 数据。
* 每次调用 sendEvent 函数时，计数器减一，当计数器归零时，发送一条简单的消息。
* 每次调用 sendEvent 函数后，使用 setTimeout 在一秒后再次调用 sendEvent，以便实现定时发送事件和消息的功能。
## 4. 最后，监听客户端的连接关闭事件，当客户端断开连接时，结束响应。
通过以上代码，您可以在 Node.js 中创建一个能够实时向客户端发送事件和消息的 Server-Sent Events 服务器。