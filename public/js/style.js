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


function swapLightAndDarkMode(){
    if(mode == 0){
        mode = 1;

        document.documentElement.style.setProperty("--fundo", dFundo);
        document.documentElement.style.setProperty("--fundo-secundario", dFundoSecundario);
        document.documentElement.style.setProperty("--texto-padrao", dTextoPadrao);
        document.documentElement.style.setProperty("--texto-fundo-azul", dTextoFundoAzul);
        document.documentElement.style.setProperty("--cor-primaria", dCorPrimaria);
        document.documentElement.style.setProperty("--cor-input", dCorInput);
        document.documentElement.style.setProperty("--borda", dBorda);

        return
    }

    mode = 0;

    document.documentElement.style.setProperty("--fundo", lFundo);
    document.documentElement.style.setProperty("--fundo-secundario", lFundoSecundario);
    document.documentElement.style.setProperty("--texto-padrao", lTextoPadrao);
    document.documentElement.style.setProperty("--texto-fundo-azul", lTextoFundoAzul);
    document.documentElement.style.setProperty("--cor-primaria", lCorPrimaria);
    document.documentElement.style.setProperty("--cor-input", lCorInput);
    document.documentElement.style.setProperty("--borda", lBorda);

    
}