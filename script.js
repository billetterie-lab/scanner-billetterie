const API = "https://script.google.com/macros/s/AKfycbyX_ecE4B21bhmVlEidZtFgCd_gawuGXP0yxxRtchvHiJtqoYJllnQMtAtSdUWt3oJ6JQ/exec";

fetch(API + "?info=event")
.then(r => r.json())
.then(rep => {

    document.getElementById("evenement").innerHTML =
        rep.evenement;

});
let scanner;
let lecture = false;

function afficher(message, couleur) {

    document.body.style.backgroundColor = couleur;
    document.getElementById("resultat").innerHTML = message;
    // scanner.pause(true);
    if (scanner.pause) {
    scanner.pause(true);
}
}

function retourScanner() {

    document.body.style.backgroundColor = "#f4f4f4";
    document.getElementById("resultat").innerHTML = "Prêt à scanner...";
    lecture = false;
   // scanner.resume();
    if (scanner.resume) {
    scanner.resume();
};
}

async function traiter(decodedText) {

    if (lecture) return;

    lecture = true;

    // Si le QR contient une URL complète, on récupère seulement l'UUID
    if (decodedText.includes("uuid=")) {

        decodedText = decodedText.split("uuid=")[1];

    }

    try {

const response = await fetch(
    API + "?uuid=" + encodeURIComponent(decodedText),
    {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    }
);
        const rep = await response.json();
        const restants = rep.total - rep.controles;
    // Mise à jour du compteur
    document.getElementById("compteur").innerHTML =
    `🎫 ${rep.controles}/${rep.total} | 🎟 ${restants}`;
        
        if (navigator.vibrate) {
            navigator.vibrate(150);
        }

if (rep.statut === "OK") {

    afficher(`
    <h2>✅ ENTRÉE AUTORISÉE</h2>

    <h3>${rep.prenom} ${rep.nom}</h3>

    <p>${rep.billet} • ${rep.tarif}</p>
`, "#27ae60");

    setTimeout(retourScanner, 2000);

}
else if (rep.statut === "DEJA") {

    afficher(`
        <h2>❌ BILLET DÉJÀ UTILISÉ</h2>

        <h3>${rep.prenom} ${rep.nom}</h3>

        <p>${rep.billet}</p>

        <p>Déjà validé :</p>

        <p>${rep.heure}</p>

        <hr>

   
    `, "#c0392b");

    setTimeout(retourScanner, 4000);

}
else {

    afficher(`
        <h2>❌ QR CODE INCONNU</h2>

        <hr>

        <h2>${rep.controles} / ${rep.total}</h2>

    `, "#8e0000");

    setTimeout(retourScanner, 4000);

}

    }

    catch (err) {

        afficher(

            "<h2>⚠️ Erreur de communication</h2><br>" + err,

            "#555555"

        );

    }

    
}

window.onload = function () {

    fetch(API + "?info=event")
    .then(r => r.json())
    .then(rep => {
        document.getElementById("evenement").innerHTML =
            rep.evenement;
    });

    fetch(API + "?info=compteurs")
    .then(r => r.json())
    .then(rep => {

        const restants = rep.total - rep.controles;

        document.getElementById("compteur").innerHTML =
            `🎫 ${rep.controles}/${rep.total} | 🎟 ${restants}`;

});
    scanner = new Html5QrcodeScanner(
        "reader",
        {
            fps: 8,
            qrbox: 160,
            rememberLastUsedCamera: true
        }
    );

    scanner.render(traiter);

};
