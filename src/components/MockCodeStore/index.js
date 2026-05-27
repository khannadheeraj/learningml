
// import React from 'react';
// import {
//     CCard,
//     CCardBody,
//     CCardHeader,
//     CCol,
//     CForm,
//     CFormInput,
//     CRow,
//     CFormSelect,
// } from '@coreui/react';

// const CollegeConfigurationForm = () => {
//     return (
//         <CForm>
//             {/* College Information Section */}
//             <CCard className="mb-4">
//                 <CCardHeader className="bg-primary text-white">College Information</CCardHeader>
//                 <CCardBody>
//                     <CRow>
//                         <CCol md={4}>
//                             <CFormInput label="College Name" placeholder="Full name of the college" />
//                         </CCol>
//                         <CCol md={4}>
//                             <CFormInput label="Location" placeholder="City, State, Country" />
//                         </CCol>
//                         <CCol md={4}>
//                             <CFormInput label="Approval/Affiliation" placeholder="1561" />
//                         </CCol>
//                         <CCol md={4}>
//                             <CFormInput label="Establishment Year" placeholder="Contact" />
//                         </CCol>
//                         <CCol md={4}>
//                             <CFormSelect label="College Type">
//                                 <option>Government</option>
//                                 <option>Private</option>
//                             </CFormSelect >
//                         </CCol>
//                         <CCol md={4}>
//                             <CFormInput label="Contact Details" />
//                         </CCol>
//                     </CRow>
//                 </CCardBody>
//             </CCard>

//             {/* Course and Fee Structure Section */}
//             <CCard className="mb-4">
//                 <CCardHeader className="bg-primary text-white">Course and Fee Structure</CCardHeader>
//                 <CCardBody>
//                     <CRow>
//                         <CCol md={4}>
//                             <CFormInput label="Course Name" placeholder="Course name" />
//                         </CCol>
//                         <CCol md={4}>
//                             <CFormInput label="Specializations" placeholder="Fee per semester/year" />
//                         </CCol>
//                         <CCol md={4}>
//                             <CFormInput label="Fee" placeholder="Amount per semester/year" />
//                         </CCol>
//                         <CCol md={4}>
//                             <CFormInput label="Eligibility Criteria" />
//                         </CCol>
//                         <CCol md={4}>
//                             <CFormInput label="Duration" />
//                         </CCol>
//                     </CRow>
//                 </CCardBody>
//             </CCard>

//             {/* Placement Details Section */}
//             <CCard className="mb-4">
//                 <CCardHeader className="bg-primary text-white">Placement Details</CCardHeader>
//                 <CCardBody>
//                     <CRow>
//                         <CCol md={4}>
//                             <CFormInput label="Average Package" placeholder="Average package" />
//                         </CCol>
//                         <CCol md={4}>
//                             <CFormInput label="Highest Package" placeholder="%" />
//                         </CCol>
//                         <CCol md={4}>
//                             <CFormInput label="Placement Rate" />
//                         </CCol>
//                         <CCol md={4}>
//                             <CFormInput label="Top Recruiters" placeholder="Internship" />
//                         </CCol>
//                         <CCol md={4}>
//                             <CFormInput label="Rating Breakdown" />
//                         </CCol>
//                     </CRow>
//                 </CCardBody>
//             </CCard>

//             {/* Additional Fields Section */}
//             <CCard className="mb-4">
//                 <CCardHeader className="bg-primary text-white">Additional Fields</CCardHeader>
//                 <CCardBody>
//                     <CRow>
//                         <CCol md={4}>
//                             <CFormInput label="Campus Facilities" placeholder="Campus Facilities" />
//                         </CCol>
//                         <CCol md={4}>
//                             <CFormInput label="Admission Process" placeholder="Scholarships" />
//                         </CCol>
//                         <CCol md={4}>
//                             <CFormInput label="Accreditation Score" placeholder="Reviews comment" />
//                         </CCol>
//                         <CCol md={4}>
//                             <CFormInput label="Student Enrollment" placeholder="Faculty Details" />
//                         </CCol>
//                     </CRow>
//                 </CCardBody>
//             </CCard>
//         </CForm>
//     );
// };

// export default CollegeConfigurationForm;



// Alternative Html Form Code

// import React, { useState } from 'react';
// import './formConfiguration.css';
// const CollegeConfigurationForm = () => {
//     // State declarations for each form input
//     const [collegeName, setCollegeName] = useState('');
//     const [location, setLocation] = useState('');
//     const [approval, setApproval] = useState('1561');
//     const [establishmentYear, setEstablishmentYear] = useState('');
//     const [collegeType, setCollegeType] = useState('government');

//     const [courseName, setCourseName] = useState('');
//     const [specializations, setSpecializations] = useState('');
//     const [fee, setFee] = useState('');
//     const [eligibility, setEligibility] = useState('');
//     const [duration, setDuration] = useState('');

//     const [averagePackage, setAveragePackage] = useState('');
//     const [highestPackage, setHighestPackage] = useState('');
//     const [placementRate, setPlacementRate] = useState('');
//     const [topRecruiters, setTopRecruiters] = useState('');
//     const [ratingBreakdown, setRatingBreakdown] = useState('');

//     const [facilities, setFacilities] = useState('');
//     const [admissionProcess, setAdmissionProcess] = useState('');
//     const [accreditationScore, setAccreditationScore] = useState('');
//     const [studentEnrollment, setStudentEnrollment] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Handle form submission logic here
//         console.log({
//             collegeName,
//             location,
//             approval,
//             establishmentYear,
//             collegeType,
//             courseName,
//             specializations,
//             fee,
//             eligibility,
//             duration,
//             averagePackage,
//             highestPackage,
//             placementRate,
//             topRecruiters,
//             ratingBreakdown,
//             facilities,
//             admissionProcess,
//             accreditationScore,
//             studentEnrollment,
//         });
//     };

//     return (
//         <div className="container">
//             <form onSubmit={handleSubmit}>
//                 <section className="form-section">
//                     <h2 className="section-title">College Information</h2>
//                     <div className="form-group">
//                         <label htmlFor="collegeName">College Name</label>
//                         <input
//                             type="text"
//                             id="collegeName"
//                             value={collegeName}
//                             onChange={(e) => setCollegeName(e.target.value)}
//                             placeholder="Full name of the college"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="location">Location</label>
//                         <input
//                             type="text"
//                             id="location"
//                             value={location}
//                             onChange={(e) => setLocation(e.target.value)}
//                             placeholder="City, State, Country"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="approval">Approval/Affiliation</label>
//                         <input
//                             type="text"
//                             id="approval"
//                             value={approval}
//                             onChange={(e) => setApproval(e.target.value)}
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="establishmentYear">Establishment Year</label>
//                         <input
//                             type="text"
//                             id="establishmentYear"
//                             value={establishmentYear}
//                             onChange={(e) => setEstablishmentYear(e.target.value)}
//                             placeholder="Establishment Year"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="collegeType">College Type</label>
//                         <select
//                             id="collegeType"
//                             value={collegeType}
//                             onChange={(e) => setCollegeType(e.target.value)}
//                         >
//                             <option value="government">Government</option>
//                             {/* Add more options as needed */}
//                         </select>
//                     </div>
//                 </section>

//                 <section className="form-section">
//                     <h2 className="section-title">Course and Fee Structure</h2>
//                     <div className="form-group">
//                         <label htmlFor="courseName">Course Name</label>
//                         <input
//                             type="text"
//                             id="courseName"
//                             value={courseName}
//                             onChange={(e) => setCourseName(e.target.value)}
//                             placeholder="Course name"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="specializations">Specializations</label>
//                         <input
//                             type="text"
//                             id="specializations"
//                             value={specializations}
//                             onChange={(e) => setSpecializations(e.target.value)}
//                             placeholder="Specializations"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="fee">Fee</label>
//                         <input
//                             type="text"
//                             id="fee"
//                             value={fee}
//                             onChange={(e) => setFee(e.target.value)}
//                             placeholder="Amount per semester/year"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="eligibility">Eligibility Criteria</label>
//                         <input
//                             type="text"
//                             id="eligibility"
//                             value={eligibility}
//                             onChange={(e) => setEligibility(e.target.value)}
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="duration">Duration</label>
//                         <input
//                             type="text"
//                             id="duration"
//                             value={duration}
//                             onChange={(e) => setDuration(e.target.value)}
//                         />
//                     </div>
//                 </section>

//                 <section className="form-section">
//                     <h2 className="section-title">Placement Details</h2>
//                     <div className="form-group">
//                         <label htmlFor="averagePackage">Average Package</label>
//                         <input
//                             type="text"
//                             id="averagePackage"
//                             value={averagePackage}
//                             onChange={(e) => setAveragePackage(e.target.value)}
//                             placeholder="Average package"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="highestPackage">Highest Package</label>
//                         <input
//                             type="text"
//                             id="highestPackage"
//                             value={highestPackage}
//                             onChange={(e) => setHighestPackage(e.target.value)}
//                             placeholder="%"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="placementRate">Placement Rate</label>
//                         <input
//                             type="text"
//                             id="placementRate"
//                             value={placementRate}
//                             onChange={(e) => setPlacementRate(e.target.value)}
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="topRecruiters">Top Recruiters</label>
//                         <input
//                             type="text"
//                             id="topRecruiters"
//                             value={topRecruiters}
//                             onChange={(e) => setTopRecruiters(e.target.value)}
//                             placeholder="Top Recruiters"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="ratingBreakdown">Rating Breakdown</label>
//                         <input
//                             type="text"
//                             id="ratingBreakdown"
//                             value={ratingBreakdown}
//                             onChange={(e) => setRatingBreakdown(e.target.value)}
//                         />
//                     </div>
//                 </section>

//                 <section className="form-section">
//                     <h2 className="section-title">Additional Fields</h2>
//                     <div className="form-group">
//                         <label htmlFor="facilities">Campus Facilities</label>
//                         <input
//                             type="text"
//                             id="facilities"
//                             value={facilities}
//                             onChange={(e) => setFacilities(e.target.value)}
//                             placeholder="Campus Facilities"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="admissionProcess">Admission Process</label>
//                         <input
//                             type="text"
//                             id="admissionProcess"
//                             value={admissionProcess}
//                             onChange={(e) => setAdmissionProcess(e.target.value)}
//                             placeholder="Admission Process"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="accreditationScore">Accreditation Score</label>
//                         <input
//                             type="text"
//                             id="accreditationScore"
//                             value={accreditationScore}
//                             onChange={(e) => setAccreditationScore(e.target.value)}
//                             placeholder="Accreditation Score"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="studentEnrollment">Student Enrollment</label>
//                         <input
//                             type="text"
//                             id="studentEnrollment"
//                             value={studentEnrollment}
//                             onChange={(e) => setStudentEnrollment(e.target.value)}
//                             placeholder="Student Enrollment"
//                         />
//                     </div>
//                 </section>

//                 <button type="submit" className="submit-button">Submit</button>
//             </form>
//         </div>
//     );
// };

// export default CollegeConfigurationForm;