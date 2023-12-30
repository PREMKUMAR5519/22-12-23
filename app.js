const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 1010;

// In-memory storage for rooms and bookings
let rooms = [];
let bookings = [];
app.use(bodyParser.json());

// Endpoint to create a new room
app.post('/rooms', (req, res) => {
  const { roomnumber, seats, amenities, pricePerHour } = req.body;

  if (!roomnumber || !seats || !amenities || !pricePerHour) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if(rooms.some(entry =>  entry.roomnumber === roomnumber)){
    return res.status(400).json({ error: 'room already exists.' });

  }


  const newRoom = {
    id: rooms.length + 1,
    roomnumber,
    seats,
    amenities,
    pricePerHour,
  };

  rooms.push(newRoom);

  res.json(newRoom);
});

// Endpoint to get all rooms
app.get('/rooms', (req, res) => {
  res.json(rooms);
});

// Endpoint to book a room
app.post('/bookings', (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;

  if (!customerName || !date || !startTime || !endTime || !roomId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const room = rooms.find((r) => r.id === parseInt(roomId));

  if (room) {
    return res.status(404).json({ error: 'Room not found.' });
  }
  if(bookings.some(entry =>  entry.roomId === roomId && entry.date === date )){
    return res.status(400).json({ error: `room already booked for someone. kindly choose different room id or book different date` })}

  const newBooking = {
    id: bookings.length + 1,
    customerName,
    date,
    startTime,
    endTime,
    roomId,
  };

  bookings.push(newBooking);

  res.json(newBooking);
});
app.get('/bookings', (req, res) => {
  res.json(bookings);
});

// Endpoint to get all bookings with room details
app.get('/booking-list', (req, res) => {
  const bookingsWithDetails = bookings.map((booking) => {
    return {
      roomnumber: rooms[booking.id - 1].roomnumber,
      bookedStatus: 'Booked',
      customerName: booking.customerName,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    };
  });

  res.json(bookingsWithDetails);
});

// Endpoint to get all customers with booking details
app.get('/customers', (req, res) => {
  const customersWithDetails = bookings.map((booking) => {
    return {
      customerName: booking.customerName,
      roomnumber: rooms[booking.id - 1].roomnumber,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    };
  });

  res.json(customersWithDetails);
});

// Endpoint to get booking history for a specific customer
app.get('/customer-history/:customerName', (req, res) => {
  const { customerName } = req.params;

  const customerBookings = bookings
    .filter((booking) => booking.customerName === customerName)
    .map((booking) => {
      return {
        customerName: booking.customerName,
        roomnumber: rooms[booking.id - 1].roomnumber,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        bookingId: booking.id,
        bookingDate: booking.date,
        bookingStatus: 'Booked',
      };
    });

  res.json(customerBookings);
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
