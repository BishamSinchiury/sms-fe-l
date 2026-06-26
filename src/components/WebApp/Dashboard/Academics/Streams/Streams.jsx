import React from "react";
import CrudTable from "../CrudTable/CrudTable";
import {
  listStreams,
  createStream,
  updateStream,
  deleteStream,
} from "@/services/academic/academicService";

const Streams = ({ schoolLevels = [] }) => {
  const levelOpts = schoolLevels.map(l => ({ value: l.id, label: l.name_display }));

  return (
    <CrudTable
      title="Stream"
      subtitle="Academic streams tied to a school level (e.g. Science, Management)"
      columns={[
        { key: "name",       label: "Name" },
        { key: "short",      label: "Short" },
        { key: "level_name", label: "School Level" },
        { key: "is_active",  label: "Active", render: r => r.is_active ? "Yes" : "No" },
      ]}
      listFn={listStreams}
      createFn={createStream}
      updateFn={updateStream}
      deleteFn={deleteStream}
      fields={[
        { key: "name",      label: "Name",         required: true,  placeholder: "Science" },
        { key: "short",     label: "Short",        required: true,  placeholder: "SCI" },
        { key: "level_id",  label: "School Level", type: "select",  required: true, options: levelOpts },
        { key: "is_active", label: "Active",       type: "checkbox" },
      ]}
      toFormData={item => item
        ? { name: item.name ?? "", short: item.short ?? "", level_id: item.level_id ?? "", is_active: item.is_active ?? true }
        : { name: "", short: "", level_id: "", is_active: true }
      }
      filters={[
        { key: "level_name", label: "Level",  type: "searchable", options: levelOpts.map(l => ({ value: l.label, label: l.label })) },
        { key: "is_active",  label: "Active", options: [{ value: "true", label: "Yes" }, { value: "false", label: "No" }] },
      ]}
    />
  );
};

export default Streams;
