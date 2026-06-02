





// import React, { useMemo, useState } from "react";
// import "./sendInvitation.css";

// import {
//   CBadge,
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CFormInput,
//   CFormSelect,
//   CFormTextarea,
//   CInputGroup,
//   CInputGroupText,
//   CProgress,
//   CRow,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
// } from "@coreui/react";

// import {
//   FaWhatsapp,
//   FaPaperPlane,
//   FaUsers,
//   FaCheckCircle,
//   FaClock,
//   FaSearch,
//   FaUpload,
//   FaChartLine,
//   FaCalendarAlt,
//   FaUserFriends,
//   FaBolt,
//   FaEnvelope,
//   FaMobileAlt,
//   FaRocket,
//   FaShieldAlt,
//   FaRegSmile,
//   FaStar,
//   FaTrophy,
// } from "react-icons/fa";

// /* =========================
//    DYNAMIC CONFIGS
// ========================= */

// const FORM_FIELDS = [
//   {
//     label: "Campaign Name",
//     name: "campaignName",
//     type: "text",
//     placeholder: "e.g., Annual Business Meetup 2026",
//     required: true,
//     col: 6,
//   },
//   {
//     label: "Sender Name",
//     name: "senderName",
//     type: "text",
//     placeholder: "e.g., WhatsApp Campaign Team",
//     required: true,
//     col: 6,
//   },
//   {
//     label: "Campaign Type",
//     name: "campaignType",
//     type: "select",
//     col: 6,
//     options: [
//       {
//         label: "🎉 Event Invitation",
//         value: "EVENT_INVITATION",
//       },
//       {
//         label: "💍 Wedding Invitation",
//         value: "WEDDING_INVITATION",
//       },
//       {
//         label: "📢 Marketing Campaign",
//         value: "MARKETING",
//       },
//     ],
//   },
//   {
//     label: "Delivery Mode",
//     name: "scheduleType",
//     type: "select",
//     col: 6,
//     options: [
//       {
//         label: "⚡ Instant Delivery",
//         value: "INSTANT",
//       },
//       {
//         label: "📅 Scheduled Delivery",
//         value: "SCHEDULED",
//       },
//     ],
//   },
//   {
//     label: "Invitation Message",
//     name: "message",
//     type: "textarea",
//     rows: 7,
//     col: 12,
//     placeholder:
//       "Hello {{name}}, we are delighted to invite you...",
//   },
// ];

// const HERO_FEATURES = [
//   {
//     icon: FaRocket,
//     label: "High Delivery Rate",
//   },
//   {
//     icon: FaShieldAlt,
//     label: "End-to-End Encrypted",
//   },
//   {
//     icon: FaRegSmile,
//     label: "24/7 Support",
//   },
// ];

// const RECIPIENT_LIST = [
//   {
//     id: 1,
//     name: "Rahul Sharma",
//     phone: "+91 9876543210",
//     status: "DELIVERED",
//     openRate: "92%",
//   },
//   {
//     id: 2,
//     name: "Priya Das",
//     phone: "+91 9123456789",
//     status: "PENDING",
//     openRate: "--",
//   },
//   {
//     id: 3,
//     name: "Amit Roy",
//     phone: "+91 9988776655",
//     status: "SENT",
//     openRate: "80%",
//   },
// ];

// const STATUS_CONFIG = {
//   DELIVERED: {
//     color: "success",
//     icon: FaCheckCircle,
//   },
//   SENT: {
//     color: "primary",
//     icon: FaPaperPlane,
//   },
//   PENDING: {
//     color: "warning",
//     icon: FaClock,
//   },
// };

// const INITIAL_STATE = {
//   campaignName: "",
//   senderName: "",
//   campaignType: "EVENT_INVITATION",
//   scheduleType: "INSTANT",
//   message: "",
// };

// const SendInvitationDashboard = () => {
//   const [campaignData, setCampaignData] =
//     useState(INITIAL_STATE);

//   const handleChange = ({ target }) => {
//     const { name, value } = target;

//     setCampaignData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   /* =========================
//      CALCULATIONS
//   ========================= */

//   const totalRecipients = RECIPIENT_LIST.length;

//   const deliveredCount = useMemo(
//     () =>
//       RECIPIENT_LIST.filter(
//         (item) =>
//           item.status === "DELIVERED" ||
//           item.status === "SENT"
//       ).length,
//     []
//   );

//   const pendingCount = useMemo(
//     () =>
//       RECIPIENT_LIST.filter(
//         (item) => item.status === "PENDING"
//       ).length,
//     []
//   );

//   const deliveryPercentage = Math.round(
//     (deliveredCount / totalRecipients) * 100
//   );

//   /* =========================
//      DYNAMIC STATS
//   ========================= */

//   const STATS_LIST = [
//     {
//       label: "Total Recipients",
//       value: totalRecipients,
//       trend: "+12% this month",
//       trendIcon: FaUserFriends,
//       icon: FaUsers,
//       iconClass: "primary-icon",
//       valueClass: "",
//     },
//     {
//       label: "Delivered",
//       value: deliveredCount,
//       trend: "Successfully sent",
//       trendIcon: FaCheckCircle,
//       icon: FaCheckCircle,
//       iconClass: "success-icon",
//       valueClass: "text-success",
//       trendClass: "text-success",
//     },
//     {
//       label: "Pending",
//       value: pendingCount,
//       trend: "Awaiting delivery",
//       trendIcon: FaClock,
//       icon: FaClock,
//       iconClass: "warning-icon",
//       valueClass: "text-warning",
//       trendClass: "text-warning",
//     },
//     {
//       label: "Delivery Rate",
//       value: `${deliveryPercentage}%`,
//       trend: "Excellent performance",
//       trendIcon: FaChartLine,
//       icon: FaChartLine,
//       iconClass: "info-icon",
//       valueClass: "text-info",
//     },
//   ];

//   const ANALYTICS_LIST = [
//     {
//       label: "Total Contacts",
//       value: totalRecipients,
//       icon: FaUsers,
//       valueClass: "",
//       iconClass: "text-muted",
//     },
//     {
//       label: "Delivered",
//       value: deliveredCount,
//       icon: FaCheckCircle,
//       valueClass: "text-success",
//       iconClass: "text-success",
//     },
//     {
//       label: "Pending",
//       value: pendingCount,
//       icon: FaClock,
//       valueClass: "text-warning",
//       iconClass: "text-warning",
//     },
//     {
//       label: "Open Rate",
//       value: "89%",
//       icon: FaStar,
//       valueClass: "text-info",
//       iconClass: "text-info",
//     },
//     {
//       label: "Engagement Score",
//       value: "A+",
//       icon: FaTrophy,
//       valueClass: "text-warning",
//       iconClass: "text-warning",
//     },
//   ];

//   return (
//     <div className="campaign-dashboard">
//       {/* BACKGROUND */}
//       <div className="animated-bg"></div>

//       {/* HERO */}
//       <div className="dashboard-header-wrapper">
//         <div className="container-fluid px-4 py-4">
//           <div className="dashboard-hero shadow-xl">
//             <div className="hero-badge">
//               <FaWhatsapp className="me-2" />
//               WhatsApp Business API
//             </div>

//             <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
//               <div>
//                 <h1 className="hero-title mb-3">
//                   WhatsApp Invitation Campaign
//                   <span className="hero-glow">
//                     ✨
//                   </span>
//                 </h1>

//                 <p className="hero-subtitle mb-0">
//                   Create, schedule, and track
//                   professional WhatsApp invitation
//                   campaigns with real-time delivery
//                   analytics and smart insights.
//                 </p>

//                 <div className="hero-features mt-3">
//                   {HERO_FEATURES.map(
//                     (feature) => {
//                       const Icon =
//                         feature.icon;

//                       return (
//                         <span
//                           key={feature.label}
//                         >
//                           <Icon />

//                           {feature.label}
//                         </span>
//                       );
//                     }
//                   )}
//                 </div>
//               </div>

//               <div className="hero-actions">
//                 <CButton className="hero-btn-outline">
//                   <FaCalendarAlt className="me-2" />
//                   Schedule Campaign
//                 </CButton>

//                 <CButton className="hero-btn">
//                   <FaPaperPlane className="me-2" />
//                   Launch Campaign
//                 </CButton>
//               </div>
//             </div>

//             {/* WAVE */}
//             <div className="hero-wave">
//               <svg
//                 viewBox="0 0 1440 120"
//                 fill="none"
//               >
//                 <path
//                   d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
//                   fill="#f4f7fb"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container-fluid px-4 pb-5">
//         {/* STATS */}
//         <CRow className="g-4 mb-5 stats-row">
//           {STATS_LIST.map((item) => {
//             const Icon = item.icon;
//             const TrendIcon =
//               item.trendIcon;

//             return (
//               <CCol
//                 lg={3}
//                 md={6}
//                 key={item.label}
//               >
//                 <CCard className="stats-card border-0">
//                   <CCardBody>
//                     <div className="stats-card-inner">
//                       <div className="stats-info">
//                         <p className="stats-label">
//                           {item.label}
//                         </p>

//                         <h3
//                           className={`stats-value ${item.valueClass}`}
//                         >
//                           {item.value}
//                         </h3>

//                         <span
//                           className={`stats-trend ${item.trendClass || ""}`}
//                         >
//                           <TrendIcon />

//                           {item.trend}
//                         </span>
//                       </div>

//                       <div
//                         className={`stats-icon ${item.iconClass}`}
//                       >
//                         <Icon />
//                       </div>
//                     </div>
//                   </CCardBody>
//                 </CCard>
//               </CCol>
//             );
//           })}
//         </CRow>

//         {/* MAIN */}
//         <CRow className="g-4">
//           {/* FORM */}
//           <CCol lg={8}>
//             <CCard className="border-0 form-card">
//               <CCardHeader className="form-card-header">
//                 <div className="header-decoration"></div>

//                 <div className="d-flex align-items-center">
//                   <div className="section-icon">
//                     <FaWhatsapp />
//                   </div>

//                   <div>
//                     <h5 className="mb-1 fw-bold">
//                       Campaign Configuration
//                     </h5>

//                     <p className="mb-0 text-muted small">
//                       Configure WhatsApp
//                       invitation details and
//                       recipient setup
//                     </p>
//                   </div>
//                 </div>
//               </CCardHeader>

//               <CCardBody className="p-4">
//                 <CRow className="g-4">
//                   {FORM_FIELDS.map((field) => (
//                     <CCol
//                       md={field.col}
//                       key={field.name}
//                     >
//                       <label className="form-label custom-label">
//                         {field.label}

//                         {field.required && (
//                           <span className="text-danger">
//                             {" "}
//                             *
//                           </span>
//                         )}
//                       </label>

//                       {field.type ===
//                         "text" && (
//                         <CFormInput
//                           className="custom-input"
//                           placeholder={
//                             field.placeholder
//                           }
//                           name={field.name}
//                           value={
//                             campaignData[
//                               field.name
//                             ]
//                           }
//                           onChange={
//                             handleChange
//                           }
//                         />
//                       )}

//                       {field.type ===
//                         "select" && (
//                         <CFormSelect
//                           className="custom-input"
//                           name={field.name}
//                           value={
//                             campaignData[
//                               field.name
//                             ]
//                           }
//                           onChange={
//                             handleChange
//                           }
//                         >
//                           {field.options.map(
//                             (option) => (
//                               <option
//                                 key={
//                                   option.value
//                                 }
//                                 value={
//                                   option.value
//                                 }
//                               >
//                                 {
//                                   option.label
//                                 }
//                               </option>
//                             )
//                           )}
//                         </CFormSelect>
//                       )}

//                       {field.type ===
//                         "textarea" && (
//                         <>
//                           <CFormTextarea
//                             rows={field.rows}
//                             className="custom-input message-textarea"
//                             placeholder={
//                               field.placeholder
//                             }
//                             name={field.name}
//                             value={
//                               campaignData[
//                                 field.name
//                               ]
//                             }
//                             onChange={
//                               handleChange
//                             }
//                           />

//                           <div className="message-hint mt-2">
//                             <FaEnvelope className="me-1" />

//                             Available variables:
//                             {" {{name}}, {{phone}}, {{event_date}}, {{location}}"}
//                           </div>
//                         </>
//                       )}
//                     </CCol>
//                   ))}

//                   {/* UPLOAD */}
//                   <CCol md={12}>
//                     <label className="form-label custom-label">
//                       Upload Contact List
//                     </label>

//                     <div className="upload-box">
//                       <div className="upload-icon-wrapper">
//                         <FaUpload className="upload-icon" />
//                       </div>

//                       <h6 className="fw-semibold mt-3">
//                         Drag & Drop CSV File
//                       </h6>

//                       <p className="text-muted small mb-3">
//                         Upload recipient
//                         contacts in CSV format.
//                         Maximum 10,000 contacts
//                       </p>

//                       <CButton className="upload-btn">
//                         Browse Files
//                       </CButton>

//                       <p className="text-muted small mt-2 mb-0">
//                         Supported formats:
//                         .csv, .xlsx
//                       </p>
//                     </div>
//                   </CCol>

//                   {/* ACTIONS */}
//                   <CCol md={12}>
//                     <div className="form-actions">
//                       <CButton className="cancel-btn">
//                         Cancel
//                       </CButton>

//                       <CButton className="launch-btn">
//                         <FaPaperPlane className="me-2" />
//                         Send Invitations
//                       </CButton>
//                     </div>
//                   </CCol>
//                 </CRow>
//               </CCardBody>
//             </CCard>
//           </CCol>

//           {/* ANALYTICS */}
//           <CCol lg={4}>
//             <CCard className="border-0 analytics-card mb-4">
//               <CCardBody className="p-4">
//                 <div className="analytics-header">
//                   <div className="analytics-icon">
//                     <FaBolt />
//                   </div>

//                   <div>
//                     <h5 className="fw-bold mb-1">
//                       Campaign Analytics
//                     </h5>

//                     <p className="text-muted small mb-0">
//                       Real-time delivery
//                       insights
//                     </p>
//                   </div>
//                 </div>

//                 <div className="analytics-progress mb-4">
//                   <div className="d-flex justify-content-between mb-2">
//                     <span className="small fw-semibold">
//                       Delivery Progress
//                     </span>

//                     <span className="small fw-bold">
//                       {deliveryPercentage}%
//                     </span>
//                   </div>

//                   <CProgress
//                     value={
//                       deliveryPercentage
//                     }
//                     color="success"
//                     height={10}
//                     animated
//                   />
//                 </div>

//                 <div className="analytics-stats-list">
//                   {ANALYTICS_LIST.map(
//                     (item) => {
//                       const Icon =
//                         item.icon;

//                       return (
//                         <div
//                           className="analytics-item"
//                           key={item.label}
//                         >
//                           <span>
//                             <Icon
//                               className={`me-2 ${item.iconClass}`}
//                             />

//                             {item.label}
//                           </span>

//                           <strong
//                             className={
//                               item.valueClass
//                             }
//                           >
//                             {item.value}
//                           </strong>
//                         </div>
//                       );
//                     }
//                   )}
//                 </div>
//               </CCardBody>
//             </CCard>

//             {/* RECIPIENTS */}
//             <CCard className="border-0 recipients-card">
//               <CCardHeader className="recipients-card-header">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <h5 className="fw-bold mb-0">
//                       Recipient Activity
//                     </h5>

//                     <p className="text-muted small mb-0 mt-1">
//                       Live tracking updates
//                     </p>
//                   </div>

//                   <CBadge className="live-badge">
//                     ● Live
//                   </CBadge>
//                 </div>
//               </CCardHeader>

//               <CCardBody className="p-0">
//                 <div className="search-wrapper p-3 border-bottom">
//                   <CInputGroup>
//                     <CInputGroupText className="search-icon">
//                       <FaSearch />
//                     </CInputGroupText>

//                     <CFormInput
//                       placeholder="Search by name or phone..."
//                       className="search-input"
//                     />
//                   </CInputGroup>
//                 </div>

//                 <div className="recipients-table-wrapper">
//                   <CTable
//                     hover
//                     responsive
//                     align="middle"
//                     className="recipients-table"
//                   >
//                     <CTableHead>
//                       <CTableRow>
//                         <CTableHeaderCell>
//                           Contact Information
//                         </CTableHeaderCell>

//                         <CTableHeaderCell className="text-center">
//                           Status
//                         </CTableHeaderCell>
//                       </CTableRow>
//                     </CTableHead>

//                     <CTableBody>
//                       {RECIPIENT_LIST.map(
//                         (item) => {
//                           const currentStatus =
//                             STATUS_CONFIG[
//                               item.status
//                             ];

//                           const StatusIcon =
//                             currentStatus.icon;

//                           return (
//                             <CTableRow
//                               key={item.id}
//                             >
//                               <CTableDataCell>
//                                 <div className="contact-info">
//                                   <div className="contact-avatar">
//                                     <FaUserFriends />
//                                   </div>

//                                   <div>
//                                     <div className="fw-semibold contact-name">
//                                       {
//                                         item.name
//                                       }
//                                     </div>

//                                     <div className="small text-muted contact-phone">
//                                       <FaMobileAlt
//                                         className="me-1"
//                                         size={
//                                           10
//                                         }
//                                       />

//                                       {
//                                         item.phone
//                                       }
//                                     </div>
//                                   </div>
//                                 </div>
//                               </CTableDataCell>

//                               <CTableDataCell className="text-center">
//                                 <CBadge
//                                   className={`status-badge status-${item.status.toLowerCase()}`}
//                                   color={
//                                     currentStatus.color
//                                   }
//                                 >
//                                   <StatusIcon className="me-1" />

//                                   {
//                                     item.status
//                                   }
//                                 </CBadge>
//                               </CTableDataCell>
//                             </CTableRow>
//                           );
//                         }
//                       )}
//                     </CTableBody>
//                   </CTable>
//                 </div>

//                 <div className="recipients-footer p-3 text-center border-top">
//                   <span className="small text-muted">
//                     Showing{" "}
//                     {
//                       RECIPIENT_LIST.length
//                     }{" "}
//                     of{" "}
//                     {
//                       RECIPIENT_LIST.length
//                     }{" "}
//                     recipients
//                   </span>
//                 </div>
//               </CCardBody>
//             </CCard>
//           </CCol>
//         </CRow>
//       </div>
//     </div>
//   );
// };

// export default SendInvitationDashboard;





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
    <main className="dashboard-shell">
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
