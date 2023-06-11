var mode = 0;

const lFundo = "#f2f2f2";
const lFundoSecundario = "#fff";
const lTextoPadrao = "#000";
const lTextoFundoAzul = "#fff";
const lCorPrimaria = "#3E5BB2";
const lCorInput = "#fff";
const lBorda = "#ddd";

const dFundo = "#303030";
const dFundoSecundario = "#3a3a3a";
const dTextoPadrao = "#EEE";
const dTextoFundoAzul = "#EEE";
const dCorPrimaria = "#2f4588";
const dCorInput = "#414141";
const dBorda = "#606060";

var tamanhoFonte1 = 1.2;
var tamanhoFonte2 = 20;
var tamanhoFonte3 = 24;
var tamanhoFonte4 = 40;

var k = 0
document.cookie = "";

function getCookie(cname) {
    console.log("getCookie");
    let name = cname + "=";
    let decodeCookie = decodeURIComponent(document.cookie);
    let ca = decodeCookie.split("; ");
    console.log(ca)
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];

        if (c.indexOf(name) >= 0) {
            return c.substring(name.length, c.length);
        }
    }

    return "";
}

function checkCookie() {
    console.log("checkCookie");
    let modeButton = getCookie("modeButton");

    if (modeButton != "") {
        mode = parseInt(modeButton)
        console.log(mode)
        estadoCores()
    } else {
        console.log(modeButton)
        modeButton = mode;
        if (modeButton != "" && modeButton != null) {
            setCookie("modeButton", modeButton);
        }
    }

    let tF1 = getCookie("tamanhoFonte1");
    let tF2 = getCookie("tamanhoFonte2");
    let tF3 = getCookie("tamanhoFonte3");
    let tF4 = getCookie("tamanhoFonte4");
    if (tF1 != "" && tF2 != "" && tF3 != "" && tF4 != "") {
        tamanhoFonte1 = parseFloat(tF1)
        tamanhoFonte2 = parseFloat(tF2)
        tamanhoFonte3 = parseFloat(tF3)
        tamanhoFonte4 = parseFloat(tF4)

        console.log(tamanhoFonte1)
        tamanhoFonte()
    } else {
        console.log(modeButton)
        modeButton = mode;

        setCookie("tamanhoFonte1", tamanhoFonte1);
        setCookie("tamanhoFonte2", tamanhoFonte2);
        setCookie("tamanhoFonte3", tamanhoFonte3);
        setCookie("tamanhoFonte4", tamanhoFonte4);
    }
}

function setCookie(cname, cvalue) {
    console.log("setCookie")
    document.cookie = cname + "=" + cvalue;
}


function estadoCores() {
    if (mode == 1) {
        document.documentElement.style.setProperty("--fundo", dFundo);
        document.documentElement.style.setProperty("--fundo-secundario", dFundoSecundario);
        document.documentElement.style.setProperty("--texto-padrao", dTextoPadrao);
        document.documentElement.style.setProperty("--texto-fundo-azul", dTextoFundoAzul);
        document.documentElement.style.setProperty("--cor-primaria", dCorPrimaria);
        document.documentElement.style.setProperty("--cor-input", dCorInput);
        document.documentElement.style.setProperty("--borda", dBorda);
    } else if (mode == 0) {
        document.documentElement.style.setProperty("--fundo", lFundo);
        document.documentElement.style.setProperty("--fundo-secundario", lFundoSecundario);
        document.documentElement.style.setProperty("--texto-padrao", lTextoPadrao);
        document.documentElement.style.setProperty("--texto-fundo-azul", lTextoFundoAzul);
        document.documentElement.style.setProperty("--cor-primaria", lCorPrimaria);
        document.documentElement.style.setProperty("--cor-input", lCorInput);
        document.documentElement.style.setProperty("--borda", lBorda);
    }
}

function tamanhoFonte() {
    document.documentElement.style.setProperty("--tamanho-fonte-1", tamanhoFonte1 + "rem");
    document.documentElement.style.setProperty("--tamanho-fonte-2", tamanhoFonte2 + "px");
    document.documentElement.style.setProperty("--tamanho-fonte-3", tamanhoFonte3 + "px");
    document.documentElement.style.setProperty("--tamanho-fonte-4", tamanhoFonte4 + "px");
}


function swapLightAndDarkMode() {
    if (mode == 0) {
        mode = 1
        document.documentElement.style.setProperty("--fundo", dFundo);
        document.documentElement.style.setProperty("--fundo-secundario", dFundoSecundario);
        document.documentElement.style.setProperty("--texto-padrao", dTextoPadrao);
        document.documentElement.style.setProperty("--texto-fundo-azul", dTextoFundoAzul);
        document.documentElement.style.setProperty("--cor-primaria", dCorPrimaria);
        document.documentElement.style.setProperty("--cor-input", dCorInput);
        document.documentElement.style.setProperty("--borda", dBorda);


    } else if (mode == 1) {
        mode = 0
        document.documentElement.style.setProperty("--fundo", lFundo);
        document.documentElement.style.setProperty("--fundo-secundario", lFundoSecundario);
        document.documentElement.style.setProperty("--texto-padrao", lTextoPadrao);
        document.documentElement.style.setProperty("--texto-fundo-azul", lTextoFundoAzul);
        document.documentElement.style.setProperty("--cor-primaria", lCorPrimaria);
        document.documentElement.style.setProperty("--cor-input", lCorInput);
        document.documentElement.style.setProperty("--borda", lBorda);
    }

    setCookie("modeButton", mode)

}



function aumentarFonte() {
    tamanhoFonte1 += 0.1;
    tamanhoFonte2 += 1;
    tamanhoFonte3 += 1;
    tamanhoFonte4 += 1;
 
    document.documentElement.style.setProperty("--tamanho-fonte-1", tamanhoFonte1 + "rem");
    document.documentElement.style.setProperty("--tamanho-fonte-2", tamanhoFonte2 + "px");
    document.documentElement.style.setProperty("--tamanho-fonte-3", tamanhoFonte3 + "px");
    document.documentElement.style.setProperty("--tamanho-fonte-4", tamanhoFonte4 + "px");

    setCookie("tamanhoFonte1", tamanhoFonte1);
    setCookie("tamanhoFonte2", tamanhoFonte2);
    setCookie("tamanhoFonte3", tamanhoFonte3);
    setCookie("tamanhoFonte4", tamanhoFonte4);
}

function diminuirFonte() {
    tamanhoFonte1 -= 0.1;
    tamanhoFonte2 -= 1;
    tamanhoFonte3 -= 1;
    tamanhoFonte4 -= 1;



    document.documentElement.style.setProperty("--tamanho-fonte-1", tamanhoFonte1 + "rem");
    document.documentElement.style.setProperty("--tamanho-fonte-2", tamanhoFonte2 + "px");
    document.documentElement.style.setProperty("--tamanho-fonte-3", tamanhoFonte3 + "px");
    document.documentElement.style.setProperty("--tamanho-fonte-4", tamanhoFonte4 + "px");

    setCookie("tamanhoFonte1", tamanhoFonte1);
    setCookie("tamanhoFonte2", tamanhoFonte2);
    setCookie("tamanhoFonte3", tamanhoFonte3);
    setCookie("tamanhoFonte4", tamanhoFonte4);
}