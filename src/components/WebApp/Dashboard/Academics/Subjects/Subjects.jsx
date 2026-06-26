import React from "react";
import CrudTable from "../CrudTable/CrudTable";
import {
  listSubjects,
  createSubject,
  updateSubject,
} from "@/services/academic/academicService";

const Subjects = () => {
  return (
    <CrudTable
      title="Subject"
      subtitle="Org-scoped subjects used across semesters and grade configs (e.g. ENG-101 — English)"
      columns={[
        { key: "code",             label: "Code" },
        { key: "name",             label: "Name" },
        { key: "book_publication", label: "Publication", render: r => r.book_publication || "—" },
        { key: "is_active",        label: "Active", render: r => r.is_active ? "Yes" : "No" },
      ]}
      listFn={listSubjects}
      createFn={createSubject}
      updateFn={updateSubject}
      deleteFn={null}
      fields={[
        { key: "code",             label: "Code",        required: true,  placeholder: "ENG-101" },
        { key: "name",             label: "Name",        required: true,  placeholder: "English" },
        { key: "book_publication", label: "Publication", required: false, placeholder: "Publisher / book title (optional)" },
        { key: "is_active",        label: "Active",      type: "checkbox" },
      ]}
      toFormData={item => item
        ? {
            code:             item.code             ?? "",
            name:             item.name             ?? "",
            book_publication: item.book_publication ?? "",
            is_active:        item.is_active        ?? true,
          }
        : { code: "", name: "", book_publication: "", is_active: true }
      }
      filters={[
        { key: "is_active", label: "Active", options: [{ value: "true", label: "Yes" }, { value: "false", label: "No" }] },
      ]}
    />
  );
};

export default Subjects;
