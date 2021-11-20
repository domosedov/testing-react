// import { createServer } from "node:http";
import { factory, primaryKey } from "@mswjs/data";
import faker from "faker";
import { createServer } from "node:net";

const server = createServer((c) => {
  // 'connection' listener.
  console.log("client connected");
  c.on("end", () => {
    console.log("client disconnected");
  });

  c.on("data", (data) => {
    console.log(data.toString());
    c.end();
  });

  c.write("hello\r\n");
  c.pipe(c);
});

server.on("error", (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log("server bound");
});

// const db = factory({
//   post: {
//     id: primaryKey(Number),
//     title: String,
//   },
// });

// for (let i = 1; i < 100; i++) {
//   db.post.create({
//     id: i,
//     title: faker.name.title(),
//   });
// }

// console.log(db.post.getAll());

// const server = createServer((req, res) => {
//   console.log(req.url);

//   if (req.url === "/") {
//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.write("<h1>Hello World</h1>");
//     res.end();
//   } else if (req.url === "/api") {
//     let post = db.post.findFirst({
//       where: {
//         id: 10,
//       },
//     });
//     res.writeHead(200, { "Content-Type": "application/json" });
//     res.write(JSON.stringify(post));
//   } else if (req.url === "/error") {
//     return Promise.reject(new Error("Something went wrong"));
//     res.writeHead(500, { "Content-Type": "text/html" });
//     res.write("<h1>Error</h1>");
//   } else {
//     res.writeHead(200, {
//       "Content-Type": "text/plain",
//       "Access-Control-Allow-Origin": "*",
//     });
//     res.end("Hello World\n");
//   }
// });

// server.listen(8000, "0.0.0.0", () => {
//   console.log("Server running at http://0.0.0.0:8000");
// });

// server.on("error", (err) => {
//   console.log("err here");
//   console.error(err);
// });

// process.on("uncaughtException", (err) => {
//   console.log("Oops!");
//   console.error(err);
//   process.exit(1);
// });

// process.on("unhandledRejection", (err) => {
//   console.log("Oops promise!");
//   console.error(err);
//   process.exit(1);
// });
