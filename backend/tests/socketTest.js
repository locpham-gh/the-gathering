import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const testEventId = '65ccae8f8f2b4e1234567890'; // Use a valid-looking ObjectId if possible
const testUserId = '65ccae8f8f2b4e1234567891';
const testUserName = 'Test User Presence';

socket.on('connect', () => {
    console.log('Connected to server via socket');

    // Test 1: Join Event with Presence info
    socket.emit('join-event', {
        eventId: testEventId,
        userId: testUserId,
        name: testUserName
    });

    // Test 2: Send Persistent Message
    setTimeout(() => {
        socket.emit('send-message', {
            targetId: testEventId, // sending to event room
            eventId: testEventId,
            isRoom: false,
            content: 'This message should be saved in DB',
            senderId: testUserId,
            senderName: testUserName
        });
    }, 1000);
});

socket.on('presence-update', (users) => {
    console.log('Presence update received. Active users:', users.length);
    console.log(users);
});

socket.on('receive-message', (data) => {
    console.log('Received message (should be from DB):', data);
});

socket.on('error', (err) => {
    console.error('Socket error:', err);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

// Run for 5 seconds
setTimeout(() => {
    socket.disconnect();
    process.exit(0);
}, 5000);
