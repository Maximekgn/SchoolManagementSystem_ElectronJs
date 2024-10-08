import React, { useState, useEffect, useCallback } from "react";
import {
  FiUser,
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiBookOpen,
  FiHeart,
  FiPhone,
} from "react-icons/fi";

const AddStudentForm = ({ onAdd, onClose }) => {
  const initialFormData = {
    surname: "",
    name: "",
    birthDate: new Date().toISOString().split("T")[0],
    birthPlace: "",
    gender: "Other",
    regNumber: "",
    admissionDate: new Date().toISOString().split("T")[0],
    classId: "",
    schoolFee: 0,
    paidFee: 0,
    bloodGroup: "",
    medicalCondition: "",
    previousSchool: "",
    religion: "",
    additionalNote: "",
    parentName: "",
    parentSurname: "",
    parentPhone: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [classes, setClasses] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await window.electron.ipcRenderer.invoke("get-classes");
      setClasses(response);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setErrors((prev) => ({
        ...prev,
        fetchClasses: "Failed to fetch classes. Please try again.",
      }));
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? 0 : parseFloat(value)) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "name",
      "surname",
      "birthDate",
      "gender",
      "admissionDate",
      "classId",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field].toString().trim()) {
        newErrors[field] = `${field} is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const selectedClass = classes.find((cls) => cls.id == formData.classId);

        if (!selectedClass) {
          setErrors((prev) => ({
            ...prev,
            classId: "Invalid class selected.",
          }));
          setIsSubmitting(false);
          return;
        }

        const schoolFee =
          Number(selectedClass.class_fees) - Number(formData.discountFee);

        const updatedFormData = {
          ...formData,
          schoolFee: schoolFee,
          paidFee: 0,
          additionalNote: formData.additionalNote || "",
        };

        const result = await window.electron.ipcRenderer.invoke(
          "add-student",
          updatedFormData,
        );

        if (result.success) {
          onAdd(result);
          setFormData(initialFormData);
          onClose();
        } else {
          throw new Error(result.error || "Failed to add student");
        }
      } catch (error) {
        console.error("Error adding student:", error);
        setErrors((prev) => ({
          ...prev,
          submit: error.message || "Failed to add student. Please try again.",
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderField = (
    name,
    label,
    type = "text",
    options = null,
    icon = null,
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            {icon}
          </span>
        )}
        {options ? (
          <select
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className={`w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[name] ? "border-red-500" : "border-gray-300"}`}
            disabled={isSubmitting}
            required={["classId", "gender"].includes(name)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className={`w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[name] ? "border-red-500" : "border-gray-300"}`}
            disabled={isSubmitting}
            required={[
              "name",
              "surname",
              "birthDate",
              "admissionDate",
            ].includes(name)}
          />
        )}
      </div>
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center p-4 show-up">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Add New Student
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Student Information
              </h3>
              {renderField("surname", "Surname", "text", null, <FiUser />)}
              {renderField("name", "Name", "text", null, <FiUser />)}
              {renderField(
                "birthDate",
                "Birth Date",
                "date",
                null,
                <FiCalendar />,
              )}
              {renderField(
                "birthPlace",
                "Birth Place",
                "text",
                null,
                <FiMapPin />,
              )}
              {renderField(
                "gender",
                "Gender",
                "select",
                [
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                ],
                <FiUsers />,
              )}
              {renderField(
                "regNumber",
                "Registration Number",
                "text",
                null,
                <FiBookOpen />,
              )}
              {renderField(
                "admissionDate",
                "Admission Date",
                "date",
                null,
                <FiCalendar />,
              )}
              {renderField(
                "classId",
                "Class",
                "select",
                [
                  { value: "", label: "Select a class" },
                  ...classes.map((cls) => ({ value: cls.id, label: cls.name })),
                ],
                <FiUsers />,
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Additional Information
              </h3>
              {renderField(
                "bloodGroup",
                "Blood Group",
                "text",
                null,
                <FiHeart />,
              )}
              {renderField(
                "medicalCondition",
                "Medical Condition",
                "text",
                null,
                <FiHeart />,
              )}
              {renderField(
                "previousSchool",
                "Previous School",
                "text",
                null,
                <FiBookOpen />,
              )}
              {renderField("religion", "Religion", "text", null, <FiUsers />)}
              {renderField(
                "additionalNote",
                "Additional Note",
                "textarea",
                null,
                <FiBookOpen />,
              )}
              <h3 className="text-xl font-semibold mb-4 mt-6 text-gray-700">
                Parent Information
              </h3>
              {renderField(
                "parentName",
                "Parent Name",
                "text",
                null,
                <FiUser />,
              )}
              {renderField(
                "parentSurname",
                "Parent Surname",
                "text",
                null,
                <FiUser />,
              )}
              {renderField(
                "parentPhone",
                "Parent Phone",
                "tel",
                null,
                <FiPhone />,
              )}
            </div>
          </div>
          {errors.submit && (
            <p className="text-red-500 text-sm mt-2">{errors.submit}</p>
          )}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentForm;
