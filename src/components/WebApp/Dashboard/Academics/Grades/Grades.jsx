import React from "react";
import CrudTable from "../CrudTable/CrudTable";
import {
  listGrade,
  createGrade,
  updateGrade,
  deleteGrade,
} from "@/services/academic/academicService";

const GRADE_CHOICES = [
  { value: "preschool", label: "Preschool" },
  { value: "nursery",   label: "Nursery" },
  { value: "lkg",       label: "LKG" },
  { value: "ukg",       label: "UKG" },
  { value: "1",         label: "Grade 1" },
  { value: "2",         label: "Grade 2" },
  { value: "3",         label: "Grade 3" },
  { value: "4",         label: "Grade 4" },
  { value: "5",         label: "Grade 5" },
  { value: "6",         label: "Grade 6" },
  { value: "7",         label: "Grade 7" },
  { value: "8",         label: "Grade 8" },
  { value: "9",         label: "Grade 9" },
  { value: "10",        label: "Grade 10" },
  { value: "11",        label: "Grade 11" },
  { value: "12",        label: "Grade 12" },
];

const Grades = ({ schoolLevels = [] }) => {
  const levelOpts = schoolLevels.map(l => ({ value: l.id, label: l.name_display }));

  return (
    <CrudTable
      title="Grade"
      subtitle="School grades seeded per organization (e.g. Grade 1, LKG)"
      columns={[
        { key: "order",        label: "Order" },
        { key: "name_display", label: "Name" },
        { key: "short",        label: "Short" },
        { key: "level_name",   label: "Level" },
        { key: "duration",     label: "Duration (mo)" },
        { key: "is_active",    label: "Active", render: r => r.is_active ? "Yes" : "No" },
      ]}
      listFn={listGrade}
      createFn={createGrade}
      updateFn={updateGrade}
      deleteFn={deleteGrade}
      fields={[
        { key: "name",      label: "Name",          type: "select",   required: true, options: GRADE_CHOICES },
        { key: "short",     label: "Short",          required: true,  placeholder: "G1" },
        { key: "level",     label: "Level",          type: "select",  required: true, options: levelOpts },
        { key: "order",     label: "Order",          type: "number",  required: true, placeholder: "1" },
        { key: "duration",  label: "Duration (mo)",  type: "number",  placeholder: "12" },
        { key: "is_active", label: "Active",         type: "checkbox" },
      ]}
      toFormData={item => item
        ? {
            name:      item.name      ?? "",
            short:     item.short     ?? "",
            level:     item.level     ?? "",
            order:     item.order     ?? "",
            duration:  item.duration  ?? 12,
            is_active: item.is_active ?? true,
          }
        : { name: "", short: "", level: "", order: "", duration: 12, is_active: true }
      }
      filters={[
        { key: "level_name", label: "Level",  options: levelOpts.map(l => ({ value: l.label, label: l.label })) },
        { key: "is_active",  label: "Active", options: [{ value: "true", label: "Yes" }, { value: "false", label: "No" }] },
      ]}
    />
  );
};

export default Grades;