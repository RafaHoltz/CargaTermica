function cargaPessoas(numPessoas, calorPessoas = 125) {
    return numPessoas * calorPessoas / 1000; // convertendo para kW
}

function cargaExterno(volumeAr, deltaT, deltaW) {
    const sensivelConst = 1.2; // kW/m³/h/°C
    const latenteConst = 0.68; // kW/m³/h/g/kg

    const cargaSensivel = sensivelConst * volumeAr * deltaT;
    const cargaLatente = latenteConst * volumeAr * deltaW;

    return {
        cargaSensivel,
        cargaLatente,
        cargaSensLat: cargaSensivel + cargaLatente
    };
}

function cargaParedes(area, U, deltaT) {
    return U * area * deltaT / 1000; // convertendo para kW
}

function cargaIluminacao(area, w2m) {
    return area * w2m / 1000; // convertendo para kW
}

function cargaEquipamentos(potEquipamentos) {
    return potEquipamentos / 1000; // convertendo para kW
}

function cargaTermicaTotal(params) {
    const cargaP = cargaPessoas(params.numpessoas);
    const cargaA = cargaExterno(params.VolumeAEX, params.deltaT, params.deltaW);
    const cargaPar = cargaParedes(params.areaParedes, params.uValueParedes, params.deltaTParedes);
    const cargaI = cargaIluminacao(params.areaIluminacao, params.wattsIluminacao);
    const cargaE = cargaEquipamentos(params.potenciaEquipamentos);

    const cargaTotal = cargaP + cargaA.cargaSensLat + cargaPar + cargaI + cargaE;
    return {
        cargaTotal,
        cargaSensivel: cargaA.cargaSensivel,
        cargaLatente: cargaA.cargaLatente
    };
}

function kwParaKbtu(cargaKw) {
    const kwToKbtuConst = 3.41214;
    return cargaKw * kwToKbtuConst;
}

function calcularCargaTermica() {
    const params = {
        numpessoas: parseFloat(document.getElementById('numpessoas').value),
        VolumeAEX: parseFloat(document.getElementById('VolumeAEX').value),
        deltaT: parseFloat(document.getElementById('deltaT').value),
        deltaW: parseFloat(document.getElementById('deltaW').value),
        areaParedes: parseFloat(document.getElementById('areaParedes').value),
        uValueParedes: parseFloat(document.getElementById('uValueParedes').value),
        deltaTParedes: parseFloat(document.getElementById('deltaTParedes').value),
        areaIluminacao: parseFloat(document.getElementById('areaIluminacao').value),
        wattsIluminacao: parseFloat(document.getElementById('wattsIluminacao').value),
        potenciaEquipamentos: parseFloat(document.getElementById('potenciaEquipamentos').value)
    };

    const cargas = cargaTermicaTotal(params);
    const cargaTotalKw = cargas.cargaTotal;
    const cargaTotalKbtu = kwParaKbtu(cargaTotalKw);

    document.getElementById('cargaKw').innerText = cargaTotalKw.toFixed(2);
    document.getElementById('cargaKbtu').innerText = cargaTotalKbtu.toFixed(2);
}
