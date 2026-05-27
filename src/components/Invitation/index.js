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

// const SendInvitationDashboard = () => {
//   const [campaignData, setCampaignData] = useState({
//     campaignName: "",
//     senderName: "",
//     campaignType: "EVENT_INVITATION",
//     scheduleType: "INSTANT",
//     message: "",
//   });

//   const recipientList = [
//     {
//       id: 1,
//       name: "Rahul Sharma",
//       phone: "+91 9876543210",
//       status: "DELIVERED",
//       openRate: "92%",
//     },
//     {
//       id: 2,
//       name: "Priya Das",
//       phone: "+91 9123456789",
//       status: "PENDING",
//       openRate: "--",
//     },
//     {
//       id: 3,
//       name: "Amit Roy",
//       phone: "+91 9988776655",
//       status: "SENT",
//       openRate: "80%",
//     },
//   ];

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setCampaignData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const totalRecipients = recipientList.length;

//   const deliveredCount = useMemo(
//     () =>
//       recipientList.filter(
//         (item) =>
//           item.status === "DELIVERED" || item.status === "SENT"
//       ).length,
//     [recipientList]
//   );

//   const pendingCount = useMemo(
//     () =>
//       recipientList.filter((item) => item.status === "PENDING").length,
//     [recipientList]
//   );

//   const deliveryPercentage = Math.round(
//     (deliveredCount / totalRecipients) * 100
//   );

//   return (
//     <div className="campaign-dashboard">
//       {/* ANIMATED BACKGROUND */}
//       <div className="animated-bg"></div>

//       {/* HEADER WITH WAVE */}
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
//                   <span className="hero-glow">✨</span>
//                 </h1>

//                 <p className="hero-subtitle mb-0">
//                   Create, schedule, and track professional WhatsApp invitation
//                   campaigns with real-time delivery analytics and smart insights.
//                 </p>

//                 <div className="hero-features mt-3">
//                   <span><FaRocket /> High Delivery Rate</span>
//                   <span><FaShieldAlt /> End-to-End Encrypted</span>
//                   <span><FaRegSmile /> 24/7 Support</span>
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

//             {/* WAVE DIVIDER */}
//             <div className="hero-wave">
//               <svg viewBox="0 0 1440 120" fill="none">
//                 <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="#f4f7fb"/>
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container-fluid px-4 pb-5">
//         {/* STATS CARDS */}
//         <CRow className="g-4 mb-5 stats-row">
//           <CCol lg={3} md={6}>
//             <CCard className="stats-card border-0">
//               <CCardBody>
//                 <div className="stats-card-inner">
//                   <div className="stats-info">
//                     <p className="stats-label">Total Recipients</p>
//                     <h3 className="stats-value">{totalRecipients}</h3>
//                     <span className="stats-trend">
//                       <FaUserFriends /> +12% this month
//                     </span>
//                   </div>
//                   <div className="stats-icon primary-icon">
//                     <FaUsers />
//                   </div>
//                 </div>
//               </CCardBody>
//             </CCard>
//           </CCol>

//           <CCol lg={3} md={6}>
//             <CCard className="stats-card border-0">
//               <CCardBody>
//                 <div className="stats-card-inner">
//                   <div className="stats-info">
//                     <p className="stats-label">Delivered</p>
//                     <h3 className="stats-value text-success">{deliveredCount}</h3>
//                     <span className="stats-trend text-success">
//                       <FaCheckCircle /> Successfully sent
//                     </span>
//                   </div>
//                   <div className="stats-icon success-icon">
//                     <FaCheckCircle />
//                   </div>
//                 </div>
//               </CCardBody>
//             </CCard>
//           </CCol>

//           <CCol lg={3} md={6}>
//             <CCard className="stats-card border-0">
//               <CCardBody>
//                 <div className="stats-card-inner">
//                   <div className="stats-info">
//                     <p className="stats-label">Pending</p>
//                     <h3 className="stats-value text-warning">{pendingCount}</h3>
//                     <span className="stats-trend text-warning">
//                       <FaClock /> Awaiting delivery
//                     </span>
//                   </div>
//                   <div className="stats-icon warning-icon">
//                     <FaClock />
//                   </div>
//                 </div>
//               </CCardBody>
//             </CCard>
//           </CCol>

//           <CCol lg={3} md={6}>
//             <CCard className="stats-card border-0">
//               <CCardBody>
//                 <div className="stats-card-inner">
//                   <div className="stats-info">
//                     <p className="stats-label">Delivery Rate</p>
//                     <h3 className="stats-value text-info">{deliveryPercentage}%</h3>
//                     <span className="stats-trend">
//                       <FaChartLine /> Excellent performance
//                     </span>
//                   </div>
//                   <div className="stats-icon info-icon">
//                     <FaChartLine />
//                   </div>
//                 </div>
//               </CCardBody>
//             </CCard>
//           </CCol>
//         </CRow>

//         {/* MAIN CONTENT */}
//         <CRow className="g-4">
//           {/* LEFT SECTION - CAMPAIGN FORM */}
//           <CCol lg={8}>
//             <CCard className="border-0 form-card">
//               <CCardHeader className="form-card-header">
//                 <div className="header-decoration"></div>
//                 <div className="d-flex align-items-center">
//                   <div className="section-icon">
//                     <FaWhatsapp />
//                   </div>
//                   <div>
//                     <h5 className="mb-1 fw-bold">Campaign Configuration</h5>
//                     <p className="mb-0 text-muted small">
//                       Configure WhatsApp invitation details and recipient setup
//                     </p>
//                   </div>
//                 </div>
//               </CCardHeader>

//               <CCardBody className="p-4">
//                 <CRow className="g-4">
//                   <CCol md={6}>
//                     <label className="form-label custom-label">
//                       Campaign Name <span className="text-danger">*</span>
//                     </label>
//                     <CFormInput
//                       className="custom-input"
//                       placeholder="e.g., Annual Business Meetup 2026"
//                       name="campaignName"
//                       value={campaignData.campaignName}
//                       onChange={handleChange}
//                     />
//                   </CCol>

//                   <CCol md={6}>
//                     <label className="form-label custom-label">
//                       Sender Name <span className="text-danger">*</span>
//                     </label>
//                     <CFormInput
//                       className="custom-input"
//                       placeholder="e.g., WhatsApp Campaign Team"
//                       name="senderName"
//                       value={campaignData.senderName}
//                       onChange={handleChange}
//                     />
//                   </CCol>

//                   <CCol md={6}>
//                     <label className="form-label custom-label">
//                       Campaign Type
//                     </label>
//                     <CFormSelect
//                       className="custom-input"
//                       name="campaignType"
//                       value={campaignData.campaignType}
//                       onChange={handleChange}
//                     >
//                       <option value="EVENT_INVITATION">🎉 Event Invitation</option>
//                       <option value="WEDDING_INVITATION">💍 Wedding Invitation</option>
//                       <option value="MARKETING">📢 Marketing Campaign</option>
//                     </CFormSelect>
//                   </CCol>

//                   <CCol md={6}>
//                     <label className="form-label custom-label">
//                       Delivery Mode
//                     </label>
//                     <CFormSelect
//                       className="custom-input"
//                       name="scheduleType"
//                       value={campaignData.scheduleType}
//                       onChange={handleChange}
//                     >
//                       <option value="INSTANT">⚡ Instant Delivery</option>
//                       <option value="SCHEDULED">📅 Scheduled Delivery</option>
//                     </CFormSelect>
//                   </CCol>

//                   <CCol md={12}>
//                     <label className="form-label custom-label">
//                       Invitation Message
//                     </label>
//                     <CFormTextarea
//                       rows={7}
//                       className="custom-input message-textarea"
//                       placeholder="Hello {{name}}, we are delighted to invite you to our exclusive event... Use {{name}}, {{phone}}, {{event_date}} as dynamic placeholders"
//                       name="message"
//                       value={campaignData.message}
//                       onChange={handleChange}
//                     />
//                     <div className="message-hint mt-2">
//                       <FaEnvelope className="me-1" /> 
//                       Available variables: {"{{name}}"}, {"{{phone}}"}, {"{{event_date}}"}, {"{{location}}"}
//                     </div>
//                   </CCol>

//                   <CCol md={12}>
//                     <label className="form-label custom-label">
//                       Upload Contact List
//                     </label>
//                     <div className="upload-box">
//                       <div className="upload-icon-wrapper">
//                         <FaUpload className="upload-icon" />
//                       </div>
//                       <h6 className="fw-semibold mt-3">Drag & Drop CSV File</h6>
//                       <p className="text-muted small mb-3">
//                         Upload recipient contacts in CSV format. Maximum 10,000 contacts
//                       </p>
//                       <CButton className="upload-btn">
//                         Browse Files
//                       </CButton>
//                       <p className="text-muted small mt-2 mb-0">
//                         Supported formats: .csv, .xlsx
//                       </p>
//                     </div>
//                   </CCol>

//                   <CCol md={12}>
//                     <div className="form-actions">
//                       <CButton className="cancel-btn">Cancel</CButton>
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

//           {/* RIGHT SECTION - ANALYTICS & RECIPIENTS */}
//           <CCol lg={4}>
//             <CCard className="border-0 analytics-card mb-4">
//               <CCardBody className="p-4">
//                 <div className="analytics-header">
//                   <div className="analytics-icon">
//                     <FaBolt />
//                   </div>
//                   <div>
//                     <h5 className="fw-bold mb-1">Campaign Analytics</h5>
//                     <p className="text-muted small mb-0">Real-time delivery insights</p>
//                   </div>
//                 </div>

//                 <div className="analytics-progress mb-4">
//                   <div className="d-flex justify-content-between mb-2">
//                     <span className="small fw-semibold">Delivery Progress</span>
//                     <span className="small fw-bold">{deliveryPercentage}%</span>
//                   </div>
//                   <CProgress value={deliveryPercentage} color="success" height={10} animated />
//                 </div>

//                 <div className="analytics-stats-list">
//                   <div className="analytics-item">
//                     <span><FaUsers className="me-2 text-muted" /> Total Contacts</span>
//                     <strong>{totalRecipients}</strong>
//                   </div>
//                   <div className="analytics-item">
//                     <span><FaCheckCircle className="me-2 text-success" /> Delivered</span>
//                     <strong className="text-success">{deliveredCount}</strong>
//                   </div>
//                   <div className="analytics-item">
//                     <span><FaClock className="me-2 text-warning" /> Pending</span>
//                     <strong className="text-warning">{pendingCount}</strong>
//                   </div>
//                   <div className="analytics-item">
//                     <span><FaStar className="me-2 text-info" /> Open Rate</span>
//                     <strong className="text-info">89%</strong>
//                   </div>
//                   <div className="analytics-item border-0">
//                     <span><FaTrophy className="me-2 text-warning" /> Engagement Score</span>
//                     <strong className="text-warning">A+</strong>
//                   </div>
//                 </div>
//               </CCardBody>
//             </CCard>

//             <CCard className="border-0 recipients-card">
//               <CCardHeader className="recipients-card-header">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <h5 className="fw-bold mb-0">Recipient Activity</h5>
//                     <p className="text-muted small mb-0 mt-1">Live tracking updates</p>
//                   </div>
//                   <CBadge className="live-badge">● Live</CBadge>
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
//                   <CTable hover responsive align="middle" className="recipients-table">
//                     <CTableHead>
//                       <CTableRow>
//                         <CTableHeaderCell>Contact Information</CTableHeaderCell>
//                         <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
//                       </CTableRow>
//                     </CTableHead>

//                     <CTableBody>
//                       {recipientList.map((item) => (
//                         <CTableRow key={item.id}>
//                           <CTableDataCell>
//                             <div className="contact-info">
//                               <div className="contact-avatar">
//                                 <FaUserFriends />
//                               </div>
//                               <div>
//                                 <div className="fw-semibold contact-name">{item.name}</div>
//                                 <div className="small text-muted contact-phone">
//                                   <FaMobileAlt className="me-1" size={10} />
//                                   {item.phone}
//                                 </div>
//                               </div>
//                             </div>
//                           </CTableDataCell>

//                           <CTableDataCell className="text-center">
//                             <CBadge
//                               className={`status-badge status-${item.status.toLowerCase()}`}
//                               color={
//                                 item.status === "DELIVERED"
//                                   ? "success"
//                                   : item.status === "SENT"
//                                   ? "primary"
//                                   : "warning"
//                               }
//                             >
//                               {item.status === "DELIVERED" && <FaCheckCircle className="me-1" />}
//                               {item.status === "SENT" && <FaPaperPlane className="me-1" />}
//                               {item.status === "PENDING" && <FaClock className="me-1" />}
//                               {item.status}
//                             </CBadge>
//                           </CTableDataCell>
//                         </CTableRow>
//                       ))}
//                     </CTableBody>
//                   </CTable>
//                 </div>

//                 <div className="recipients-footer p-3 text-center border-top">
//                   <span className="small text-muted">
//                     Showing {recipientList.length} of {recipientList.length} recipients
//                   </span>
//                 </div>
//               </CCardBody>
//             </CCard>
//           </CCol>
//         </CRow>
//       </div>

//       {/* CUSTOM STYLES */}
      
//     </div>
//   );
// };

// export default SendInvitationDashboard;


import React, { useMemo, useState } from "react";
import "./sendInvitation.css";

import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";

import {
  FaWhatsapp,
  FaPaperPlane,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaUpload,
  FaChartLine,
  FaCalendarAlt,
  FaUserFriends,
  FaBolt,
  FaEnvelope,
  FaMobileAlt,
  FaRocket,
  FaShieldAlt,
  FaRegSmile,
  FaStar,
  FaTrophy,
} from "react-icons/fa";

/* =========================
   DYNAMIC CONFIGS
========================= */

const FORM_FIELDS = [
  {
    label: "Campaign Name",
    name: "campaignName",
    type: "text",
    placeholder: "e.g., Annual Business Meetup 2026",
    required: true,
    col: 6,
  },
  {
    label: "Sender Name",
    name: "senderName",
    type: "text",
    placeholder: "e.g., WhatsApp Campaign Team",
    required: true,
    col: 6,
  },
  {
    label: "Campaign Type",
    name: "campaignType",
    type: "select",
    col: 6,
    options: [
      {
        label: "🎉 Event Invitation",
        value: "EVENT_INVITATION",
      },
      {
        label: "💍 Wedding Invitation",
        value: "WEDDING_INVITATION",
      },
      {
        label: "📢 Marketing Campaign",
        value: "MARKETING",
      },
    ],
  },
  {
    label: "Delivery Mode",
    name: "scheduleType",
    type: "select",
    col: 6,
    options: [
      {
        label: "⚡ Instant Delivery",
        value: "INSTANT",
      },
      {
        label: "📅 Scheduled Delivery",
        value: "SCHEDULED",
      },
    ],
  },
  {
    label: "Invitation Message",
    name: "message",
    type: "textarea",
    rows: 7,
    col: 12,
    placeholder:
      "Hello {{name}}, we are delighted to invite you...",
  },
];

const HERO_FEATURES = [
  {
    icon: FaRocket,
    label: "High Delivery Rate",
  },
  {
    icon: FaShieldAlt,
    label: "End-to-End Encrypted",
  },
  {
    icon: FaRegSmile,
    label: "24/7 Support",
  },
];

const RECIPIENT_LIST = [
  {
    id: 1,
    name: "Rahul Sharma",
    phone: "+91 9876543210",
    status: "DELIVERED",
    openRate: "92%",
  },
  {
    id: 2,
    name: "Priya Das",
    phone: "+91 9123456789",
    status: "PENDING",
    openRate: "--",
  },
  {
    id: 3,
    name: "Amit Roy",
    phone: "+91 9988776655",
    status: "SENT",
    openRate: "80%",
  },
];

const STATUS_CONFIG = {
  DELIVERED: {
    color: "success",
    icon: FaCheckCircle,
  },
  SENT: {
    color: "primary",
    icon: FaPaperPlane,
  },
  PENDING: {
    color: "warning",
    icon: FaClock,
  },
};

const INITIAL_STATE = {
  campaignName: "",
  senderName: "",
  campaignType: "EVENT_INVITATION",
  scheduleType: "INSTANT",
  message: "",
};

const SendInvitationDashboard = () => {
  const [campaignData, setCampaignData] =
    useState(INITIAL_STATE);

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setCampaignData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     CALCULATIONS
  ========================= */

  const totalRecipients = RECIPIENT_LIST.length;

  const deliveredCount = useMemo(
    () =>
      RECIPIENT_LIST.filter(
        (item) =>
          item.status === "DELIVERED" ||
          item.status === "SENT"
      ).length,
    []
  );

  const pendingCount = useMemo(
    () =>
      RECIPIENT_LIST.filter(
        (item) => item.status === "PENDING"
      ).length,
    []
  );

  const deliveryPercentage = Math.round(
    (deliveredCount / totalRecipients) * 100
  );

  /* =========================
     DYNAMIC STATS
  ========================= */

  const STATS_LIST = [
    {
      label: "Total Recipients",
      value: totalRecipients,
      trend: "+12% this month",
      trendIcon: FaUserFriends,
      icon: FaUsers,
      iconClass: "primary-icon",
      valueClass: "",
    },
    {
      label: "Delivered",
      value: deliveredCount,
      trend: "Successfully sent",
      trendIcon: FaCheckCircle,
      icon: FaCheckCircle,
      iconClass: "success-icon",
      valueClass: "text-success",
      trendClass: "text-success",
    },
    {
      label: "Pending",
      value: pendingCount,
      trend: "Awaiting delivery",
      trendIcon: FaClock,
      icon: FaClock,
      iconClass: "warning-icon",
      valueClass: "text-warning",
      trendClass: "text-warning",
    },
    {
      label: "Delivery Rate",
      value: `${deliveryPercentage}%`,
      trend: "Excellent performance",
      trendIcon: FaChartLine,
      icon: FaChartLine,
      iconClass: "info-icon",
      valueClass: "text-info",
    },
  ];

  const ANALYTICS_LIST = [
    {
      label: "Total Contacts",
      value: totalRecipients,
      icon: FaUsers,
      valueClass: "",
      iconClass: "text-muted",
    },
    {
      label: "Delivered",
      value: deliveredCount,
      icon: FaCheckCircle,
      valueClass: "text-success",
      iconClass: "text-success",
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: FaClock,
      valueClass: "text-warning",
      iconClass: "text-warning",
    },
    {
      label: "Open Rate",
      value: "89%",
      icon: FaStar,
      valueClass: "text-info",
      iconClass: "text-info",
    },
    {
      label: "Engagement Score",
      value: "A+",
      icon: FaTrophy,
      valueClass: "text-warning",
      iconClass: "text-warning",
    },
  ];

  return (
    <div className="campaign-dashboard">
      {/* BACKGROUND */}
      <div className="animated-bg"></div>

      {/* HERO */}
      <div className="dashboard-header-wrapper">
        <div className="container-fluid px-4 py-4">
          <div className="dashboard-hero shadow-xl">
            <div className="hero-badge">
              <FaWhatsapp className="me-2" />
              WhatsApp Business API
            </div>

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
              <div>
                <h1 className="hero-title mb-3">
                  WhatsApp Invitation Campaign
                  <span className="hero-glow">
                    ✨
                  </span>
                </h1>

                <p className="hero-subtitle mb-0">
                  Create, schedule, and track
                  professional WhatsApp invitation
                  campaigns with real-time delivery
                  analytics and smart insights.
                </p>

                <div className="hero-features mt-3">
                  {HERO_FEATURES.map(
                    (feature) => {
                      const Icon =
                        feature.icon;

                      return (
                        <span
                          key={feature.label}
                        >
                          <Icon />

                          {feature.label}
                        </span>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="hero-actions">
                <CButton className="hero-btn-outline">
                  <FaCalendarAlt className="me-2" />
                  Schedule Campaign
                </CButton>

                <CButton className="hero-btn">
                  <FaPaperPlane className="me-2" />
                  Launch Campaign
                </CButton>
              </div>
            </div>

            {/* WAVE */}
            <div className="hero-wave">
              <svg
                viewBox="0 0 1440 120"
                fill="none"
              >
                <path
                  d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                  fill="#f4f7fb"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 pb-5">
        {/* STATS */}
        <CRow className="g-4 mb-5 stats-row">
          {STATS_LIST.map((item) => {
            const Icon = item.icon;
            const TrendIcon =
              item.trendIcon;

            return (
              <CCol
                lg={3}
                md={6}
                key={item.label}
              >
                <CCard className="stats-card border-0">
                  <CCardBody>
                    <div className="stats-card-inner">
                      <div className="stats-info">
                        <p className="stats-label">
                          {item.label}
                        </p>

                        <h3
                          className={`stats-value ${item.valueClass}`}
                        >
                          {item.value}
                        </h3>

                        <span
                          className={`stats-trend ${item.trendClass || ""}`}
                        >
                          <TrendIcon />

                          {item.trend}
                        </span>
                      </div>

                      <div
                        className={`stats-icon ${item.iconClass}`}
                      >
                        <Icon />
                      </div>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            );
          })}
        </CRow>

        {/* MAIN */}
        <CRow className="g-4">
          {/* FORM */}
          <CCol lg={8}>
            <CCard className="border-0 form-card">
              <CCardHeader className="form-card-header">
                <div className="header-decoration"></div>

                <div className="d-flex align-items-center">
                  <div className="section-icon">
                    <FaWhatsapp />
                  </div>

                  <div>
                    <h5 className="mb-1 fw-bold">
                      Campaign Configuration
                    </h5>

                    <p className="mb-0 text-muted small">
                      Configure WhatsApp
                      invitation details and
                      recipient setup
                    </p>
                  </div>
                </div>
              </CCardHeader>

              <CCardBody className="p-4">
                <CRow className="g-4">
                  {FORM_FIELDS.map((field) => (
                    <CCol
                      md={field.col}
                      key={field.name}
                    >
                      <label className="form-label custom-label">
                        {field.label}

                        {field.required && (
                          <span className="text-danger">
                            {" "}
                            *
                          </span>
                        )}
                      </label>

                      {field.type ===
                        "text" && (
                        <CFormInput
                          className="custom-input"
                          placeholder={
                            field.placeholder
                          }
                          name={field.name}
                          value={
                            campaignData[
                              field.name
                            ]
                          }
                          onChange={
                            handleChange
                          }
                        />
                      )}

                      {field.type ===
                        "select" && (
                        <CFormSelect
                          className="custom-input"
                          name={field.name}
                          value={
                            campaignData[
                              field.name
                            ]
                          }
                          onChange={
                            handleChange
                          }
                        >
                          {field.options.map(
                            (option) => (
                              <option
                                key={
                                  option.value
                                }
                                value={
                                  option.value
                                }
                              >
                                {
                                  option.label
                                }
                              </option>
                            )
                          )}
                        </CFormSelect>
                      )}

                      {field.type ===
                        "textarea" && (
                        <>
                          <CFormTextarea
                            rows={field.rows}
                            className="custom-input message-textarea"
                            placeholder={
                              field.placeholder
                            }
                            name={field.name}
                            value={
                              campaignData[
                                field.name
                              ]
                            }
                            onChange={
                              handleChange
                            }
                          />

                          <div className="message-hint mt-2">
                            <FaEnvelope className="me-1" />

                            Available variables:
                            {" {{name}}, {{phone}}, {{event_date}}, {{location}}"}
                          </div>
                        </>
                      )}
                    </CCol>
                  ))}

                  {/* UPLOAD */}
                  <CCol md={12}>
                    <label className="form-label custom-label">
                      Upload Contact List
                    </label>

                    <div className="upload-box">
                      <div className="upload-icon-wrapper">
                        <FaUpload className="upload-icon" />
                      </div>

                      <h6 className="fw-semibold mt-3">
                        Drag & Drop CSV File
                      </h6>

                      <p className="text-muted small mb-3">
                        Upload recipient
                        contacts in CSV format.
                        Maximum 10,000 contacts
                      </p>

                      <CButton className="upload-btn">
                        Browse Files
                      </CButton>

                      <p className="text-muted small mt-2 mb-0">
                        Supported formats:
                        .csv, .xlsx
                      </p>
                    </div>
                  </CCol>

                  {/* ACTIONS */}
                  <CCol md={12}>
                    <div className="form-actions">
                      <CButton className="cancel-btn">
                        Cancel
                      </CButton>

                      <CButton className="launch-btn">
                        <FaPaperPlane className="me-2" />
                        Send Invitations
                      </CButton>
                    </div>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>

          {/* ANALYTICS */}
          <CCol lg={4}>
            <CCard className="border-0 analytics-card mb-4">
              <CCardBody className="p-4">
                <div className="analytics-header">
                  <div className="analytics-icon">
                    <FaBolt />
                  </div>

                  <div>
                    <h5 className="fw-bold mb-1">
                      Campaign Analytics
                    </h5>

                    <p className="text-muted small mb-0">
                      Real-time delivery
                      insights
                    </p>
                  </div>
                </div>

                <div className="analytics-progress mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="small fw-semibold">
                      Delivery Progress
                    </span>

                    <span className="small fw-bold">
                      {deliveryPercentage}%
                    </span>
                  </div>

                  <CProgress
                    value={
                      deliveryPercentage
                    }
                    color="success"
                    height={10}
                    animated
                  />
                </div>

                <div className="analytics-stats-list">
                  {ANALYTICS_LIST.map(
                    (item) => {
                      const Icon =
                        item.icon;

                      return (
                        <div
                          className="analytics-item"
                          key={item.label}
                        >
                          <span>
                            <Icon
                              className={`me-2 ${item.iconClass}`}
                            />

                            {item.label}
                          </span>

                          <strong
                            className={
                              item.valueClass
                            }
                          >
                            {item.value}
                          </strong>
                        </div>
                      );
                    }
                  )}
                </div>
              </CCardBody>
            </CCard>

            {/* RECIPIENTS */}
            <CCard className="border-0 recipients-card">
              <CCardHeader className="recipients-card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold mb-0">
                      Recipient Activity
                    </h5>

                    <p className="text-muted small mb-0 mt-1">
                      Live tracking updates
                    </p>
                  </div>

                  <CBadge className="live-badge">
                    ● Live
                  </CBadge>
                </div>
              </CCardHeader>

              <CCardBody className="p-0">
                <div className="search-wrapper p-3 border-bottom">
                  <CInputGroup>
                    <CInputGroupText className="search-icon">
                      <FaSearch />
                    </CInputGroupText>

                    <CFormInput
                      placeholder="Search by name or phone..."
                      className="search-input"
                    />
                  </CInputGroup>
                </div>

                <div className="recipients-table-wrapper">
                  <CTable
                    hover
                    responsive
                    align="middle"
                    className="recipients-table"
                  >
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>
                          Contact Information
                        </CTableHeaderCell>

                        <CTableHeaderCell className="text-center">
                          Status
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>

                    <CTableBody>
                      {RECIPIENT_LIST.map(
                        (item) => {
                          const currentStatus =
                            STATUS_CONFIG[
                              item.status
                            ];

                          const StatusIcon =
                            currentStatus.icon;

                          return (
                            <CTableRow
                              key={item.id}
                            >
                              <CTableDataCell>
                                <div className="contact-info">
                                  <div className="contact-avatar">
                                    <FaUserFriends />
                                  </div>

                                  <div>
                                    <div className="fw-semibold contact-name">
                                      {
                                        item.name
                                      }
                                    </div>

                                    <div className="small text-muted contact-phone">
                                      <FaMobileAlt
                                        className="me-1"
                                        size={
                                          10
                                        }
                                      />

                                      {
                                        item.phone
                                      }
                                    </div>
                                  </div>
                                </div>
                              </CTableDataCell>

                              <CTableDataCell className="text-center">
                                <CBadge
                                  className={`status-badge status-${item.status.toLowerCase()}`}
                                  color={
                                    currentStatus.color
                                  }
                                >
                                  <StatusIcon className="me-1" />

                                  {
                                    item.status
                                  }
                                </CBadge>
                              </CTableDataCell>
                            </CTableRow>
                          );
                        }
                      )}
                    </CTableBody>
                  </CTable>
                </div>

                <div className="recipients-footer p-3 text-center border-top">
                  <span className="small text-muted">
                    Showing{" "}
                    {
                      RECIPIENT_LIST.length
                    }{" "}
                    of{" "}
                    {
                      RECIPIENT_LIST.length
                    }{" "}
                    recipients
                  </span>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </div>
  );
};

export default SendInvitationDashboard;
