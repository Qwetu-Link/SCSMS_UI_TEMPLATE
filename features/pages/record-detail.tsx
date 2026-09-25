"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Building2,
  Download,
  FileBarChart2,
  Gauge,
  MapPinned,
  Pencil,
  Trash2,
  UserCog,
  Users,
} from "lucide-react";
import { useAcademicYear } from "@/features/academic-years/academic-year-context";
import { ConfirmDeleteDialog } from "@/features/ui/confirm-delete-dialog";
import StatusBadge from "@/features/ui/status-badge";
import { DetailTabs } from "@/features/pages/detail-tabs";
import {
  getRabaiWardInfo,
  getRabaiSchoolsByWard,
  rabaiSchoolYears,
} from "@/seeders/rabai-schools";
import { getReportDetail } from "@/seeders/reports";

export function RecordDetail({
  active,
  item,
  onBack,
}: {
  active: string;
  item: string;
  onBack: () => void;
}) {
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { currentAcademicYear } = useAcademicYear();
  const reportDetail = active === "Reports" ? getReportDetail(item) : null;
  const wardSchools = active === "Ward" ? getRabaiSchoolsByWard(item) : [];
  const wardSchoolIds = new Set(wardSchools.map((school) => school.id));
  const wardYearRows = rabaiSchoolYears.filter(
    (record) =>
      record.academicYearId === currentAcademicYear.id &&
      wardSchoolIds.has(record.schoolId),
  );
  const wardLearners = wardYearRows.reduce(
    (sum, record) => sum + record.studentCount,
    0,
  );
  const wardStaff = wardYearRows.reduce(
    (sum, record) => sum + record.teacherCount,
    0,
  );
  const wardInfo = active === "Ward" ? getRabaiWardInfo(item) : null;
  const wardCode =
    wardInfo?.wardCode ??
    item
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const Icon =
    active === "Staff"
      ? UserCog
      : active === "Enrollment"
        ? Users
        : active === "Infrastructure"
          ? Building2
          : active === "School Performance"
             ? Gauge
             : active === "Reports"
                ? FileBarChart2
                : active === "Ward"
                  ? MapPinned
                  : BookOpen;

  const fields =
    active === "Staff"
      ? [
          ["Staff ID", "STF-012"],
          ["Full name", item],
          ["Designation", "Teacher"],
          ["Employment type", "Permanent"],
          ["Assigned school", "Mwangaza Primary School"],
          ["Status", "Active"],
        ]
      : active === "Enrollment"
        ? [
            ["School", item],
            [
              "School type",
              item.includes("Junior")
                ? "Junior"
                : item.includes("Senior")
                  ? "Senior / Secondary"
                  : "Primary",
            ],
            [
              "Coverage",
              item.includes("Junior")
                ? "Grade 7-9"
                : item.includes("Senior")
                  ? "Grade 10-13"
                  : "PP1-PP3 / Grade 1-6",
            ],
            [
              "Learners",
              item.includes("Mwangaza")
                ? "642"
                : item.includes("Bahari")
                  ? "518"
                  : item.includes("Kijani")
                    ? "836"
                    : "412",
            ],
            [
              "Boys",
              item.includes("Mwangaza")
                ? "326"
                : item.includes("Bahari")
                  ? "264"
                  : item.includes("Kijani")
                    ? "421"
                    : "205",
            ],
            [
              "Girls",
              item.includes("Mwangaza")
                ? "316"
                : item.includes("Bahari")
                  ? "254"
                  : item.includes("Kijani")
                    ? "415"
                    : "207",
            ],
            [
              "Updated",
              item.includes("Mwangaza") || item.includes("Bahari")
                ? "Today"
                : item.includes("Kijani")
                  ? "Yesterday"
                  : "2 days ago",
            ],
          ]
        : active === "Infrastructure"
          ? [
              ["School", item],
              ["Classrooms", "18 total"],
              ["Good condition", "14"],
              ["Needs repair", "3"],
              ["Electricity", "Yes"],
              ["Water", "Yes"],
              ["Internet", "Available"],
            ]
          : active === "School Contacts"
            ? [
                ["School", item],
                ["Contact name", "John Kamau"],
                ["Role", "Head Teacher"],
                ["Phone", "+254 700 000 012"],
                ["Email", "contact@school.example"],
                ["Status", "Active"],
              ]
          : active === "School Performance"
            ? [
                ["School", item],
                ["Level", "Primary"],
                ["KNEC Code", "04122123"],
                ["Exam Canditature", "50"],
                ["Mean Score", "9.30"],
                ["Subjects", "12"],
                ["Year", "2026"],
              ]
            : active === "Ward"
              ? [
                  ["Ward", item],
                  ["Ward code", wardCode],
                  ["County", wardInfo?.county ?? "Kilifi"],
                  ["County code", wardInfo?.countyCode ?? "003"],
                  ["Sub-County", wardInfo?.subCounty ?? "Rabai"],
                  ["Sub-County code", wardInfo?.subCountyCode ?? "014"],
                  ["Constituency", wardInfo?.constituency ?? "Rabai"],
                  ["Constituency code", wardInfo?.constituencyCode ?? "014"],
                  ["Academic year", currentAcademicYear.name],
                  ["Status", "Active"],
                  ["Schools", wardSchools.length.toLocaleString()],
                  ["Learners", wardLearners.toLocaleString()],
                  ["Staff", wardStaff.toLocaleString()],
                  [
                    "Public schools",
                    wardSchools
                      .filter((school) => school.ownershipType === "PUBLIC")
                      .length.toLocaleString(),
                  ],
                  [
                    "Private schools",
                    wardSchools
                      .filter((school) => school.ownershipType === "PRIVATE")
                      .length.toLocaleString(),
                  ],
                  [
                    "Primary schools",
                    wardSchools
                      .filter((school) => school.institutionType === "PRIMARY")
                      .length.toLocaleString(),
                  ],
                  [
                    "Junior secondary schools",
                    wardSchools
                      .filter(
                        (school) =>
                          school.institutionType === "JUNIOR_SECONDARY",
                      )
                      .length.toLocaleString(),
                  ],
                  [
                    "Senior schools",
                    wardSchools
                      .filter(
                        (school) =>
                          school.institutionType === "SENIOR_SECONDARY",
                      )
                      .length.toLocaleString(),
                  ],
                  ["Notes", "Ward-level Rabai school coverage record"],
                ]
              : [
                  ["Report code", reportDetail?.code ?? "RPT-000"],
                  ["Report type", reportDetail?.title ?? item],
                  ["Category", reportDetail?.category ?? "Operational"],
                  [
                    "Reporting period",
                    reportDetail?.reportingPeriod ?? "Academic Year 2026",
                  ],
                  [
                    "Records included",
                    reportDetail?.recordsIncluded ?? "128 schools",
                  ],
                  [
                    "Last generated",
                    reportDetail?.lastGenerated ?? "18 September 2026",
                  ],
                  [
                    "Owner",
                    reportDetail?.owner ?? "Sub-County Education Office",
                  ],
                  ["Status", reportDetail?.status ?? "Ready for export"],
                ];

  return (
    <div className="content">
      {showDeleteModal && (
        <ConfirmDeleteDialog
          item={item}
          confirmCode={active === "Ward" ? wardCode : item}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={onBack}
        />
      )}
      <div className="breadcrumbs profile-crumb">
        <button onClick={onBack}>{active}</button>
        <span>/</span>
        <span>View details</span>
      </div>
      <div className="profile-head">
        <div className="profile-title">
          <div className="profile-school-icon">
            <Icon />
          </div>
          <div>
            <div className="profile-code">
              {active === "Staff"
                ? "STF-012"
                : active === "Enrollment"
                  ? "ENR-2026-004"
                  : active === "School Performance"
                    ? "04122123"
                    : active === "Ward"
                      ? wardCode
                      : active === "Reports"
                        ? (reportDetail?.code ?? "RPT-000")
                        : "SC-SMS RECORD"}
            </div>
            <h1>{item}</h1>
            <div className="profile-sub">
              <span>{active}</span>
              <i />
              <StatusBadge status="Active" />
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button
            className="outline-button"
            onClick={() => window.alert("Export prepared for download")}
          >
            <Download /> Export
          </button>
          {active !== "Enrollment" && (
            <Button
              className="edit-record-button"
              onClick={() =>
              active === "School Performance"
                ? window.dispatchEvent(
                    new CustomEvent("scsms-performance-dialog", {
                      detail: { mode: "edit", item },
                    }),
                  )
                : window.dispatchEvent(
                    new CustomEvent("scsms-edit-record", {
                      detail: { active, item },
                    }),
                  )
            }
            >
              <Pencil data-icon="inline-start" />
              Edit {active === "Reports" ? "Report" : "Record"}
            </Button>
          )}
          {(active === "Ward" || active === "Staff") && (
            <button
              className="danger-button"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 />
              Delete
            </button>
          )}
        </div>
      </div>
      <DetailTabs active={active} item={item} onTabChange={setSelectedTab} />
      {active !== "School Performance" && (
        <div
          className={`profile-grid ${selectedTab === "Overview" ? "" : "enrollment-overview-hidden"}`}
        >
          <section className="panel detail-panel">
            <div className="panel-header">
              <div>
                <h2>Record information</h2>
                <p>Official {active.toLowerCase()} details</p>
              </div>
            </div>
            <dl className="detail-list">
              {fields.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      )}
    </div>
  );
}
