
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
import "./styles.css";


import {
    FaEye,
    FaEyeSlash
} from 'react-icons/fa';



import { validateEmail } from '../../utils/utils';
import { useAuth } from '../../auth/AuthProvider';
import { getSafeApiMessage } from '../../services/Apis/client';


const Login = () => {
    const { login, sessionExpired } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

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

            const user = await login(formValues.email, formValues.password);
            navigate(user?.mustChangePassword ? '/change-password' : '/dashboard', { replace: true });

        } catch (error) {

            setErrors({
                common: getSafeApiMessage(error, 'Invalid email or password.')
            });

        } finally {

            setIsLoading(false);
        }
    };


    return (

        <div className="login-page min-vh-100 d-flex align-items-center justify-content-center position-relative">

            <div className="background-glow background-glow-top" />
            <div className="background-glow background-glow-bottom" />

            <CContainer className="login-container">

                <CRow className="justify-content-center">

                    <CCol xs={12} xl={10} lg={11} className="login-shell">

                        <CCard className="login-card border-0 shadow-lg overflow-hidden">

                            <CRow className="g-0">

                                <CCol
                                    xs={12}
                                    lg={6}
                                    className="login-hero-panel d-none d-lg-flex flex-column justify-content-center align-items-start text-white p-5 position-relative"
                                >

                                    <div className="hero-badge mb-4">Secure workspace</div>

                                    <CImage
                                        src="https://img.freepik.com/free-vector/mobile-marketing-concept-illustration_114360-1497.jpg"
                                        alt="WhatsApp Campaign Dashboard"
                                        className="login-illustration mb-4"
                                    />

                                    <h2 className="hero-title fw-bold mb-3">
                                        WhatsApp Campaign Dashboard
                                    </h2>

                                    <p className="hero-copy mb-4">
                                        Launch campaigns, automate messaging and monitor delivery performance from one modern workspace.
                                    </p>

                                    <ul className="hero-features list-unstyled mb-0">
                                        <li>Real-time campaign analytics</li>
                                        <li>Automated message flows</li>
                                        <li>Clean contact management</li>
                                    </ul>

                                </CCol>

                                <CCol
                                    xs={12}
                                    lg={6}
                                    className="login-form-panel d-flex align-items-center"
                                >

                                    <CCardBody className="login-card-body p-4 p-lg-5">

                                        <div className="text-center mb-4">

                                            <div className="login-logo-wrapper mb-3">

                                                <CImage
                                                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                                                    alt="WhatsApp"
                                                    className="login-logo"
                                                />

                                            </div>

                                            <h2 className="fw-bold mb-2">Welcome Back</h2>
                                            <p className="text-secondary mb-0">
                                                Sign in to access your campaign analytics and messaging suite.
                                            </p>

                                        </div>

                                        {(errors?.common || sessionExpired || location.state?.passwordChanged) && (
                                            <div className="alert alert-danger text-center py-2">
                                                {errors?.common || (sessionExpired ? 'Your session expired. Please sign in again.' : 'Password changed. Sign in with your new password.')}
                                            </div>
                                        )}

                                        <CForm onSubmit={handleSubmit}>

                                            <div className="mb-4">
                                                <label className="form-label fw-semibold text-dark d-block mb-2">
                                                    Email Address
                                                    <span className="text-danger ms-1">*</span>
                                                </label>

                                                <CFormInput
                                                    type="email"
                                                    name="email"
                                                    placeholder="Enter your email address"
                                                    value={formValues.email}
                                                    onChange={handleChange}
                                                    size="lg"
                                                    className="login-input"
                                                />

                                                {errors?.email && (
                                                    <small className="text-danger">
                                                        {errors?.email}
                                                    </small>
                                                )}
                                            </div>

                                            <div className="mb-4">
                                                <label className="form-label fw-semibold text-dark d-block mb-2">
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
                                                        className="login-input"
                                                        size="lg"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="password-toggle-btn"
                                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                    >
                                                        {showPassword ? (
                                                            <FaEyeSlash size={18} color="#6c757d" />
                                                        ) : (
                                                            <FaEye size={18} color="#6c757d" />
                                                        )}
                                                    </button>
                                                </div>

                                                {errors?.password && (
                                                    <small className="text-danger">
                                                        {errors?.password}
                                                    </small>
                                                )}
                                            </div>

                                            <CButton
                                                type="submit"
                                                size="lg"
                                                className="login-btn w-100 fw-semibold"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                        <CSpinner size="sm" color="light" />
                                                        <span>Signing In...</span>
                                                    </div>
                                                ) : (
                                                    'Login to Dashboard'
                                                )}
                                            </CButton>

                                        </CForm>

                                        <div className="text-center mt-4">
                                            <small className="text-secondary">
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
