
import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CSpinner,
  CBadge,
  CFormInput,
  CFormSelect,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CPagination,
  CPaginationItem,
} from "@coreui/react";

import {
  FaWhatsapp,
  FaPaperPlane,
  FaCheckCircle,
  FaEye,
  FaTimesCircle,
  FaSearch,
} from "react-icons/fa";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const CAMPAIGN_NAME =
    "upsc_orientation_may31";

  const PAGE_SIZE = 10;

  const [isLoading, setIsLoading] =
    useState(false);

  const [campaignData, setCampaignData] =
    useState([]);

  const [summary, setSummary] =
    useState({});

  const [pagination, setPagination] =
    useState({});

  const [searchText, setSearchText] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [page, setPage] =
    useState(0);

  const fetchCampaignAnalytics =
    async (currentPage = 0) => {
      try {
        setIsLoading(true);

        const BASE_URL =
          process.env
            .REACT_APP_recommendServiceURL;

        const response =
          await axios.get(
            `${BASE_URL}/analytics/campaign/${CAMPAIGN_NAME}?page=${currentPage}&size=${PAGE_SIZE}`
          );

        setCampaignData(
          response?.data?.data || []
        );

        setSummary(
          response?.data?.summary || {}
        );

        setPagination(
          response?.data?.pagination || {}
        );
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchCampaignAnalytics(page);
  }, [page]);

  const getStatusColor = (
    status
  ) => {
    switch (status) {
      case "DELIVERED":
        return "success";
      case "FAILED":
        return "danger";
      case "READ":
        return "info";
      case "SENT":
        return "primary";
      default:
        return "secondary";
    }
  };

  const filteredData =
    campaignData.filter((item) => {
      const matchesSearch =
        item?.name
          ?.toLowerCase()
          ?.includes(
            searchText.toLowerCase()
          ) ||
        item?.phone?.includes(
          searchText
        );

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : item?.status ===
            statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  const chartData = {
    labels: [
      "Sent",
      "Delivered",
      "Read",
      "Failed",
    ],
    datasets: [
      {
        data: [
          summary?.sent || 0,
          summary?.delivered || 0,
          summary?.read || 0,
          summary?.failed || 0,
        ],
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#06b6d4",
          "#ef4444",
        ],
        borderWidth: 0,
      },
    ],
  };

  const deliveryRate =
    summary?.sent > 0
      ? (
          (summary.delivered /
            summary.sent) *
          100
        ).toFixed(1)
      : 0;

  const readRate =
    summary?.delivered > 0
      ? (
          (summary.read /
            summary.delivered) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="container-fluid p-4">
      {/* HEADER */}

      <CCard
        className="border-0 shadow mb-4"
        style={{
          borderRadius: "20px",
          background:
            "linear-gradient(135deg,#25D366,#128C7E)",
        }}
      >
        <CCardBody className="text-white p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-2">
                WhatsApp Campaign Analytics
              </h2>

              <div>
                Campaign :
                {" "}
                {CAMPAIGN_NAME}
              </div>
            </div>

            <FaWhatsapp
              size={60}
            />
          </div>
        </CCardBody>
      </CCard>

      {/* KPI */}

      <CRow className="g-4 mb-4">
        {[
          {
            title: "Total",
            value:
              summary?.total || 0,
            icon:
              <FaWhatsapp />,
            color:
              "#6366f1",
          },
          {
            title: "Sent",
            value:
              summary?.sent || 0,
            icon:
              <FaPaperPlane />,
            color:
              "#3b82f6",
          },
          {
            title: "Delivered",
            value:
              summary?.delivered ||
              0,
            icon:
              <FaCheckCircle />,
            color:
              "#22c55e",
          },
          {
            title: "Read",
            value:
              summary?.read || 0,
            icon: <FaEye />,
            color:
              "#06b6d4",
          },
          {
            title: "Failed",
            value:
              summary?.failed ||
              0,
            icon:
              <FaTimesCircle />,
            color:
              "#ef4444",
          },
        ].map((item) => (
          <CCol
            lg={2}
            md={4}
            sm={6}
            key={item.title}
          >
            <CCard className="border-0 shadow-sm h-100">
              <CCardBody>
                <div className="d-flex justify-content-between">
                  <div>
                    <small className="text-muted">
                      {item.title}
                    </small>

                    <h3
                      className="fw-bold mt-2"
                      style={{
                        color:
                          item.color,
                      }}
                    >
                      {item.value}
                    </h3>
                  </div>

                  <div
                    style={{
                      width: 55,
                      height: 55,
                      borderRadius: 15,
                      background:
                        `${item.color}20`,
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      color:
                        item.color,
                      fontSize: 22,
                    }}
                  >
                    {item.icon}
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* ANALYTICS */}

      <CRow className="g-4 mb-4">
        <CCol lg={4}>
          <CCard className="border-0 shadow-sm">
            <CCardBody>
              <h5 className="fw-bold mb-4">
                Campaign Overview
              </h5>

              <Doughnut
                data={chartData}
              />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={8}>
          <CCard className="border-0 shadow-sm h-100">
            <CCardBody>
              <h5 className="fw-bold mb-4">
                Performance Metrics
              </h5>

              <div className="d-flex justify-content-between py-3 border-bottom">
                <span>
                  Delivery Rate
                </span>
                <strong>
                  {
                    deliveryRate
                  }
                  %
                </strong>
              </div>

              <div className="d-flex justify-content-between py-3 border-bottom">
                <span>
                  Read Rate
                </span>
                <strong>
                  {readRate}%
                </strong>
              </div>

              <div className="d-flex justify-content-between py-3">
                <span>
                  Total Records
                </span>
                <strong>
                  {pagination?.totalRecords ||
                    0}
                </strong>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* FILTER */}

      <CCard className="border-0 shadow-sm mb-4">
        <CCardBody>
          <CRow className="g-3">
            <CCol md={8}>
              <div className="position-relative">
                <FaSearch
                  style={{
                    position:
                      "absolute",
                    left: 15,
                    top: 14,
                    color:
                      "#6b7280",
                  }}
                />

                <CFormInput
                  className="ps-5"
                  placeholder="Search Name / Phone"
                  value={
                    searchText
                  }
                  onChange={(e) =>
                    setSearchText(
                      e.target
                        .value
                    )
                  }
                />
              </div>
            </CCol>

            <CCol md={4}>
              <CFormSelect
                value={
                  statusFilter
                }
                onChange={(e) =>
                  setStatusFilter(
                    e.target
                      .value
                  )
                }
              >
                <option value="ALL">
                  All Status
                </option>
                <option value="SENT">
                  Sent
                </option>
                <option value="DELIVERED">
                  Delivered
                </option>
                <option value="READ">
                  Read
                </option>
                <option value="FAILED">
                  Failed
                </option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* TABLE */}

      <CCard className="border-0 shadow-sm">
        <CCardBody>
          {isLoading ? (
            <div className="text-center py-5">
              <CSpinner />
            </div>
          ) : (
            <>
              <CTable
                hover
                responsive
                align="middle"
              >
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>
                      Name
                    </CTableHeaderCell>
                    <CTableHeaderCell>
                      Phone
                    </CTableHeaderCell>
                    <CTableHeaderCell>
                      Status
                    </CTableHeaderCell>
                    <CTableHeaderCell>
                      Purpose
                    </CTableHeaderCell>
                    <CTableHeaderCell>
                      Failure
                    </CTableHeaderCell>
                    <CTableHeaderCell>
                      Updated
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {filteredData.map(
                    (
                      item,
                      index
                    ) => (
                      <CTableRow
                        key={
                          index
                        }
                      >
                        <CTableDataCell>
                          {
                            item.name
                          }
                        </CTableDataCell>

                        <CTableDataCell>
                          {
                            item.phone
                          }
                        </CTableDataCell>

                        <CTableDataCell>
                          <CBadge
                            shape="rounded-pill"
                            color={getStatusColor(
                              item.status
                            )}
                          >
                            {
                              item.status
                            }
                          </CBadge>
                        </CTableDataCell>

                        <CTableDataCell>
                          {
                            item.messagePurpose
                          }
                        </CTableDataCell>

                        <CTableDataCell>
                          {item.failedReason ||
                            "-"}
                        </CTableDataCell>

                        <CTableDataCell>
                          {item.updateTime
                            ? new Date(
                                item.updateTime
                              ).toLocaleString()
                            : "-"}
                        </CTableDataCell>
                      </CTableRow>
                    )
                  )}
                </CTableBody>
              </CTable>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <strong>
                  Total :
                  {" "}
                  {pagination?.totalRecords ||
                    0}
                </strong>

                <CPagination>
                  <CPaginationItem
                    disabled={
                      !pagination?.hasPrevious
                    }
                    onClick={() =>
                      setPage(
                        page -
                          1
                      )
                    }
                  >
                    Previous
                  </CPaginationItem>

                  <CPaginationItem active>
                    {page + 1}
                  </CPaginationItem>

                  <CPaginationItem
                    disabled={
                      !pagination?.hasNext
                    }
                    onClick={() =>
                      setPage(
                        page +
                          1
                      )
                    }
                  >
                    Next
                  </CPaginationItem>
                </CPagination>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Dashboard;