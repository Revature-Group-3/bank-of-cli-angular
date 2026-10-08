The `json_format/` directory standardizes JSON formats for communication with the API. Request JSON formats are standardized in `json_format/requests/`, while response JSON formats are standardized in `json_format/successful_responses/` and `json_format/unsuccessful_responses/` for successful and unsuccessful responses, respectively.

Notes on JSON formats:
- `most_recent_transactions_by_account.json` contains a list of transactions; this list can be arbitrarily long, and the file contains three example transactions solely for demonstration purposes.

Notes on JSON attribute data types and values:
- IDs are non-negative integers.
- Money is represented using non-negative integers of *cents*, rather than floating-point dollar values. This is to avoid floating-point precision issues.
- The transaction `type` attribute is a String that can have values of `"DEPOSIT"`, `"WITHDRAWAL"`, or `TRANSFER`.
- The `timestamp` attribute, present in transaction and the unsuccessful responses, is a String containing a formatted timestamp (e.g. `"2024-06-01T00:00:00Z"`).
