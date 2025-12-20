import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  IconButton,
  Spinner,
} from "@radix-ui/themes";
import "./ApplicationForm.scss";
import { Cross1Icon } from "@radix-ui/react-icons";
import Dropdown from "../../Dropdown/Dropdown";
import React, { useEffect, useMemo, useState } from "react";
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
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { ApplicationDto } from "../../../types/dtos/application/application.dto";
import ApplicationAutofill from "../../ApplicationAutofill/ApplicationAutofill";
import { ExtractCompanyInfoResultDto } from "../../../types/dtos/company/company.dto";
import RadioCardGroup from "../../RadioCardGroup/RadioCardGroup";

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
  isOpen: boolean;
  data?: UpdateApplicationDto;
  setExpandedCard: React.Dispatch<React.SetStateAction<ApplicationDto | null>>;
  onClose: () => void;
};

const ApplicationForm = ({
  isOpen,
  data,
  setExpandedCard,
  onClose,
}: ApplicationFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CreateApplicationDto | UpdateApplicationDto>({
    defaultValues: data ?? defaultApplication,
  });
  const statusOptions = useMemo(
    () =>
      Object.values(ApplicationStatus).filter(
        (elem) => elem !== watch("status"),
      ),
    [watch("status")],
  );
  const workLocationOptions = Object.values(WorkLocation);
  const priorityOptions = ["LOW", "MEDIUM", "HIGH"];

  const [company, setCompany] = useState<string>("Company*");
  const [showCompanyError, setShowCompanyError] = useState<boolean>(false);

  const { data: companiesData, isLoading, error } = useCompanies();
  const createApplication = useCreateApplication();
  const updateApplication = useUpdateApplication();
  const toast = useToast();
  const { isSm } = useBreakpoint();

  useEffect(() => {
    if (!data) return;

    setCompany(data.company.name!);
  }, [data?.company]);

  // Reset form when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      reset(data ?? defaultApplication);
      setCompany(data?.company.name ?? "Company*");
      setShowCompanyError(false);
    }
  }, [isOpen, data, reset]);

  function handleCompanyChange(selected: string) {
    setCompany(selected);
    setShowCompanyError(false);

    if (selected === "Add new company") {
      setValue("company", defaultCompany);
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

  function handleClose() {
    reset(defaultApplication);
    setCompany("Company*");
    setShowCompanyError(false);
    onClose();
  }

  // handles company data separately after successful autofill
  function handleAutoFillCompany(
    companyInfo: ExtractCompanyInfoResultDto | undefined,
  ) {
    if (!companyInfo) return;

    const isNewCompany = !getCompanyNames().some(
      (companyName) => companyName === companyInfo.name,
    );

    if (isNewCompany) {
      handleCompanyChange("Add new company");
      setValue("company", companyInfo as CreateCompanyDto);
    } else {
      handleCompanyChange(companyInfo.name ?? "");
    }
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

        const updatedApplication = await updateApplication.mutateAsync({
          id: data.id,
          data: { company: companyRest, ...rest },
        });
        setExpandedCard(updatedApplication);

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

        const createdApplication = await createApplication.mutateAsync({
          company: cleanCompany,
          logItemDate: new Date(logItemDate).toISOString(),
          ...rest,
        });
        setExpandedCard(createdApplication);

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
      <Dialog.Root
        open={isOpen}
        onOpenChange={(open) => !open && handleClose()}
      >
        <Dialog.Content className="app-form">
          <form onSubmit={handleSubmit(onSubmit)} style={{ height: "100%" }}>
            <Flex
              direction={"column"}
              gap={"2"}
              justify={"between"}
              height={"100%"}
            >
              <Flex justify={"between"} align={"start"}>
                <ApplicationAutofill
                  resetAppForm={reset}
                  handleAutoFillCompany={handleAutoFillCompany}
                />
                <IconButton
                  style={{ cursor: "pointer" }}
                  onClick={handleClose}
                  size={"3"}
                  radius={"small"}
                  type={"button"}
                  color={"crimson"}
                >
                  <Cross1Icon width={"32"} height={"32"} />
                </IconButton>
              </Flex>
              <Box className="form-container">
                <Dialog.Title align={"center"} style={{ marginBottom: 0 }}>
                  {data ? "Edit" : "Create new"} application
                </Dialog.Title>
                <div>
                  <p className="required-tooltip">required*</p>
                  <FloatingTextField
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
                <FloatingTextArea
                  placeholder={"Job Description"}
                  hasTrigger={false}
                  {...register("jobDescription")}
                  value={watch("jobDescription") ?? ""}
                />
                <FloatingTextField
                  placeholder={"Job Link"}
                  {...register("jobLink")}
                  value={watch("jobLink") ?? ""}
                />
                <Dropdown
                  name={company}
                  options={getCompanyNames()}
                  onChange={handleCompanyChange}
                />
                {showCompanyError && company === "Company*" && (
                  <span className="error">Please select a company</span>
                )}
                {company !== "Company*" && (
                  <CompanyForm
                    register={register}
                    watch={watch}
                    errors={errors}
                  />
                )}
                <RadioCardGroup
                  options={workLocationOptions}
                  defaultValue="UNSURE"
                  value={watch("workLocation") ?? "UNSURE"}
                  title={"Work Location"}
                  onChange={(selected) =>
                    setValue("workLocation", selected as WorkLocation)
                  }
                />
                <RadioCardGroup
                  options={priorityOptions}
                  defaultValue={getPriorityLabel(2)}
                  value={getPriorityLabel(watch("priority") ?? 2)}
                  title={"Priority"}
                  onChange={(selected) =>
                    setValue("priority", getPriorityValue(selected))
                  }
                />
                {!data && (
                  <Flex
                    direction={isSm ? "row" : "column"}
                    gap={"4"}
                    align={"stretch"}
                  >
                    <Box width={isSm ? "50%" : "100%"}>
                      <Card>
                        <Flex direction={"column"} gap={"4"} align={"center"}>
                          <Dropdown
                            name={watch("status") || "Status"}
                            options={statusOptions}
                            onChange={(selected) =>
                              setValue("status", selected as ApplicationStatus)
                            }
                          />
                          <FloatingTextField
                            placeholder="Status Date"
                            type={"datetime-local"}
                            {...register("logItemDate")}
                            value={watch("logItemDate") ?? ""}
                          />
                        </Flex>
                      </Card>
                    </Box>
                    {/* TODO replace dummy file upload */}
                    <Box width={isSm ? "50%" : "100%"}>
                      <Card className="file-upload-card">
                        <label htmlFor="file-upload">
                          <Button style={{ cursor: "pointer" }}>
                            Upload files
                          </Button>
                          <input
                            id="file-upload"
                            type={"file"}
                            multiple
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                        </label>
                      </Card>
                    </Box>
                  </Flex>
                )}
                <FloatingTextArea
                  placeholder={"Job Notes"}
                  size={"3"}
                  {...register("notes")}
                  value={watch("notes") ?? ""}
                />
                <Button
                  type={"submit"}
                  style={{ cursor: "pointer", width: "100%" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Spinner size="2" />
                  ) : data ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </Button>
              </Box>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>
    </QueryState>
  );
};

export default ApplicationForm;
