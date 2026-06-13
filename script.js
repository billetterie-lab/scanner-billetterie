function onScanSuccess(decodedText){

    document.getElementById("resultat").innerHTML =
        "QR détecté :<br><br>" + decodedText;

}

const scanner = new Html5QrcodeScanner(
    "reader",
    {
        fps:10,
        qrbox:250
    }
);

scanner.render(onScanSuccess);
