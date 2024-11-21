import React, { useState, useEffect } from "react";
import { Modal } from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "./App.css";

type ApiData = Record<string, any>;

const App: React.FC = () => {
  const [apiName, setApiName] = useState<string>("");
  const [data, setData] = useState<ApiData[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ApiData | null>(null);

  const apiOptions = [
    { label: "API 1", value: "https://jsonplaceholder.typicode.com/posts" },
    { label: "API 2", value: "https://jsonplaceholder.typicode.com/users" },
  ];

  useEffect(() => {
    if (apiName) {
      fetchData(apiName);
    }
  }, [apiName]);

  const fetchData = async (apiUrl: string) => {
    try {
      const response = await fetch(apiUrl);
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleApiChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setApiName(event.target.value);
  };

  const handleRowClick = (event: any) => {
    setSelectedRecord(event.data);
    const modalElement = document.getElementById("recordModal");
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  };


  const columnDefs = data.length
    ? Object.keys(data[0]).map((key) => ({
        headerName: key.toUpperCase(),
        field: key,
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: (params: any) =>
          typeof params.value === "object"
            ? JSON.stringify(params.value)
            : params.value,
      }))
    : [];

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">API Data Viewer</h2>

      <div className="mb-4">
        <label htmlFor="apiSelect" className="form-label fw-bold text-secondary">
          Select an API:
        </label>
        <select
          id="apiSelect"
          className="form-select border-primary shadow-sm"
          value={apiName}
          onChange={handleApiChange}
        >
          <option value="">-- Choose API --</option>
          {apiOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {data.length > 0 && (
        <div
          className="ag-theme-alpine"
          style={{ height: 400, width: "100%" }}
        >
          <AgGridReact
            rowData={data}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={5}
            onRowClicked={handleRowClick}
          />
        </div>
      )}

      {/* Modal */}
      <div
        className="modal fade"
        id="recordModal"
        tabIndex={-1}
        aria-labelledby="recordModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="recordModalLabel">
                Record Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedRecord &&
                Object.entries(selectedRecord).map(([fieldKey, fieldValue]) => (
                  <div key={fieldKey} className="text-secondary">
                    <strong className="text-dark">{fieldKey}: </strong>
                    {typeof fieldValue === "object"
                      ? JSON.stringify(fieldValue)
                      : String(fieldValue)}
                  </div>
                ))}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
