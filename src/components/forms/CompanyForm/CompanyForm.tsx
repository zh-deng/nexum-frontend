import { TextArea, TextField } from "@radix-ui/themes";
import "./CompanyForm.scss";
import { CreateCompanyDto } from "../../../types/dtos/create-company.dto";
import { UpdateCompanyDto } from "../../../types/dtos/update-company.dto";

type CompanyFormProps = {
  value: CreateCompanyDto | UpdateCompanyDto;
  onChange: (updated: CreateCompanyDto | UpdateCompanyDto) => void;
};

const CompanyForm = ({ value, onChange }: CompanyFormProps) => {
  function handleFieldChange<
    K extends keyof (CreateCompanyDto | UpdateCompanyDto),
  >(key: K, val: (CreateCompanyDto | UpdateCompanyDto)[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div className="company-form">
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Company Name*"
          type="text"
          value={value.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Website"
          type="text"
          value={value.website}
          onChange={(e) => handleFieldChange("website", e.target.value)}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Street"
          type="text"
          value={value.street}
          onChange={(e) => handleFieldChange("street", e.target.value)}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="City"
          type="text"
          value={value.city}
          onChange={(e) => handleFieldChange("city", e.target.value)}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="State"
          type="text"
          value={value.state}
          onChange={(e) => handleFieldChange("state", e.target.value)}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="ZIP Code"
          type="text"
          value={value.zipCode}
          onChange={(e) => handleFieldChange("zipCode", e.target.value)}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Country"
          type="text"
          value={value.country}
          onChange={(e) => handleFieldChange("country", e.target.value)}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Industry"
          type="text"
          value={value.industry}
          onChange={(e) => handleFieldChange("industry", e.target.value)}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Company Size"
          type="text"
          value={value.companySize}
          onChange={(e) => handleFieldChange("companySize", e.target.value)}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Contact Name"
          type="text"
          value={value.contactName}
          onChange={(e) => handleFieldChange("contactName", e.target.value)}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Contact Email"
          type="text"
          value={value.contactEmail}
          onChange={(e) => handleFieldChange("contactEmail", e.target.value)}
        />
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Contact Phone"
          type="text"
          value={value.contactPhone}
          onChange={(e) => handleFieldChange("contactPhone", e.target.value)}
        />
      </div>
      <div>
        <TextArea
          placeholder="Notes"
          size={"3"}
          value={value.notes}
          onChange={(e) => handleFieldChange("notes", e.target.value)}
        />
      </div>
      {/* TODO add company logo? */}
    </div>
  );
};

export default CompanyForm;
