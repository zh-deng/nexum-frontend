import "./CompanyForm.scss";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import FloatingTextField from "../../FloatingTextField/FloatingTextField";
import FloatingTextArea from "../../FloatingTextArea/FloatingTextArea";
import { CreateApplicationDto } from "../../../types/dtos/application/create-application.dto";
import { UpdateApplicationDto } from "../../../types/dtos/application/update-application.dto";

type CompanyFormProps = {
  register: UseFormRegister<CreateApplicationDto | UpdateApplicationDto>;
  watch: UseFormWatch<CreateApplicationDto | UpdateApplicationDto>;
  errors: FieldErrors<CreateApplicationDto | UpdateApplicationDto>;
};

const CompanyForm = ({ register, watch, errors }: CompanyFormProps) => {
  return (
    <div className="company-form">
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder="Company Name*"
          {...register("company.name", {
            required: "Company name is required",
            validate: (value) =>
              value?.trim() !== "" || "Company name cannot be empty",
          })}
          value={watch("company.name") ?? ""}
        />
        {errors.company?.name && (
          <span className="error">{errors.company.name.message}</span>
        )}
      </div>
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder="Website"
          {...register("company.website")}
          value={watch("company.website") ?? ""}
        />
      </div>
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder="Street"
          {...register("company.street")}
          value={watch("company.street") ?? ""}
        />
      </div>
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder="City"
          {...register("company.city")}
          value={watch("company.city") ?? ""}
        />
      </div>
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder="State"
          {...register("company.state")}
          value={watch("company.state") ?? ""}
        />
      </div>
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder="ZIP Code"
          {...register("company.zipCode")}
          value={watch("company.zipCode") ?? ""}
        />
      </div>
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder="Country"
          {...register("company.country")}
          value={watch("company.country") ?? ""}
        />
      </div>
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder="Industry"
          {...register("company.industry")}
          value={watch("company.industry") ?? ""}
        />
      </div>
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder="Company Size"
          {...register("company.companySize")}
          value={watch("company.companySize") ?? ""}
        />
      </div>
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder="Contact Name"
          {...register("company.contactName")}
          value={watch("company.contactName") ?? ""}
        />
      </div>
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder="Contact Email"
          {...register("company.contactEmail")}
          value={watch("company.contactEmail") ?? ""}
        />
      </div>
      {/* TODO handle email inputs better with validaton */}
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder="Contact Phone"
          {...register("company.contactPhone")}
          value={watch("company.contactPhone") ?? ""}
        />
      </div>
      <div>
        <FloatingTextArea
          placeholder="Notes"
          size={"3"}
          {...register("company.notes")}
          value={watch("company.notes") ?? ""}
        />
      </div>
      {/* TODO add company logo? */}
    </div>
  );
};

export default CompanyForm;
