import ACTIONS from "./Actions.js";

let userSocketMap = {};
const usersCode = {};

const getAllConnectedClients = (roomId, io) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({
      socketId,
      username: userSocketMap[socketId],
    })
  );
};

export const socketHandler = (socket, io) => {
  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on(ACTIONS.JOIN, ({ roomId, username, initialCode }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    if (!usersCode[roomId]) {
      usersCode[roomId] = initialCode || "";
    }

    socket.emit(ACTIONS.SEND_LATEST_CODE, {
      latestCode: usersCode[roomId],
    });

    const clients = getAllConnectedClients(roomId, io);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    usersCode[roomId] = code;
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.REQUEST_LATEST_CODE, ({ roomId }) => {
    if (usersCode[roomId]) {
      socket.emit(ACTIONS.SEND_LATEST_CODE, {
        latestCode: usersCode[roomId],
      });
    }
  });

  socket.on(ACTIONS.USER_TYPING, ({ roomId, username }) => {
    console.log('Starts')
    socket.in(roomId).emit(ACTIONS.USER_TYPING, { username });
  });

  socket.on(ACTIONS.USER_STOP_TYPING, ({ roomId, username }) => {
    console.log('Stops')
    socket.in(roomId).emit(ACTIONS.USER_STOP_TYPING, { username });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export { getAllConnectedClients, userSocketMap };
