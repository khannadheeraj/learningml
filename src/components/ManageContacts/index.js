import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaUserFriends,
  FaTimes,
  FaClipboardList,
  FaCalendarAlt,
  FaUndo,
  FaChevronDown,
} from "react-icons/fa";
import "./manageContacts.css";

const API_BASE_URL = (process.env.REACT_APP_recommendServiceURL).replace(/\/$/, "");
const READ_STATUS_API = `${API_BASE_URL}/users/campaigns/read-status`;
const PAGE_SIZE = 10;

function formatInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDefaultDateRange() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return {
    startDate: formatInputDate(yesterday),
    endDate: formatInputDate(today),
  };
}

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

function getDateEpoch(date, endOfDay = false) {
  if (!date) return undefined;

  const dateTime = endOfDay ? `${date}T23:59:59.999` : `${date}T00:00:00.000`;
  return new Date(dateTime).getTime();
}

function formatDateLabel(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function parseInteractionStatus(contact) {
  const rawStatus =
    contact.isInteractionCompleted ??
    contact.interactionCompleted ??
    contact.isRead ??
    contact.read ??
    contact.readStatus ??
    contact.status ??
    false;

  if (typeof rawStatus === "string") {
    return ["completed", "complete", "read", "true", "yes"].includes(rawStatus.toLowerCase());
  }

  return Boolean(rawStatus);
}

function normalizeContactsResponse(data) {
  const contacts = Array.isArray(data)
    ? data
    : data?.users || data?.contacts || data?.campaigns || data?.readStatuses || data?.data || data?.results || [];

  return contacts.map((contact, index) => {
    const user = contact.user || contact.contact || {};
    const username =
      contact.username ||
      contact.name ||
      contact.fullName ||
      user.username ||
      user.name ||
      user.fullName ||
      "";
    const phoneNumber =
      contact.phoneNumber ||
      contact.phone ||
      contact.mobile ||
      user.phoneNumber ||
      user.phone ||
      user.mobile ||
      "";
    return {
      ...contact,
      id: contact.id || contact._id || user.id || user._id || phoneNumber || `contact-${index}`,
      username,
      phoneNumber,
      notes: contact.notes || contact.description || "",
      isInteractionCompleted: parseInteractionStatus(contact),
    };
  });
}

export default function ContactsListPage() {
  const defaultDateRange = useMemo(() => getDefaultDateRange(), []);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(defaultDateRange.startDate);
  const [endDate, setEndDate] = useState(defaultDateRange.endDate);
  const [draftStartDate, setDraftStartDate] = useState(defaultDateRange.startDate);
  const [draftEndDate, setDraftEndDate] = useState(defaultDateRange.endDate);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [serverTotalPages, setServerTotalPages] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(null);
  const [hasPrevPage, setHasPrevPage] = useState(null);
  const [message, setMessage] = useState("");
  const [activeContact, setActiveContact] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.get(READ_STATUS_API, {
        params: {
          page,
          pageSize: PAGE_SIZE,
          startDate: getDateEpoch(startDate),
          endDate: getDateEpoch(endDate, true),
        },
      });
      const fetchedContacts = normalizeContactsResponse(response.data);
      const pagination = response.data?.pagination || response.data?.meta || {};
      const totalFromResponse =
        response.data?.total ||
        response.data?.count ||
        response.data?.totalCount ||
        pagination?.totalRecords ||
        pagination?.total ||
        fetchedContacts.length;
      const totalPagesFromResponse =
        response.data?.totalPages || pagination?.totalPages || null;

      setContacts(fetchedContacts);
      setTotalCount(Number(totalFromResponse) || fetchedContacts.length);
      setServerTotalPages(totalPagesFromResponse ? Number(totalPagesFromResponse) : null);
      setHasNextPage(
        typeof pagination?.hasNextPage === "boolean"
          ? pagination.hasNextPage
          : typeof pagination?.hasNext === "boolean"
            ? pagination.hasNext
            : response.data?.hasNextPage ?? null
      );
      setHasPrevPage(
        typeof pagination?.hasPrevPage === "boolean"
          ? pagination.hasPrevPage
          : typeof pagination?.hasPrevious === "boolean"
            ? pagination.hasPrevious
            : response.data?.hasPrevPage ?? null
      );
    } catch {
      setContacts([]);
      setTotalCount(0);
      setServerTotalPages(null);
      setHasNextPage(null);
      setHasPrevPage(null);
      setMessage("Could not load contact read status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [page, startDate, endDate]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

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
      await axios.post(`${API_BASE_URL}/users/${id}/notes`, {
        notes: noteText.trim(),
      });

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

  const totalPages = serverTotalPages || Math.max(1, Math.ceil((totalCount || contacts.length) / PAGE_SIZE));

  function goToPage(nextPage) {
    setPage(Math.min(totalPages, Math.max(1, nextPage)));
  }

  function resetDateRange() {
    setStartDate(defaultDateRange.startDate);
    setEndDate(defaultDateRange.endDate);
    setDraftStartDate(defaultDateRange.startDate);
    setDraftEndDate(defaultDateRange.endDate);
    setPage(1);
    setIsDatePickerOpen(false);
  }

  function openDatePicker() {
    setDraftStartDate(startDate);
    setDraftEndDate(endDate);
    setIsDatePickerOpen((current) => !current);
  }

  function applyDateRange() {
    setStartDate(draftStartDate);
    setEndDate(draftEndDate);
    setPage(1);
    setIsDatePickerOpen(false);
  }

  return (
    <main className="contacts-page">
      <section className="contacts-card">
        <header className="contacts-header">
          <div>
            <p className="eyebrow">Contacts</p>
            <h2>All contacts</h2>
            <p className="subtitle">View your contacts and track interaction notes.</p>
          </div>

          <div className="contacts-toolbar">
            <label className="search-box" htmlFor="contacts-search">
              <FaSearch className="search-icon" />
              <input
                id="contacts-search"
                type="search"
                placeholder="Search by name or number"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <div className="date-filter">
              <button
                type="button"
                className={`date-trigger ${isDatePickerOpen ? "is-open" : ""}`}
                aria-label="Open date range filter"
                aria-expanded={isDatePickerOpen}
                onClick={openDatePicker}
              >
                <span className="date-trigger-icon">
                  <FaCalendarAlt />
                </span>
                <span className="date-trigger-copy">
                  <span>Date range</span>
                  <strong>
                    {formatDateLabel(startDate)} - {formatDateLabel(endDate)}
                  </strong>
                </span>
                <FaChevronDown className="date-trigger-chevron" />
              </button>

              {isDatePickerOpen && (
                <div className="date-popover">
                  <div className="date-popover-header">
                    <span>Filter by date</span>
                    <button
                      type="button"
                      className="date-icon-button"
                      aria-label="Close date range filter"
                      onClick={() => setIsDatePickerOpen(false)}
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="date-range-fields">
                    <label className="date-field">
                      <span>Start date</span>
                      <input
                        type="date"
                        value={draftStartDate}
                        max={draftEndDate}
                        onChange={(event) => setDraftStartDate(event.target.value)}
                      />
                    </label>
                    <label className="date-field">
                      <span>End date</span>
                      <input
                        type="date"
                        value={draftEndDate}
                        min={draftStartDate}
                        onChange={(event) => setDraftEndDate(event.target.value)}
                      />
                    </label>
                  </div>

                  <div className="date-popover-actions">
                    <button
                      type="button"
                      className="date-secondary-button"
                      onClick={resetDateRange}
                    >
                      <FaUndo />
                      Reset
                    </button>
                    <button
                      type="button"
                      className="date-apply-button"
                      onClick={applyDateRange}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {message && !isLoading && (
          <div className="info-banner is-error">
            {message}
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
                    <span>Try a different search or date range.</span>
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
              Showing {filteredContacts.length} of {totalCount || contacts.length} contacts
            </span>
            <div className="pagination-controls">
              <button
                type="button"
                className="pagination-btn"
                disabled={typeof hasPrevPage === "boolean" ? !hasPrevPage : page === 1}
                onClick={() => goToPage(page - 1)}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                type="button"
                className="pagination-btn"
                disabled={typeof hasNextPage === "boolean" ? !hasNextPage : page === totalPages}
                onClick={() => goToPage(page + 1)}
              >
                Next
              </button>
            </div>
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
