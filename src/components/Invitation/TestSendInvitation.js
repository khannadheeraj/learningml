// import React, { useState } from "react";

// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CFormInput,
//   CFormSelect,
//   CRow,
//   CSpinner,
// } from "@coreui/react";

// import {
//   FaPaperPlane,
//   FaWhatsapp,
//   FaMobileAlt,
//   FaLayerGroup,
// } from "react-icons/fa";

// import "./sendInvitation.css";

// const TEMPLATE_OPTIONS = [
//   {
//     label: "🎉 Event Invitation",
//     value: "event_invitation",
//   },
//   {
//     label: "💍 Wedding Invitation",
//     value: "wedding_invitation",
//   },
//   {
//     label: "📢 Marketing Campaign",
//     value: "marketing_campaign",
//   },
//   {
//     label: "🎂 Birthday Invitation",
//     value: "birthday_invitation",
//   },
// ];

// const INITIAL_STATE = {
//   phoneNumber: "",
//   templateName: "event_invitation",
// };

// const TestSendInvitation = () => {
//   const [formData, setFormData] =
//     useState(INITIAL_STATE);

//   const [isSending, setIsSending] =
//     useState(false);

//   const handleChange = ({ target }) => {
//     const { name, value } = target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSendTestMessage = async () => {
//     try {
//       setIsSending(true);

//       const payload = {
//         phoneNumber: formData.phoneNumber,
//         templateName: formData.templateName,
//       };

//       console.log(
//         "Send Test Invitation Payload:",
//         payload
//       );

//       // ==========================
//       // API CALL
//       // ==========================

//       /*
//       await axios.post(
//         "/api/send-test-invitation",
//         payload
//       );
//       */

//       setTimeout(() => {
//         setIsSending(false);
//       }, 1500);
//     } catch (error) {
//       console.error(error);

//       setIsSending(false);
//     }
//   };

//   return (
//     <div className="test-send-page">
//       <div className="container-fluid">
//         <CRow className="justify-content-center">
//           <CCol xl={5} lg={6} md={8}>
//             <CCard className="test-send-card border-0">
//               <CCardHeader className="test-send-header">
//                 <div className="test-send-icon">
//                   <FaWhatsapp />
//                 </div>

//                 <div>
//                   <h3 className="fw-bold mb-1">
//                     Test Send Invitation
//                   </h3>

//                   <p className="text-muted mb-0 small">
//                     Send WhatsApp template
//                     message to verify campaign
//                     delivery
//                   </p>
//                 </div>
//               </CCardHeader>

//               <CCardBody className="p-4">
//                 <CRow className="g-4">
//                   {/* PHONE NUMBER */}
//                   <CCol md={12}>
//                     <label className="custom-label">
//                       Phone Number
//                     </label>

//                     <div className="input-with-icon">
//                       <FaMobileAlt className="field-icon" />

//                       <CFormInput
//                         type="text"
//                         name="phoneNumber"
//                         value={
//                           formData.phoneNumber
//                         }
//                         onChange={handleChange}
//                         placeholder="Enter WhatsApp number"
//                         className="custom-input custom-input-icon"
//                       />
//                     </div>
//                   </CCol>

//                   {/* TEMPLATE */}
//                   <CCol md={12}>
//                     <label className="custom-label">
//                       Template Name
//                     </label>

//                     <div className="input-with-icon">
//                       <FaLayerGroup className="field-icon" />

//                       <CFormSelect
//                         name="templateName"
//                         value={
//                           formData.templateName
//                         }
//                         onChange={handleChange}
//                         className="custom-input custom-input-icon"
//                       >
//                         {TEMPLATE_OPTIONS.map(
//                           (item) => (
//                             <option
//                               key={item.value}
//                               value={item.value}
//                             >
//                               {item.label}
//                             </option>
//                           )
//                         )}
//                       </CFormSelect>
//                     </div>
//                   </CCol>

//                   {/* SEND BUTTON */}
//                   <CCol md={12}>
//                     <CButton
//                       className="send-test-btn"
//                       disabled={isSending}
//                       onClick={
//                         handleSendTestMessage
//                       }
//                     >
//                       {isSending ? (
//                         <>
//                           <CSpinner
//                             size="sm"
//                             className="me-2"
//                           />
//                           Sending...
//                         </>
//                       ) : (
//                         <>
//                           <FaPaperPlane className="me-2" />
//                           Send Message
//                         </>
//                       )}
//                     </CButton>
//                   </CCol>
//                 </CRow>
//               </CCardBody>
//             </CCard>
//           </CCol>
//         </CRow>
//       </div>
//     </div>
//   );
// };

// export default TestSendInvitation;


import React, { useState } from "react";

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CSpinner,
} from "@coreui/react";

import {
  FaPaperPlane,
  FaWhatsapp,
  FaMobileAlt,
  FaLayerGroup,
} from "react-icons/fa";

import "./sendInvitation.css";

const TEMPLATE_OPTIONS = [
  {
    label: "🎉 Event Invitation",
    value: "event_invitation",
  },
  {
    label: "💍 Wedding Invitation",
    value: "wedding_invitation",
  },
  {
    label: "📢 Marketing Campaign",
    value: "marketing_campaign",
  },
  {
    label: "🎂 Birthday Invitation",
    value: "birthday_invitation",
  },
];

const COUNTRY_CODE_OPTIONS = [
  {
    label: "🇮🇳 +91",
    value: "+91",
  }
];

const INITIAL_STATE = {
  countryCode: "+91",
  phoneNumber: "",
  templateName: "event_invitation",
};

const TestSendInvitation = () => {
  const [formData, setFormData] =
    useState(INITIAL_STATE);

  const [isSending, setIsSending] =
    useState(false);

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendTestMessage = async () => {
    try {
      setIsSending(true);

      const fullPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`;

      const payload = {
        phoneNumber: fullPhoneNumber,
        templateName: formData.templateName,
      };

      console.log(
        "Send Test Invitation Payload:",
        payload
      );

      // ==========================
      // API CALL
      // ==========================

      /*
      await axios.post(
        "/api/send-test-invitation",
        payload
      );
      */

      setTimeout(() => {
        setIsSending(false);
      }, 1500);
    } catch (error) {
      console.error(error);

      setIsSending(false);
    }
  };

  return (
    <div className="test-send-page">
      <div className="container-fluid">
        <CRow className="justify-content-center">
          <CCol xl={5} lg={6} md={8}>
            <CCard className="test-send-card border-0">
              <CCardHeader className="test-send-header">
                <div className="test-send-icon">
                  <FaWhatsapp />
                </div>

                <div>
                  <h3 className="fw-bold mb-1">
                    Test Send Invitation
                  </h3>

                  <p className="text-muted mb-0 small">
                    Send WhatsApp template
                    message to verify campaign
                    delivery
                  </p>
                </div>
              </CCardHeader>

              <CCardBody className="p-4">
                <CRow className="g-4">
                  {/* PHONE NUMBER */}
                  <CCol md={12}>
                    <label className="custom-label">
                      Phone Number
                    </label>

                    <div className="d-flex gap-2">
                      {/* COUNTRY CODE */}
                      <CFormSelect
                        name="countryCode"
                        value={
                          formData.countryCode
                        }
                        onChange={handleChange}
                        className="custom-input"
                        style={{
                          maxWidth: "120px",
                        }}
                      >
                        {COUNTRY_CODE_OPTIONS.map(
                          (item) => (
                            <option
                              key={item.value}
                              value={item.value}
                            >
                              {item.label}
                            </option>
                          )
                        )}
                      </CFormSelect>

                      {/* PHONE NUMBER INPUT */}
                      <div className="input-with-icon flex-grow-1">
                        <FaMobileAlt className="field-icon" />

                        <CFormInput
                          type="text"
                          name="phoneNumber"
                          value={
                            formData.phoneNumber
                          }
                          onChange={handleChange}
                          placeholder="Enter WhatsApp number"
                          className="custom-input custom-input-icon"
                        />
                      </div>
                    </div>
                  </CCol>

                  {/* TEMPLATE */}
                  <CCol md={12}>
                    <label className="custom-label">
                      Template Name
                    </label>

                    <div className="input-with-icon">
                      <FaLayerGroup className="field-icon" />

                      <CFormSelect
                        name="templateName"
                        value={
                          formData.templateName
                        }
                        onChange={handleChange}
                        className="custom-input custom-input-icon"
                      >
                        {TEMPLATE_OPTIONS.map(
                          (item) => (
                            <option
                              key={item.value}
                              value={item.value}
                            >
                              {item.label}
                            </option>
                          )
                        )}
                      </CFormSelect>
                    </div>
                  </CCol>

                  {/* SEND BUTTON */}
                  <CCol md={12}>
                    <CButton
                      className="send-test-btn"
                      disabled={isSending}
                      onClick={
                        handleSendTestMessage
                      }
                    >
                      {isSending ? (
                        <>
                          <CSpinner
                            size="sm"
                            className="me-2"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="me-2" />
                          Send Message
                        </>
                      )}
                    </CButton>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </div>
  );
};

export default TestSendInvitation;