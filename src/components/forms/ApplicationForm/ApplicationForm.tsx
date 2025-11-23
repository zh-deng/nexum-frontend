import { Button, Card, Flex, IconButton, Text } from "@radix-ui/themes";
import "./ApplicationForm.scss";
import { Cross1Icon } from "@radix-ui/react-icons";
import Dropdown from "../../Dropdown/Dropdown";
import { useEffect, useMemo, useState } from "react";
import CompanyForm from "../CompanyForm/CompanyForm";
import { CreateCompanyDto } from "../../../types/dtos/company/create-company.dto";
import { ApplicationStatus, WorkLocation } from "../../../types/enums";
import {
  getLocalDatetimeValue,
  getPriorityLabel,
  getPriorityValue,
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
import QueryState from "../../QueryState/QueryState";
import { useToast } from "../../ToastProvider/ToastProvider";

const defaultCompany: CreateCompanyDto = {
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
};

const defaultApplication = {
  jobTitle: "",
  company: defaultCompany,
  jobLink: "",
  jobDescription: "",
  workLocation: undefined,
  priority: undefined,
  notes: "",
  status: undefined,
  logItemDate: getLocalDatetimeValue(),
  fileUrls: [],
};

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
    defaultValues: data ?? defaultApplication,
  });
  const statusOptions = useMemo(
    () =>
      [
        "DRAFT",
        "APPLIED",
        "INTERVIEW",
        "OFFER",
        "HIRED",
        "DECLINED_OFFER",
        "REJECTED",
        "GHOSTED",
        "WITHDRAWN",
      ].filter((elem) => elem !== watch("status")),
    [watch("status")],
  );
  const workLocationOptions = useMemo(
    () =>
      ["ON_SITE", "REMOTE", "HYBRID", "UNSURE"].filter(
        (elem) => elem !== watch("workLocation"),
      ),
    [watch("workLocation")],
  );
  const currentPriority = watch("priority");
  const currentPriorityLabel = currentPriority
    ? getPriorityLabel(currentPriority)
    : "Priority";
  const priorityOptions = useMemo(
    () =>
      ["HIGH", "MEDIUM", "LOW"].filter((elem) => elem !== currentPriorityLabel),
    [currentPriorityLabel],
  );

  const [company, setCompany] = useState<string>("Company*");
  const [showCompanyError, setShowCompanyError] = useState<boolean>(false);

  const { data: companiesData, isLoading, error } = useCompanies();
  const createApplication = useCreateApplication();
  const updateApplication = useUpdateApplication();
  const toast = useToast();

  useEffect(() => {
    if (!data) return;

    setCompany(data.company.name!);
  }, [data?.company]);

  function handleCompanyChange(selected: string) {
    setCompany(selected);
    setShowCompanyError(false);

    if (selected === "Add new company") {
      resetField("company");
    } else {
      const companyData = companiesData!.find(
        (element) => element.name === selected,
      );

      setValue("company", companyData!);
    }
  }

  // Dummy file upload handler
  function handleFileChange() {}

  function getCompanyNames(): string[] {
    if (!companiesData) return [];

    return [
      "Add new company",
      ...companiesData
        .map((company) => company.name)
        .filter((name) => name !== company),
    ];
  }

  async function onSubmit(data: CreateApplicationDto | UpdateApplicationDto) {
    if (company === "Company*") {
      setShowCompanyError(true);
      return;
    }

    try {
      const cleanedData = removeEmptyStrings(data);

      if ("id" in data && data.id) {
        const {
          createdAt,
          updatedAt,
          status,
          userId,
          reminders,
          interviews,
          logItems,
          company,
          ...rest
        } = cleanedData;
        const {
          userId: companyUserId,
          createdAt: companyCreatedAt,
          updatedAt: companyUpdatedAt,
          ...companyRest
        } = company;

        await updateApplication.mutateAsync({
          id: data.id,
          data: { company: companyRest, ...rest },
        });

        toast.success("Successfully updated application");
      } else {
        const {
          company: {
            applications,
            userId,
            id,
            updatedAt,
            createdAt,
            ...cleanCompany
          },
          logItemDate,
          ...rest
        } = cleanedData;

        await createApplication.mutateAsync({
          company: cleanCompany,
          logItemDate: new Date(logItemDate).toISOString(),
          ...rest,
        });

        toast.success("Successfully created application");
      }

      onClose();
    } catch (error: unknown) {
      console.error("Create or update application error:", error);
      toast.error("Failed to create or update application");
    }
  }

  return (
    <QueryState isLoading={isLoading} error={error}>
      <div className="app-form">
        <p className="form-header">
          {data ? "Edit" : "Create new"} application
        </p>
        <p className="required-tooltip">required*</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <FloatingTextField
              className="radix-textfield"
              placeholder={"Job Title*"}
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
              placeholder={"Job Description"}
              {...register("jobDescription")}
              value={watch("jobDescription") ?? ""}
            />
          </div>
          <div>
            <FloatingTextField
              className="radix-textfield"
              placeholder={"Job Link"}
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
                    type={"datetime-local"}
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
              type={"file"}
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <div>
            <FloatingTextArea
              placeholder={"Job Notes"}
              size={"3"}
              {...register("notes")}
              value={watch("notes") ?? ""}
            />
          </div>
          <Button
            type={"submit"}
            style={{ cursor: "pointer" }}
            mt={"4"}
            disabled={isSubmitting}
          >
            {data ? "Update" : "Create"}
          </Button>
        </form>
        <IconButton
          className="cancel-button"
          style={{ cursor: "pointer" }}
          onClick={onClose}
          size={"4"}
          radius={"small"}
          type={"button"}
        >
          <Cross1Icon width={"32"} height={"32"} />
        </IconButton>
      </div>
    </QueryState>
  );
};

export default ApplicationForm;
