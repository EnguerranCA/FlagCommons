export async function loadTemplate(templatePath) {
    try {
        const response = await fetch(templatePath);
        if (!response.ok) {
            throw new Error(`Failed to load template from ${templatePath}`);
        }
        const template = await response.text();
        return template;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

