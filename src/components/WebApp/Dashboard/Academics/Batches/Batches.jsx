import React from "react";
import CrudTable from "../CrudTable/CrudTable";
import {
  listBatches,
  createBatch,
  updateBatch,
  deleteBatch,
} from "@/services/academic/academicService";

const Batches = ({ gradeOpts }) => {
  return (
    <CrudTable
      title="Batch"
      subtitle="Student cohorts / intakes"
      columns={[
        { key: "name",               label: "Name" },
        { key: "start_year",         label: "Start Year" },
        { key: "expected_end_year",  label: "End Year" },
        { key: "current_grade_name", label: "Current Grade" },
      ]}
      listFn={listBatches}
      createFn={createBatch}
      updateFn={updateBatch}
      deleteFn={deleteBatch}
      fields={[
        { key: "name",                     label: "Name",              required: true, placeholder: "BCA Batch 2025" },
        { key: "start_year",               label: "Start Year",        type: "number", required: true, placeholder: "2025" },
        { key: "expected_end_year",        label: "Expected End Year", type: "number", required: true, placeholder: "2028" },
        { key: "current_grade_level_uuid", label: "Current Grade",     type: "select", options: gradeOpts },
      ]}
      toFormData={item => item
        ? { name: item.name, start_year: item.start_year, expected_end_year: item.expected_end_year, current_grade_level_uuid: item.current_grade_level_uuid || "" }
        : { name: "", start_year: "", expected_end_year: "", current_grade_level_uuid: "" }
      }
      filters={[
        { key: "current_grade_level_uuid", label: "Current Grade", options: gradeOpts, filterKey: "current_grade_level_uuid" },
      ]}
    />
  );
};

export default Batches;
