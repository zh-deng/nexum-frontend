import {
  Box,
  Button,
  Callout,
  Dialog,
  Flex,
  IconButton,
  Spinner,
  Text,
} from "@radix-ui/themes";
import "./ApplicationAutofill.scss";
import {
  Cross1Icon,
  InfoCircledIcon,
  MagicWandIcon,
} from "@radix-ui/react-icons";
import FloatingTextField from "../FloatingTextField/FloatingTextField";
import FloatingTextArea from "../FloatingTextArea/FloatingTextArea";
import { useForm, UseFormReset } from "react-hook-form";
import { ExtractJobInfoDto } from "../../types/dtos/application/application.dto";
import { useState } from "react";
import { useToast } from "../ToastProvider/ToastProvider";
import { extractJobInfo } from "../../lib/api/ai";
import { CreateApplicationDto } from "../../types/dtos/application/create-application.dto";
import { UpdateApplicationDto } from "../../types/dtos/application/update-application.dto";
import { ExtractCompanyInfoResultDto } from "../../types/dtos/company/company.dto";
import { getLocalDatetimeValue } from "../../utils/helper";

type ApplicationAutofillProps = {
  resetAppForm: UseFormReset<CreateApplicationDto | UpdateApplicationDto>;
  handleAutoFillCompany: (
    companyInfo: ExtractCompanyInfoResultDto | undefined,
  ) => void;
};

const defaultInfo = {
  jobLink: "",
  jobDescription: "",
};

const ApplicationAutofill = ({
  resetAppForm,
  handleAutoFillCompany,
}: ApplicationAutofillProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<ExtractJobInfoDto>({
    defaultValues: defaultInfo,
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showEmptyError, setShowEmptyError] = useState<boolean>(false);

  const toast = useToast();

  async function onSubmit(data: ExtractJobInfoDto) {
    if (data.jobLink?.trim() === "" && data.jobDescription?.trim() === "") {
      setShowEmptyError(true);
      return;
    }

    try {
      const extractedData = await extractJobInfo(data);

      resetAppForm({ ...extractedData, logItemDate: getLocalDatetimeValue() });

      handleAutoFillCompany(extractedData.company);

      handleClose();
      toast.success("Successfully extracted job information");
    } catch (error: unknown) {
      console.error("Failed to extract job information:", error);
      toast.error("Failed to extract job information.");
    }
  }

  function handleClose() {
    reset();
    setIsOpen(false);
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Trigger>
        <Button
          style={{ cursor: "pointer" }}
          onClick={() => setIsOpen(true)}
          size={"2"}
          radius={"small"}
          type={"button"}
          color={"jade"}
        >
          <MagicWandIcon width={"14"} height={"14"} />
          <Text>AI Autofill</Text>
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <form
          onSubmit={(e) => {
            handleSubmit(onSubmit)(e);
            e.stopPropagation();
          }}
        >
          <Flex justify={"end"}>
            <Dialog.Close>
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
            </Dialog.Close>
          </Flex>
          <Dialog.Title align={"center"} mb={"6"}>
            AI Autofill
          </Dialog.Title>
          <Flex direction={"column"} align={"center"} gap={"4"}>
            <Callout.Root>
              <Flex gap={"2"} align={"center"}>
                <Callout.Icon>
                  <InfoCircledIcon />
                </Callout.Icon>
                <Callout.Text>
                  Provide either the job link or job description. Providing both
                  will enhance the extraction.
                  <br />
                  The estimated processing time is 1-2 minutes.
                </Callout.Text>
              </Flex>
            </Callout.Root>

            <Box width={"100%"}>
              <FloatingTextField
                type={"text"}
                placeholder={"Job description link e.g. Linkedin Link"}
                {...register("jobLink")}
                value={watch("jobLink") ?? ""}
              />
            </Box>
            <Box width={"100%"}>
              <FloatingTextArea
                hasTrigger={false}
                placeholder={"Job description text"}
                rows={15}
                {...register("jobDescription")}
                value={watch("jobDescription") ?? ""}
              />
            </Box>
            <Box width={"100%"}>
              {showEmptyError && (
                <span className="error">
                  Please provide either the job link or job description
                </span>
              )}
            </Box>
          </Flex>
          <Button
            type={"submit"}
            style={{ cursor: "pointer", width: "100%" }}
            disabled={isSubmitting}
            mt={"6"}
          >
            {isSubmitting ? <Spinner size="2" /> : "Start Autofill"}
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ApplicationAutofill;
