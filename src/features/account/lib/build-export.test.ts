import { describe, expect, it } from "vitest";
import { buildExport, EXPORT_FORMAT, exportFileName } from "./build-export";

const NOW = new Date("2026-10-09T14:30:00Z");

describe("buildExport", () => {
  it("assemble un export daté, avec ou sans compte", () => {
    const device = { "soniva-library": { state: {} } };
    const result = buildExport({ account: null, device, now: NOW });

    expect(result).toMatchObject({
      format: EXPORT_FORMAT,
      version: 1,
      exportedAt: "2026-10-09T14:30:00.000Z",
      account: null,
      device,
    });
    expect(result.notice).toContain("Audius");
  });
});

describe("exportFileName", () => {
  it("nomme le fichier avec la date du jour", () => {
    expect(exportFileName(NOW)).toBe("soniva-donnees-2026-10-09.json");
  });
});
