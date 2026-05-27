import React, { useEffect, useState } from 'react'
import { CRow, CAvatar, CBadge, CButton, CCollapse, CSmartTable } from '@coreui/react-pro';
import { CCol } from '@coreui/react'
import { cilArrowLeft, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import '../Colleges/collegesDashboard.css'
import { FaPlus } from 'react-icons/fa'
import { useNavigate, Link } from 'react-router-dom'


const getBadge = (status) => {
  switch (status) {
    case 'Active':
      return 'success'
    case 'Inactive':
      return 'secondary'
    case 'Pending':
      return 'warning'
    case 'Banned':
      return 'danger'
    default:
      return 'primary'
  }
}

const Colleges = () => {

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [details, setDetails] = useState([])

  const toggleDetails = (id) => {
    const position = details.indexOf(id)
    let newDetails = [...details]
    if (position === -1) {
      newDetails = [...details, id]
    } else {
      newDetails.splice(position, 1)
    }
    setDetails(newDetails)
  }

  const columns = [
    { key: 'avatar', label: '', filter: false, sorter: false },
    { key: 'name', _style: { width: '20%' } },
    {
      key: 'registered',
      sorter: (a, b) => new Date(a.registered) - new Date(b.registered),
    },
    { key: 'role', _style: { width: '20%' } },
    'status',
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
  ]

  const items = [
    {
      id: 1,
      name: 'Samppa Nori',
      avatar: '1.jpg',
      registered: '2021/03/01',
      role: 'Member',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Estavan Lykos',
      avatar: '2.jpg',
      registered: '2018/02/07',
      role: 'Staff',
      status: 'Banned',
    },
    {
      id: 3,
      name: 'Chetan Mohamed',
      avatar: '3.jpg',
      registered: '2020/01/15',
      role: 'Admin',
      status: 'Inactive',
      _selected: true,
    },
    {
      id: 4,
      name: 'Derick Maximinus',
      avatar: '4.jpg',
      registered: '2019/04/05',
      role: 'Member',
      status: 'Pending',
    },
    {
      id: 5,
      name: 'Friderik Dávid',
      avatar: '5.jpg',
      registered: '2022/03/25',
      role: 'Staff',
      status: 'Active',
    },
    {
      id: 6,
      name: 'Yiorgos Avraamu',
      avatar: '6.jpg',
      registered: '2017/01/01',
      role: 'Member',
      status: 'Active',
    },
    {
      id: 7,
      name: 'Avram Tarasios',
      avatar: '7.jpg',
      registered: '2016/02/12',
      role: 'Staff',
      status: 'Banned',
      _selected: true,
    },
    {
      id: 8,
      name: 'Quintin Ed',
      avatar: '8.jpg',
      registered: '2023/01/21',
      role: 'Admin',
      status: 'Inactive',
    },
    {
      id: 9,
      name: 'Enéas Kwadwo',
      avatar: '9.jpg',
      registered: '2024/03/10',
      role: 'Member',
      status: 'Pending',
    },
    {
      id: 10,
      name: 'Agapetus Tadeáš',
      avatar: '10.jpg',
      registered: '2015/01/10',
      role: 'Staff',
      status: 'Active',
    },
    {
      id: 11,
      name: 'Carwyn Fachtna',
      avatar: '11.jpg',
      registered: '2014/04/01',
      role: 'Member',
      status: 'Active',
    },
    {
      id: 12,
      name: 'Nehemiah Tatius',
      avatar: '12.jpg',
      registered: '2013/01/05',
      role: 'Staff',
      status: 'Banned',
      _selected: true,
    },
    {
      id: 13,
      name: 'Ebbe Gemariah',
      avatar: '13.jpg',
      registered: '2012/02/25',
      role: 'Admin',
      status: 'Inactive',
    },
    {
      id: 14,
      name: 'Eustorgios Amulius',
      avatar: '14.jpg',
      registered: '2011/03/19',
      role: 'Member',
      status: 'Pending',
    },
    {
      id: 15,
      name: 'Leopold Gáspár',
      avatar: '15.jpg',
      registered: '2010/02/01',
      role: 'Staff',
      status: 'Active',
    },
  ]

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="p-3">

      {/* Header */}

      {/* <CRow className="mb-4 align-items-center justify-content-between px-2 py-3 bg-white shadow-sm rounded-3">
        <CCol xs="auto">
          <CButton color="light" variant="ghost" onClick={handleGoBack} className="d-flex align-items-center gap-1">
            <CIcon icon={cilArrowLeft} />
            <span className="fw-medium">Back</span>
          </CButton>
        </CCol>
        <CCol className="text-end">
          <h3 className="mb-0 fw-semibold text-primary">🎓 Colleges List</h3>
        </CCol>
      </CRow> */}

      <CRow className="align-items-center mb-4 px-3 py-3 bg-light border rounded-4 shadow-sm">
        <CCol xs="auto">
          <CButton
            color="secondary"
            variant="outline"
            shape="rounded-pill"
            className="d-flex align-items-center gap-2 px-3 py-2 fw-semibold"
            onClick={handleGoBack}
          >
            <CIcon icon={cilArrowLeft} size="sm" />
            <span>Back</span>
          </CButton>
        </CCol>
        <CCol>
          <h2 className="mb-0 fw-bold text-dark">🎓 Colleges List</h2>
          <p className="text-muted mb-0 fs-15">Manage and review college information easily</p>
        </CCol>
        <CCol xs="auto">
          <Link
            to="/college-configuration/create"
            className="custom-add-btn rounded-pill d-flex align-items-center gap-2 px-4 py-2 fw-semibold shadow-sm text-decoration-none"
          >
            <FaPlus className="fs-5 text-white" />
            <span>Add New</span>
          </Link>
        </CCol>

      </CRow>

      {/* <CRow
        className="align-items-center mb-4 px-4 py-4 bg-white border rounded-4 shadow-lg position-relative"
        style={{
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(200, 200, 200, 0.3)',
        }}
      >
        <CCol xs="auto">
          <CButton
            color="dark"
            variant="ghost"
            shape="rounded-pill"
            className="d-flex align-items-center gap-2 px-3 py-2 fw-medium"
            onClick={handleGoBack}
          >
            <CIcon icon={cilArrowLeft} size="lg" className="opacity-75" />
            <span className="fs-6">Back</span>
          </CButton>
        </CCol>
        <CCol>
          <h1 className="mb-1 fw-bold text-dark">🎓 Colleges Dashboard</h1>
          <p className="text-muted mb-0 fs-6">View and manage all listed colleges</p>
        </CCol>
        <CCol xs="auto">
          <CButton color="primary" className="rounded-pill px-4 py-2 fw-semibold shadow-sm">
            + Add New
          </CButton>
        </CCol>
      </CRow> */}

      {/* smart table */}
      <CSmartTable
        columns={columns}
        items={items}
        columnFilter
        columnSorter
        // footer
        pagination
        itemsPerPage={10}
        itemsPerPageSelect
        clickableRows
        // tableFilter
        // cleaner
        selectable
        activePage={1}
        // sorterValue={{ column: 'status', state: 'asc' }}
        tableProps={{
          className: 'add-this-custom-class',
          responsive: true,
          striped: true,
          hover: true,
        }}
        tableBodyProps={{
          className: 'align-middle',
        }}
        scopedColumns={{
          avatar: (item) => (
            <td>
              <CAvatar src={`../../images/avatars/${item.avatar}`} />
            </td>
          ),
          registered: (item) => {
            const date = new Date(item.registered)
            return (
              <td>
                {date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </td>
            )
          },
          status: (item) => (
            <td>
              <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
            </td>
          ),
          show_details: (item) => (
            <td className="py-2">
              <CButton
                color="primary"
                variant="outline"
                shape="square"
                size="sm"
                onClick={() => toggleDetails(item.id)}
              >
                {details.includes(item.id) ? 'Hide' : 'Show'}
              </CButton>
            </td>
          ),
          details: (item) => (
            <CCollapse visible={details.includes(item.id)}>
              <div className="p-3">
                <h4>{item.name}</h4>
                <p className="text-body-secondary">
                  User since: {item.registered}
                </p>
                <CButton size="sm" color="info">
                  User Settings
                </CButton>
                <CButton size="sm" color="danger" className="ms-1">
                  Delete
                </CButton>
              </div>
            </CCollapse>
          ),
        }}
      />
    </div>
  )
}

export default Colleges
