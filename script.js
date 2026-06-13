const API =
"https://script.google.com/macros/s/AKfycbwxWLrSlgT1TJWZU-iS3N9mhYx1qzk-JxtOidgRznBJhEvZfgui6ROu4cott6Ffcz7hFQ/exec";

let scanner;

let lecture=false;

function afficher(msg,couleur){

    document.body.style.background=couleur;

    document.getElementById("resultat").innerHTML=msg;
}

function retour(){

    document.body.style.background="#f4f4f4";

    document.getElementById("resultat").innerHTML="Prêt à scanner...";

    lecture=false;

}

function traiter(decodedText){

    if(lecture)return;

    lecture=true;

    fetch(API,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            uuid:decodedText

        })

    })

.then(r => r.json())
.then(rep => {

        if(navigator.vibrate){

            navigator.vibrate(150);

        }

        if(rep.statut=="OK"){

            afficher(

`<h2>✅ ENTRÉE AUTORISÉE</h2>

<b>${rep.prenom} ${rep.nom}</b><br><br>

Tarif : ${rep.tarif}<br>

Billet : ${rep.billet}<br><br>

🎫 ${rep.controles} / ${rep.total} billets contrôlés`,

"#27ae60");

        }

        else if(rep.statut=="DEJA"){

            afficher(

`<h2>❌ BILLET DÉJÀ UTILISÉ</h2>

<b>${rep.prenom} ${rep.nom}</b><br><br>

Déjà validé<br>

${rep.heure}<br><br>

🎫 ${rep.controles} / ${rep.total}`,

"#c0392b");

        }

        else{

            afficher(

"<h2>❌ QR CODE INCONNU</h2>",

"#8e0000");

        }

        setTimeout(retour,2000);

    });

}

scanner=new Html5QrcodeScanner(

"reader",

{

fps:10,

qrbox:250,

rememberLastUsedCamera:true

}

);

scanner.render(traiter);
