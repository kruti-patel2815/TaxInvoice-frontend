import React from 'react';

function InvoiceTable({ invoices, onEdit, onDelete, onViewItems }) {
  if (!invoices || invoices.length === 0) {
    return <p><b>No invoices found.</b></p>;
  }

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>MobileNo</th>
          <th>Total</th>
          <th>Invoice total</th>
          <th>Action</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice) => (
          <tr key={invoice._id}>
            <td>{invoice.Name || ''}</td>
            <td>{invoice.Address || ''}</td>
            <td>{invoice.MobileNo || ''}</td>
            <td>{invoice.totalAmount || 0}</td>
            <td>{invoice.invoiceTotalAfter || 0}</td>
            <td>
              <button 
                className="btn btn-sm btn-info"
                onClick={() => onViewItems(invoice)}
              >
                View Items
              </button>
            </td>
            <td>
              <button 
                className="btn btn-sm btn-warning"
                onClick={() => onEdit(invoice)}
              >
                Edit
              </button>
            </td>
            <td>
              <button 
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(invoice._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default InvoiceTable;