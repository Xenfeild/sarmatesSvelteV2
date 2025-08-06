<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once 'cms/functions/pdo.php';

$pdo2 = null;
$dtest = "contact@sarmates-music.com";
$table = "contacts"; // Table fixée en dur

function getUserIpAddr(){
    if(!empty($_SERVER['HTTP_CLIENT_IP'])){
        //ip from share internet
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    }elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
        //ip pass from proxy
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    }else{
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}

// timer
date_default_timezone_set('Europe/Paris');
$userIp = getUserIpAddr();
$dateReq = $_SERVER['REQUEST_TIME'];
// date autorisation : $dateReq + 5 minutes
$dateAut = $dateReq +(5*60);

// Variables default response Js fetch
$rep = [];
$status = 200;
$srvMsg = "Le message est transmis";

// Validation et nettoyage des champs
$prenom = substr(trim(htmlspecialchars($_POST['name'] ?? '')), 0, 50);
$nom = substr(trim(htmlspecialchars($_POST['surename'] ?? '')), 0, 50);
$email = substr(trim(htmlspecialchars($_POST['email'] ?? '')), 0, 100);
$company = substr(trim(htmlspecialchars($_POST['company'] ?? '')), 0, 100);
$message = substr(trim(htmlspecialchars($_POST['message'] ?? '')), 0, 1000);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $srvMsg = "Email invalide.";
    $status = 400;
}

// reading IP and  date in the database
$historique = $pdo1->prepare('SELECT ip, authTime FROM contacts WHERE (ip = :userIp OR mail = :email) AND authTime > :dateReq');
$historique->execute(array(
    'userIp' => $userIp,
    'email' => $email,
    'dateReq' => $dateReq
));
while ($donnees = $historique->fetch())
{
    if(($donnees['ip'] == $userIp) && ($donnees['authTime'] > $dateReq)) {
        $srvMsg= "SECURITE : Vous avez déjà envoyé un message il y a moins de 5 minutes, merci de patienter.";
        $status = 429;
    }
}

$historique->closeCursor(); // Fin de traitement historique

if($status == 200){
    //préparation requête écriture
    $req = $pdo1->prepare("INSERT INTO contacts (ip, authTime, prenom, nom, mail, company, message)
        VALUES(:userIp, :dateAut, :prenom, :nom, :mail, :company, :message)");
    //Ecriture dans la BDD
    $req->execute(array(
        'userIp' => $userIp,
        'dateAut' => $dateAut,
        'prenom' => $prenom,
        'nom' => $nom,
        'mail' => $email,
        'company' => $company,
        'message' => $message
    ));
    //Sending mail
    ini_set('display_errors', 1);
    error_reporting(E_ALL);

    $to = $dtest;
    $subject = "Nouveau contact de : ".$prenom;
    $mailContent = "Formulaire : ".$prenom." a envoyé ce message :\n";
    $mailContent .= $prenom." ".$nom."\n";
    $mailContent .= $email." ".$company."\n";
    $mailContent .= htmlspecialchars($message, ENT_QUOTES, 'UTF-8')."\n";
    $mailContent .= "\nNe pas répondre à ce message.\n\n++";
    $headers = 'From: contact@sarmates-music.com' . "\r\n" .
        'Reply-To: contact@sarmates-music.com' . "\r\n" .
        'X-Mailer: PHP/' . phpversion();
    mail($to, $subject, $mailContent, $headers);
}

$rep = ["status" => $status];
$rep += ["message" => $srvMsg];

// back for request fetch
header('Access-Control-Allow-Origin: *');
header("Content-Type: application/json");
echo json_encode($rep, JSON_UNESCAPED_UNICODE);

?>