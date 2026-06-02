
import React, { useState } from 'react';
import { CHeader, CContainer, CHeaderBrand, CHeaderToggler, CBadge } from '@coreui/react';
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ProfileDropdown from '../../components/ProfileDropdown';

const Header = ({ sidebarShow, setSidebarShow }) => {
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      console.log('Search:', searchValue);
    }
  };

  return (
    <CHeader position="sticky" className="app-header modern-header">
      <CContainer fluid className="header-wrapper">
        {/* Left Section: Hamburger + Brand */}
        <div className="header-section header-left">
          <CHeaderToggler
            className={`sidebar-toggler modern-toggler ${sidebarShow ? 'open' : ''}`}
            onClick={() => setSidebarShow(!sidebarShow)}
            aria-label="Toggle navigation"
            title="Toggle sidebar"
          >
            <span className="toggler-line" />
            <span className="toggler-line" />
            <span className="toggler-line" />
          </CHeaderToggler>

          <CHeaderBrand className="logo-text">
            <div className="brand-icon">📊</div>
            <div className="brand-content">
              <div className="brand-title">WhatsApp Campaign</div>
              <div className="brand-subtitle">Analytics Dashboard</div>
            </div>
          </CHeaderBrand>
        </div>

        {/* Center Section: Breadcrumb/Context */}
        <div className="header-section header-center">
          <div className="breadcrumb-nav">
            <span className="breadcrumb-item">Dashboard</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Analytics</span>
          </div>
        </div>

        {/* Right Section: Search and Profile */}
        <div className="header-section header-right">
          {/* Search Bar */}
          <div className={`search-bar ${searchActive ? 'active' : ''}`}>
            <CIcon icon={cilSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search campaigns, contacts..."
              className="search-input"
              value={searchValue}
              onChange={handleSearch}
              onKeyPress={handleSearchSubmit}
              onFocus={() => setSearchActive(true)}
              onBlur={() => setSearchActive(false)}
            />
            {searchValue && (
              <button
                className="search-clear"
                onClick={() => setSearchValue('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="header-action profile-section">
            <ProfileDropdown />
          </div>
        </div>
      </CContainer>
    </CHeader>
  );
};

export default Header;
