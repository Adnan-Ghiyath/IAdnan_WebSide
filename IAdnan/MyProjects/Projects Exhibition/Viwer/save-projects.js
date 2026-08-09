// save-projects.js
export class SaveProjects {
  constructor(projects = null) {
    if (projects) {
      this.saveAllProjectsAgain(projects);
    } else {
      // إذا لم يتم تمرير شيء، المنشئ الفارغ: لا نقوم بشيء هنا،
      // سيتم استدعاء getOldProjects لاحقاً عند الحاجة.
    }
  }

  // إرجاع المشاريع المحفوظة أو مصفوفة فارغة
  getOldProjects() {
    try {
      const stored = localStorage.getItem("projects");
      if (!stored) {
        console.warn("لا توجد مشاريع محفوظة محلياً");
        return [];
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error("فشل قراءة البيانات من LocalStorage:", error);
      return [];
    }
  }

  // حفظ مصفوفة المشاريع بالكامل (حذف القديم وكتابة الجديد)
  saveAllProjectsAgain(projects) {
    try {
      if (!Array.isArray(projects)) {
        throw new Error("البيانات المراد حفظها يجب أن تكون مصفوفة");
      }
      localStorage.setItem("projects", JSON.stringify(projects));
      console.log(`تم حفظ ${projects.length} مشروع بنجاح في LocalStorage`);
    } catch (error) {
      console.error("فشل حفظ البيانات في LocalStorage:", error);
    }
  }
}
