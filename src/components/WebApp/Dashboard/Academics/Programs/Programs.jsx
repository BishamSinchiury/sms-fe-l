import React from "react";
import CrudTable from "../CrudTable/CrudTable";
import {
  listPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from "@/services/academic/academicService";

const Programs = ({ uniLevels = [] }) => {
  const levelOpts = uniLevels.map(l => ({ value: l.id, label: l.name_display }));

  return (
    <CrudTable
      title="Program"
      subtitle="An org's named offering of a university level (e.g. BCA, Science +2)"
      columns={[
        { key: "name",       label: "Name" },
        { key: "short",      label: "Short" },
        { key: "level_name", label: "Level" },
        { key: "is_active",  label: "Active", render: r => r.is_active ? "Yes" : "No" },
      ]}
      listFn={listPrograms}
      createFn={createProgram}
      updateFn={updateProgram}
      deleteFn={deleteProgram}
      fields={[
        { key: "name",      label: "Name",   required: true, placeholder: "BCA" },
        { key: "short",     label: "Short",  required: true, placeholder: "BCA" },
        { key: "level_id",  label: "Level",  type: "select", required: true, options: levelOpts },
        { key: "is_active", label: "Active", type: "checkbox" },
      ]}
      toFormData={item => item
        ? { name: item.name, short: item.short ?? "", level_id: item.level_id ?? "", is_active: item.is_active ?? true }
        : { name: "", short: "", level_id: "", is_active: true }
      }
      filters={[
        { key: "level_name", label: "Level",  options: levelOpts.map(l => ({ value: l.label, label: l.label })) },
        { key: "is_active",  label: "Active", options: [{ value: "true", label: "Yes" }, { value: "false", label: "No" }] },
      ]}
    />
  );
};

export default Programs;