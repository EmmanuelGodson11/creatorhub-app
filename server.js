const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const stripe = require('stripe')('your_stripe_key'); // Replace with your Stripe secret key

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Stripe Subscription Endpoint
app.post('/create-subscription', async (req, res) => {
  try {
    const customer = await stripe.customers.create({ email: req.body.email });
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: 'your_premium_price_id' }], // Create in Stripe dashboard
    });
    res.json({ subscriptionId: subscription.id });
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
