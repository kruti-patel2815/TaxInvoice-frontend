import React, { useState, useEffect } from 'react';
import InvoiceTable from './InvoiceTable';
import InvoiceModal from './InvoiceModal';
import ItemsModal from './ItemsModal';

const API_URL = 'http://localhost:5000/api';

function Home() {
  const [invoices, setInvoices] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const res = await fetch(`${API_URL}/invoice`);
      const data = await res.json();
      setInvoices(data);
    } catch (error) {
      console.error('Error loading invoices:', error);
    }
  };

  const handleAdd = () => {
    setCurrentInvoice(null);
    setShowInvoiceModal(true);
  };

  const handleEdit = (invoice) => {
    setCurrentInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this invoice?')) {
      try {
        await fetch(`${API_URL}/invoice/delete/${id}`, {
          method: 'DELETE'
        });
        loadInvoices();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleViewItems = (invoice) => {
    setSelectedItems(invoice.items || []);
    setShowItemsModal(true);
  };

  const handleModalClose = () => {
    setShowInvoiceModal(false);
    loadInvoices();
  };

  const handleItemsModalClose = () => {
    setShowItemsModal(false);
  };

  return (
    <div className="container p-4">
      <button
        className="btn btn-primary mb-3"
        onClick={handleAdd}
      >
        Open Invoice
      </button>

      <InvoiceTable
        invoices={invoices}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewItems={handleViewItems}
      />

      {showInvoiceModal && (
        <InvoiceModal
          invoice={currentInvoice}
          onClose={handleModalClose}
        />
      )}

      {showItemsModal && (
        <ItemsModal
          items={selectedItems}
          onClose={handleItemsModalClose}
        />
      )}
    </div>
  );
}

export default Home;