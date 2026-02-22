import React from 'react';

function ItemsModal({ items, onClose }) {
  return (
    <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Design No.</th>
                  <th>Qty</th>
                  <th>Cut</th>
                  <th>MTR</th>
                  <th>Unit</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {!items || items.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No items</td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.Desc || '-'}</td>
                      <td>{item.DesignNo || '-'}</td>
                      <td>{item.Qty || 0}</td>
                      <td>{item.Cut || 0}</td>
                      <td>{item.MTR || 0}</td>
                      <td>{item.Unit || '-'}</td>
                      <td>{item.Rate || 0}</td>
                      <td>{item.Amount || 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ItemsModal;