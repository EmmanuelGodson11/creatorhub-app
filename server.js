const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const paystack = require('paystack')('your_paystack_secret_key'); // Add "paystack": "^2.0.1" to package.json dependencies

app.post('/create-subscription', async (req, res) => {
  try {
    const plan = await paystack.plan.create({
      name: 'Premium Plan',
      interval: 'monthly',
      amount: 499 * 100, // ₦499 in kobo
    });
    const subscription = await paystack.subscription.create({
      customer: req.body.customerId, // From frontend user signup
      plan: plan.code
    });
    res.json(subscription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chat Logic (Rooms, Messages, Encryption)
const rooms = {};
io.on('connection', (socket) => {
  socket.on('joinRoom', (room) => {
    socket.join(room);
    if (!rooms[room]) rooms[room] = [];
    rooms[room].push(socket.id);
    socket.emit('joined', room);
    socket.to(room).emit('userJoined');
  });

  socket.on('message', ({ room, encryptedMsg, timer }) => {
    io.to(room).emit('message', { encryptedMsg, sender: socket.id, timer });
    if (timer > 0) setTimeout(() => io.to(room).emit('deleteMsg', encryptedMsg), timer);
  });

  socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(Server running on port ${PORT}));
