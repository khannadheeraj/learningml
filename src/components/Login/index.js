
import React, { useState } from 'react';
import axios from 'axios';

import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CForm,
    CFormInput,
    CButton,
    CImage,
    CSpinner
} from '@coreui/react';


import {
    FaEye,
    FaEyeSlash
} from 'react-icons/fa';



import { validateEmail } from '../../utils/utils';
import { auth_service } from '../../auth/auth';


const Login = () => {

    const [formValues, setFormValues] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    // =========================================================
    // Handle Input Change
    // =========================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: ''
        }));
    };


    // =========================================================
    // Validate Form
    // =========================================================

    const validateForm = () => {

        let validationErrors = {};

        let formIsValid = true;

        if (!formValues?.email) {

            validationErrors.email = 'Email is required';

            formIsValid = false;
        }

        if (
            formValues?.email &&
            !validateEmail(formValues?.email)
        ) {

            validationErrors.email = 'Please enter valid email';

            formIsValid = false;
        }

        if (!formValues?.password) {

            validationErrors.password = 'Password is required';

            formIsValid = false;
        }

        setErrors(validationErrors);

        return formIsValid;
    };


    // =========================================================
    // Handle Login
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {

            setIsLoading(true);

            setErrors({});

            const BASE_URL =
                process.env.REACT_APP_recommendServiceURL;

            const response = await axios.post(
                `${BASE_URL}/admin/login`,
                {
                    emailId: formValues.email,
                    password: formValues.password
                }
            );

            const responseData = response?.data;

            // ==========================================
            // Save Session
            // ==========================================

            auth_service.setSessionData(
                responseData,
                responseData?.userData
            );

            // Save JWT Token
            localStorage.setItem(
                'adminToken',
                responseData?.token
            );

            // Redirect
            window.location.href = '/dashboard';

        } catch (error) {

            console.error(
                'Login Error:',
                error
            );

            setErrors({
                common:
                    error?.response?.data?.detail ||
                    error?.response?.data?.message ||
                    'Invalid email or password'
            });

            auth_service.clearData();

        } finally {

            setIsLoading(false);
        }
    };


    return (

        <div
            className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
            style={{
                background:
                    'linear-gradient(135deg, #0f2027, #203a43, #2c5364)'
            }}
        >

            {/* Background Blur Circle */}
            <div
                style={{
                    position: 'absolute',
                    width: '350px',
                    height: '350px',
                    borderRadius: '50%',
                    background: 'rgba(37,211,102,0.18)',
                    top: '-100px',
                    right: '-100px',
                    filter: 'blur(40px)'
                }}
            />

            <div
                style={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    bottom: '-100px',
                    left: '-100px',
                    filter: 'blur(50px)'
                }}
            />

            <CContainer>

                <CRow className="justify-content-center">

                    <CCol
                        xl={10}
                        lg={11}
                    >

                        <CCard
                            className="border-0 shadow-lg overflow-hidden"
                            style={{
                                borderRadius: '28px',
                                background: 'rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)'
                            }}
                        >

                            <CRow className="g-0">

                                {/* =========================================================
                                    Left Side Banner
                                ========================================================= */}

                                <CCol
                                    md={6}
                                    className="d-none d-md-flex flex-column justify-content-center align-items-center text-white p-5 position-relative"
                                    style={{
                                        background:
                                            'linear-gradient(180deg, #25D366 0%, #128C7E 100%)'
                                    }}
                                >

                                    <CImage
                                        src="https://img.freepik.com/free-vector/mobile-marketing-concept-illustration_114360-1497.jpg"
                                        alt="WhatsApp Campaign Dashboard"
                                        className="img-fluid mb-4"
                                        style={{
                                            maxHeight: '300px',
                                            objectFit: 'contain'
                                        }}
                                    />

                                    <h2
                                        className="fw-bold text-center mb-3"
                                    >
                                        WhatsApp Campaign Dashboard
                                    </h2>

                                    <p
                                        className="text-center opacity-75"
                                        style={{
                                            maxWidth: '420px',
                                            lineHeight: '28px'
                                        }}
                                    >
                                        Manage campaigns, automate messaging,
                                        monitor delivery reports and grow your
                                        business communication with powerful
                                        WhatsApp marketing tools.
                                    </p>

                                </CCol>


                                {/* =========================================================
                                    Right Side Login Form
                                ========================================================= */}

                                <CCol
                                    md={6}
                                    className="bg-white d-flex align-items-center"
                                >

                                    <CCardBody className="p-4 p-lg-5">

                                        {/* Logo */}

                                        <div className="text-center mb-4">

                                            <div
                                                className="d-inline-flex align-items-center justify-content-center rounded-circle shadow-sm"
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    background: '#25D366'
                                                }}
                                            >

                                                <CImage
                                                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                                                    alt="WhatsApp"
                                                    style={{
                                                        width: '55px',
                                                        height: '55px'
                                                    }}
                                                />

                                            </div>

                                        </div>


                                        {/* Heading */}

                                        <div className="text-center mb-4">

                                            <h2 className="fw-bold mb-2">
                                                Welcome Back
                                            </h2>

                                            <p className="text-medium-emphasis">
                                                Sign in to continue to your dashboard
                                            </p>

                                        </div>


                                        {/* Error */}

                                        {
                                            errors?.common && (
                                                <div
                                                    className="alert alert-danger text-center py-2"
                                                >
                                                    {errors?.common}
                                                </div>
                                            )
                                        }
                                        <CForm onSubmit={handleSubmit}>

                                            {/* Email */}

                                            <div className="mb-4">

                                                <label className="form-label fw-semibold text-dark">
                                                    Email Address
                                                    <span className="text-danger ms-1">*</span>
                                                </label>

                                                <div className="position-relative">

                                                    <CFormInput
                                                        type="email"
                                                        name="email"
                                                        placeholder="Enter your email address"
                                                        value={formValues.email}
                                                        onChange={handleChange}
                                                        size="lg"
                                                        style={{
                                                            borderRadius: '12px',
                                                            height: '52px',
                                                            border: '1px solid #dcdcdc',
                                                            boxShadow: 'none'
                                                        }}
                                                    />

                                                </div>

                                                {
                                                    errors?.email && (
                                                        <small className="text-danger">
                                                            {errors?.email}
                                                        </small>
                                                    )
                                                }

                                            </div>


                                            {/* Password */}

                                            <div className="mb-4">

                                                <label className="form-label fw-semibold text-dark">
                                                    Password
                                                    <span className="text-danger ms-1">*</span>
                                                </label>

                                                <div className="position-relative">

                                                    <CFormInput
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="password"
                                                        placeholder="Enter your password"
                                                        value={formValues.password}
                                                        onChange={handleChange}
                                                        size="lg"
                                                        style={{
                                                            borderRadius: '12px',
                                                            height: '52px',
                                                            border: '1px solid #dcdcdc',
                                                            paddingRight: '55px',
                                                            boxShadow: 'none'
                                                        }}
                                                    />

                                                    {/* Eye Toggle */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword(!showPassword)
                                                        }
                                                        className="border-0 bg-transparent position-absolute top-50 end-0 translate-middle-y pe-3"
                                                    >

                                                        {
                                                            showPassword ? (
                                                                <FaEyeSlash
                                                                    size={18}
                                                                    color="#6c757d"
                                                                />
                                                            ) : (
                                                                <FaEye
                                                                    size={18}
                                                                    color="#6c757d"
                                                                />
                                                            )
                                                        }

                                                    </button>

                                                </div>

                                                {
                                                    errors?.password && (
                                                        <small className="text-danger">
                                                            {errors?.password}
                                                        </small>
                                                    )
                                                }

                                            </div>


                                            {/* Login Button */}

                                            <CButton
                                                type="submit"
                                                size="lg"
                                                className="w-100 fw-semibold border-0 shadow-sm"
                                                disabled={isLoading}
                                                style={{
                                                    background:
                                                        'linear-gradient(90deg, #25D366 0%, #128C7E 100%)',
                                                    borderRadius: '14px',
                                                    height: '54px',
                                                    fontSize: '16px',
                                                    letterSpacing: '0.5px'
                                                }}
                                            >

                                                {
                                                    isLoading ? (
                                                        <div className="d-flex align-items-center justify-content-center gap-2">

                                                            <CSpinner
                                                                size="sm"
                                                                color="light"
                                                            />

                                                            <span>
                                                                Signing In...
                                                            </span>

                                                        </div>
                                                    ) : (
                                                        'Login to Dashboard'
                                                    )
                                                }

                                            </CButton>

                                        </CForm>

                                        {/* Footer */}

                                        <div className="text-center mt-4">

                                            <small className="text-medium-emphasis">
                                                © 2026 WhatsApp Campaign Dashboard
                                            </small>

                                        </div>

                                    </CCardBody>

                                </CCol>

                            </CRow>

                        </CCard>

                    </CCol>

                </CRow>

            </CContainer>

        </div>
    );
};

export default Login;
