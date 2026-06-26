import React, { useState, useEffect } from "react";
import styles from "./AcademicSection.module.css";
import {
  FiCalendar, FiBook, FiLayers, FiGrid,
  FiGitBranch, FiClipboard, FiLink, FiLayout,
} from "react-icons/fi";

import {
  listUniversityLevels,
  listSchoolLevels,
  listPrograms,
  listStreams,
  listGrade,
  listSemesters,
  listSubjects,
} from "@/services/academic/academicService";

// Subcomponents
import AcademicYears    from "@/components/WebApp/Dashboard/Academics/AcademicYears/AcademicYears";
import Levels           from "@/components/WebApp/Dashboard/Academics/Levels/Levels";
import Programs         from "@/components/WebApp/Dashboard/Academics/Programs/Programs";
import Grades           from "@/components/WebApp/Dashboard/Academics/Grades/Grades";
import Semesters        from "@/components/WebApp/Dashboard/Academics/Semesters/Semesters";
import Streams          from "@/components/WebApp/Dashboard/Academics/Streams/Streams";
import Subjects         from "@/components/WebApp/Dashboard/Academics/Subjects/Subjects";
import ClassSubjectConfigs from "@/components/WebApp/Dashboard/Academics/ClassSubjectConfigs/ClassSubjectConfigs";

const TABS = [
  { key: "years",             label: "Academic Years",    icon: <FiCalendar /> },
  { key: "levels",            label: "Levels",            icon: <FiLayers /> },
  { key: "programs",          label: "Programs",          icon: <FiBook /> },
  { key: "grades",            label: "Grade",             icon: <FiGrid /> },
  { key: "semesters",         label: "Semesters",         icon: <FiGrid /> },
  { key: "streams",           label: "Streams",           icon: <FiGitBranch /> },
  { key: "subjects",          label: "Subjects",          icon: <FiClipboard /> },
  { key: "classconfigs",      label: "Class Configs",     icon: <FiLayout /> },
];

const AcademicSection = () => {
  const [activeTab, setActiveTab]       = useState("years");
  const [uniLevels, setUniLevels]       = useState([]);
  const [schoolLevels, setSchoolLevels] = useState([]);
  const [programs, setPrograms]         = useState([]);
  const [streams, setStreams]           = useState([]);
  const [grades, setGrades]             = useState([]);
  const [semesters, setSemesters]       = useState([]);
  const [subjects, setSubjects]         = useState([]);

  useEffect(() => {
    listUniversityLevels().then(d => setUniLevels(Array.isArray(d) ? d : [])).catch(() => {});
    listSchoolLevels().then(d => setSchoolLevels(Array.isArray(d) ? d : [])).catch(() => {});
    listPrograms().then(d => setPrograms(Array.isArray(d) ? d : [])).catch(() => {});
    listStreams().then(d => setStreams(Array.isArray(d) ? d : [])).catch(() => {});
    listGrade().then(d => setGrades(Array.isArray(d) ? d : [])).catch(() => {});
    listSemesters().then(d => setSemesters(Array.isArray(d) ? d : [])).catch(() => {});
    listSubjects().then(d => setSubjects(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const programOpts  = programs.map(p  => ({ value: p.id,    label: p.name }));
  const streamOpts   = streams.map(s   => ({ value: s.id,    label: s.name }));
  const gradeOpts    = grades.map(g    => ({ value: g.id,    label: g.name_display ?? g.name }));
  const semOpts      = semesters.map(s => ({ value: s.id,    label: `${s.program_name} — ${s.name}` }));
  const subjectOpts  = subjects.map(s  => ({ value: s.id,    label: `${s.code} — ${s.name}` }));

  return (
    <div>
      <div className={styles.tabBar}>
        {TABS.map(t => (
          <button
            key={t.key}
            className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {activeTab === "years"        && <AcademicYears />}
      {activeTab === "levels"       && <Levels />}
      {activeTab === "programs"     && <Programs uniLevels={uniLevels} />}
      {activeTab === "grades"       && <Grades schoolLevels={schoolLevels} />}
      {activeTab === "semesters" && (
        <Semesters programOpts={programOpts} subjectOpts={subjectOpts} />
      )}
      {activeTab === "streams"      && <Streams schoolLevels={schoolLevels} />}
      {activeTab === "subjects"     && <Subjects />}
      {activeTab === "classconfigs" && (
        <ClassSubjectConfigs
          gradeOpts={gradeOpts}
          streamOpts={streamOpts}
          subjectOpts={subjectOpts}
        />
      )}
    </div>
  );
};

export default AcademicSection;