// %2FSite_Nsi%2F changer cette valeur pour le chemin racine jusqu'a File non compris les / sont remplacer par des %2F et on commence par un %2F
const pageQuote = "%2Fm_nsi%2Fnsi%2Ft2%2F" 

pdfjsLib.GlobalWorkerOptions.workerSrc = 'PDFJS/build/pdf.worker.js';

// ici on récupère les deux fichier .json 
var config = fetch("./config.json").then((data) => data.json()).then((data) => Chapitrage(data));
var Search = fetch("./Search.json").then((data) => data.json()).then((data) => { window.dataSearch = data });

// cette fonction créer le chapitrage a partir du config.json
async function Chapitrage(config) {
    const divAllChapitre = document.getElementById("chapitre");
    window.AllHref = {}
    for (const indexChapitre in config) {
        var chapitre = config[indexChapitre]
        var divChapitre = document.createElement("div");
        divChapitre.className = "text-left p-0 m-0"
        var h3Titre = '<h3 class="text-lg pl-4 py-2 pr-0 align-middle select-none font-bold">' + chapitre.Titre_Chap + '</h3>'
        if (chapitre.Table_Des_Matière) {

            window.AllHref[chapitre.Pdf_Href] = chapitre.Titre_Chap

            var pdf = await pdfjsLib.getDocument(chapitre.Pdf_Href).promise.then((pdf) => { return pdf; });
            var Spans = ""
            var tempSpans = ""
            for (let i = 1; i < chapitre.Table_Des_Matière_Length + 1; i++) {
                var page = await pdf.getPage(i).then((page) => { return page; });

                var result = await page.getTextContent().then(function (result) { return result; });

                if (i >= 2) {
                    var data = result["items"]
                    data = data.slice(2, data.length - 2)
                } else {
                    var data = result["items"]
                    data = data.slice(2, data.length)
                }

                for (let w = 0; w < data.length; w++) {
                    var ligne = data[w].str
                    if (ligne.indexOf(" ") === -1) {
                        if (tempSpans != "") {
                            Spans += '<span onclick="pdfHref(\'' + chapitre.Pdf_Href + '\',' + ligne + ')" class="cursor-pointer"><p class="pl-6 pr-0 py-1 hover:bg-gray-400 align-middle select-none">' + tempSpans.slice(2, tempSpans.length) + '</p></span>'
                            tempSpans = ""
                        }

                    } else if (ligne.indexOf(".") === -1) {
                        if (tempSpans === "") {
                            tempSpans += ligne
                        } else {
                            tempSpans += " " + ligne
                        }
                    }

                }

            }
        } else {
            var Spans = ''
            for (const indexSous_Chapitre in chapitre.Sous_Chapitre) {
                SousChapitre = chapitre.Sous_Chapitre[indexSous_Chapitre]
                if (SousChapitre.Type == "pdf") {
                    window.AllHref[SousChapitre.Href] = chapitre.Titre_Chap + "!$§" + SousChapitre.Titre
                    Spans += '<span onclick="pdfHref(\'' + SousChapitre.Href + '\',' + 0 + ')" class="cursor-pointer"><p class="pl-6 pr-0 py-1 hover:bg-gray-400 align-middle select-none">' + SousChapitre.Titre + '</p></span>'
                } else {
                    Spans += '<a href="' + SousChapitre.Href + '" target="_blank"><span><p class="pl-6 pr-0 py-1 hover:bg-gray-400 align-middle select-none">' + SousChapitre.Titre + '</p></span></a>'
                }

            }

        }
        divChapitre.innerHTML = h3Titre + Spans
        divAllChapitre.appendChild(divChapitre)
    }
    document.getElementById("divMenu").innerHTML = '<button class="focus:outline-none" onclick=menuSommaireOpen()><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="32" height="32"stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg></button>'
    window.endChapitrage = true
}

// cette fonction permet d'afficher la barre de recherche
function buttonSearch() {
    let objectButton = document.getElementById("objectButton");
    objectButton.remove();
    let divSearch = document.getElementById("divSearch");
    divSearch.innerHTML = "<div class='relative'><input type='text' id='inputSearch' onblur='setTimeout(function(){afficherSvg();}, 100);' autocomplete='off' oninput='inputSearch(this.value)' name='mytext' placeholder='Recherche' class='py-0.5 wx-48 text-center outline-none box-border h-auto border-2 border-black sm:px-28' /><div class='absolute bg-white box-border h-auto w-full border-2 mt-8 border-black' id='searchSuggestion'><span onclick='' class='cursor-pointer'><p class='px-4 pr-0 py-1 align-middle select-none'><strong>Aucune correspondance trouver</strong></p></span><div>"
    document.getElementById("inputSearch").focus()
}

// cette fonction permet de fermer la barre de recherche et de la remplacer par le svg de recherche
function afficherSvg() {
    let inputSearch = document.getElementById("inputSearch");
    inputSearch.remove();
    let divSearch = document.getElementById("divSearch");
    divSearch.innerHTML = '<button class="focus:outline-none" onclick=buttonSearch() id="objectButton"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="32" height="32" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>';
}

// cette fonction permet d'afficher le menu pour mobile
function menuSommaireOpen() {
    let divMenu = document.getElementById("divMenu")
    document.getElementById("chapitre-pdf").className += " hidden"
    var MenuChapitre = document.getElementById("chapitreMenu")
    MenuChapitre.className = "block w-full h-full z-10"
    MenuChapitre.innerHTML = document.getElementById("chapitre").innerHTML
    document.getElementById("footer").className = "hidden"
    divMenu.innerHTML = '<button class="focus:outline-none" onclick=menuSommaireClose()><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="32" height="32" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>'
}

// cette fonction sert a fermer le menu et changer le bouton du menu pour mobile
function menuSommaireClose() {
    let divMenu = document.getElementById("divMenu")
    var MenuChapitre = document.getElementById("chapitreMenu")
    MenuChapitre.className = "hidden w-full h-full z-10"
    MenuChapitre.innerHTML = ""
    document.getElementById("footer").className = "block"
    document.getElementById("chapitre-pdf").className = "flex flex-row"
    divMenu.innerHTML = '<button class="focus:outline-none" onclick=menuSommaireOpen()><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="32" height="32"stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg></button>'
}


//cette function fix des bugs sur le menuMobile et le faite de rezise la fenetre
function menuSommaireCloseResize() {
    let divMenu = document.getElementById("divMenu")
    if (window.innerWidth >= 1023 && window.endChapitrage) {
        document.getElementById("chapitreMenu").innerHTML = ""
        document.getElementById("chapitre-pdf").className = "flex flex-row"
        divMenu.innerHTML = '<button class="focus:outline-none" onclick=menuSommaireOpen()><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="32" height="32"stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg></button>'
    }

}

window.addEventListener('resize', menuSommaireCloseResize);

// cette fonction permet de classer un dictionaire par ordre décroissant 
function sort_object(dict) {
    var items = Object.keys(dict).map(function (key) {
        return [key, dict[key]];
    });

    items.sort(function (first, second) {
        return second[1] - first[1];
    });

    return items;
}

// Cette fonction permet d'afficher les resultat en temps réel de la recherche 
function inputSearch(string) {
    let searchSuggestion = document.getElementById("searchSuggestion")

    string = string.toLowerCase();
    string = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    string = string.split(" ")
    DicoHrefName = {}

    for (w in string) {
        mot = string[w]
        if (mot != "") {
            for (i in window.dataSearch) {
                x = i.substr(0, mot.length)
                if (x != undefined) {
                    if (x.indexOf(mot) != -1) {
                        for (z in window.dataSearch[i]) {
                            if (z in DicoHrefName) {
                                DicoHrefName[z] += window.dataSearch[i][z]
                            } else {
                                DicoHrefName[z] = window.dataSearch[i][z]
                            }

                        }
                    }

                }

            }
        }
    }
    Dico = {}
    for (i in DicoHrefName) {
        Dico[window.AllHref[i]] = DicoHrefName[i]

    }
    Dico = sort_object(Dico)
    DicoHrefName = sort_object(DicoHrefName)
    if (Dico.length == 0) {
        searchSuggestion.innerHTML = "<span onclick='' class='cursor-pointer'><p class='px-4 pr-0 py-1 align-middle select-none'><strong>Aucune correspondance trouver</strong></p></span>"
    } else {
        searchSuggestion.innerHTML = ""
    }

    for (i in Dico) {
        var suggestion = Dico[i][0]
        suggestion = suggestion.split("!$§")
        if (suggestion.length === 1) {
            searchSuggestion.innerHTML += '<span onmousedown="pdfHref(\'' + DicoHrefName[i][0] + '\',' + 0 + ')" class="cursor-pointer"><p class="px-4 pr-0 py-1 hover:bg-gray-400 align-middle select-none"><strong>' + suggestion[0] + '</strong></p></span>'
        } else {
            searchSuggestion.innerHTML += '<span onmousedown="pdfHref(\'' + DicoHrefName[i][0] + '\',' + 0 + ')" class="cursor-pointer"><p class="px-4 pr-0 py-1 hover:bg-gray-400 align-middle select-none"><strong>' + suggestion[0] + '</strong><br>' + suggestion[1] + '</p></span>'
        }

    }

}

// Cette fonction permet d'afficher le pdf quand on click sur n'importe quel element qui doit afficher un pdf
function pdfHref(url, page) {
    menuSommaireClose()
    document.getElementById("pdf").src = "PDFJS/web/viewer.html?file=" + pageQuote + url.replace("/", "%2F") + "#page=" + page + "&view=fitH";
}

// Ce pdf est le pdf qui est afficher quand on arrive sur le site
document.getElementById("pdf").src = "PDFJS/web/viewer.html?file=" + pageQuote + "File%2Fnsi_t_prog_dyn_1.pdf&view=fitH"
