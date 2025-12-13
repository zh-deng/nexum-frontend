import {
  ApplicationDto,
  ExtractJobInfoDto,
} from "../../types/dtos/application/application.dto";

export async function extractJobInfo(
  data: ExtractJobInfoDto,
): Promise<ApplicationDto> {
  const res = await fetch(`FASTAPI_BASEURL/ai/extract-job-info`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error.message || `Request failed with status ${res.status}`,
    );
  }

  return await res.json();
}
