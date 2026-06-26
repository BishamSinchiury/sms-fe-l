import React from "react";
import CrudTable from "../CrudTable/CrudTable";
import {
  listUniversityLevels,
  updateUniversityLevel,
} from "@/services/academic/academicService";

const STATUS_OPTS = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];

const UniversityLevels = () => {
  return (
    <CrudTable
      title="University Level"
      subtitle="Seed-defined levels for higher education (Diploma, Bachelors, Masters, PhD). Levels are managed by superusers — only order and status can be adjusted here."
      columns={[
        { key: "name",      label: "Name" },
        { key: "order",     label: "Order" },
        { key: "is_active", label: "Status", render: v => (v ? "Active" : "Inactive") },
      ]}
      listFn={listUniversityLevels}
      updateFn={updateUniversityLevel}
      fields={[
        { key: "name",      label: "Name",   disabled: true },
        { key: "order",     label: "Order",  type: "number", required: true, placeholder: "1" },
        { key: "is_active", label: "Status", type: "select", required: true, options: STATUS_OPTS },
      ]}
      toFormData={item => item
        ? { name: item.name, order: item.order, is_active: item.is_active }
        : { name: "", order: "", is_active: true }
      }
    />
  );
};

export default UniversityLevels;