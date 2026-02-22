import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

function InvoiceModal({ invoice, onClose }) {
  const [formData, setFormData] = useState({
    Name: '', Address: '', MobileNo: '', State: '', GSTIN: '',
    InvoiceNo: '', ChalanNo: '', InvoiceDate: '', DueDate: '',
    PaymentTerms: '', EwayBill: '',
    items: [{
      Desc: '', DesignNo: '', HSN: '',
      Qty: 0, Cut: 0, MTR: 0, Unit: 'PCS', Rate: 0, Amount: 0
    }],
    discount: 0, CGST: 0, SGST: 0, IGST: 0,
    totalAmount: 0, taxableValue: 0,
    invoiceTotalBefore: 0, invoiceTotalAfter: 0,
    amountWords: 'Zero Rupees Only'
  });

  useEffect(() => {
    if (invoice) {
      setFormData(invoice);
    }
  }, [invoice]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    const item = newItems[index];
    let amount = 0;
    if (item.Unit === 'PCS') amount = Number(item.Qty || 0) * Number(item.Rate || 0);
    if (item.Unit === 'MTR') amount = Number(item.MTR || 0) * Number(item.Rate || 0);
    if (item.Unit === 'CUT') amount = Number(item.Cut || 0) * Number(item.Rate || 0);
    item.Amount = amount;

    setFormData({ ...formData, items: newItems });

    calculateTotal(newItems);
  };

  function numberToWords(num) {
    var ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    var teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
      "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    var tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty",
      "Sixty", "Seventy", "Eighty", "Ninety"];

    if (num === 0) return "Zero";

    function twoDigit(n) {
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      return tens[Math.floor(n / 10)] + " " + ones[n % 10];
    }

    function threeDigit(n) {
      if (n < 100) return twoDigit(n);
      return ones[Math.floor(n / 100)] + " Hundred " + twoDigit(n % 100);
    }

    var word = "";

    if (num >= 100000) {
      word += threeDigit(Math.floor(num / 100000)) + " Lakh ";
      num = num % 100000;
    }

    if (num >= 1000) {
      word += threeDigit(Math.floor(num / 1000)) + " Thousand ";
      num = num % 1000;
    }

    if (num > 0) {
      word += threeDigit(num);
    }

    return word.trim();
  }

  const calculateTotal = (items) => {
    let total = items.reduce((sum, item) => sum + (item.Amount || 0), 0);


    let discountVal = (total * (formData.discount || 0)) / 100;
    let taxable = total - discountVal;

    let cgst = (taxable * (formData.CGST || 0)) / 100;
    let sgst = (taxable * (formData.SGST || 0)) / 100;
    let igst = (taxable * (formData.IGST || 0)) / 100;

    let finalTotal = taxable + cgst + sgst + igst;
    let roundedTotal = Math.round(finalTotal);
    let words = numberToWords(roundedTotal) + " Rupees Only";

    setFormData(prev => ({
      ...prev,
      totalAmount: total,
      taxableValue: taxable,
      invoiceTotalBefore: finalTotal,
      invoiceTotalAfter: Math.round(finalTotal),
      amountWords: words
    }));
  };

  const handleGSTChange = (type, value) => {
    if (type === 'IGST') {
      setFormData({
        ...formData,
        IGST: value,
        CGST: 0,
        SGST: 0
      });
    } else {
      setFormData({
        ...formData,
        [type]: value,
        IGST: 0
      });
    }

    setTimeout(() => calculateTotal(formData.items), 100);
  };

  const addRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, {
        Desc: '', DesignNo: '', HSN: '',
        Qty: 0, Cut: 0, MTR: 0, Unit: 'PCS', Rate: 0, Amount: 0
      }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    calculateTotal(formData.items);

    try {
      if (invoice) {

        await fetch(`${API_URL}/invoice/update/${invoice._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {

        await fetch(`${API_URL}/invoice/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>

              <div className="text-center mb-3">
                <h6>Default Company Profile</h6>
                <h3>Demo Company</h3>
                <h6>GSTIN: ssdcd</h6>
                <div className="row mt-2">
                  <div className="col">+91-1234567890</div>
                  <div className="col">demo address</div>
                  <div className="col">+91-9876543210</div>
                </div>
              </div>

              <hr />
              <h6 className="text-center"># TAX INVOICE #</h6>
              <hr />

              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td colSpan="5">
                      <strong>Receiver's Details</strong>
                      <input type="text" name="Name" className="form-control mb-2" placeholder="Name"
                        value={formData.Name} onChange={handleChange} />
                      <input type="text" name="Address" className="form-control mb-2" placeholder="Address"
                        value={formData.Address} onChange={handleChange} />
                      <input type="text" name="MobileNo" className="form-control mb-2" placeholder="MobileNo"
                        value={formData.MobileNo} onChange={handleChange} />
                      <input type="text" name="State" className="form-control mb-2" placeholder="State"
                        value={formData.State} onChange={handleChange} />
                      <input type="text" name="GSTIN" className="form-control" placeholder="GSTIN"
                        value={formData.GSTIN} onChange={handleChange} />
                    </td>
                    <td colSpan="5">
                      <strong>Invoice Details</strong>
                      <input type="text" name="InvoiceNo" className="form-control mb-2" placeholder="Invoice No"
                        value={formData.InvoiceNo} onChange={handleChange} />
                      <input type="text" name="ChalanNo" className="form-control mb-2" placeholder="Chalan No"
                        value={formData.ChalanNo} onChange={handleChange} />
                      <input type="text" name="InvoiceDate" className="form-control mb-2" placeholder="Invoice Date"
                        value={formData.InvoiceDate} onChange={handleChange} />
                      <input type="text" name="DueDate" className="form-control mb-2" placeholder="Due Date"
                        value={formData.DueDate} onChange={handleChange} />
                      <input type="text" name="PaymentTerms" className="form-control mb-2" placeholder="Payment Terms"
                        value={formData.PaymentTerms} onChange={handleChange} />
                      <input type="text" name="EwayBill" className="form-control" placeholder="Eway Bill"
                        value={formData.EwayBill} onChange={handleChange} />
                    </td>
                  </tr>

                  <tr className="text-center">
                    <th>Sr</th>
                    <th>Desc.</th>
                    <th>Design No.</th>
                    <th>HSN</th>
                    <th>Qty</th>
                    <th>Cut</th>
                    <th>MTR</th>
                    <th>Unit</th>
                    <th>Rate</th>
                    <th>Amount
                      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={addRow}>+</button>
                    </th>
                  </tr>

                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td><input type="text" className="form-control"
                        value={item.Desc} onChange={(e) => handleItemChange(index, 'Desc', e.target.value)} /></td>
                      <td><input type="text" className="form-control"
                        value={item.DesignNo} onChange={(e) => handleItemChange(index, 'DesignNo', e.target.value)} /></td>
                      <td><input type="text" className="form-control"
                        value={item.HSN} onChange={(e) => handleItemChange(index, 'HSN', e.target.value)} /></td>
                      <td><input type="number" className="form-control"
                        value={item.Qty} onChange={(e) => handleItemChange(index, 'Qty', e.target.value)} /></td>
                      <td><input type="number" className="form-control"
                        value={item.Cut} onChange={(e) => handleItemChange(index, 'Cut', e.target.value)} /></td>
                      <td><input type="number" className="form-control"
                        value={item.MTR} onChange={(e) => handleItemChange(index, 'MTR', e.target.value)} /></td>
                      <td>
                        <select className="form-select"
                          value={item.Unit} onChange={(e) => handleItemChange(index, 'Unit', e.target.value)}>
                          <option value="PCS">PCS</option>
                          <option value="MTR">MTR</option>
                          <option value="CUT">CUT</option>
                        </select>
                      </td>
                      <td><input type="number" className="form-control"
                        value={item.Rate} onChange={(e) => handleItemChange(index, 'Rate', e.target.value)} /></td>
                      <td><input type="number" className="form-control" value={item.Amount} readOnly /></td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan="9" className="text-end"><strong>Total</strong></td>
                    <td><input type="number" className="form-control" value={formData.totalAmount || 0} readOnly /></td>
                  </tr>

                  <tr>
                    <td colSpan="7" className="text-center">Amount (in words)</td>
                    <td colSpan="2">Dis (00 %)</td>
                    <td>
                      <input type="number" className="form-control" name="discount"
                        value={formData.discount} onChange={handleChange} onBlur={() => calculateTotal(formData.items)} />
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="7" className="text-center">
                      {formData.amountWords}
                    </td>
                    <td colSpan="2"><strong>Taxable Value</strong></td>
                    <td><input type="number" className="form-control" value={formData.taxableValue || 0} readOnly /></td>
                  </tr>

                  <tr>
                    <td colSpan="7" rowSpan="6" className="align-top">
                      PAN: sdsdc<br />
                      Bank Name: zc<br />
                      Account No: zxc<br />
                      Branch Name: zsc<br />
                      IFSC: 64
                    </td>
                    <td colSpan="2">CGST (00 %)</td>
                    <td>
                      <input type="number" className="form-control" name="CGST"
                        value={formData.CGST} onChange={(e) => handleGSTChange('CGST', e.target.value)} />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">SGST (00 %)</td>
                    <td>
                      <input type="number" className="form-control" name="SGST"
                        value={formData.SGST} onChange={(e) => handleGSTChange('SGST', e.target.value)} />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">IGST (5 %)</td>
                    <td>
                      <input type="number" className="form-control" name="IGST"
                        value={formData.IGST} onChange={(e) => handleGSTChange('IGST', e.target.value)} />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">Invoice Total</td>
                    <td><input type="number" className="form-control" value={formData.invoiceTotalBefore || 0} readOnly /></td>
                  </tr>
                  <tr>
                    <td colSpan="2">Round Off(+/-)</td>
                    <td>
                      <input type="number" className="form-control"
                        value={((formData.invoiceTotalAfter || 0) - (formData.invoiceTotalBefore || 0)).toFixed(2)} readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2"><strong>Invoice Total</strong></td>
                    <td><input type="number" className="form-control" value={formData.invoiceTotalAfter || 0} readOnly /></td>
                  </tr>

                  <tr style={{ height: '120px' }}>
                    <td colSpan="7" className="text-start">
                      TERM & CONDITION<br />
                      SUBJECT TO SURAT JURISDICTION E.&O.E.<br />
                      Goods once sold will not be taken back or replaced.<br />
                      Any complaint of goods should be made within 7 days.<br />
                      Interest @ 4% per month will be charged on the bill.<br />
                      Receiver's Sign. ___________________
                    </td>
                    <td colSpan="3" className="text-center">
                      For, Demo Company<br /><br /><br />
                      Authorised Sign<br />
                      ___________________
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="text-center">
                <button type="submit" className="btn btn-success px-5">
                  {invoice ? 'Update' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceModal;