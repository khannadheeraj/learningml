import { useRef, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./uploadContacts.css";

const USERNAME_KEYS = ["username", "user", "name", "fullname", "contactname"];
const PHONE_KEYS = [
  "phonenumber",
  "phone",
  "mobile",
  "mobilenumber",
  "contactnumber",
  "number",
];
const UPLOAD_CONTACTS_API = process.env.REACT_APP_recommendServiceURL;

function normalizeKey(key) {
  return String(key).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findCell(row, acceptedKeys) {
  const matchedKey = Object.keys(row).find((key) =>
    acceptedKeys.includes(normalizeKey(key))
  );

  return matchedKey ? String(row[matchedKey] ?? "").trim() : "";
}

function formatRows(sheetRows) {
  return sheetRows
    .map((row, index) => ({
      id: `contact-${index}`,
      username: findCell(row, USERNAME_KEYS),
      phoneNumber: findCell(row, PHONE_KEYS),
    }))
    .filter((row) => row.username || row.phoneNumber);
}

export default function UploadContacts() {
  const fileInputRef = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [uploadUsers, setUploadUsers] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const selectedCount = selectedIds.length;
  const allSelected = contacts.length > 0 && selectedCount === contacts.length;
  const uploadStatus = contacts.length
    ? `${contacts.length} contact${contacts.length === 1 ? "" : "s"} ready`
    : "Waiting for upload";

  async function handleFile(file) {
    setError("");

    if (!file) {
      return;
    }

    if (!/\.(csv|xlsx|xls)$/i.test(file.name)) {
      setContacts([]);
      setSelectedIds([]);
      setUploadUsers([]);
      setFileName("");
      setError("Please upload only CSV, XLSX, or XLS files.");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      const nextContacts = formatRows(rows);

      setContacts(nextContacts);
      setSelectedIds([]);
      setUploadUsers([]);
      setFileName(file.name);

      if (!nextContacts.length) {
        setError(
          "No username or phone number data found. Use columns like Username and Phone Number."
        );
      }
    } catch {
      setContacts([]);
      setSelectedIds([]);
      setUploadUsers([]);
      setFileName("");
      setError("Could not read this file. Please try another CSV/XLSX file.");
    }
  }

  function toggleSelectAll(checked) {
    setSelectedIds(checked ? contacts.map((contact) => contact.id) : []);
    setUploadUsers(checked ? contacts : []);
  }

  function toggleContact(id, checked) {
    setSelectedIds((current) => {
      const nextIds = checked
        ? Array.from(new Set([...current, id]))
        : current.filter((selectedId) => selectedId !== id);

      setUploadUsers(contacts.filter((contact) => nextIds.includes(contact.id)));
      return nextIds;
    });
  }


  const resetModal = () => {
    setIsModalOpen(false);
    setSelectedIds([]);
    setUploadUsers([]);
  }

  function openPicker() {
    fileInputRef.current?.click();
  }

  async function handleUploadUsers() {
    if (!uploadUsers.length) {
      toast.info("Please select at least one contact.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const payload = {
      users: uploadUsers.map(({ username, phoneNumber }) => ({
        username,
        phoneNumber,
      })),
    };

    try {
      setIsUploading(true);

      const response = await axios.post(`${UPLOAD_CONTACTS_API}/users/bulk-upload`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const {
        message,
        alreadyPresent = [],
        invalidUsers = [],
        uploaded = uploadUsers.length,
        total = uploadUsers.length,
      } = response.data || {};

      const summaryParts = [`${uploaded} uploaded successfully`];
      if (!message) {
        if (alreadyPresent.length > 0) {
          summaryParts.push(`${alreadyPresent.length} already present`);
        }
        if (invalidUsers.length > 0) {
          summaryParts.push(`${invalidUsers.length} invalid`);
        }
      }

      const summaryMessage = message || `${summaryParts.join(", ")}.`;

      toast.success(
        <div className="toastify-upload-summary">
          <div className="toastify-upload-header">
            <div className="toastify-upload-note">{summaryMessage}</div>
          </div>

          {alreadyPresent.length > 0 && (
            <div className="toastify-section">
              <div className="toastify-section-title">Already present</div>
              <ul className="toastify-list">
                {alreadyPresent.map((user, index) => (
                  <li key={`${user.username || user.phoneNumber}-${index}`}>
                    <strong>{user.username || user.phoneNumber}</strong>
                    {user.username && user.phoneNumber ? ` — ${user.phoneNumber}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {invalidUsers.length > 0 && (
            <div className="toastify-section toastify-section-secondary">
              <div className="toastify-section-title">Invalid contacts</div>
              <span className="toastify-upload-text">
                {invalidUsers.length} contact(s) were invalid and skipped.
              </span>
            </div>
          )}
        </div>,
        {
          position: "top-right",
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch {
      toast.error("Could not upload contacts. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="app-shell" >
      <section className="upload-panel">
        <div className="panel-copy">
          <p className="eyebrow">Contacts Import</p>
          <h3>Upload CSV or XLSX contacts</h3>
          <p>
            Drop your file here, then click Show to review usernames and phone
            numbers in a selectable popup table.
          </p>
        </div>

        <div
          className={`drop-zone${isDragging ? " is-dragging" : ""}`}
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              openPicker();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFile(event.dataTransfer.files?.[0]);
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          <div className="upload-visual">
            <span className="upload-icon">+</span>
          </div>
          <div className="drop-copy">
            <strong>Drag and drop file here</strong>
            <small>or click to upload CSV, XLSX, or XLS</small>
          </div>
          {fileName && (
            <div className="file-preview">
              <span className="file-type">File</span>
              <span className="file-name">{fileName}</span>
            </div>
          )}
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="actions">
          <button
            type="button"
            className="primary-button"
            disabled={!contacts.length}
            onClick={() => setIsModalOpen(true)}
          >
            Show
          </button>
          <span className="upload-status">{uploadStatus}</span>
        </div>
      </section>

      {isModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setIsModalOpen(false)}
        >
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contacts-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="modal-header">
              <div className="modal-title-block">
                <p className="eyebrow">Uploaded Data</p>
                <h2 id="contacts-modal-title">Select contacts</h2>
                <span>
                  Choose one or more contacts from the uploaded file.
                </span>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close popup"
                onClick={() => resetModal()}
              >
                x
              </button>
            </header>

            <div className="modal-summary">
              <div>
                <strong>{contacts.length}</strong>
                <span>Total contacts</span>
              </div>
              <div>
                <strong>{selectedCount}</strong>
                <span>Selected</span>
              </div>
              <label className="select-all-control">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(event) => toggleSelectAll(event.target.checked)}
                />
                Select all
              </label>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(event) => toggleSelectAll(event.target.checked)}
                      />
                    </th>
                    <th>Username</th>
                    <th>Phone Number</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className={selectedIds.includes(contact.id) ? "is-selected" : ""}
                    >
                      <td className="checkbox-cell">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(contact.id)}
                          onChange={(event) =>
                            toggleContact(contact.id, event.target.checked)
                          }
                        />
                      </td>
                      <td>{contact.username || "-"}</td>
                      <td>{contact.phoneNumber || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="modal-footer">
              <div className="modal-footer-copy">
                <span>
                  {selectedCount} selected from {contacts.length} uploaded contacts
                </span>
              </div>
              <button
                type="button"
                disabled={!uploadUsers.length || isUploading}
                onClick={handleUploadUsers}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </footer>
          </section>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="toastify-toast"
        bodyClassName="toastify-body"
        progressClassName="toastify-progress"
      />
    </main>
  );
}
