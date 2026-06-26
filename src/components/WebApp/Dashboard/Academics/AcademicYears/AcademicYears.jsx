import React from "react";
import CrudTable from "../CrudTable/CrudTable";
import styles from "./AcademicYears.module.css";
import {
  listAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} from "@/services/academic/academicService";

const AcademicYears = () => {
  return (
    <CrudTable
      title="Academic Year"
      subtitle="Manage your institution's academic years"
      columns={[
        { key: "name",       label: "Name" },
        { key: "start_date", label: "Start" },
        { key: "end_date",   label: "End" },
        { key: "is_active",  label: "Status", render: r => (
          <span className={`${styles.badge} ${r.is_active ? styles.badgeSuccess : styles.badgeDefault}`}>
            {r.is_active ? "Active" : "Inactive"}
          </span>
        )},
      ]}
      listFn={listAcademicYears}
      createFn={createAcademicYear}
      updateFn={updateAcademicYear}
      deleteFn={deleteAcademicYear}
      fields={[
        { key: "name",       label: "Name",       required: true, placeholder: "2025/2026" },
        { key: "start_date", label: "Start Date", type: "date",   required: true },
        { key: "end_date",   label: "End Date",   type: "date",   required: true },
        { key: "is_active",  label: "Active",     type: "checkbox" },
      ]}
      toFormData={item => item
        ? { name: item.name, start_date: item.start_date, end_date: item.end_date, is_active: item.is_active }
        : { name: "", start_date: "", end_date: "", is_active: false }
      }
      filters={[
        { key: "is_active", label: "Status", options: [{value: "true", label: "Active"}, {value: "false", label: "Inactive"}], filterKey: "is_active" },
      ]}
    />
  );
};

export default AcademicYears;
