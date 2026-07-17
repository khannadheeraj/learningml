import React, { useState } from 'react';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider } from '@coreui/react';
import { cilAccountLogout, cilEnvelopeOpen, cilSettings, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useAuth } from '../../auth/AuthProvider';

const getAvatarUrl = (name, imageUrl) => {
    if (imageUrl) return imageUrl;
    const initials = encodeURIComponent(name || 'Guest');
    return `https://ui-avatars.com/api/?name=${initials}&background=0D6EFD&color=fff&rounded=true`;
};

const ProfileDropdown = () => {
    const { user, logout } = useAuth();
    const [visible, setVisible] = useState(false);
    const profile = {
        name: user?.displayName || user?.email || 'User',
        email: user?.email || '',
        avatar: getAvatarUrl(user?.displayName || user?.email || 'User'),
    };

    const handleToggle = () => {
        setVisible((prevVisible) => !prevVisible);
    };

    const menuItems = [
        {
            label: 'My Profile',
            icon: cilUser,
            href: '#',
        },
        {
            label: 'Account Settings',
            icon: cilSettings,
            href: '#',
        },
        {
            label: 'Support',
            icon: cilEnvelopeOpen,
            href: '#',
        },
    ];

    const RenderDropdownMenu = () => {
        return (
            <CDropdownMenu className="profile-dropdown-menu shadow-lg" placement="bottom-end">
                <div className="profile-dropdown-card p-3">
                    <div className="profile-card-header d-flex align-items-center gap-3">
                        <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="profile-card-avatar"
                        />
                        <div>
                            <div className="profile-card-name">{profile.name}</div>
                            {profile.email && (
                                <div className="profile-card-email text-muted">{profile.email}</div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="profile-dropdown-actions">
                    {menuItems.map((item, idx) => (
                        <CDropdownItem
                            href={item.href}
                            key={idx}
                            className="profile-dropdown-item"
                        >
                            <CIcon icon={item.icon} className="me-3 text-primary" />
                            <div>
                                <div className="fw-semibold">{item.label}</div>
                                <div className="text-muted small">Quick access</div>
                            </div>
                        </CDropdownItem>
                    ))}
                </div>
                <CDropdownDivider className="my-2" />
                <CDropdownItem
                    onClick={logout}
                    className="profile-dropdown-logout"
                >
                    <CIcon icon={cilAccountLogout} className="me-2 text-danger" />
                    Sign out
                </CDropdownItem>
            </CDropdownMenu>
        );
    };

    return (
        <CDropdown alignment="end" visible={visible} onVisibleChange={setVisible}>
            <CDropdownToggle className="p-0 border-0 bg-transparent profile-dropdown-toggle" caret={false} onClick={handleToggle}>
                <div className="profile-dropdown-button d-flex align-items-center gap-2">
                    <img
                        src={profile.avatar}
                        alt={profile.name}
                        title={profile.name}
                        className="rounded-circle profile-dropdown"
                        width="40"
                        height="40"
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="profile-dropdown-label d-none d-md-flex flex-column">
                        <span className="profile-dropdown-name">{profile.name}</span>
                        {profile.email && <span className="profile-dropdown-role text-muted">{profile.email}</span>}
                    </div>
                    <span className="profile-dropdown-chevron">▾</span>
                </div>
            </CDropdownToggle>
            {visible && RenderDropdownMenu()}
        </CDropdown>
    );
};

export default ProfileDropdown;
