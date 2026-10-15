import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = fileURLToPath(new URL(".", import.meta.url));

const headerStyle = {
  fill: "#1F4E78",
  font: { name: "Arial", size: 11, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#FFFFFF" },
};

function setColumnWidths(sheet, widths) {
  for (const [column, widthPx] of Object.entries(widths)) {
    sheet.getRange(`${column}:${column}`).format.columnWidthPx = widthPx;
  }
}

async function saveWorkbook(workbook, outputName, previewName, sheetName, inspectRange) {
  const check = await workbook.inspect({
    kind: "table",
    range: `${sheetName}!${inspectRange}`,
    include: "values,formulas",
    tableMaxRows: 6,
    tableMaxCols: 12,
  });
  console.log(`${outputName}\n${check.ndjson}`);

  const preview = await workbook.render({
    sheetName,
    range: inspectRange,
    scale: 2,
    format: "png",
  });
  await fs.writeFile(`${outputDir}${previewName}`, new Uint8Array(await preview.arrayBuffer()));

  const output = await SpreadsheetFile.exportXlsx(workbook);
  await output.save(`${outputDir}${outputName}`);
}

async function createWorkingExcel() {
  const workbook = Workbook.create();
  const sheet = workbook.worksheets.add("Working_excel");
  sheet.showGridLines = true;

  const headers = [
    "pid",
    "email",
    "phone",
    "Invitation_sent_at",
    "reminder_sent_at",
    "whatsapp_sent_at",
    "Scheduled",
    "schedule_date_time",
  ];
  sheet.getRange("A1:H1").values = [headers];
  sheet.getRange("A1:H1").format = headerStyle;
  sheet.getRange("A1:H1").format.rowHeight = 32;
  sheet.freezePanes.freezeRows(1);

  setColumnWidths(sheet, {
    A: 130,
    B: 240,
    C: 140,
    D: 165,
    E: 165,
    F: 165,
    G: 105,
    H: 185,
  });

  sheet.getRange("A2:A1001").setNumberFormat("@");
  sheet.getRange("B2:C1001").setNumberFormat("@");
  sheet.getRange("D2:F1001").setNumberFormat("yyyy-mm-dd hh:mm");
  sheet.getRange("H2:H1001").setNumberFormat("yyyy-mm-dd hh:mm");
  sheet.dataValidations.add({
    range: "G2:G1001",
    rule: { type: "list", values: ["Yes", "No"] },
  });

  await saveWorkbook(
    workbook,
    "working_excel.xlsx",
    "working_excel_preview.png",
    "Working_excel",
    "A1:H10",
  );
}

async function createAtRunTime() {
  const workbook = Workbook.create();
  const sheet = workbook.worksheets.add("At_Run_Time");
  sheet.showGridLines = true;

  const headers = [
    "condition_cell",
    "first_name",
    "last_name",
    "date",
    "hour",
    "pid",
    "Arrived",
    "Completed",
  ];
  sheet.getRange("A1:H1").values = [headers];
  sheet.getRange("A1:H1").format = headerStyle;
  sheet.getRange("A1:H1").format.rowHeight = 32;
  sheet.freezePanes.freezeRows(1);

  setColumnWidths(sheet, {
    A: 150,
    B: 135,
    C: 145,
    D: 120,
    E: 90,
    F: 130,
    G: 105,
    H: 110,
  });

  sheet.getRange("D2:D1001").setNumberFormat("yyyy-mm-dd");
  sheet.getRange("E2:E1001").setNumberFormat("hh:mm");
  sheet.getRange("F2:F1001").setNumberFormat("@");
  sheet.dataValidations.add({
    range: "G2:H1001",
    rule: { type: "list", values: ["Yes", "No"] },
  });

  await saveWorkbook(
    workbook,
    "at_run_time.xlsx",
    "at_run_time_preview.png",
    "At_Run_Time",
    "A1:H10",
  );
}

await createWorkingExcel();
await createAtRunTime();
