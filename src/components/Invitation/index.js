import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaPaperPlane } from 'react-icons/fa';
import './invitation.css';
import { usersData } from "./mockData";

const USERS_API =
  process.env.REACT_APP_recommendServiceURL +
  "/users/all";
const CAMPAIGNS_API = import.meta.env.VITE_CAMPAIGNS_API || "/api/campaigns";
const SEND_INVITATION_API =
  import.meta.env.VITE_SEND_INVITATION_API || "/api/send-invitation";
const PAGE_SIZE = 10;




function normalizeUsersResponse(data) {
  const users = Array.isArray(data)
    ? data
    : data?.users || data?.data || data?.contacts || [];

  return users.map((user, index) => ({
    id: user.id || user._id || `user-${index}`,
    username: user.username || user.name || user.fullName || "",
    phoneNumber: user.phoneNumber || user.phone || user.mobile || "",
  }));
}

function normalizeCampaignsResponse(data) {
  const campaigns = Array.isArray(data)
    ? data
    : data?.campaigns || data?.data || [];

  return campaigns.map((campaign, index) => {
    if (typeof campaign === "string") {
      return {
        id: campaign,
        name: campaign,
      };
    }

    return {
      id: campaign.id || campaign._id || campaign.value || `campaign-${index}`,
      name:
        campaign.name ||
        campaign.campaignName ||
        campaign.label ||
        campaign.title ||
        "",
    };
  });
}

export default function SendInvitationDashboard() {


  const campaignsData = [
  {
    id: "campaign_1",
    name: "Wedding Invitation Campaign",
  },
  {
    id: "campaign_2",
    name: "RSVP Reminder Campaign",
  },
  {
    id: "campaign_3",
    name: "Photo Sharing Campaign",
  },
  {
    id: "campaign_4",
    name: "Thank You Campaign",
  },
];



  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState(campaignsData);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [serverTotalPages, setServerTotalPages] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(null);
  const [hasPrevPage, setHasPrevPage] = useState(null);

  const totalPages = serverTotalPages || Math.max(1, Math.ceil((totalCount || users.length) / PAGE_SIZE));
  // when using server-side pagination the `users` array contains the current page
  // so render it directly instead of slicing client-side
  const currentPageUsers = useMemo(() => users, [users]);

  const selectedUsers = useMemo(
    () => users.filter((user) => selectedUserIds.includes(user.id)),
    [selectedUserIds, users]
  );

  const allUsersSelected =
    users.length > 0 && users.every((user) => selectedUserIds.includes(user.id));

  useEffect(() => {
    let cancelled = false;

    async function fetchCampaigns() {
      try {
        const campaignsResponse = await axios.get(CAMPAIGNS_API);
        if (!cancelled && campaignsResponse?.status === 200) {
          setCampaigns(normalizeCampaignsResponse(campaignsResponse.data));
        }
      } catch (e) {
        // ignore, keep default campaigns
      }
    }

    fetchCampaigns();
    return () => {
      cancelled = true;
    };
  }, []);

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  // refetch when page or debouncedSearch changes
  useEffect(() => {
    // when page or search changes, trigger the same fetch logic as initial load
    async function refetch() {
      try {
        setIsLoading(true);
        setMessage("");

        const usersResponse = await axios.get(USERS_API, {
          params: {
            page,
            pageSize: PAGE_SIZE,
            ...(debouncedSearch ? { search: debouncedSearch } : {}),
          },
        });

        const fetchedUsers = normalizeUsersResponse(usersResponse.data);
        setUsers(fetchedUsers);

        // extract pagination info if the API returns it under `pagination` or `meta`
        const pagination = usersResponse.data?.pagination || usersResponse.data?.meta || {};

        const totalFromResp =
          usersResponse.data?.total ||
          usersResponse.data?.count ||
          usersResponse.data?.totalCount ||
          pagination?.totalRecords ||
          pagination?.total ||
          fetchedUsers.length;

        const totalPagesFromResp = pagination?.totalPages || usersResponse.data?.totalPages || null;

        setTotalCount(Number(totalFromResp) || fetchedUsers.length);
        setServerTotalPages(totalPagesFromResp ? Number(totalPagesFromResp) : null);
        setHasNextPage(typeof pagination?.hasNextPage === 'boolean' ? pagination.hasNextPage : (usersResponse.data?.hasNextPage ?? null));
        setHasPrevPage(typeof pagination?.hasPrevPage === 'boolean' ? pagination.hasPrevPage : (usersResponse.data?.hasPrevPage ?? null));
      } catch (e) {
        setMessage("Could not load uploaded users.");
      } finally {
        setIsLoading(false);
      }
    }

    refetch();
  }, [page, debouncedSearch]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  function toggleSelectAllUsers(checked) {
    setMessage("");
    setSelectedUserIds(checked ? users.map((user) => user.id) : []);
  }

  function toggleUser(id, checked) {
    setMessage("");
    setSelectedUserIds((current) =>
      checked
        ? Array.from(new Set([...current, id]))
        : current.filter((selectedId) => selectedId !== id)
    );
  }

  async function handleSendInvitation() {
    if (!selectedCampaign) {
      setMessage("Please select a campaign name.");
      return;
    }

    if (!selectedUsers.length) {
      setMessage("Please select at least one user.");
      return;
    }

    const payload = {
      campaignId: selectedCampaign,
      users: selectedUsers.map(({ username, phoneNumber }) => ({
        username,
        phoneNumber,
      })),
    };

    try {
      setIsSending(true);
      setMessage("");

      await axios.post(SEND_INVITATION_API, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setMessage(`Invitation sent to ${selectedUsers.length} user(s).`);
    } catch {
      setMessage("Could not send invitation. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  function goToPage(nextPage) {
    setPage(Math.min(totalPages, Math.max(1, nextPage)));
  }

  return (
    <main className="app-shell">

      <section className="invitation-card">
        {/* Header */}
        <div className="invitation-header">
          <div className="header-content">
            <span className="header-badge">📧 Invitations</span>
            <h1 className="header-title">Send Campaign Invitations</h1>
            <p className="header-description">Select uploaded contacts and send invitations to your campaign participants.</p>
          </div>
          <a className="header-link" href="upload-contacts" title="Upload more contacts">
            <span className="link-icon">+</span>
            Upload Contacts
          </a>
        </div>

        {/* Toolbar */}
        <div className="invitation-toolbar">
          <label className="form-group">
            <span className="form-label">Campaign</span>
            <select
              value={selectedCampaign}
              onChange={(event) => setSelectedCampaign(event.target.value)}
              className="form-select"
            >
              <option value="">Select a campaign...</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-group">
            <span className="form-label">Search users</span>
            <div className="search-wrapper">
              <span className="search-icon">🔎</span>
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by username or phone number"
                className="form-input"
              />
              {search && (
                <button
                  type="button"
                  className="search-clear"
                  aria-label="Clear search"
                  onClick={() => { setSearch(""); setPage(1); }}
                >
                  ×
                </button>
              )}
            </div>
          </label>

          <label className="form-group action-group">
            <span className="form-label" aria-hidden="true">&nbsp;</span>
            <button
              type="button"
              className="btn btn-primary invitation-action"
              disabled={isSending || !selectedCampaign || !selectedUsers.length}
              onClick={handleSendInvitation}
            >
              {isSending ? (
                <>
                  <span className="spinner" />
                  Sending...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Send Invitations
                </>
              )}
            </button>
          </label>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`status-alert ${selectedUsers.length > 0 && message.includes('sent') ? 'success' : 'info'}`}>
            <span className="alert-icon">ℹ️</span>
            <p>{message}</p>
          </div>
        )}

        {/* Data Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="col-checkbox">
                  <input
                    type="checkbox"
                    checked={allUsersSelected}
                    onChange={(event) => toggleSelectAllUsers(event.target.checked)}
                    title={allUsersSelected ? 'Deselect all' : 'Select all'}
                  />
                </th>
                <th className="col-username">Username</th>
                <th className="col-phone">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="table-empty">
                    <span className="loading-text">Loading contacts...</span>
                  </td>
                </tr>
              ) : currentPageUsers.length ? (
                currentPageUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`table-row ${selectedUserIds.includes(user.id) ? 'is-selected' : ''}`}
                  >
                    <td className="col-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={(event) => toggleUser(user.id, event.target.checked)}
                      />
                    </td>
                    <td className="col-username">
                      <span className="user-name">{user.username || '—'}</span>
                    </td>
                    <td className="col-phone">
                      <span className="phone-number">{user.phoneNumber || '—'}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="table-empty">
                    <span className="empty-text">No contacts found. <a href="upload-contacts">Upload some contacts</a></span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="invitation-footer">
          <div className="selection-info">
            <span className="info-text">
              <strong>{selectedUsers.length}</strong> selected from <strong>{users.length}</strong> contacts
            </span>
          </div>
          <div className="pagination-controls">
            <button
              type="button"
              className="pagination-btn"
              disabled={typeof hasPrevPage === 'boolean' ? !hasPrevPage : page === 1}
              onClick={() => goToPage(page - 1)}
              title="Previous page"
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              type="button"
              className="pagination-btn"
              disabled={typeof hasNextPage === 'boolean' ? !hasNextPage : page === totalPages}
              onClick={() => goToPage(page + 1)}
              title="Next page"
            >
              Next →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
