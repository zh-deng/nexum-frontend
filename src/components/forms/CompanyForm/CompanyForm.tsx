import { TextArea, TextField } from "@radix-ui/themes";
import "./CompanyForm.scss";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateApplicationDto } from "../../../types/dtos/create-application.dto";

type CompanyFormProps = {
  register: UseFormRegister<CreateApplicationDto>;
  errors: FieldErrors<CreateApplicationDto>;
};

const CompanyForm = ({ register, errors }: CompanyFormProps) => {
  return (
    <div className="company-form">
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Company Name*"
          {...register("company.name", {
            required: "Company name is required",
            validate: (value) =>
              value?.trim() !== "" || "Company name cannot be empty",
          })}
        />
        {errors.company?.name && (
          <span className="error">{errors.company.name.message}</span>
        )}
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Website"
          {...register("company.website")}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Street"
          {...register("company.street")}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="City"
          {...register("company.city")}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="State"
          {...register("company.state")}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="ZIP Code"
          {...register("company.zipCode")}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Country"
          {...register("company.country")}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Industry"
          {...register("company.industry")}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Company Size"
          {...register("company.companySize")}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Contact Name"
          {...register("company.contactName")}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Contact Email"
          {...register("company.contactEmail")}
        />
      </div>
      {/* TODO handle email inputs better with validaton */}
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Contact Phone"
          {...register("company.contactPhone")}
        />
      </div>
      <div>
        <TextArea
          placeholder="Notes"
          size={"3"}
          {...register("company.notes")}
        />
      </div>
      {/* TODO add company logo? */}
    </div>
  );
};

export default CompanyForm;
