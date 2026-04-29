import React from "react";

export default function Bookings({
  customers,
  bookings,
  bookingForm,
  setBookingForm,
  addBooking,
  deleteBooking
}) {
  return (
    <div style={{ background: "white", padding: 20 }}>
      <h2>Bookings</h2>

      <select
        value={bookingForm.customerId}
        onChange={(e) => {
          const selected = customers.find(c => c.id === e.target.value);

          setBookingForm({
            customerId: selected.id,
            customerName: selected.firstName,
            service: selected.service,
            price: selected.price,
            location: selected.location,
            date: ""
          });
        }}
      >
        <option>Select Customer</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.firstName}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={bookingForm.date}
        onChange={(e) =>
          setBookingForm({ ...bookingForm, date: e.target.value })
        }
      />

      <button onClick={addBooking}>Create Booking</button>

      {bookings.map((b) => (
        <div key={b.id}>
          {b.customerName} - {b.date}
          <button onClick={() => deleteBooking(b.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}