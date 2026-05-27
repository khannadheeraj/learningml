import { useEffect, useState } from 'react';
import { CForm, CCard, CCardHeader, CCardBody, CRow, CCol, CFormInput, CFormSelect, CFormTextarea, CButton, CFormLabel, CInputGroup, CInputGroupText, CAlert, CTooltip } from '@coreui/react';
import { cilSchool, cilLocationPin, cilCalendar,cilPhone, cilBook, cilMoney, cilBriefcase, cilChart, cilPlus, cilTrash, cilInfo, cilChevronLeft } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate } from 'react-router-dom';
import '../CollegeConfigurationForm/formConfiguration.css';

const CollegeConfigurationForm = () => {
    const navigate = useNavigate();
    const [collegeType, setCollegeType] = useState('');
    const [courses, setCourses] = useState([{ name: '', specialization: '', fee: '', duration: '' }]);
    const [placement, setPlacement] = useState({
        averagePackage: '',
        highestPackage: '',
        placementRate: '',
        topRecruiters: ''
    });


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const handleAddCourse = () => {
        setCourses([...courses, { name: '', specialization: '', fee: '', duration: '' }]);
    };

    const handleRemoveCourse = (index) => {
        if (courses.length > 1) {
            const updatedCourses = [...courses];
            updatedCourses.splice(index, 1);
            setCourses(updatedCourses);
        }
    };

    return (

        <div className="form-container" >
            {/* Modern Header with Back Button */}
            {/* <div className="form-header">
                <div className="form-header-content">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="header-back-button"
                        aria-label="Go back"
                    >
                        <CIcon icon={cilChevronLeft} />
                    </button>
                    <CIcon icon={cilSchool} className="header-icon" />
                    <h1 className="header-title">College Configuration</h1>
                </div>
            </div> */}

            <CTooltip content="Go back" placement="right">
                <CButton color="light"  onClick={() => navigate(-1)} className="back-button position-absolute shadow-lg" >
                    <CIcon icon={cilChevronLeft}  className="back-button-icon" />
                </CButton>
            </CTooltip>


            <CForm className="p-1">
                {/* Floating Back Button */}

                {/* College Information Section */}
                <CCard className="mb-4 shadow-sm">
                    <CCardHeader className="d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)', color: 'white' }}>
                        <CIcon icon={cilSchool} className="me-2" />
                        <h5 className="mb-0">College Information</h5>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="g-3">
                            <CCol md={6}>
                                <CFormLabel className="fw-semibold">College Name</CFormLabel>
                                <CInputGroup>
                                    <CInputGroupText>
                                        <CIcon icon={cilSchool} />
                                    </CInputGroupText>
                                    <CFormInput placeholder="Full name of the college" />
                                </CInputGroup>
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel className="fw-semibold">Location</CFormLabel>
                                <CInputGroup>
                                    <CInputGroupText>
                                        <CIcon icon={cilLocationPin} />
                                    </CInputGroupText>
                                    <CFormInput placeholder="City, State, Country" />
                                </CInputGroup>
                            </CCol>

                            <CCol md={4}>
                                <CFormLabel className="fw-semibold">Approval/Affiliation</CFormLabel>
                                <CFormInput placeholder="e.g. UGC, AICTE" />
                            </CCol>

                            <CCol md={4}>
                                <CFormLabel className="fw-semibold">Establishment Year</CFormLabel>
                                <CInputGroup>
                                    <CInputGroupText>
                                        <CIcon icon={cilCalendar} />
                                    </CInputGroupText>
                                    <CFormInput type="number" placeholder="Year" />
                                </CInputGroup>
                            </CCol>

                            <CCol md={4}>
                                <CFormLabel className="fw-semibold">College Type</CFormLabel>
                                <CFormSelect
                                    value={collegeType}
                                    onChange={(e) => setCollegeType(e.target.value)}
                                >
                                    <option value="">Select type</option>
                                    <option value="government">Government</option>
                                    <option value="private">Private</option>
                                    <option value="deemed">Deemed University</option>
                                    <option value="autonomous">Autonomous</option>
                                </CFormSelect>
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel className="fw-semibold">Contact Details</CFormLabel>
                                <CInputGroup>
                                    <CInputGroupText>
                                        <CIcon icon={cilPhone} />
                                    </CInputGroupText>
                                    <CFormInput placeholder="Phone number" />
                                </CInputGroup>
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel className="fw-semibold">Website</CFormLabel>
                                <CInputGroup>
                                    <CInputGroupText>https://</CInputGroupText>
                                    <CFormInput placeholder="collegewebsite.edu" />
                                </CInputGroup>
                            </CCol>

                            <CCol xs={12}>
                                <CFormLabel className="fw-semibold">About College</CFormLabel>
                                <CFormTextarea placeholder="Brief description about the college" rows={3} />
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>

                {/* Course and Fee Structure Section */}
                <CCard className="mb-4 shadow-sm">
                    <CCardHeader className="d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)', color: 'white' }}>
                        <CIcon icon={cilBook} className="me-2" />
                        <h5 className="mb-0">Course and Fee Structure</h5>
                        <CButton color="light" size="sm" className="ms-auto" onClick={handleAddCourse}>
                            <CIcon icon={cilPlus} className="me-1" />
                            Add Course
                        </CButton>
                    </CCardHeader>
                    <CCardBody>
                        {courses.map((course, index) => (
                            <div key={index} className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="mb-0">Course #{index + 1}</h6>
                                    {courses.length > 1 && (
                                        <CButton color="danger" size="sm" variant="outline" onClick={() => handleRemoveCourse(index)}>
                                            <CIcon icon={cilTrash} />
                                        </CButton>
                                    )}
                                </div>

                                <CRow className="g-3">
                                    <CCol md={6}>
                                        <CFormLabel className="fw-semibold">Course Name</CFormLabel>
                                        <CFormInput
                                            value={course.name}
                                            onChange={(e) => {
                                                const updatedCourses = [...courses];
                                                updatedCourses[index].name = e.target.value;
                                                setCourses(updatedCourses);
                                            }}
                                            placeholder="e.g. Computer Science Engineering"
                                        />
                                    </CCol>

                                    <CCol md={6}>
                                        <CFormLabel className="fw-semibold">Specializations</CFormLabel>
                                        <CFormInput
                                            value={course.specialization}
                                            onChange={(e) => {
                                                const updatedCourses = [...courses];
                                                updatedCourses[index].specialization = e.target.value;
                                                setCourses(updatedCourses);
                                            }}
                                            placeholder="e.g. AI, Data Science, Cybersecurity"
                                        />
                                    </CCol>

                                    <CCol md={4}>
                                        <CFormLabel className="fw-semibold">Fee</CFormLabel>
                                        <CInputGroup>
                                            <CInputGroupText>
                                                <CIcon icon={cilMoney} />
                                            </CInputGroupText>
                                            <CFormInput
                                                type="number"
                                                value={course.fee}
                                                onChange={(e) => {
                                                    const updatedCourses = [...courses];
                                                    updatedCourses[index].fee = e.target.value;
                                                    setCourses(updatedCourses);
                                                }}
                                                placeholder="Amount per semester/year"
                                            />
                                            <CInputGroupText>.00</CInputGroupText>
                                        </CInputGroup>
                                    </CCol>

                                    <CCol md={4}>
                                        <CFormLabel className="fw-semibold">Duration</CFormLabel>
                                        <CFormInput
                                            value={course.duration}
                                            onChange={(e) => {
                                                const updatedCourses = [...courses];
                                                updatedCourses[index].duration = e.target.value;
                                                setCourses(updatedCourses);
                                            }}
                                            placeholder="e.g. 4 years"
                                        />
                                    </CCol>

                                    <CCol md={4}>
                                        <CFormLabel className="fw-semibold">Eligibility Criteria</CFormLabel>
                                        <CFormInput placeholder="e.g. 12th with 75% marks" />
                                    </CCol>

                                    <CCol xs={12}>
                                        <CFormLabel className="fw-semibold">Course Description</CFormLabel>
                                        <CFormTextarea rows={2} placeholder="Brief about the course curriculum" />
                                    </CCol>
                                </CRow>

                                {/* {index < courses.length - 1 && <CDivider className="my-4" />} */}
                                {index < courses.length - 1 && <hr className="my-4" />}
                            </div>
                        ))}
                    </CCardBody>
                </CCard>

                {/* Placement Details Section */}
                <CCard className="mb-4 shadow-sm">
                    <CCardHeader className="d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #f46b45 0%, #eea849 100%)', color: 'white' }}>
                        <CIcon icon={cilBriefcase} className="me-2" />
                        <h5 className="mb-0">Placement Details</h5>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="g-3">
                            <CCol md={6}>
                                <CFormLabel className="fw-semibold">Average Package</CFormLabel>
                                <CInputGroup>
                                    <CInputGroupText>
                                        <CIcon icon={cilMoney} />
                                    </CInputGroupText>
                                    <CFormInput
                                        value={placement.averagePackage}
                                        onChange={(e) => setPlacement({ ...placement, averagePackage: e.target.value })}
                                        placeholder="e.g. 6.5"
                                    />
                                    <CInputGroupText>LPA</CInputGroupText>
                                </CInputGroup>
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel className="fw-semibold">Highest Package</CFormLabel>
                                <CInputGroup>
                                    <CInputGroupText>
                                        <CIcon icon={cilChart} />
                                    </CInputGroupText>
                                    <CFormInput
                                        value={placement.highestPackage}
                                        onChange={(e) => setPlacement({ ...placement, highestPackage: e.target.value })}
                                        placeholder="e.g. 42.0"
                                    />
                                    <CInputGroupText>LPA</CInputGroupText>
                                </CInputGroup>
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel className="fw-semibold">Placement Rate</CFormLabel>
                                <CInputGroup>
                                    <CFormInput
                                        type="number"
                                        value={placement.placementRate}
                                        onChange={(e) => setPlacement({ ...placement, placementRate: e.target.value })}
                                        placeholder="e.g. 85"
                                    />
                                    <CInputGroupText>%</CInputGroupText>
                                </CInputGroup>
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel className="fw-semibold">Top Recruiters</CFormLabel>
                                <CFormInput
                                    value={placement.topRecruiters}
                                    onChange={(e) => setPlacement({ ...placement, topRecruiters: e.target.value })}
                                    placeholder="e.g. Google, Microsoft, Amazon"
                                />
                            </CCol>

                            <CCol xs={12}>
                                <CFormLabel className="fw-semibold">Internship Opportunities</CFormLabel>
                                <CFormTextarea rows={2} placeholder="Details about internship programs" />
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>

                {/* Additional Fields Section */}
                <CCard className="mb-4 shadow-sm">
                    <CCardHeader className="d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)', color: 'white' }}>
                        <CIcon icon={cilInfo} className="me-2" />
                        <h5 className="mb-0">Additional Information</h5>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="g-3">
                            <CCol md={6}>
                                <CFormLabel className="fw-semibold">Campus Facilities</CFormLabel>
                                <CFormTextarea rows={3} placeholder="Library, Labs, Sports facilities, etc." />
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel className="fw-semibold">Admission Process</CFormLabel>
                                <CFormTextarea rows={3} placeholder="Entrance exams, cutoffs, etc." />
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel className="fw-semibold">Accreditation & Rankings</CFormLabel>
                                <CFormTextarea rows={2} placeholder="NAAC score, NIRF ranking, etc." />
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel className="fw-semibold">Scholarships</CFormLabel>
                                <CFormTextarea rows={2} placeholder="Available scholarships and eligibility" />
                            </CCol>

                            <CCol xs={12}>
                                <CAlert color="info" className="d-flex align-items-center">
                                    <CIcon icon={cilInfo} className="flex-shrink-0 me-2" />
                                    <div>Complete all required fields before submitting the form. You can save your progress and continue later.</div>
                                </CAlert>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>

                <div className="d-flex justify-content-end gap-3 mt-4">
                    <CButton color="secondary" variant="outline">
                        Save Draft
                    </CButton>
                    <CButton color="primary">
                        Submit College Details
                    </CButton>
                </div>
            </CForm>

        </div>
    );
};

export default CollegeConfigurationForm;