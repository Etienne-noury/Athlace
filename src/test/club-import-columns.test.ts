import { describe, expect, it } from "vitest";
import { isCsvImportableClubColumn } from "../../supabase/functions/_shared/club-import-columns";

describe("CSV club visibility protection", () => {
  it("excludes is_hidden from the importable schema regardless of its CSV value", () => {
    for (const value of [true, false, "true", "false", "1", "0", null]) {
      const csv = { name: "Club test", is_hidden: value };
      const imported = Object.fromEntries(Object.entries(csv).filter(([column]) => isCsvImportableClubColumn(column)));
      expect(imported).not.toHaveProperty("is_hidden");
      expect(imported.name).toBe("Club test");
    }
  });
});