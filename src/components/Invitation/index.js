import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import './invitation.css';
import { usersData } from "./mockData";

const USERS_API =
  import.meta.env.VITE_INVITATION_USERS_API ||
  import.meta.env.VITE_UPLOAD_CONTACTS_API ||
  "/api/upload-contacts";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const currentPageUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return users.slice(start, start + PAGE_SIZE);
  }, [page, users]);

  const selectedUsers = useMemo(
    () => users.filter((user) => selectedUserIds.includes(user.id)),
    [selectedUserIds, users]
  );

  const allUsersSelected =
    users.length > 0 && users.every((user) => selectedUserIds.includes(user.id));

  useEffect(() => {
    async function fetchInvitationData() {
      try {
        setIsLoading(true);
        setMessage("");

        const [usersResponse, campaignsResponse] = await Promise.allSettled([
          axios.get(USERS_API),
          axios.get(CAMPAIGNS_API),
        ]);

        setUsers(normalizeUsersResponse(usersData));

        if (usersResponse.status === "fulfilled") {
          // setUsers(normalizeUsersResponse(usersResponse.value.data));
          
        } else {
          setMessage("Could not load uploaded users.");
        }

        if (campaignsResponse.status === "fulfilled") {
          setCampaigns(normalizeCampaignsResponse(campaignsResponse.value.data));
        }
      } catch {
        setMessage("Could not load invitation data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchInvitationData();
  }, []);

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
    <main className="">
     
     <section className="dashboard-card">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Invitation</p>
            <h1>Send invitation</h1>
            <p>Select uploaded users and send campaign invitations.</p>
          </div>
          <a className="secondary-link" href="upload-contacts">
            Upload contacts
          </a>
        </header>

        <div className="toolbar-row">
          <label className="field-group">
            <span>Campaign Name</span>
            <select
              value={selectedCampaign}
              // options={campaigns.map((campaign) => ({
              //   label: campaign.name,
              //   value: campaign.id,
              // }))}
              onChange={(event) => setSelectedCampaign(event.target.value)}
            >
              <option value="">Select campaign</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="primary-button"
            disabled={isSending || !selectedCampaign || !selectedUsers.length}
            onClick={handleSendInvitation}
          >
            {isSending ? "Sending..." : "Send Invitation"}
          </button>
        </div>

        {message && <p className="status-message">{message}</p>}

        <div className="data-table-wrap">
          <table>
            <thead>
              <tr>
                <th className="checkbox-cell">
                  <input
                    type="checkbox"
                    checked={allUsersSelected}
                    onChange={(event) => toggleSelectAllUsers(event.target.checked)}
                  />
                </th>
                <th>Username</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="empty-cell">
                    Loading users...
                  </td>
                </tr>
              ) : currentPageUsers.length ? (
                currentPageUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={selectedUserIds.includes(user.id) ? "is-selected" : ""}
                  >
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={(event) => toggleUser(user.id, event.target.checked)}
                      />
                    </td>
                    <td>{user.username || "-"}</td>
                    <td>{user.phoneNumber || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="empty-cell">
                    No uploaded users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="pagination-row">
          <span>
            {selectedUsers.length} selected from {users.length} users
          </span>
          <div className="pagination-actions">
            <button type="button" disabled={page === 1} onClick={() => goToPage(page - 1)}>
              Previous
            </button>
            <strong>
              Page {page} of {totalPages}
            </strong>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => goToPage(page + 1)}
            >
              Next
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}
