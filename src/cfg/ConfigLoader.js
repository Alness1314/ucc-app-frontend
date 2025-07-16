export async function loadConfig() {
    const response = await fetch('/config.json');
    if (!response.ok) {
        throw new Error('No se pudo cargar la configuración');
    }
    const config = await response.json();

    // Mock process.env si no existe (navegador)
    if (!window.process) window.process = {};
    window.process.env = {
        ...window.process.env,
        ...config
    };
}
