import React, { useState } from 'react';
import {
    CContainer, CRow, CCol, CCard, CCardBody, CForm, CFormInput, CButton, CImage
} from '@coreui/react';
import { validateEmail } from '../../utils/utils';
import { adminUserLogin } from '../../services/AuthService';
import { auth_service } from '../../auth/auth';

const Login = () => {
    const [formValues, setFormValues] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});

    const ADMIN_USER_EMAIL = process.env.REACT_APP_ADMIN_USER_EMAIL;
    const ADMIN_USER_PASSWORD = process.env.REACT_APP_ADMIN_USER_PASSWORD;


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        let errors = {};
        let formIsValid = true;

        if (!formValues?.email) {
            errors['email'] = "Email is required";
            formIsValid = false;
        }
        if (formValues?.email && !validateEmail(formValues?.email)) {
            errors['email'] = "Please enter a valid email";
            formIsValid = false;
        }
        if (!formValues?.password) {
            errors['password'] = "Password is required";
            formIsValid = false;
        }
        setErrors(errors);
        setTimeout(() => {
            setErrors({});
        }, 2000);

        return formIsValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            // let response = await adminUserLogin(formValues);
            // if (res.status === 200) {
            let response = {};  /* later user global Auth state integration || mustate stae */
            if (ADMIN_USER_EMAIL === formValues.email && ADMIN_USER_PASSWORD === formValues.password) {
                response = {
                    "email": formValues.email,
                    "name": "Admin",
                    "role": "ADMIN",
                }
                let authResult = {};
                authResult = response;
                auth_service.setSessionData(authResult, response);
                window.location.href = "/dashboard"
            } else {
                auth_service.clearData();
            }
        }
    };

    return (
        <CContainer fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-purple">
            <CCard className="d-flex flex-row shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: '900px', width: '100%' }}>
                <CCol md={6} className="d-none d-md-block">
                    <CImage
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                        alt="login"
                        className="w-100 h-100 object-fit-cover"
                    />
                </CCol>

                <CCol md={6} className="p-5 d-flex flex-column align-items-center">
                    <CCardBody className="w-100">
                        <div className="text-center mb-4">
                            <CImage
                                src="/assets/logo.jpeg"
                                // alt="My College Vision"
                                alt="Whatsapp Campan"
                                className="img-fluid"
                                style={{ maxHeight: '200px' }}
                            />
                        </div>

                        <h4 className="text-center mb-4">Sign into your account</h4>

                        <CForm onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <CFormInput
                                    type="text"
                                    name="email"
                                    label="Email address"
                                    value={formValues.email}
                                    onChange={handleChange}
                                    floatingLabel
                                />
                                {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                            </div>

                            <div className="mb-4">
                                <CFormInput
                                    type="text"
                                    name="password"
                                    label="Password"
                                    value={formValues.password}
                                    onChange={handleChange}
                                    floatingLabel
                                />
                                {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                            </div>

                            <CButton color="dark" type="submit" className="w-100 mb-3" size="lg">
                                LOGIN
                            </CButton>

                            <div className="text-center">
                                <a href="#!" className="text-muted small">Forgot password?</a>
                                <p className="mt-3 mb-0">
                                    Don't have an account?{' '}
                                    <a href="#!" className="fw-bold text-decoration-none text-primary">
                                        Register here
                                    </a>
                                </p>
                            </div>
                        </CForm>

                        <div className="text-center mt-4">
                            <a href="#!" className="text-muted small me-3">Terms of use</a>
                            <a href="#!" className="text-muted small">Privacy policy</a>
                        </div>
                    </CCardBody>
                </CCol>
            </CCard>
        </CContainer>
    );
};

export default Login;
