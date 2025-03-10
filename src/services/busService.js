const axios = require("axios");
const https = require("https");

async function obtenerTiemposAutobuses(paradaId) {
    try {
        const url = `https://www.vitoria-gasteiz.org/j16-02w/detalleAction.do?accion=CONSULTA_PARADAS&charset=UTF-8&idParada=${paradaId}`;
        const httpsAgent = new https.Agent({ rejectUnauthorized: false }); // Desactiva la verificación
        const response = await axios.get(url, { httpsAgent });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener datos para la parada ${paradaId}:`, error.message);
        return { error: "No se pudo obtener la información para esta parada." };
    }
}

module.exports = { obtenerTiemposAutobuses };
