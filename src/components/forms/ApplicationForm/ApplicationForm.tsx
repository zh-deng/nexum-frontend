import { Button, Card, Flex, IconButton, Text } from "@radix-ui/themes";
import "./ApplicationForm.scss";
import { Cross1Icon } from "@radix-ui/react-icons";
import Dropdown from "../../Dropdown/Dropdown";
import { useEffect, useState } from "react";
import CompanyForm from "../CompanyForm/CompanyForm";
import { CreateCompanyDto } from "../../../types/dtos/company/create-company.dto";
import {
  ApplicationStatus,
  Priority,
  WorkLocation,
} from "../../../types/enums";
import {
  combineDateWithTime,
  getPriorityLabel,
  getPriorityValue,
  getTodayLocalDate,
  removeEmptyStrings,
} from "../../../utils/helper";
import { useForm } from "react-hook-form";
import { useCreateApplication } from "../../../hooks/application/useCreateApplication";
import FloatingTextField from "../../FloatingTextField/FloatingTextField";
import FloatingTextArea from "../../FloatingTextArea/FloatingTextArea";
import { useCompanies } from "../../../hooks/company/useCompanies";
import { useUpdateApplication } from "../../../hooks/application/useUpdateApplication";
import { CreateApplicationDto } from "../../../types/dtos/application/create-application.dto";
import { UpdateApplicationDto } from "../../../types/dtos/application/update-application.dto";

type ApplicationFormProps = {
  data?: UpdateApplicationDto;
  onClose: () => void;
};

const ApplicationForm = ({ data, onClose }: ApplicationFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    resetField,
  } = useForm<CreateApplicationDto | UpdateApplicationDto>({
    defaultValues: data ?? {
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
      logItemDate: getTodayLocalDate(),
      fileUrls: [],
    },
  });

  const { data: companiesData } = useCompanies();
  const createApplication = useCreateApplication();
  const updateApplication = useUpdateApplication();
  const [company, setCompany] = useState<string>("Company*");
  const [showCompanyError, setShowCompanyError] = useState<boolean>(false);
  const workLocationOptions = ["ON_SITE", "REMOTE", "HYBRID", "UNSURE"].filter(
    (elem) => elem !== watch("workLocation"),
  );
  const currentPriority = watch("priority");
  const currentPriorityLabel = currentPriority
    ? getPriorityLabel(currentPriority)
    : "Priority";
  const priorityOptions = ["HIGH", "MEDIUM", "LOW"].filter(
    (elem) => elem !== currentPriorityLabel,
  );

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
  ].filter((elem) => elem !== watch("status"));

  useEffect(() => {
    if (!data) return;

    setCompany(data.company.name!);
  }, [data?.company]);

  const handleCompanyChange = (selected: string) => {
    setCompany(selected);
    setShowCompanyError(false);

    if (selected === "Add new company") {
      resetField("company");
    } else {
      const companyData = companiesData.find(
        (element) => element.name === selected,
      );

      setValue("company", companyData!);
    }
  };

  function getCompanyNames(): string[] {
    return [
      "Add new company",
      ...companiesData
        .map((company) => company.name)
        .filter((name) => name !== company),
    ];
  }

  function handleFileChange() {}

  async function onSubmit(data: CreateApplicationDto | UpdateApplicationDto) {
    if (company === "Company*") {
      setShowCompanyError(true);
      return;
    }

    try {
      const cleanedData = removeEmptyStrings(data);

      if ("id" in data && data.id) {
        const { reminders, interviews, logItems, ...rest } = cleanedData;
        await updateApplication.mutateAsync({ id: data.id, data: rest });
      } else {
        const {
          company: { applications, ...cleanCompany },
          logItemDate,
          ...rest
        } = cleanedData;

        const fullTimestamp = logItemDate
          ? combineDateWithTime(logItemDate)
          : new Date().toISOString();

        await createApplication.mutateAsync({
          company: cleanCompany,
          logItemDate: fullTimestamp,
          ...rest,
        });
      }
      onClose();
    } catch (error: unknown) {
      console.error("Create or update application error:", error);
    }
  }

  return (
    <div className="app-form">
      <p className="form-header">Create new application</p>
      <p className="required-tooltip">required*</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <FloatingTextField
            className="radix-textfield"
            placeholder="Job Title*"
            {...register("jobTitle", {
              required: "Job title is required",
              validate: (value) =>
                value.trim() !== "" || "Job title cannot be empty",
            })}
            value={watch("jobTitle") ?? ""}
          />
          {errors.jobTitle && (
            <span className="error">{errors.jobTitle.message}</span>
          )}
        </div>
        <div>
          <FloatingTextField
            className="radix-textfield"
            placeholder="Job Description"
            {...register("jobDescription")}
            value={watch("jobDescription") ?? ""}
          />
        </div>
        <div>
          <FloatingTextField
            className="radix-textfield"
            placeholder="Job Link"
            {...register("jobLink")}
            value={watch("jobLink") ?? ""}
          />
        </div>
        <div>
          <Dropdown
            name={company}
            options={getCompanyNames()}
            onChange={handleCompanyChange}
          />
          {showCompanyError && company === "Company*" && (
            <span className="error">Please select a company</span>
          )}
        </div>
        {company !== "Company*" && (
          <div>
            <CompanyForm register={register} watch={watch} errors={errors} />
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
            name={currentPriorityLabel}
            options={priorityOptions}
            onChange={(selected) =>
              setValue("priority", getPriorityValue(selected))
            }
          />
        </div>
        {!data && (
          <Card>
            <Flex direction={"column"} gap={"3"} align={"center"}>
              <Dropdown
                name={watch("status") || "Status"}
                options={statusOptions}
                onChange={(selected) =>
                  setValue("status", selected as ApplicationStatus)
                }
              />
              <Flex align={"center"} gap={"4"}>
                <Text weight={"bold"}>SINCE</Text>
                <FloatingTextField
                  className="radix-textfield"
                  placeholder="Status Date"
                  type={"date"}
                  {...register("logItemDate")}
                  value={watch("logItemDate") ?? ""}
                />
              </Flex>
            </Flex>
          </Card>
        )}
        {/* TODO replace dummy file upload */}
        <div>
          <label htmlFor="file-upload">
            <Button style={{ cursor: "pointer" }}>Upload files</Button>
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
          <FloatingTextArea
            placeholder="Job Notes"
            size={"3"}
            {...register("notes")}
            value={watch("notes") ?? ""}
          />
        </div>
        <Button
          type="submit"
          style={{ cursor: "pointer" }}
          mt={"4"}
          disabled={isSubmitting}
        >
          Create
        </Button>
      </form>
      <IconButton
        className="cancel-button"
        style={{ cursor: "pointer" }}
        onClick={onClose}
        size={"4"}
        radius={"small"}
      >
        <Cross1Icon width="32" height="32" />
      </IconButton>
    </div>
  );
};

export default ApplicationForm;
