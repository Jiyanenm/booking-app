import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem
} from "@mui/material";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: "AIzaSyB1EoRXo-fzPNDz1kdGp3eh9Wf1N5cky3M",
  authDomain: "booking-dashboard-a6b91.firebaseapp.com",
  projectId: "booking-dashboard-a6b91",
  storageBucket: "booking-dashboard-a6b91.firebasestorage.app",
  messagingSenderId: "167866484507",
  appId: "1:167866484507:web:404d2ccc697eb2e50675be"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ================= LOGIN ================= */
function LoginPage({ form, setForm, handleLogin }) {
  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f5f7fb" }}>
      <Card sx={{ p: 4, width: 380 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Login
        </Typography>

        <TextField fullWidth label="Email" margin="normal"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <TextField fullWidth label="Password" type="password" margin="normal"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Button fullWidth variant="contained" onClick={handleLogin}>
          Login
        </Button>
      </Card>
    </Box>
  );
}

/* ================= DASHBOARD ================= */
function Dashboard({ bookings = [] }) {
  const revenue = bookings.reduce((a, b) => a + Number(b.totalPrice || 0), 0);

  return (
    <Box>
      <Typography variant="h4" mb={2}>Dashboard</Typography>

      <Box display="flex" gap={2}>
        <Card sx={{ p: 3, flex: 1 }}>
          <Typography>Total Bookings</Typography>
          <Typography variant="h4">{bookings.length}</Typography>
        </Card>

        <Card sx={{ p: 3, flex: 1 }}>
          <Typography>Total Revenue</Typography>
          <Typography variant="h4">R {revenue}</Typography>
        </Card>
      </Box>
    </Box>
  );
}

/* ================= CUSTOMERS ================= */
function CustomersPage({ customers = [] }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    serviceType: "",
    price: ""
  });

  const [editing, setEditing] = useState(null);

  const addCustomer = async () => {
    await addDoc(collection(db, "customers"), form);
    setForm({ firstName: "", lastName: "", phone: "", serviceType: "", price: "" });
  };

  const deleteCustomer = async (id) => {
    await deleteDoc(doc(db, "customers", id));
  };

  const updateCustomer = async () => {
    await updateDoc(doc(db, "customers", editing.id), editing);
    setEditing(null);
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>Customers</Typography>

      {/* FORM */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
          <TextField label="First Name" value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />

          <TextField label="Last Name" value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />

          <TextField label="Phone" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <TextField label="Service" value={form.serviceType}
            onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
          />

          <TextField label="Price" value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <Button variant="contained" onClick={addCustomer}>
            Add
          </Button>
        </Box>
      </Card>

      {/* TABLE */}
      <Card sx={{ p: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.firstName} {c.lastName}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.serviceType}</TableCell>
                <TableCell>R {c.price}</TableCell>

                <TableCell>
                  <Button size="small" onClick={() => setEditing(c)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => deleteCustomer(c.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* EDIT */}
      {editing && (
        <Card sx={{ p: 3, mt: 3 }}>
          <Typography mb={2}>Edit Customer</Typography>

          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
            <TextField value={editing.firstName}
              onChange={(e) => setEditing({ ...editing, firstName: e.target.value })}
            />

            <TextField value={editing.lastName}
              onChange={(e) => setEditing({ ...editing, lastName: e.target.value })}
            />

            <TextField value={editing.phone}
              onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
            />

            <TextField value={editing.serviceType}
              onChange={(e) => setEditing({ ...editing, serviceType: e.target.value })}
            />

            <TextField value={editing.price}
              onChange={(e) => setEditing({ ...editing, price: e.target.value })}
            />

            <Button variant="contained" onClick={updateCustomer}>
              Save
            </Button>
          </Box>
        </Card>
      )}
    </Box>
  );
}

/* ================= BOOKINGS ================= */
function BookingsPage({ bookings = [], customers = [] }) {
  const [form, setForm] = useState({
    customerId: "",
    customerName: "",
    serviceType: "",
    price: "",
    dateFrom: "",
    dateTo: ""
  });

  const [editing, setEditing] = useState(null);

  const calcDays = (from, to) =>
    (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24) + 1;

  const addBooking = async () => {
    const days = calcDays(form.dateFrom, form.dateTo);
    const totalPrice = Number(form.price || 0) * days;

    await addDoc(collection(db, "bookings"), { ...form, days, totalPrice });

    setForm({
      customerId: "",
      customerName: "",
      serviceType: "",
      price: "",
      dateFrom: "",
      dateTo: ""
    });
  };

  const deleteBooking = async (id) => {
    await deleteDoc(doc(db, "bookings", id));
  };

  const updateBooking = async () => {
    const days = calcDays(editing.dateFrom, editing.dateTo);
    const totalPrice = Number(editing.price) * days;

    await updateDoc(doc(db, "bookings", editing.id), {
      ...editing,
      days,
      totalPrice
    });

    setEditing(null);
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>Bookings</Typography>

      {/* FORM */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
          <TextField
            select
            label="Customer"
            value={form.customerId}
            onChange={(e) => {
              const selected = customers.find(c => c.id === e.target.value);

              setForm({
                ...form,
                customerId: e.target.value,
                customerName: selected ? `${selected.firstName} ${selected.lastName}` : "",
                serviceType: selected?.serviceType || "",
                price: selected?.price || ""
              });
            }}
          >
            {customers.map(c => (
              <MenuItem key={c.id} value={c.id}>
                {c.firstName} {c.lastName}
              </MenuItem>
            ))}
          </TextField>

          <TextField type="date" value={form.dateFrom}
            onChange={(e) => setForm({ ...form, dateFrom: e.target.value })}
          />

          <TextField type="date" value={form.dateTo}
            onChange={(e) => setForm({ ...form, dateTo: e.target.value })}
          />

          <Button variant="contained" onClick={addBooking}>
            Add Booking
          </Button>
        </Box>
      </Card>

      {/* TABLE */}
      <Card sx={{ p: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {bookings.map(b => (
              <TableRow key={b.id}>
                <TableCell>{b.customerName}</TableCell>
                <TableCell>{b.serviceType}</TableCell>
                <TableCell>{b.days}</TableCell>
                <TableCell>R {b.totalPrice}</TableCell>

                <TableCell>
                  <Button size="small" onClick={() => setEditing(b)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => deleteBooking(b.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* EDIT */}
      {editing && (
        <Card sx={{ p: 3, mt: 3 }}>
          <Typography mb={2}>Edit Booking</Typography>

          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
            <TextField value={editing.dateFrom}
              onChange={(e) => setEditing({ ...editing, dateFrom: e.target.value })}
            />

            <TextField value={editing.dateTo}
              onChange={(e) => setEditing({ ...editing, dateTo: e.target.value })}
            />

            <TextField value={editing.price}
              onChange={(e) => setEditing({ ...editing, price: e.target.value })}
            />

            <Button variant="contained" onClick={updateBooking}>
              Save
            </Button>
          </Box>
        </Card>
      )}
    </Box>
  );
}

/* ================= LAYOUT ================= */
function Layout({ children, handleLogout }) {
  const navigate = useNavigate();

  return (
    <Box display="flex">
      <Box width={220} bgcolor="#111" color="#fff" minHeight="100vh">
        <Button fullWidth onClick={() => navigate("/")}>Dashboard</Button>
        <Button fullWidth onClick={() => navigate("/customers")}>Customers</Button>
        <Button fullWidth onClick={() => navigate("/bookings")}>Bookings</Button>
        <Button fullWidth onClick={handleLogout}>Logout</Button>
      </Box>

      <Box flex={1} p={3}>{children}</Box>
    </Box>
  );
}

/* ================= APP ================= */
function AppContent() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (!user) return;

    onSnapshot(collection(db, "customers"), snap =>
      setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );

    onSnapshot(collection(db, "bookings"), snap =>
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }, [user]);

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, form.email, form.password);
  };

  const handleLogout = async () => signOut(auth);

  return (
    <BrowserRouter>
      {!user ? (
        <LoginPage form={form} setForm={setForm} handleLogin={handleLogin} />
      ) : (
        <Layout handleLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard bookings={bookings} />} />
            <Route path="/customers" element={<CustomersPage customers={customers} />} />
            <Route path="/bookings" element={<BookingsPage bookings={bookings} customers={customers} />} />
          </Routes>
        </Layout>
      )}
    </BrowserRouter>
  );
}

export default AppContent;