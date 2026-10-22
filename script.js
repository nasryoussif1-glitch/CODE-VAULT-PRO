```javascript
// 1. تحديد عناصر الموقع

const showFormBtn = document.getElementById("showFormBtn");
const cancelBtn = document.getElementById("cancelBtn");
const addCodeForm = document.getElementById("addCodeForm");
const codeForm = document.getElementById("codeForm");

const codeTitle = document.getElementById("codeTitle");
const codeLanguage = document.getElementById("codeLanguage");
const codeDescription = document.getElementById("codeDescription");
const codeContent = document.getElementById("codeContent");

const searchInput = document.getElementById("searchInput");
const codesContainer = document.getElementById("codesContainer");
const emptyMessage = document.getElementById("emptyMessage");

const totalCodes = document.getElementById("totalCodes");
const totalLanguages = document.getElementById("totalLanguages");


// 2. تحميل الأكواد المحفوظة

let codes = [];

try {
    const savedCodes = localStorage.getItem("codeVault");

    if (savedCodes) {
        const parsedCodes = JSON.parse(savedCodes);

        if (Array.isArray(parsedCodes)) {
            codes = parsedCodes.filter(code =>
                code &&
                typeof code.id === "string" &&
                typeof code.title === "string" &&
                typeof code.language === "string" &&
                typeof code.content === "string"
            );
        }
    }
} catch (error) {
    console.error("تعذر تحميل الأكواد:", error);
}


// 3. حفظ الأكواد على الجهاز

function saveCodes() {
    try {
        localStorage.setItem("codeVault", JSON.stringify(codes));
        return true;
    } catch (error) {
        alert("تعذر حفظ البيانات. قد تكون مساحة التخزين ممتلئة.");
        console.error(error);
        return false;
    }
}


// 4. إظهار وإخفاء نموذج إضافة الكود

showFormBtn.addEventListener("click", function () {
    addCodeForm.classList.toggle("hidden");

    if (!addCodeForm.classList.contains("hidden")) {
        codeTitle.focus();
    }
});

cancelBtn.addEventListener("click", function () {
    addCodeForm.classList.add("hidden");
    codeForm.reset();
});


// 5. إضافة كود جديد

codeForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newCode = {
        id: crypto.randomUUID(),
        title: codeTitle.value.trim(),
        language: codeLanguage.value,
        description: codeDescription.value.trim(),
        content: codeContent.value,
        createdAt: new Date().toISOString()
    };

    if (!newCode.title || !newCode.content.trim()) {
        alert("اكتب اسم الكود ومحتواه أولًا.");
        return;
    }

    codes.unshift(newCode);

    if (!saveCodes()) {
        codes.shift();
        return;
    }

    codeForm.reset();
    addCodeForm.classList.add("hidden");

    renderCodes();

    alert("تم حفظ الكود بنجاح!");
});


// 6. عرض الأكواد

function renderCodes() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredCodes = codes.filter(function (code) {
        return (
            code.title.toLowerCase().includes(searchTerm) ||
            code.language.toLowerCase().includes(searchTerm) ||
            code.description.toLowerCase().includes(searchTerm)
        );
    });

    codesContainer.replaceChildren();

    totalCodes.textContent = codes.length;

    const languages = new Set(
        codes.map(code => code.language)
    );

    totalLanguages.textContent = languages.size;

    emptyMessage.classList.toggle(
        "hidden",
        filteredCodes.length > 0
    );

    if (codes.length === 0) {
        emptyMessage.textContent =
            "لا توجد أكواد حتى الآن. أضف أول كود إلى مكتبتك!";
    } else if (filteredCodes.length === 0) {
        emptyMessage.textContent =
            "ملقيناش أكواد مطابقة لبحثك.";
    }

    filteredCodes.forEach(function (code) {
        const card = document.createElement("article");
        card.className = "code-card";

        const header = document.createElement("div");
        header.className = "code-card-header";

        const info = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = code.title;

        const description = document.createElement("p");
        description.className = "code-description";
        description.textContent =
            code.description || "بدون وصف";

        info.append(title, description);

        const badge = document.createElement("span");
        badge.className = "language-badge";
        badge.textContent = code.language;

        header.append(info, badge);

        const preview = document.createElement("div");
        preview.className = "code-preview";

        const pre = document.createElement("pre");
        pre.textContent = code.content;

        preview.appendChild(pre);

        const actions = document.createElement("div");
        actions.className = "code-actions";

        const copyBtn = document.createElement("button");
        copyBtn.className = "action-btn";
        copyBtn.textContent = "نسخ الكود";

        copyBtn.addEventListener("click", function () {
            copyCode(code.content);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "action-btn delete-btn";
        deleteBtn.textContent = "حذف";

        deleteBtn.addEventListener("click", function () {
            deleteCode(code.id);
        });

        actions.append(copyBtn, deleteBtn);

        card.append(header, preview, actions);

        codesContainer.appendChild(card);
    });
}


// 7. نسخ الكود

async function copyCode(content) {
    try {
        await navigator.clipboard.writeText(content);
        alert("تم نسخ الكود بنجاح!");
    } catch (error) {
        alert(
            "المتصفح منع النسخ التلقائي. افتح الموقع عبر خادم محلي HTTPS أو localhost."
        );
    }
}


// 8. حذف كود

function deleteCode(id) {
    const confirmed = confirm(
        "هل أنت متأكد إنك عايز تحذف الكود ده؟"
    );

    if (!confirmed) {
        return;
    }

    const previousCodes = codes;
    codes = codes.filter(code => code.id !== id);

    if (!saveCodes()) {
        codes = previousCodes;
        return;
    }

    renderCodes();
}


// 9. البحث عن الأكواد

searchInput.addEventListener("input", function () {
    renderCodes();
});


// 10. تشغيل الموقع أول مرة

renderCodes();
```
