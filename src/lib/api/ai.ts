import {
  ExtractJobInfoDto,
  ExtractJobInfoResultDto,
} from "../../types/dtos/application/application.dto";
import { apiClient } from "../api-client";

export async function extractJobInfo(
  data: ExtractJobInfoDto,
): Promise<ExtractJobInfoResultDto> {
  return apiClient<ExtractJobInfoResultDto>("/ai/extract-job-info", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
