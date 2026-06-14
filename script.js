const API = "https://script.google.com/macros/s/AKfycbx6DFYvy6hKWB3SZzjd4dXo055b1HsqL6i3OtmQd9dcbz8-VgxaZT9vEeKvBATJQYRZfA/exec";

let scanner;
let lecture = false;

function afficher(message, couleur) {

    document.body.style.backgroundColor = couleur;
    document.getElementById("resultat").innerHTML = message;
    scanner.pause(true);
}

function retourScanner() {

    document.body.style.backgroundColor = "#f4f4f4";
    document.getElementById("resultat").innerHTML = "Prêt à scanner...";
    lecture = false;
    scanner.resume();
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
    // Mise à jour du compteur
        document.getElementById("compteur").innerHTML =
        "🎫 Contrôlés : " + rep.controles + " / " + rep.total;
        
        if (navigator.vibrate) {
            navigator.vibrate(150);
        }

if (rep.statut === "OK") {

    afficher(`
        <h2>✅ ENTRÉE AUTORISÉE</h2>

        <h3>${rep.prenom} ${rep.nom}</h3>

        <p>🎟 Billet : ${rep.billet}</p>

        <p>💶 Tarif : ${rep.tarif}</p>

        <hr>

        <h2>🎫 ${rep.controles} / ${rep.total}</h2>

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

        <h2>${rep.controles} / ${rep.total}</h2>

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

    setTimeout(retourScanner, 2500);

}

window.onload = function () {

    scanner = new Html5QrcodeScanner(

        "reader",

        {

            fps: 10,

            qrbox: 160,

            rememberLastUsedCamera: true,

            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]

        },

        false

    );

    scanner.render(traiter);

};
