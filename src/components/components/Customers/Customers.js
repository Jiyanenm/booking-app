import React from "react";

export default function Customers({
  customers,
  customerForm,
  setCustomerForm,
  saveCustomer,
  deleteCustomer
}) {
  return (
    <div style={{ background: "white", padding: 20 }}>
      <h2>Customers</h2>

      <input
        placeholder="First Name"
        value={customerForm.firstName}
        onChange={(e) =>
          setCustomerForm({ ...customerForm, firstName: e.target.value })
        }
      />

      <input
        placeholder="Phone"
        value={customerForm.phone}
        onChange={(e) =>
          setCustomerForm({ ...customerForm, phone: e.target.value })
        }
      />

      <button onClick={saveCustomer}>Add Customer</button>

      {customers.map((c) => (
        <div key={c.id}>
          {c.firstName} - {c.phone}
          <button onClick={() => deleteCustomer(c.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}