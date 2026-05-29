const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.SOCKET_PORT || 4000;
const ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: ORIGIN,
        credentials: true,
    },
    transports: ["websocket"],
});

const agents = new Map();
const ticketLocks = new Map();

function broadcastPresence() {
    io.emit("presence_update", Array.from(agents.values()));
}

io.on("connection", (socket) => {
    socket.on("join_dashboard", ({ agentId, agentName, role }) => {
        const agent = {
            id: agentId,
            name: agentName,
            role: role || "Support Agent",
            status: "online",
            activity: "Viewing Dashboard",
        };
        agents.set(agentId, agent);
        socket.data.agentId = agentId;
        io.emit("agent_joined", agent);
        broadcastPresence();
    });

    socket.on("agent_online", ({ agentId, agentName, role }) => {
        const agent = {
            id: agentId,
            name: agentName,
            role: role || "Support Agent",
            status: "online",
            activity: "Viewing Dashboard",
        };
        agents.set(agentId, agent);
        socket.data.agentId = agentId;
        io.emit("agent_joined", agent);
        broadcastPresence();
    });

    socket.on("agent_offline", ({ agentId }) => {
        if (agents.has(agentId)) {
            agents.delete(agentId);
            io.emit("agent_left", agentId);
            broadcastPresence();
        }
    });

    socket.on("lock_ticket", (payload) => {
        const existingLock = ticketLocks.get(payload.ticketId);

        if (existingLock) {
            if (existingLock.lockedById === payload.agentId) {
                socket.emit("ticket_locked", existingLock);
            } else {
                socket.emit("ticket_lock_denied", {
                    ticketId: payload.ticketId,
                    lockedById: existingLock.lockedById,
                    lockedByName: existingLock.lockedByName,
                });
            }
            return;
        }

        const lock = {
            ticketId: payload.ticketId,
            agentId: payload.agentId,
            agentName: payload.agentName,
            lockedById: payload.agentId,
            lockedByName: payload.agentName,
        };

        ticketLocks.set(payload.ticketId, lock);
        io.emit("ticket_locked", lock);
    });

    socket.on("unlock_ticket", (payload) => {
        const existingLock = ticketLocks.get(payload.ticketId);
        if (!existingLock) {
            return;
        }

        if (payload.agentId && existingLock.lockedById !== payload.agentId) {
            return;
        }

        ticketLocks.delete(payload.ticketId);
        io.emit("ticket_unlocked", { ticketId: payload.ticketId });
    });

    socket.on("create_ticket", (ticket) => {
        io.emit("ticket_created", ticket);
    });

    socket.on("update_ticket", (ticket) => {
        io.emit("ticket_updated", ticket);
    });

    socket.on("typing", (payload) => {
        socket.broadcast.emit("typing", payload);
    });

    socket.on("disconnect", () => {
        const agentId = socket.data.agentId;
        if (agentId && agents.has(agentId)) {
            agents.delete(agentId);
            io.emit("agent_left", agentId);
            broadcastPresence();
        }

        for (const [ticketId, lock] of ticketLocks.entries()) {
            if (lock.lockedById === agentId) {
                ticketLocks.delete(ticketId);
                io.emit("ticket_unlocked", { ticketId });
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Socket server running on http://localhost:${PORT}`);
});
