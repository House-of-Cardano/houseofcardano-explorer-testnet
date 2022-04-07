const app = require("./server");
const mongoConnect = require("./util/mongodb").mongoConnect;

const PORT = 8000;

mongoConnect(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server now listening on port ${PORT}`);
  });
  const io = require("socket.io")(server);
  io.on("connection", (socket) => {
    console.log(socket.id);
    console.log("Aye, aye min, fit like the day");
    socket.on('send-message', (message) => {
        io.emit("receive-message", message);
        console.log(message)
    });
  });
});
