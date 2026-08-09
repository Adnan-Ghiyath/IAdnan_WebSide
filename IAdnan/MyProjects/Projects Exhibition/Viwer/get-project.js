// get-project.js
import { SUPABASE_URL, SUPABASE_KEY, TABLE_NAME } from "./config.js";
import { ShowProjects } from "./show-projects.js";

export class GetProject {
  static async getAllProjects() {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?order=id.asc`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `فشل الاتصال: ${response.status} ${response.statusText}`,
        );
      }
      console.log("Statuse code for Projects is =>", response.status);

      const projects = await response.json();

      if (!Array.isArray(projects)) {
        throw new Error("البيانات المستلمة ليست مصفوفة");
      }

      new ShowProjects(projects);
    } catch (error) {
      console.error("فشل جلب المشاريع من Supabase:", error);
      new ShowProjects(); // fallback: يعرض آخر نسخة محفوظة محليًا فقط عند فشل الاتصال
    }
  }
}
