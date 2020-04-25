<?php
include './API.php';

// obtienen la accion proveniente de js
switch ( $_GET['action'] ) {
  case 'getAccessToken':
    getAccessToken();
    break;

  case 'sendMessage':
      sendMessage( $_GET['accessToken'], $_GET['sessionToken'], $_GET['message'] );
    break;

  case 'setupConversation':
      setupConversation( $_GET['accessToken'] );
    break;
  
  default:
    # code...
    break;
}

/**
 * [sendMessage Envia un mensaje al bot de inbenta]
 * @param  [String] $accessToken  [token de acceso tipo Bearer]
 * @param  [String] $sessionToken [token de sesion tipo Bearer]
 * @param  [String] $message      [mensaje enviado por el usuario]
 * @return [JSON]               [description]
 */
function sendMessage( $accessToken, $sessionToken, $message ){
  $url = 'https://api-gce3.inbenta.io/prod/chatbot/v1/conversation/message';
  $data_array =  array(
        "message" => $message,
        "type" => "answer",
        "suggestedAnswer" => "Star Wars",
  );

  $make_call = callAPIAuthBearerSession( 'POST', $url, json_encode($data_array), $accessToken, $sessionToken );
  $response = json_decode($make_call, true);

  print_r($make_call);
};//sendMessage

/**
 * [setupConversation Configura la conversacion con el bot y obtiene el token de sesion]
 * @param  [String] $accessToken  [token de acceso tipo Bearer]
 * @return [JSON]              [description]
 */
function setupConversation( $accessToken ){
  $url = 'https://api-gce3.inbenta.io/prod/chatbot/v1/conversation';
  $data_array =  array(
        "lang" => "en",
  );

  $make_call = callAPIAuthBearer('POST', $url, json_encode($data_array), $accessToken);
  $response = json_decode($make_call, true);

  print_r($make_call);
};//startConversation

/**
 * [getAccessToken Obtienen el token de acceso]
 * @return [JSON] [description]
 */
function getAccessToken(){
  $url = 'https://api.inbenta.io/v1/auth';
  $data_array =  array(
        "secret" => 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0IjoieW9kYV9jaGF0Ym90X2VuIn0.anf_eerFhoNq6J8b36_qbD4VqngX79-yyBKWih_eA1-HyaMe2skiJXkRNpyWxpjmpySYWzPGncwvlwz5ZRE7eg'
  );

  $make_call = callAPI('POST', $url, json_encode($data_array));
  $response = json_decode($make_call, true);

  print_r($make_call);
};//getAccessToken
  
?>