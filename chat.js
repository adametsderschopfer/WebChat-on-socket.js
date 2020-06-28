const app = require("./app");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const moment = require("moment");

let usersLength = 0;

io.on("connection", (socket) => {
  usersLength++;
  let userConnected;

  socket.on("chat message", (message) => {
    io.emit("chat message", message);
  });

  socket.on("user connected", (user) => {
    userConnected = "@" + user;
    io.emit("user connected_client", {
      user: "@" + user,
      date: moment().format("LT"),
      usersLength,
    });
  });

  socket.on("disconnect", () => {
    usersLength--;

    io.emit("user disconected", {
      user: userConnected,
      date: moment().format("LT"),
      usersLength,
    });
  });
});

http.listen(process.env.PORT, () => {
  console.log("listening on *:3000");
});
