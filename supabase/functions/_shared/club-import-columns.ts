/** Visibility is managed independently of federation CSV data. */
export function isCsvImportableClubColumn(column: string): boolean {
  return column !== "is_hidden";
}