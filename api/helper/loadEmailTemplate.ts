import fs from "fs";
import path from "path";

type Replacements = { [key: string]: string | number }; // Define allowed keys

export function loadEmailTemplate(templateName: string, replacements: Replacements = {}): string {
    const filePath = path.join(__dirname, "emails", `${templateName}.html`);
    let content = fs.readFileSync(filePath, "utf8");

    // Replace placeholders like {{placeholder}}
    for (const key in replacements) {
        const regex = new RegExp(`{{${key}}}`, "g");
        content = content.replace(regex, String(replacements[key])); // ensure it's a string
    }

    return content;
}
