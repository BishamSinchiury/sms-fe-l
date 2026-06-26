import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./CrudTable.module.css";
import { useNotification } from "@/components/Notification/NotificationContainer";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSearch } from "react-icons/fa";
import CrudModal from "../CrudModal/CrudModal";
import Notify from "@/components/Modal/Notify.jsx";

const CrudTable = ({
  title, subtitle, columns,
  listFn, createFn, updateFn, deleteFn,
  fields, toFormData, fromFormData,
  filters = [],
  rowExtra = null,
}) => {
  const { notify } = useNotification();
  const [items, setItems]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [modal, setModal]               = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  // Searchable filter state
  const [comboText, setComboText]       = useState({});   // { [filterKey]: typed text }
  const [comboOpen, setComboOpen]       = useState(null); // which filter key is open
  const comboRefs                       = useRef({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listFn();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      notify({ type: "error", title: "Error", message: `Failed to load ${title.toLowerCase()}.` });
    } finally {
      setLoading(false);
    }
  }, [listFn, notify, title]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Close combobox on outside click
  useEffect(() => {
    if (!comboOpen) return;
    const handler = (e) => {
      const ref = comboRefs.current[comboOpen];
      if (ref && !ref.contains(e.target)) setComboOpen(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [comboOpen]);

  const selectComboOption = (filterKey, value) => {
    setFilterValues(p => ({ ...p, [filterKey]: value }));
    setComboText(p => ({ ...p, [filterKey]: "" }));
    setComboOpen(null);
  };

  const clearCombo = (filterKey) => {
    setFilterValues(p => ({ ...p, [filterKey]: "" }));
    setComboText(p => ({ ...p, [filterKey]: "" }));
    setComboOpen(null);
  };

  const renderFilter = (f) => {
    if (f.type === "searchable") {
      const selectedLabel = (f.options ?? []).find(o => String(o.value) === String(filterValues[f.key] ?? ""))?.label ?? "";
      const typedText     = comboText[f.key] ?? "";
      const displayText   = comboOpen === f.key ? typedText : selectedLabel;
      const isSelected    = !!filterValues[f.key];
      const matchingOpts  = (f.options ?? []).filter(o =>
        o.label.toLowerCase().includes(typedText.toLowerCase())
      );
      return (
        <div
          key={f.key}
          className={styles.comboWrap}
          ref={el => { comboRefs.current[f.key] = el; }}
        >
          <div
            className={`${styles.comboInput} ${comboOpen === f.key ? styles.comboInputOpen : ""} ${isSelected ? styles.comboInputSelected : ""}`}
            onClick={() => setComboOpen(comboOpen === f.key ? null : f.key)}
          >
            <input
              className={styles.comboTextInput}
              placeholder={`${f.label}: All`}
              value={displayText}
              onChange={e => {
                setComboText(p => ({ ...p, [f.key]: e.target.value }));
                setComboOpen(f.key);
              }}
              onFocus={() => setComboOpen(f.key)}
            />
            {isSelected ? (
              <button
                className={styles.comboClear}
                onMouseDown={e => { e.stopPropagation(); clearCombo(f.key); }}
                aria-label="Clear"
              >
                <FaTimes size={9} />
              </button>
            ) : (
              <span className={styles.comboChevron}>▾</span>
            )}
          </div>
          {comboOpen === f.key && (
            <div className={styles.comboDropdown}>
              {matchingOpts.length === 0 ? (
                <div className={styles.comboNoResults}>No results</div>
              ) : (
                matchingOpts.map(o => (
                  <div
                    key={o.value}
                    className={`${styles.comboOption} ${String(filterValues[f.key]) === String(o.value) ? styles.comboOptionActive : ""}`}
                    onMouseDown={() => selectComboOption(f.key, o.value)}
                  >
                    {o.label}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      );
    }
    // Default plain select
    return (
      <select
        key={f.key}
        className={styles.filterSelect}
        value={filterValues[f.key] || ""}
        onChange={e => setFilterValues(p => ({ ...p, [f.key]: e.target.value }))}
      >
        <option value="">{f.label}: All</option>
        {(f.options ?? []).map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    );
  };

  const handleSave = async (formData) => {
    const payload = fromFormData ? fromFormData(formData) : formData;
    try {
      if (modal.item) {
        await updateFn(modal.item.id ?? modal.item.uuid, payload);
        notify({ type: "success", title: "Updated", message: `${title} updated.` });
      } else {
        await createFn(payload);
        notify({ type: "success", title: "Created", message: `${title} created.` });
      }
      setModal(null);
      fetchData();
    } catch (e) {
      const detail = e?.response?.data;
      const msg = typeof detail === "string"
        ? detail
        : detail?.detail || JSON.stringify(detail) || "Save failed.";
      notify({ type: "error", title: "Error", message: msg });
    }
  };

  const askDelete = (item) => setConfirmDelete(item);

  const cancelDelete = () => {
    if (deleting) return;
    setConfirmDelete(null);
  };

  const confirmDeleteItem = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteFn(confirmDelete.id ?? confirmDelete.uuid);
      notify({ okType: "Delete", title: "Deleted", message: `${title} deleted.` });
      setConfirmDelete(null);
      fetchData();
    } catch (e) {
      notify({ okType: "error", title: "Error", message: e?.response?.data?.detail || "Delete failed." });
    } finally {
      setDeleting(false);
    }
  };

  const filtered = items.filter(item => {
    if (search) {
      const q = search.toLowerCase();
      const match = columns.some(col => {
        const val = typeof col.render === "function" ? "" : String(item[col.key] ?? "");
        return val.toLowerCase().includes(q);
      });
      if (!match) return false;
    }
    for (const f of filters) {
      if (filterValues[f.key] && String(item[f.filterKey ?? f.key]) !== String(filterValues[f.key])) {
        return false;
      }
    }
    return true;
  });

  const openAdd  = () => setModal({ item: null, title: `New ${title}`,  initial: toFormData ? toFormData(null) : {} });
  const openEdit = (item) => setModal({ item, title: `Edit ${title}`, initial: toFormData ? toFormData(item) : item });

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>{title}</h2>
          {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
        </div>
        {createFn && (
          <button className={styles.addBtn} onClick={openAdd}>
            <FaPlus size={10} /> Add {title}
          </button>
        )}
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filterRow}>
          <div className={styles.searchWrap}>
            <FaSearch className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.searchClear} onClick={() => setSearch("")} aria-label="Clear">
                <FaTimes />
              </button>
            )}
          </div>

          {filters.map(f => renderFilter(f))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading…</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map(c => <th key={c.key}>{c.label}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className={styles.empty}>
                    No records found.
                  </td>
                </tr>
              ) : filtered.map(item => (
                <React.Fragment key={item.id ?? item.uuid}>
                  <tr>
                    {columns.map(c => (
                      <td key={c.key}>
                        {c.render ? c.render(item) : (item[c.key] ?? "—")}
                      </td>
                    ))}
                    <td>
                      <div className={styles.actionCell}>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                          onClick={() => openEdit(item)}
                        >
                          <FaEdit size={10} /> Edit
                        </button>
                        {deleteFn && (
                          <button
                            className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                            onClick={() => askDelete(item)}
                          >
                            <FaTrash size={10} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {rowExtra && (
                    <tr>
                      <td colSpan={columns.length + 1} style={{ padding: "0 1.25rem 0.75rem" }}>
                        {rowExtra(item)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <CrudModal
          title={modal.title}
          fields={fields}
          initial={modal.initial}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <Notify
        show={!!confirmDelete}
        title={`Delete ${title}`}
        message={`Are you sure you want to delete this ${title.toLowerCase()}? This action cannot be undone.`}
        okText={deleting ? "Deleting…" : "Delete"}
        cancelText="Cancel"
        okType="Delete"
        onOk={confirmDeleteItem}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default CrudTable;