const inputName = document.getElementById("name");
const inputTitle = document.getElementById("title");
const inputEmail = document.getElementById("email");
const inputPhone = document.getElementById("phone-number");
const birthdayDate= document.getElementById("birthday");
const inputLink = document.getElementById("link");
const inputSkill = document.getElementById("skill");
const skillLevelSelector = document.getElementById("skill-level");
const inputIde = document.getElementById("IDE");
const ideLevelSelector = document.getElementById("IDE-level");
const inputLanguage = document.getElementById("language");
const languageLevelSelector = document.getElementById("language-level");
const inputSummary = document.getElementById("summary");
const inputExperience = document.getElementById("experience");
const startDateExperience = document.getElementById("experience-start");
const endDateExperience = document.getElementById("experience-end");
const inputEducation = document.getElementById("education");
const startDateEducation = document.getElementById("education-start");
const endDateEducation = document.getElementById("education-end");
const inputCertification = document.getElementById("certification");
const startDateCertification = document.getElementById("certification-start");
const endDateCertification = document.getElementById("certification-end");
const skillsContainer = document.getElementById("skills-container");
const softwareContainer = document.getElementById("software-container");
const languageContainer = document.getElementById("language-container");
const experienceContainer = document.getElementById("experience-container");
const educationContainer = document.getElementById("education-container");
const certificationContainer = document.getElementById("certification-container");
const columna = document.getElementById("column");
const cvContainer = document.getElementById("cv-container");
const button = document.getElementById("button");
let cv = null;
let skillCounter = 0; 
let softwareCounter = 0;
let languageCounter = 0;
let experienceCounter = 0;
let educationCounter = 0;
let certificationCounter = 0;

function validate(){
    let isValid = true;
    isValid = inputValidator(inputName, isValid);
    isValid = inputValidator(inputTitle, isValid);
    isValid = inputValidator(inputEmail, isValid);
    isValid = inputValidator(inputPhone, isValid);
    isValid = inputValidator(birthdayDate, isValid);
    isValid = inputValidator(inputLink, isValid);
    isValid = inputValidator(inputSkill, isValid);
    isValid = inputValidator(skillLevelSelector, isValid);
    isValid = inputValidator(inputIde, isValid);
    isValid = inputValidator(ideLevelSelector, isValid);
    isValid = inputValidator(ideLevelSelector, isValid);
    isValid = inputValidator(inputLanguage, isValid);
    isValid = inputValidator(languageLevelSelector, isValid);
    isValid = inputValidator(inputSummary, isValid);
    isValid = inputValidator(inputExperience, isValid);
    isValid = inputValidator(startDateExperience, isValid);
    isValid = inputValidator(endDateExperience, isValid);
    isValid = inputValidator(inputEducation, isValid);
    isValid = inputValidator(startDateEducation, isValid);
    isValid = inputValidator(endDateEducation, isValid);
    isValid = inputValidator(inputCertification, isValid);
    isValid = inputValidator(startDateCertification, isValid);
    isValid = inputValidator(endDateCertification, isValid);

    document.querySelectorAll("#skills-container .form-control").forEach(input => {
        isValid = inputValidator(input, isValid);
    });
    document.querySelectorAll("#skills-container .form-select").forEach(select => {
        isValid = inputValidator(select, isValid);
    });
    document.querySelectorAll("#software-container .form-control").forEach(input => {
        isValid = inputValidator(input, isValid);
    });
    document.querySelectorAll("#software-container .form-select").forEach(select => {
        isValid = inputValidator(select, isValid);
    });
    document.querySelectorAll("#language-container .form-control").forEach(input => {
        isValid = inputValidator(input, isValid);
    });
    document.querySelectorAll("#language-container .form-select").forEach(select => {
        isValid = inputValidator(select, isValid);
    });
    document.querySelectorAll("#experience-container .form-control").forEach(input => {
        isValid = inputValidator(input, isValid);
    });
    document.querySelectorAll("#education-container .form-control").forEach(input => {
        isValid = inputValidator(input, isValid);
    });
    document.querySelectorAll("#certification-container .form-control").forEach(input => {
        isValid = inputValidator(input, isValid);
    });

    return isValid;
}

function inputValidator(input, isValid){
    const value = input.value;
    if(value == "" || value == null || value == undefined){
        input.classList.add("input-error");
        input.classList.remove("input-success");
        return false;
    } else{
        input.classList.add("input-success");
        input.classList.remove("input-error");
        if(!isValid){
            return false;
        } 
        return true;
    }
}

function SslData(container) {
    const inputs = container.querySelectorAll(".input");
    const selects = container.querySelectorAll(".select");

    const inputValues = Array.from(inputs).map(input => input.value.trim() || "Sin descripción");
    const selectValues = Array.from(selects).map(select => select.value.trim() || "0");

    const maxLength = Math.max(inputValues.length, selectValues.length);
    let resultArray = [];

    for (let i = 0; i < maxLength; i++) {
        resultArray.push({
            input: inputValues[i],
            rating: selectValues[i]
        });
    }

    return resultArray;
}

function EecData(container) {
    const textInputs = container.querySelectorAll(".input");
    const startDateInputs = container.querySelectorAll(".date");
    const endDateInputs = container.querySelectorAll(".date1");

    const inputTextValues = Array.from(textInputs).map(input => input.value.trim() || "Sin descripción");
    const inputStartDateValues = Array.from(startDateInputs).map(input => input.value.trim());
    const inputEndDateValues = Array.from(endDateInputs).map(input => input.value.trim() || "Fecha fin no definida");

    const maxLength = Math.max(inputTextValues.length, inputStartDateValues.length, inputEndDateValues.length);
    let resultArray = [];

    for (let i = 0; i < maxLength; i++) {
        resultArray.push({
            text: inputTextValues[i],
            startDate: inputStartDateValues[i],
            endDate: inputEndDateValues[i]
        });
    }

    return resultArray;
}

function addSkill() {
    skillCounter++;

    const col9 = document.createElement("div");
    col9.classList.add("mb-1", "col-sm-9");

    const fc = document.createElement("input");
    fc.classList.add("form-control", "input"); 
    fc.placeholder = "Habilidad";
    fc.id = `skill-${skillCounter}`; 

    const col3 = document.createElement("div");
    col3.classList.add("mb-1", "col-sm-3");

    const fmSl = document.createElement("select"); 
    fmSl.classList.add("form-select", "select"); 
    fmSl.id = `skill-level-${skillCounter}`;

    for (let i = 0; i <= 5; i++) {
        let option = document.createElement("option");
        option.value = i || ""; 
        option.textContent = i === 0 ? "Seleccione una opción" : i;
        fmSl.appendChild(option);
    }

    col9.appendChild(fc);
    col3.appendChild(fmSl);

    skillsContainer.appendChild(col9);
    skillsContainer.appendChild(col3);
}

function addSoftware() {
    softwareCounter++;

    const col9 = document.createElement("div");
    col9.classList.add("col-sm-9", "mb-1");

    const fc = document.createElement("input");
    fc.classList.add("form-control", "input");
    fc.placeholder = "Software";
    fc.id = `software-${softwareCounter}`;

    const col3 = document.createElement("div");
    col3.classList.add("col-sm-3", "mb-1");

    const fmSl = document.createElement("select"); 
    fmSl.classList.add("form-select", "select");
    fmSl.id = `software-level-${softwareCounter}`;

    for (let i = 0; i <= 5; i++) {
        let option = document.createElement("option");
        option.value = i || "";
        option.textContent = i === 0 ? "Seleccione una opción" : i;
        fmSl.appendChild(option);
    }

    col9.appendChild(fc);
    col3.appendChild(fmSl);

    softwareContainer.appendChild(col9);
    softwareContainer.appendChild(col3);
}

function addLanguage() {
    languageCounter++;

    const col9 = document.createElement("div");
    col9.classList.add("col-sm-9", "mb-1");

    const fc = document.createElement("input");
    fc.classList.add("form-control", "input");
    fc.placeholder = "Idioma";
    fc.id = `language-${languageCounter}`;

    const col3 = document.createElement("div");
    col3.classList.add("col-sm-3", "mb-1");

    const fmSl = document.createElement("select"); 
    fmSl.classList.add("form-select", "select");
    fmSl.id = `language-level-${languageCounter}`;

    for (let i = 0; i <= 5; i++) {
        let option = document.createElement("option");
        option.value = i || "";
        option.textContent = i === 0 ? "Seleccione una opción" : i;
        fmSl.appendChild(option);
    }

    col9.appendChild(fc);
    col3.appendChild(fmSl);

    languageContainer.appendChild(col9);
    languageContainer.appendChild(col3);
}

function addExperience() {
    experienceCounter++;

    const col9 = document.createElement("div");
    col9.classList.add("col-sm-6", "mb-1");

    const fc = document.createElement("input");
    fc.classList.add("form-control", "input");
    fc.placeholder = "Empresa";
    fc.id = `experience-${experienceCounter}`;

    const col3 = document.createElement("div");
    col3.classList.add("col-sm-3", "mb-1");

    const col_3 = document.createElement("div");
    col_3.classList.add("col-sm-3", "mb-1");

    const eS = document.createElement("input"); 
    eS.classList.add("form-control", "date");
    eS.type = "date";
    eS.id = `experience-start-${experienceCounter}`;

    const eE = document.createElement("input"); 
    eE.classList.add("form-control", "date1");
    eE.type = "date";
    eE.id = `experience-end-${experienceCounter}`;

    col9.appendChild(fc);
    col3.appendChild(eS);
    col_3.appendChild(eE);

    experienceContainer.appendChild(col9);
    experienceContainer.appendChild(col3);
    experienceContainer.appendChild(col_3);
}

function addEducation() {
    educationCounter++;

    const col9 = document.createElement("div");
    col9.classList.add("col-sm-6", "mb-1");

    const fc = document.createElement("input");
    fc.classList.add("form-control", "input");
    fc.placeholder = "Institución";
    fc.id = `education-${educationCounter}`;

    const col3 = document.createElement("div");
    col3.classList.add("col-sm-3", "mb-1");

    const col_3 = document.createElement("div");
    col_3.classList.add("col-sm-3", "mb-1");

    const eS = document.createElement("input"); 
    eS.classList.add("form-control", "date");
    eS.type = "date";
    eS.id = `education-start-${educationCounter}`;

    const eE = document.createElement("input"); 
    eE.classList.add("form-control", "date1");
    eE.type = "date";
    eE.id = `education-end-${educationCounter}`;

    col9.appendChild(fc);
    col3.appendChild(eS);
    col_3.appendChild(eE);

    educationContainer.appendChild(col9);
    educationContainer.appendChild(col3);
    educationContainer.appendChild(col_3);
}

function addCertification() {
    certificationCounter++;

    const col9 = document.createElement("div");
    col9.classList.add("col-sm-6", "mb-1");

    const fc = document.createElement("input");
    fc.classList.add("form-control", "input");
    fc.placeholder = "Certificado";
    fc.id = `certification-${certificationCounter}`;

    const col3 = document.createElement("div");
    col3.classList.add("col-sm-3", "mb-1");

    const col_3 = document.createElement("div");
    col_3.classList.add("col-sm-3", "mb-1");

    const cS = document.createElement("input"); 
    cS.classList.add("form-control", "date");
    cS.type = "date";
    cS.id = `certification-start-${certificationCounter}`;

    const cE = document.createElement("input"); 
    cE.classList.add("form-control", "date1");
    cE.type = "date";
    cE.id = `certification-end-${certificationCounter}`;

    col9.appendChild(fc);
    col3.appendChild(cS);
    col_3.appendChild(cE);

    certificationContainer.appendChild(col9);
    certificationContainer.appendChild(col3);
    certificationContainer.appendChild(col_3);
}

function cvVerification() {
    if (cvContainer.hasChildNodes()) {
        remove(button);
    }
    createCV();
}

function createCV(){
    if(validate()){
        cv = document.createElement("div");
        cv.setAttribute("class", "mt-2 row d-flexbox justify-content-center");
    
        const cvHeader = document.createElement("div");
        cvHeader.setAttribute("class", "bg-dark text-light text-center rounded col-sm-10");
    
        const h3CV = document.createElement("h3");
        h3CV.textContent = "SU CV ha sido generado";
    
        const column = document.createElement("div");
        column.setAttribute("class", "card col-sm-3 py-4 mb-5 me-1 column");

        const divNameTitle = document.createElement("div");
        divNameTitle.setAttribute("class", "mb-2 text-center");
    
        const h3Name = document.createElement("h3");
        h3Name.textContent = `${inputName.value}`.toUpperCase();
    
        const h5Title = document.createElement("h6");
        h5Title.textContent = `${inputTitle.value}`.toUpperCase();
    
        const divCardPersonalInfo = document.createElement("div");
        divCardPersonalInfo.setAttribute("class", "mb-3");
    
        const piHeader = document.createElement("div");
        piHeader.setAttribute("class", "card-header bg-dark text-light text-center");
    
        const h5Header = document.createElement("h5");
        h5Header.setAttribute("class", "text-center fw-bold");
        h5Header.textContent = "Información personal";
    
        const piBody = document.createElement("div");
        piBody.setAttribute("class", "card-body");
    
        const ulPiBody = document.createElement("ul");
        ulPiBody.setAttribute("class", "list-group list-group-flush");
    
        const divEmail = document.createElement("div");
        divEmail.setAttribute("class", "mb-2");
    
        const emailLabel = document.createElement("label");
        emailLabel.setAttribute("class", "form-label fw-bold");
        emailLabel.textContent = "Correo Electrónico:";
    
        const liEmail = document.createElement("li");
        liEmail.setAttribute("class", "list-group-item");
        liEmail.textContent = `${inputEmail.value}`;
    
        const divPhone = document.createElement("div");
        divPhone.setAttribute("class", "mb-2");
    
        const phoneLabel = document.createElement("label");
        phoneLabel.setAttribute("class", "form-label fw-bold");
        phoneLabel.textContent = "Número de teléfono:";
    
        const liPhone = document.createElement("li");
        liPhone.setAttribute("class", "list-group-item");
        liPhone.textContent = `${inputPhone.value}`;
    
        const divBirthdayDate = document.createElement("div");
        divBirthdayDate.setAttribute("class", "mb-2");
    
        const birthdayDateLabel = document.createElement("label");
        birthdayDateLabel.setAttribute("class", "form-label fw-bold");
        birthdayDateLabel.textContent = "Fecha de nacimiento:";
    
        const liBirthdaydate = document.createElement("li");
        liBirthdaydate.setAttribute("class", "list-group-item");
        liBirthdaydate.textContent = `${birthdayDate.value}`;
    
        const divLink = document.createElement("div");
        divLink.setAttribute("class", "mb-2");
    
        const linkLabel = document.createElement("label");
        linkLabel.setAttribute("class", "form-label fw-bold");
        linkLabel.textContent = "LinkedIn:";
    
        const liLink = document.createElement("li");
        liLink.setAttribute("class", "list-group-item");
        
        const aLink = document.createElement("a");
        aLink.href = inputLink.value;
        aLink.textContent = inputLink.value;
        aLink.target = "_blank";
    
        const divCardSkills = document.createElement("div");
        divCardSkills.setAttribute("class", "mb-3");
    
        const skillHeader = document.createElement("div");
        skillHeader.setAttribute("class", "card-header bg-dark text-light text-center");
    
        const h5SkillHeader = document.createElement("h5");
        h5SkillHeader.setAttribute("class", "text-center fw-bold");
        h5SkillHeader.textContent = "Habilidades";
    
        const skillBody = document.createElement("div");
        skillBody.setAttribute("class", "card-body");
    
        const ulSkillBody = document.createElement("ul");
        ulSkillBody.setAttribute("class", "list-group list-group-flush");
    
        const skillData = SslData(skillsContainer);

        skillData.forEach(skill => {
            const liSkill = document.createElement("li");
            liSkill.setAttribute("class", "list-group-item");

            const skillElement = document.createElement("div");
            skillElement.setAttribute("class", "fw-bold");
            skillElement.textContent = skill.input;

            const ratingElement = document.createElement("div");
            ratingElement.setAttribute("class", "text-muted");
            ratingElement.textContent = `Nivel de habilidad: ${skill.rating}/5`;

            liSkill.appendChild(skillElement);
            liSkill.appendChild(ratingElement);

            ulSkillBody.appendChild(liSkill);
        });
    
        const divCardSoftware = document.createElement("div");
        divCardSoftware.setAttribute("class", "mb-3");
    
        const softwareHeader = document.createElement("div");
        softwareHeader.setAttribute("class", "card-header bg-dark text-light text-center");
    
        const h5SoftwareHeader = document.createElement("h5");
        h5SoftwareHeader.setAttribute("class", "text-center fw-bold");
        h5SoftwareHeader.textContent = "Software";
    
        const softwareBody = document.createElement("div");
        softwareBody.setAttribute("class", "card-body");
    
        const ulSoftwareBody = document.createElement("ul");
        ulSoftwareBody.setAttribute("class", "list-group list-group-flush");

        const softwareData = SslData(softwareContainer);
    
        softwareData.forEach(software => {
            const liSoftware = document.createElement("li");
            liSoftware.setAttribute("class", "list-group-item");

            const softwareElement = document.createElement("div");
            softwareElement.setAttribute("class", "fw-bold");
            softwareElement.textContent = software.input;

            const ratingElement = document.createElement("div");
            ratingElement.setAttribute("class", "text-muted");
            ratingElement.textContent = `Nivel de habilidad: ${software.rating}/5`;

            liSoftware.appendChild(softwareElement);
            liSoftware.appendChild(ratingElement);

            ulSoftwareBody.appendChild(liSoftware);
        });
    
        const divCardLanguage = document.createElement("div");
        divCardLanguage.setAttribute("class", "mb-3");
    
        const LanguageHeader = document.createElement("div");
        LanguageHeader.setAttribute("class", "card-header bg-dark text-light text-center");
    
        const h5LanguageHeader = document.createElement("h5");
        h5LanguageHeader.setAttribute("class", "text-center fw-bold");
        h5LanguageHeader.textContent = "Idiomas";
    
        const LanguageBody = document.createElement("div");
        LanguageBody.setAttribute("class", "card-body");
    
        const ulLanguageBody = document.createElement("ul");
        ulLanguageBody.setAttribute("class", "list-group list-group-flush");
    
        const languageData = SslData(languageContainer);
    
        languageData.forEach(language => {
            const liLanguage = document.createElement("li");
            liLanguage.setAttribute("class", "list-group-item");

            const languageElement = document.createElement("div");
            languageElement.setAttribute("class", "fw-bold");
            languageElement.textContent = language.input;

            const ratingElement = document.createElement("div");
            ratingElement.setAttribute("class", "text-muted");
            ratingElement.textContent = `Nivel de habilidad: ${language.rating}/5`;

            liLanguage.appendChild(languageElement);
            liLanguage.appendChild(ratingElement);

            ulLanguageBody.appendChild(liLanguage);
        });
    
        const side = document.createElement("div");
        side.setAttribute("class", "card col-sm-6 py-4 mb-5 ms-3");
    
        const divCardSummary = document.createElement("div");
        divCardSummary.setAttribute("class", "mb-2 mt-2");
    
        const summaryHeader = document.createElement("div");
        summaryHeader.setAttribute("class", "card-header bg-dark text-light text-center");
    
        const h5SummaryHeader = document.createElement("h5");
        h5SummaryHeader.setAttribute("class", "text-center fw-bold");
        h5SummaryHeader.textContent = "Resumen laboral";
    
        const summaryBody = document.createElement("div");
        summaryBody.setAttribute("class", "card-body");
    
        const ulSummaryBody = document.createElement("ul");
        ulSummaryBody.setAttribute("class", "list-group list-group-flush");
    
        const liSummary = document.createElement("li");
        liSummary.setAttribute("class", "list-group-item");
        liSummary.textContent = `${inputSummary.value}`;
    
        const divCardExperience = document.createElement("div");
        divCardExperience.setAttribute("class", "mb-2 mt-2");

        const experienceHeader = document.createElement("div");
        experienceHeader.setAttribute("class", "card-header bg-dark text-light text-center");

        const h5ExperienceHeader = document.createElement("h5");
        h5ExperienceHeader.setAttribute("class", "text-center fw-bold");
        h5ExperienceHeader.textContent = "Experiencia laboral";

        const experienceBody = document.createElement("div");
        experienceBody.setAttribute("class", "card-body");

        const ulExperienceBody = document.createElement("ul");
        ulExperienceBody.setAttribute("class", "list-group list-group-flush");

        const experienceData = EecData(experienceContainer);

        experienceData.forEach(exp => {
            const liExperience = document.createElement("li");
            liExperience.setAttribute("class", "list-group-item");

            const textElement = document.createElement("div");
            textElement.setAttribute("class", "fw-bold");
            textElement.textContent = exp.text;

            const dateElement = document.createElement("div");
            dateElement.setAttribute("class", "text-muted");
            dateElement.textContent = `(${exp.startDate} - ${exp.endDate})`;

            liExperience.appendChild(textElement);
            liExperience.appendChild(dateElement);

            ulExperienceBody.appendChild(liExperience);
        });
    
        const divCardEducation = document.createElement("div");
        divCardEducation.setAttribute("class", "mb-2 mt-2");
    
        const educationHeader = document.createElement("div");
        educationHeader.setAttribute("class", "card-header bg-dark text-light text-center");
    
        const h5EducationHeader = document.createElement("h5");
        h5EducationHeader.setAttribute("class", "text-center fw-bold");
        h5EducationHeader.textContent = "Educación";
    
        const educationBody = document.createElement("div");
        educationBody.setAttribute("class", "card-body");
    
        const ulEducationBody = document.createElement("ul");
        ulEducationBody.setAttribute("class", "list-group list-group-flush");
    
        const educationData = EecData(educationContainer);

        educationData.forEach(edu => {
            const liEducation = document.createElement("li");
            liEducation.setAttribute("class", "list-group-item");

            const textElement = document.createElement("div");
            textElement.setAttribute("class", "fw-bold");
            textElement.textContent = edu.text;

            const dateElement = document.createElement("div");
            dateElement.setAttribute("class", "text-muted");
            dateElement.textContent = `(${edu.startDate} - ${edu.endDate})`;

            liEducation.appendChild(textElement);
            liEducation.appendChild(dateElement);

            ulEducationBody.appendChild(liEducation);
        });
    
        const divCardcertification = document.createElement("div");
        divCardcertification.setAttribute("class", "mb-3 mt-2");
    
        const certificationHeader = document.createElement("div");
        certificationHeader.setAttribute("class", "card-header bg-dark text-light text-center");
    
        const h5certificationHeader = document.createElement("h5");
        h5certificationHeader.setAttribute("class", "text-center fw-bold");
        h5certificationHeader.textContent = "Educación";
    
        const certificationBody = document.createElement("div");
        certificationBody.setAttribute("class", "card-body");
    
        const ulcertificationBody = document.createElement("ul");
        ulcertificationBody.setAttribute("class", "list-group list-group-flush");
    
        const certificationData = EecData(certificationContainer);

        certificationData.forEach(cer => {
            const liCertification = document.createElement("li");
            liCertification.setAttribute("class", "list-group-item");

            const textElement = document.createElement("div");
            textElement.setAttribute("class", "fw-bold");
            textElement.textContent = cer.text;

            const dateElement = document.createElement("div");
            dateElement.setAttribute("class", "text-muted");
            dateElement.textContent = `(${cer.startDate} - ${cer.endDate})`;

            liCertification.appendChild(textElement);
            liCertification.appendChild(dateElement);

            ulcertificationBody.appendChild(liCertification);
        });

        const divDownload = document.createElement("div");
        divDownload.setAttribute("class", "mb-3 mt-4 col-sm-10");

        const btnDownload = document.createElement("button");
        btnDownload.setAttribute("class", "btn btn-dark float-end");
        btnDownload.textContent = "Descargar CV";
        btnDownload.type = "button";
        btnDownload.addEventListener("click", function () {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
        
            const element = cvContainer; 
        
            setTimeout(() => {
                html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true
                }).then(canvas => {
                    const imgData = canvas.toDataURL("image/png");
                    const imgWidth = 190; 
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
                    let y = 10;
                    if (imgHeight > 280) {
                        let pages = Math.ceil(imgHeight / 280);
                        for (let i = 0; i < pages; i++) {
                            if (i > 0) doc.addPage();
                            doc.addImage(imgData, "PNG", 10, y - i * 280, imgWidth, imgHeight);
                        }
                    } else {
                        doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
                    }
        
                    doc.save(`${nombre} - CV.pdf`);
                });
            }, 500); 
        });

        columna.appendChild(cvHeader);
        cv.appendChild(column);
        cv.appendChild(side);
        button.appendChild(divDownload);
    
        cvHeader.appendChild(h3CV);

        divDownload.appendChild(btnDownload);
    
        divNameTitle.appendChild(h3Name);
        divNameTitle.appendChild(h5Title);
    
        divCardPersonalInfo.appendChild(piHeader);
        divCardPersonalInfo.appendChild(piBody);
    
        divCardSkills.append(skillHeader);
        divCardSkills.append(skillBody);
    
        piHeader.appendChild(h5Header);
    
        piBody.appendChild(ulPiBody);
        piBody.appendChild(divEmail);
        piBody.appendChild(divPhone);
        piBody.appendChild(divBirthdayDate);
        piBody.appendChild(divLink);
    
        divEmail.appendChild(emailLabel);
        divEmail.appendChild(liEmail);
    
        divPhone.appendChild(phoneLabel);
        divPhone.appendChild(liPhone);
    
        divBirthdayDate.appendChild(birthdayDateLabel);
        divBirthdayDate.appendChild(liBirthdaydate);
    
        divLink.appendChild(linkLabel);
        divLink.appendChild(liLink);
        liLink.appendChild(aLink);
    
        skillHeader.appendChild(h5SkillHeader);
        skillBody.appendChild(ulSkillBody);
    
        divCardSkills.appendChild(skillBody);
        
        softwareHeader.appendChild(h5SoftwareHeader);
        softwareBody.appendChild(ulSoftwareBody);
    
        divCardSoftware.appendChild(softwareHeader);
        divCardSoftware.appendChild(softwareBody);
    
        LanguageHeader.appendChild(h5LanguageHeader);
        LanguageBody.appendChild(ulLanguageBody);
    
        divCardLanguage.appendChild(LanguageHeader);
        divCardLanguage.appendChild(LanguageBody);
    
        column.appendChild(divNameTitle);
        column.appendChild(divCardPersonalInfo);
        column.appendChild(divCardSkills);
        column.appendChild(divCardSoftware);
        column.appendChild(divCardLanguage);
    
        summaryHeader.appendChild(h5SummaryHeader);
        ulSummaryBody.appendChild(liSummary);
        summaryBody.appendChild(ulSummaryBody);
    
        divCardSummary.appendChild(summaryHeader);
        divCardSummary.appendChild(summaryBody);
    
        experienceHeader.appendChild(h5ExperienceHeader);
        experienceBody.appendChild(ulExperienceBody);
    
        divCardExperience.appendChild(experienceHeader);
        divCardExperience.appendChild(experienceBody);
    
        educationHeader.appendChild(h5EducationHeader);
        educationBody.appendChild(ulEducationBody);
    
        divCardEducation.appendChild(educationHeader);
        divCardEducation.appendChild(educationBody);
    
        certificationHeader.appendChild(h5certificationHeader);
        certificationBody.appendChild(ulcertificationBody);
    
        divCardcertification.appendChild(certificationHeader);
        divCardcertification.appendChild(certificationBody);
    
        side.appendChild(divCardSummary);
        side.appendChild(divCardExperience);
        side.appendChild(divCardEducation);
        side.appendChild(divCardcertification);
    
        cvContainer.appendChild(cv);

        const nombre = inputName.value;

        inputClear(inputName);
        inputClear(inputTitle);
        inputClear(inputEmail);
        inputClear(inputPhone);
        inputClear(birthdayDate);
        inputClear(inputLink);
        inputClear(inputSkill);
        inputClear(skillLevelSelector);
        inputClear(inputIde);
        inputClear(ideLevelSelector);
        inputClear(inputLanguage);
        inputClear(languageLevelSelector);
        inputClear(inputSummary);
        inputClear(inputExperience);
        inputClear(startDateExperience);
        inputClear(endDateExperience);
        inputClear(inputEducation);
        inputClear(startDateEducation);
        inputClear(endDateEducation);
        inputClear(inputCertification);
        inputClear(startDateCertification);
        inputClear(endDateCertification);
        remove(skillsContainer);
        remove(softwareContainer);
        remove(languageContainer);
        remove(experienceContainer);
        remove(educationContainer);
        remove(certificationContainer);
    
    } else{
        alert("Todos los campos deben ser completados.");
    } 
}

function inputClear(input) {
    input.value = "";
    input.classList.remove("input-success");
    input.classList.remove("input-error");
}

function remove(container) {
    const children = Array.from(container.children);
    children.forEach(child => {
        if (!child.hasAttribute("data-static")) { 
            container.removeChild(child);
        }
    });
}
