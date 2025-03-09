import { supabase } from "./supabase";
import fs from "fs";
import csv from "csv-parse/sync";

interface GrantCSV {
  Title: string;
  Release_Date: string;
  Expired_Date: string;
  Activity_Code: string;
  Parent_Organization: string;
  Organization: string;
  Participating_Orgs: string;
  Document_Number: string;
  Document_Type: string;
  Clinical_Trials: string;
  URL: string;
}

export async function importGrantsFromCSV(filePath: string) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const records = csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: "\t",
    }) as GrantCSV[];

    const grants = records.map((record) => ({
      title: record.Title,
      release_date: record.Release_Date,
      expired_date: record.Expired_Date,
      activity_code: record.Activity_Code,
      parent_organization: record.Parent_Organization,
      organization: record.Organization,
      participating_orgs: record.Participating_Orgs,
      document_number: record.Document_Number,
      document_type: record.Document_Type,
      clinical_trials: record.Clinical_Trials,
      url: record.URL,
    }));

    const { data, error } = await supabase
      .from("grants")
      .insert(grants)
      .select();

    if (error) throw error;
    console.log(`Successfully imported ${data.length} grants`);
  } catch (error) {
    console.error("Error importing grants:", error);
  }
}
