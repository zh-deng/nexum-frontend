export type CreateCompanyDto = {
  name: string;
  website?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  industry?: string;
  companySize?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  logoUrl?: string;
};
