import { Button, IconButton, TextArea, TextField } from "@radix-ui/themes";
import "./ApplicationForm.scss";
import { Cross1Icon } from "@radix-ui/react-icons";
import Dropdown from "../../Dropdown/Dropdown";
import { useState } from "react";
import { createApplication } from "../../../lib/api/application";
import { CreateApplicationDto } from "../../../types/dtos/create-application.dto";
import CompanyForm from "../CompanyForm/CompanyForm";
import { CreateCompanyDto } from "../../../types/dtos/create-company.dto";
import {
  ApplicationStatus,
  Priority,
  WorkLocation,
} from "../../../types/enums";
import { removeEmptyStrings } from "../../../util/helper";

const ApplicationForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState<CreateApplicationDto>({
    jobTitle: "",
    company: {
      name: "",
      website: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      industry: "",
      companySize: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      notes: "",
      logoUrl: "",
    } as CreateCompanyDto,
    jobLink: "",
    jobDescription: "",
    workLocation: undefined,
    priority: undefined,
    notes: "",
    status: undefined,
    fileUrls: [],
  });

  const [company, setCompany] = useState<string>("Company*");
  const workLocationOptions = ["ON_SITE", "REMOTE", "HYBRID", "UNSURE"];
  const priorityOptions = ["LOW", "MEDIUM", "HIGH"];
  const statusOptions = [
    "DRAFT",
    "APPLIED",
    "INTERVIEW",
    "OFFER",
    "HIRED",
    "DECLINED_OFFER",
    "REJECTED",
    "GHOSTED",
    "WITHDRAWN",
  ];

  function handleChange<K extends keyof CreateApplicationDto>(
    key: K,
    value: CreateApplicationDto[K],
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function getCompanies() {
    return [];
  }

  function handleFileChange() {}

  async function handleSubmit() {
    try {
      const cleanedData = removeEmptyStrings(formData);
      await createApplication(cleanedData);
      onClose();
    } catch (error: unknown) {
      console.error("Create application error:", error);
    }
  }

  return (
    <div className="app-form">
      <p className="form-header">Create new application</p>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField.Root
            className="radix-textfield"
            placeholder="Job Title*"
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
          />
        </div>
        <div>
          <TextField.Root
            className="radix-textfield"
            placeholder="Job Description"
            type="text"
            value={formData.jobDescription}
            onChange={(e) => handleChange("jobDescription", e.target.value)}
          />
        </div>
        <div>
          <TextField.Root
            className="radix-textfield"
            placeholder="Job Link"
            type="text"
            value={formData.jobLink}
            onChange={(e) => handleChange("jobLink", e.target.value)}
          />
        </div>
        <div>
          <Dropdown
            name={company}
            options={["Add new company", ...getCompanies()]}
            onChange={(selected) => setCompany(selected)}
          />
        </div>
        {company !== "Company*" && (
          <div>
            <CompanyForm
              value={formData.company}
              onChange={(updatedCompany) =>
                handleChange("company", updatedCompany)
              }
            />
          </div>
        )}
        <div>
          <Dropdown
            name={formData.workLocation || "Work Location"}
            options={workLocationOptions}
            onChange={(selected) =>
              handleChange("workLocation", selected as WorkLocation)
            }
          />
        </div>
        <div>
          <Dropdown
            name={formData.priority || "Priority"}
            options={priorityOptions}
            onChange={(selected) =>
              handleChange("priority", selected as Priority)
            }
          />
        </div>
        <div>
          <Dropdown
            name={formData.status || "Status"}
            options={statusOptions}
            onChange={(selected) =>
              handleChange("status", selected as ApplicationStatus)
            }
          />
        </div>
        {/* TODO replace dummy file upload */}
        <div>
          <label htmlFor="file-upload">
            <Button>Upload files</Button>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <div>
          <TextArea
            placeholder="Notes"
            size={"3"}
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
        </div>
        <Button type="submit" mt={"4"}>
          Create
        </Button>
      </form>
      <IconButton className="cancel-button" onClick={onClose} size={"3"}>
        <Cross1Icon width="32" height="32" />
      </IconButton>
    </div>
  );
};

export default ApplicationForm;
