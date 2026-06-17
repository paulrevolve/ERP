import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import { backendUrl } from "./config";
import { MainContainer, Toolbar } from "../helper/container";
import { FormInput, FormSection } from "../helper/formSection";

const ManageCreditCardImportInfo = () => {
  const [records, setRecords] = useState([]);
  const [allRecords, setAllRecords] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedRow, setSelectedRow] = useState(null);

  const [isFormView, setIsFormView] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const [loading, setLoading] = useState(false);
  const [clipboard, setClipboard] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialRecord = {
    creditCardType: "",
    creditCardDesc: "",
    vendorId: "",
    creditCardAccounts: "",
    payVendorId: "",
    invoiceDate: "",
    transactionAmt: "",
    transactionDesc: "",
    account: "",
    organization: "",
    project: "",
    notes: "",
    taxType: "",
    salesUseTaxCd: "",
    salesUseTaxAmt: "",
    companyId: "1",
    modifiedBy: user.name || "system",
  };

  const COLUMN_LABELS = {
    creditCardType: "Credit Card Type",
    creditCardDesc: "Credit Card Desc",
    vendorId: "Vendor ID",
    creditCardAccounts: "Credit Card Accounts",
    payVendorId: "Pay Vendor ID",
    invoiceDate: "Invoice Date",
    transactionAmt: "Transaction Amt",
    transactionDesc: "Transaction Desc",
    account: "Account",
    organization: "Organization",
    project: "Project",
    notes: "Notes",
    taxType: "Tax Type",
    salesUseTaxCd: "Sales/Use Tax Cd",
    salesUseTaxAmt: "Sales/Use Tax Amt",
  };

  const columns = Object.keys(COLUMN_LABELS);

  const REQUIRED_FIELDS = new Set([
    "creditCardType",
    "creditCardDesc",
    "vendorId",
    "creditCardAccounts",
    "invoiceDate",
    "transactionAmt",
    "account",
    "organization",
    "taxType",
  ]);

  const renderColumnLabel = (columnKey) => (
    <>
      {COLUMN_LABELS[columnKey]}
      {REQUIRED_FIELDS.has(columnKey) && (
        <span className="text-red-600 ml-0.5">*</span>
      )}
    </>
  );

  const renderRequiredLabel = (label) => (
    <>
      {label} <span className="text-red-600">*</span>
    </>
  );

  const fetchCreditCardImportInfo = async () => {
    setLoading(true);
    try {
      const response = await api.get(`${backendUrl}/api/CrCardUploadDef`);

      if (response.data) {
        const data = response.data;
        setRecords(data);
        setAllRecords(data);

        if (data.length > 0) {
          const stillExists = data.find(
            (item) => item.creditCardType === selectedRow?.creditCardType,
          );
          if (stillExists) {
            setSelectedRow(stillExists);
            setSelectedRows(new Set([stillExists.creditCardType]));
          } else {
            const firstRecord = data[0];
            setSelectedRow(firstRecord);
            setSelectedRows(new Set([firstRecord.creditCardType]));
          }
        } else {
          setSelectedRow(null);
          setSelectedRows(new Set());
        }
      }
    } catch (error) {
      console.error("Fetch Error", error);
      toast.error("Failed to fetch credit card import configuration.", {
        style: { fontSize: "11px" },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditCardImportInfo();
  }, []);

  const handleInputChange = (field, value, rowId) => {
    setIsDirty(true);

    // 1. Update the Master List
    setRecords((prevList) =>
      prevList.map((item) => {
        const itemId = item?.tempId || item.creditCardType;
        if (String(itemId) === String(rowId)) {
          return {
            ...item,
            [field]: value,
            isDirty: true,
          };
        }
        return item;
      }),
    );

    // 2. Update the Active Record
    setSelectedRow((prev) => {
      if (!prev) return prev;
      const currentId = prev.tempId || prev.creditCardType;
      if (String(currentId) !== String(rowId)) return prev;

      return { ...prev, [field]: value };
    });
  };

  const handleAdd = () => {
    const hasUnsavedNew = records.some((row) => row.isNew || !!row.tempId);
    if (hasUnsavedNew) {
      toast.warn(
        "Please save or cancel the current new entry before adding another.",
      );
      return;
    }
    const newId = `TEMP_${Date.now()}`;
    const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const newRow = {
      ...initialRecord,
      tempId: newId,
      isNew: true,
      isDirty: true,
      modifiedBy: userSession?.name || "system",
      companyId: "1",
    };
    setRecords([newRow, ...records]);
    setSelectedRows(new Set([newId]));
    setSelectedRow(newRow);
    setCurrentIndex(0);
    setIsDirty(true);
  };

  const handleSaveAll = async () => {
    const changedRows = records.filter((row) => row?.isNew || row.isDirty);

    if (changedRows.length === 0) {
      toast.info("No changes to save.", { style: { fontSize: "11px" } });
      return;
    }

    // Validation
    const requiredFields = Array.from(REQUIRED_FIELDS);
    let validationError = "";

    for (const row of changedRows) {
      const missing = requiredFields.find(
        (field) => !row[field] || String(row[field]).trim() === "",
      );
      if (missing) {
        const fieldName = COLUMN_LABELS[missing];
        validationError = `Row ${records.indexOf(row) + 1}: ${fieldName} is required.`;
        break;
      }
    }

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);
    try {
      const savePromises = changedRows.map((row) => {
        const { isNew, isDirty, tempId, ...payload } = row;
        if (row.isNew) {
          return api.post(`${backendUrl}/api/CrCardUploadDef`, payload);
        } else {
          return api.put(`${backendUrl}/api/CrCardUploadDef`, payload);
        }
      });

      await Promise.all(savePromises);

      toast.success("Changes saved successfully!", {
        style: { fontSize: "11px" },
      });
      setIsDirty(false);
      fetchCreditCardImportInfo();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(
        error.response?.data?.message || "Error during save operation.",
        { style: { fontSize: "11px" } },
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedRows.size === 0) {
      toast.warn("Please select at least one record to delete.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedRows.size} selected item(s)?`,
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const idsToDelete = Array.from(selectedRows);

      for (const id of idsToDelete) {
        const isTemporary = String(id).startsWith("TEMP_");

        if (isTemporary) {
          setRecords((prev) => prev.filter((item) => item.tempId !== id));
        } else {
          await api.delete(`${backendUrl}/api/CrCardUploadDef/${id}`);
        }
      }

      toast.success("Selection deleted successfully.");
      setSelectedRows(new Set());
      setSelectedRow(null);
      fetchCreditCardImportInfo();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete some items.",
      );
    } finally {
      setLoading(false);
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = records.find(
      (item) =>
        String(item.creditCardType).toLowerCase() === String(code).toLowerCase(),
    );

    if (found) {
      const id = found.tempId || found.creditCardType;
      setSelectedRow(found);
      setIsFormView(true);
      const newIdx = records.indexOf(found);
      setCurrentIndex(newIdx);
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`Credit Card Type "${code}" not found.`);
    }
  };

  const handleNavigate = (direction) => {
    const idx = records.findIndex(
      (x) =>
        (x.tempId || x.creditCardType) ===
        (selectedRow?.tempId || selectedRow?.creditCardType),
    );

    let newIdx = idx;
    if (direction === "next" && idx < records.length - 1) newIdx = idx + 1;
    if (direction === "prev" && idx > 0) newIdx = idx - 1;
    if (direction === "start") newIdx = 0;
    if (direction === "end") newIdx = records.length - 1;

    if (newIdx !== idx) {
      const nextRecord = records[newIdx];
      const nextId = nextRecord.tempId || nextRecord.creditCardType;

      setSelectedRow(nextRecord);
      setCurrentIndex(newIdx);
      setSelectedRows(new Set([nextId]));
    }
  };

  const handleCopy = () => {
    const hasSelection = selectedRows.size > 0 || selectedRow;
    if (!hasSelection) {
      toast.warn("Select a record to copy first.");
      return;
    }

    const rowsToCopy =
      selectedRows.size > 0
        ? records.filter((item) =>
            selectedRows.has(item.tempId || item.creditCardType),
          )
        : records.filter(
            (item) =>
              (item.tempId || item.creditCardType) ===
              (selectedRow?.tempId || selectedRow?.creditCardType),
          );

    const headerLine = columns.map((key) => COLUMN_LABELS[key]).join("\t");
    const dataLines = rowsToCopy
      .map((row) => columns.map((key) => row[key] || "").join("\t"))
      .join("\n");

    const finalClipboardString = `${headerLine}\n${dataLines}`;

    navigator.clipboard
      .writeText(finalClipboardString)
      .then(() => {
        setClipboard(rowsToCopy);
        localStorage.setItem("creditcard_clipboard", JSON.stringify(rowsToCopy));
        toast.success(`${rowsToCopy.length} record(s) copied.`);
      })
      .catch(() => toast.error("Clipboard access failed."));
  };

  const handlePaste = () => {
    const savedData =
      clipboard && clipboard.length > 0
        ? clipboard
        : JSON.parse(localStorage.getItem("creditcard_clipboard"));

    if (!savedData) return toast.warn("Clipboard is empty.");

    const dataToPaste = Array.isArray(savedData) ? savedData : [savedData];
    const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const pastedRows = dataToPaste.map((row, index) => {
      const newTempId = `CARD_NEW_${Date.now()}_${index}`;
      return {
        ...row,
        creditCardType: "", 
        tempId: newTempId,
        isNew: true,
        isDirty: true,
        modifiedBy: userSession?.name || "system",
      };
    });

    setRecords((prev) => [
      ...pastedRows,
      ...prev.filter((item) => !item.isNew),
    ]);

    if (pastedRows.length > 0) {
      setSelectedRow(pastedRows[0]);
      setSelectedRows(new Set([pastedRows[0].tempId]));
      setIsDirty(true);
    }
    toast.success(`${pastedRows.length} record(s) pasted.`);
  };

  const handleDiscard = () => {
    const hasUnsavedChanges = records.some((item) => item.isNew || item.isDirty);

    if (!isDirty && !hasUnsavedChanges) {
      toast.info("No changes found.");
      return;
    }

    if (window.confirm("Discard all unsaved changes and new records?")) {
      setRecords([...allRecords]);
      setSelectedRow(null);
      setSelectedRows(new Set());
      setIsDirty(false);
      setClipboard(null);
      localStorage.removeItem("creditcard_clipboard");
      fetchCreditCardImportInfo();
      toast.info("Changes discarded.");
    }
  };

  const activeRowId = selectedRow ? (selectedRow.tempId || selectedRow.creditCardType) : "";

  return (
    <div className="mt-14 ml-4">
      <MainContainer title={"Manage Credit Card Import Info"}>
        <Toolbar
          isFormView={isFormView}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          totalRecords={records.length}
          selectedRow={selectedRow}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          loading={loading}
          actions={{
            onAdd: handleAdd,
            onSave: handleSaveAll,
            onDelete: handleDelete,
            onCopy: handleCopy,
            onClear: handleDiscard,
            onPaste: handlePaste,
            onToggleView: () => {
              if (!isFormView && !selectedRow && records.length > 0) {
                const firstRecord = records[0];
                setSelectedRow(firstRecord);
                setSelectedRows((prevSet) => {
                  const newSet = new Set(prevSet);
                  newSet.add(firstRecord.creditCardType || firstRecord.tempId);
                  return newSet;
                });
              }
              setIsFormView(!isFormView);
            },
          }}
          currentIndex={currentIndex}
        />
        {isFormView ? (
          <div className="p-2 space-y-2">
            <FormSection>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label={renderRequiredLabel("Credit Card Type")}
                  disabled={!selectedRow?.isNew}
                  value={selectedRow?.creditCardType || ""}
                  onChange={(e) =>
                    handleInputChange("creditCardType", e.target.value, activeRowId)
                  }
                />
                <FormInput
                  label={renderRequiredLabel("Credit Card Desc")}
                  value={selectedRow?.creditCardDesc || ""}
                  onChange={(e) =>
                    handleInputChange("creditCardDesc", e.target.value, activeRowId)
                  }
                />
              </div>
            </FormSection>

            <FormSection title={"Define Field Positions"}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                {/* Column 1 */}
                <div className="flex flex-col space-y-2">
                  <FormInput
                    label={renderRequiredLabel("Vendor ID")}
                    value={selectedRow?.vendorId || ""}
                    onChange={(e) =>
                      handleInputChange("vendorId", e.target.value, activeRowId)
                    }
                  />
                  <FormInput
                    label={renderRequiredLabel("Credit Card Accounts")}
                    value={selectedRow?.creditCardAccounts || ""}
                    onChange={(e) =>
                      handleInputChange("creditCardAccounts", e.target.value, activeRowId)
                    }
                  />
                  <FormInput
                    label="Pay Vendor ID"
                    value={selectedRow?.payVendorId || ""}
                    onChange={(e) =>
                      handleInputChange("payVendorId", e.target.value, activeRowId)
                    }
                  />
                </div>

                {/* Column 2 */}
                <div className="flex flex-col space-y-2">
                  <FormInput
                    label={renderRequiredLabel("Invoice Date")}
                    value={selectedRow?.invoiceDate || ""}
                    onChange={(e) =>
                      handleInputChange("invoiceDate", e.target.value, activeRowId)
                    }
                  />
                  <FormInput
                    label={renderRequiredLabel("Transaction Amt")}
                    value={selectedRow?.transactionAmt || ""}
                    onChange={(e) =>
                      handleInputChange("transactionAmt", e.target.value, activeRowId)
                    }
                  />
                  <FormInput
                    label="Transaction Desc"
                    value={selectedRow?.transactionDesc || ""}
                    onChange={(e) =>
                      handleInputChange("transactionDesc", e.target.value, activeRowId)
                    }
                  />
                </div>

                {/* Column 3 */}
                <div className="flex flex-col space-y-2">
                  <FormInput
                    label={renderRequiredLabel("Account")}
                    value={selectedRow?.account || ""}
                    onChange={(e) =>
                      handleInputChange("account", e.target.value, activeRowId)
                    }
                  />
                  <FormInput
                    label={renderRequiredLabel("Organization")}
                    value={selectedRow?.organization || ""}
                    onChange={(e) =>
                      handleInputChange("organization", e.target.value, activeRowId)
                    }
                  />
                  <FormInput
                    label="Project"
                    value={selectedRow?.project || ""}
                    onChange={(e) =>
                      handleInputChange("project", e.target.value, activeRowId)
                    }
                  />
                </div>

                {/* Column 4 */}
                <div className="flex flex-col space-y-2">
                  <FormInput
                    label="Notes"
                    value={selectedRow?.notes || ""}
                    onChange={(e) =>
                      handleInputChange("notes", e.target.value, activeRowId)
                    }
                  />
                  <FormInput
                    label={renderRequiredLabel("Tax Type")}
                    value={selectedRow?.taxType || ""}
                    onChange={(e) =>
                      handleInputChange("taxType", e.target.value, activeRowId)
                    }
                  />
                  <FormInput
                    label="Sales/Use Tax Cd"
                    value={selectedRow?.salesUseTaxCd || ""}
                    onChange={(e) =>
                      handleInputChange("salesUseTaxCd", e.target.value, activeRowId)
                    }
                  />
                  <FormInput
                    label="Sales/Use Tax Amt"
                    value={selectedRow?.salesUseTaxAmt || ""}
                    onChange={(e) =>
                      handleInputChange("salesUseTaxAmt", e.target.value, activeRowId)
                    }
                  />
                </div>
              </div>
            </FormSection>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[35vh]">
            <table className="min-w-full text-xs border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="th-thead w-10"></th>
                  {columns.map((col) => (
                    <th key={col} className="th-thead px-2 py-1">
                      <div className="flex items-center justify-center">
                        <span>{renderColumnLabel(col)}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="tbody">
                {records?.map((item) => {
                  const uniqueKey = item.tempId || item.creditCardType;
                  const isChecked = selectedRows.has(uniqueKey);
                  return (
                    <tr
                      key={uniqueKey}
                      className={`${
                        isChecked ? "bg-blue-50" : ""
                      } hover:bg-gray-50 transition-colors cursor-pointer`}
                    >
                      <td className="text-center tbody-td p-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          className="h-3 w-3 accent-blue-600 cursor-pointer"
                          onChange={(e) => {
                            e.stopPropagation();
                            const newSet = new Set(selectedRows);
                            if (newSet.has(uniqueKey)) {
                              newSet.delete(uniqueKey);
                              setSelectedRow(null);
                            } else {
                              newSet.add(uniqueKey);
                              setSelectedRow(item);
                            }
                            setSelectedRows(newSet);
                          }}
                        />
                      </td>
                      {columns.map((col) => (
                        <td key={col} className="tbody-td p-1">
                          <input
                            className={`td-input min-w-[150px] ${
                              col === "creditCardType" && !item?.isNew
                                ? "bg-gray-100 cursor-not-allowed"
                                : "bg-white"
                            }`}
                            value={item[col] || ""}
                            disabled={col === "creditCardType" && !item?.isNew}
                            onChange={(e) =>
                              handleInputChange(col, e.target.value, uniqueKey)
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </MainContainer>
    </div>
  );
};

export default ManageCreditCardImportInfo;
