import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSearch, FaUserFriends, FaTimes, FaClipboardList } from "react-icons/fa";
import "./manageContacts.css";

const RECOMMEND_SERVICE_URL = process.env.REACT_APP_recommendServiceURL;

const MOCK_CONTACTS = [
  { id: "1", username: "Aarav Sharma", phoneNumber: "+91 98765 43210", isInteractionCompleted: false, notes: "" },
  { id: "2", username: "Priya Nair", phoneNumber: "+91 91234 56789", isInteractionCompleted: true, notes: "Interested in premium plan." },
  { id: "3", username: "Rohan Mehta", phoneNumber: "+91 99887 76655", isInteractionCompleted: false, notes: "" },
  { id: "4", username: "Sneha Kapoor", phoneNumber: "+91 90011 22334", isInteractionCompleted: false, notes: "" },
  { id: "5", username: "Vikram Singh", phoneNumber: "+91 98123 45678", isInteractionCompleted: true, notes: "Follow up next week." },
  { id: "6", username: "Ananya Iyer", phoneNumber: "+91 97654 32109", isInteractionCompleted: false, notes: "" },
];

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

const AVATAR_COLORS = ["#4F7CFF", "#FF8A65", "#34C38F", "#A78BFA", "#F472B6", "#22B8CF"];

function getAvatarColor(name = "") {
  const sum = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

export default function ContactsListPage() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeContact, setActiveContact] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    setIsLoading(true);

    try {
      const response = await axios.get(`${RECOMMEND_SERVICE_URL}/users`);
      const users = response.data?.users || response.data || [];

      if (users.length) {
        setContacts(users);
        setUsingMockData(false);
      } else {
        setContacts(MOCK_CONTACTS);
        setUsingMockData(true);
      }
    } catch {
      setContacts(MOCK_CONTACTS);
      setUsingMockData(true);
    } finally {
      setIsLoading(false);
    }
  }

  function openNotesModal(contact) {
    setActiveContact(contact);
    setNoteText(contact.notes || "");
  }

  function closeNotesModal() {
    if (isSaving) return;
    setActiveContact(null);
    setNoteText("");
  }

  async function handleSaveNotes(event) {
    event.preventDefault();

    if (!noteText.trim()) {
      toast.info("Please enter a note before saving.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSaving(true);
    const id = activeContact.id || activeContact._id || activeContact.phoneNumber;

    try {
      if (!usingMockData) {
        await axios.post(`${RECOMMEND_SERVICE_URL}/users/${id}/notes`, {
          notes: noteText.trim(),
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setContacts((current) =>
        current.map((item) =>
          (item.id || item._id || item.phoneNumber) === id
            ? { ...item, notes: noteText.trim(), isInteractionCompleted: true }
            : item
        )
      );

      toast.success(
        `Notes saved for ${activeContact.username || activeContact.phoneNumber}`,
        {
          position: "top-right",
          autoClose: 4000,
        }
      );

      closeNotesModal();
    } catch {
      toast.error("Could not save notes. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  }

  const filteredContacts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return contacts;

    return contacts.filter(
      (contact) =>
        contact.username?.toLowerCase().includes(term) ||
        contact.phoneNumber?.toLowerCase().includes(term)
    );
  }, [contacts, searchTerm]);

  return (
    <main className="contacts-page">
      <section className="contacts-card">
        <header className="contacts-header">
          <div>
            <p className="eyebrow">Contacts</p>
            <h2>All contacts</h2>
            <p className="subtitle">View your contacts and track interaction notes.</p>
          </div>

          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or number"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </header>

        {usingMockData && !isLoading && (
          <div className="info-banner">
            Showing sample data — connect the contacts API to see live data.
          </div>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Number</th>
                <th>Interaction Status</th>
                <th className="action-col">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="skeleton-row">
                    <td>
                      <div className="skeleton-cell skeleton-avatar-line" />
                    </td>
                    <td>
                      <div className="skeleton-cell" />
                    </td>
                    <td>
                      <div className="skeleton-cell skeleton-pill" />
                    </td>
                    <td className="action-col">
                      <div className="skeleton-cell skeleton-button" />
                    </td>
                  </tr>
                ))}

              {!isLoading && filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-state">
                    <FaUserFriends className="empty-icon" />
                    <p>No contacts found.</p>
                    <span>Try a different search or upload a contact list.</span>
                  </td>
                </tr>
              )}

              {!isLoading &&
                filteredContacts.map((contact) => {
                  const id = contact.id || contact._id || contact.phoneNumber;

                  return (
                    <tr key={id}>
                      <td>
                        <div className="contact-name-cell">
                          <span
                            className="avatar"
                            style={{ backgroundColor: getAvatarColor(contact.username) }}
                          >
                            {getInitials(contact.username)}
                          </span>
                          <span className="contact-name">
                            {contact.username || "-"}
                          </span>
                        </div>
                      </td>

                      <td className="contact-number">
                        {contact.phoneNumber || "-"}
                      </td>

                      <td>
                        {contact.isInteractionCompleted ? (
                          <span className="status-badge is-completed">Completed</span>
                        ) : (
                          <span className="status-badge is-pending">Pending</span>
                        )}
                      </td>

                      <td className="action-col">
                        <button
                          type="button"
                          className="invite-button"
                          onClick={() => openNotesModal(contact)}
                        >
                          <FaClipboardList className="invite-icon" />
                          {contact.isInteractionCompleted ? "View Notes" : "Add Notes"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredContacts.length > 0 && (
          <footer className="contacts-footer">
            <span>
              Showing {filteredContacts.length} of {contacts.length} contacts
            </span>
          </footer>
        )}
      </section>

      {activeContact && (
        <div className="modal-backdrop" role="presentation" onClick={closeNotesModal}>
          <section
            className="send-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notes-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="send-modal-header">
              <div>
                <p className="eyebrow">Interaction notes</p>
                <h3 id="notes-modal-title">{activeContact.username || "Contact"}</h3>
                <span className="send-modal-number">{activeContact.phoneNumber}</span>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close popup"
                onClick={closeNotesModal}
                disabled={isSaving}
              >
                <FaTimes />
              </button>
            </header>

            <form className="send-modal-form" onSubmit={handleSaveNotes}>
              <label htmlFor="contact-notes">Notes</label>
              <textarea
                id="contact-notes"
                rows={4}
                placeholder="Add details about your conversation with this contact..."
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                autoFocus
              />

              <div className="send-modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeNotesModal}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button type="submit" className="invite-button" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}