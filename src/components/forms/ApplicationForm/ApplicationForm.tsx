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
import { removeEmptyStrings } from "../../../utils/helper";
import { useForm } from "react-hook-form";

const ApplicationForm = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateApplicationDto>({
    defaultValues: {
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
    },
  });

  const [company, setCompany] = useState<string>("Company*");
  const [showCompanyError, setShowCompanyError] = useState<boolean>(false);
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

  const handleCompanyChange = (selected: string) => {
    setCompany(selected);
    setShowCompanyError(false);
  };

  function getCompanies() {
    return [];
  }

  function handleFileChange() {}

  async function onSubmit(data: CreateApplicationDto) {
    if (company === "Company*") {
      setShowCompanyError(true);
      return;
    }

    try {
      const cleanedData = removeEmptyStrings(data);
      await createApplication(cleanedData);
      onClose();
    } catch (error: unknown) {
      console.error("Create application error:", error);
    }
  }

  return (
    <div className="app-form">
      <p className="form-header">Create new application</p>
      <p className="required-tooltip">required*</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <TextField.Root
            className="radix-textfield"
            placeholder="Job Title*"
            {...register("jobTitle", {
              required: "Job title is required",
              validate: (value) =>
                value.trim() !== "" || "Job title cannot be empty",
            })}
          />
          {errors.jobTitle && (
            <span className="error">{errors.jobTitle.message}</span>
          )}
        </div>
        <div>
          <TextField.Root
            className="radix-textfield"
            placeholder="Job Description"
            {...register("jobDescription")}
          />
        </div>
        <div>
          <TextField.Root
            className="radix-textfield"
            placeholder="Job Link"
            {...register("jobLink")}
          />
        </div>
        <div>
          <Dropdown
            name={company}
            options={["Add new company", ...getCompanies()]}
            onChange={handleCompanyChange}
          />
          {showCompanyError && company === "Company*" && (
            <span className="error">Please select a company</span>
          )}
        </div>
        {company !== "Company*" && (
          <div>
            <CompanyForm register={register} errors={errors} />
          </div>
        )}
        <div>
          <Dropdown
            name={watch("workLocation") || "Work Location"}
            options={workLocationOptions}
            onChange={(selected) =>
              setValue("workLocation", selected as WorkLocation)
            }
          />
        </div>
        <div>
          <Dropdown
            name={watch("priority") || "Priority"}
            options={priorityOptions}
            onChange={(selected) => setValue("priority", selected as Priority)}
          />
        </div>
        <div>
          <Dropdown
            name={watch("status") || "Status"}
            options={statusOptions}
            onChange={(selected) =>
              setValue("status", selected as ApplicationStatus)
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
          <TextArea placeholder="Notes" size={"3"} {...register("notes")} />
        </div>
        <Button type="submit" mt={"4"} disabled={isSubmitting}>
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
