// interface to cover every failure in the app
// the shape of every failure, matching json_format/unsuccessful_responses/
export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}
