import Message from '../models/Message.js';

/**
 * Socket.io handler for real-time events:
 * - Presence management (tracking active users in events/rooms)
 * - Persistent Messaging (storing in MongoDB)
 * - Minimap Proximity logic (location broadcasting)
 * - WebRTC Signaling (video call handshake)
 */

// Memory store for active users per event
// { eventId: Map(socketId => { userId, username, avatar, x, y, lastSeen }) }
const eventPresence = new Map();

export const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        /**
         * 1. EVENT & PRESENCE
         */
        socket.on('join-event', ({ eventId, userId, username, avatar }) => {
            socket.join(`event:${eventId}`);

            if (!eventPresence.has(eventId)) {
                eventPresence.set(eventId, new Map());
            }

            const userData = {
                socketId: socket.id,
                userId,
                username,
                avatar,
                x: 0,
                y: 0,
                lastSeen: new Date(),
                currentRoom: null
            };

            eventPresence.get(eventId).set(socket.id, userData);

            // Broadcast updated presence list to everyone in the event
            const activeUsers = Array.from(eventPresence.get(eventId).values());
            io.to(`event:${eventId}`).emit('presence-update', activeUsers);

            console.log(`Presence: ${username} joined event ${eventId}`);
        });

        /**
         * 2. ROOM MANAGEMENT
         */
        socket.on('join-room', ({ roomId, eventId }) => {
            // Leave previous room if any
            const prevRoom = Array.from(socket.rooms).find(r => r.startsWith('room:'));
            if (prevRoom) socket.leave(prevRoom);

            socket.join(`room:${roomId}`);

            // Update presence metadata
            if (eventPresence.has(eventId) && eventPresence.get(eventId).has(socket.id)) {
                eventPresence.get(eventId).get(socket.id).currentRoom = roomId;
                const activeUsers = Array.from(eventPresence.get(eventId).values());
                io.to(`event:${eventId}`).emit('presence-update', activeUsers);
            }

            console.log(`Room: ${socket.id} entered room ${roomId}`);
        });

        /**
         * 3. MESSAGING (Persistent)
         */
        socket.on('send-message', async (messageData) => {
            const { eventId, roomId, content, senderId, senderName, isRoom } = messageData;
            const targetChannel = isRoom ? `room:${roomId}` : `event:${eventId}`;

            try {
                // Save to DB
                const newMessage = await Message.create({
                    sender: senderId,
                    content,
                    event: eventId,
                    room: isRoom ? roomId : undefined
                });

                // Emit to channel
                io.to(targetChannel).emit('receive-message', {
                    _id: newMessage._id,
                    content: newMessage.content,
                    sender: { _id: senderId, username: senderName },
                    createdAt: newMessage.createdAt,
                    room: roomId
                });
            } catch (err) {
                console.error('Socket Message Error:', err);
                socket.emit('error', { message: 'Could not send message' });
            }
        });

        /**
         * 4. PROXIMITY & COORDINATES
         */
        socket.on('update-position', ({ eventId, x, y }) => {
            if (eventPresence.has(eventId) && eventPresence.get(eventId).has(socket.id)) {
                const user = eventPresence.get(eventId).get(socket.id);
                user.x = x;
                user.y = y;
                user.lastSeen = new Date();

                // Broadcast local move to others (for real-time animation)
                socket.to(`event:${eventId}`).emit('user-moved', {
                    socketId: socket.id,
                    userId: user.userId,
                    x,
                    y
                });
            }
        });

        /**
         * 5. SIGNALING (WebRTC)
         */
        socket.on('signal', ({ to, signal, from }) => {
            io.to(to).emit('signal', { signal, from });
        });

        /**
         * DISCONNECT
         */
        socket.on('disconnect', () => {
            for (const [eventId, users] of eventPresence.entries()) {
                if (users.has(socket.id)) {
                    users.delete(socket.id);
                    // Broadcast updated presence
                    io.to(`event:${eventId}`).emit('presence-update', Array.from(users.values()));
                    socket.to(`event:${eventId}`).emit('user-disconnected', socket.id);
                }
            }
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
