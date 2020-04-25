window.onload = () => {

  const form = new Vue( {
    el: "#formYodaBot",
    data: {
      message: null, // mensaje entrante
      isWriting: false, // bandera para saber si esta escribiendo
      error: false, // hay error?
      prevMessage: '', // ultimo mensaje
      isFirstMessage: true, // es el primer mensaje?
      user: null,
      bot: null
    },
    methods: {
      // Cuando se envia el mensaje
      onSubmit: function ( e ) {
        // Si hay texto en el mensaje
        if ( this.message && this.message.trim() !== "" ) {
          // declara las funciones para que sean alcanzadas dentro de los callbacks
          const setWriting = this.setWriting;
          const sendMessage = this.sendMessage;
          const message = this.message;

          // Si hay registros del bot en localStorage
          if ( localStorage.user ) {
            localStorage.user = `${ localStorage.user }|${ this.message }`;
          } else {
            // crea un registro con las respuestas del bot
            localStorage.user = message;
          }
          this.setUserArray();
          setWriting( true );
          // si es el primer mensaje
          if ( this.isFirstMessage ) {
            localStorage.prevMessage = this.message;
            // configura la conversacion
            this.setupConversation()
              .then( function ( response ) {
                // agrega los tokens de sesion al localstorage
                localStorage.sessionId = response.data.sessionId;
                localStorage.sessionToken = response.data.sessionToken;
                // envia el mensaje al bot
                sendMessage( message );
              } )
              .catch( function ( error ) {
                // en caso de error cambia la bandera de writing
                setWriting( false );
              } );
            // Cambia la bandera de primer comentario
            this.isFirstMessage = false;
          } else {
            // envia el mensaje al bot
            sendMessage( message );
          }
        }
        this.message = ""; // borra el mensaje del state
        e.preventDefault(); // evita el comportamiento nativo
        e.target.reset(); // regresa al estado original el input del mensaje
      },
      // obtiene un token de acceso a la API de inbenta
      getAccessToken: function () {
        // realiza una peticion al controlador 
        axios.get( './controllers/sendData.php?action=getAccessToken' )
          .then( function ( response ) {
            // guarda la respuesta en el localstorage
            localStorage.accessToken = response.data.accessToken;
            //console.log( 'response', response );
          }, function () {
            alert( 'Error!' );
          } );
      },
      // envia un mensaje al bot
      sendMessage: function ( message ) {
        // obtiene los tokens guardados en el localstorage
        const accessToken = localStorage.accessToken;
        // token de sesion, obtenido al configurar la conversacion
        const sessionToken = localStorage.sessionToken;
        const setWriting = this.setWriting;
        const setBotArray = this.setBotArray;
        // Si hay tokens en el localstorage
        if ( accessToken && sessionToken ) {
          // envia el mensaje a la API de inbenta
          axios.get( `./controllers/sendData.php?action=sendMessage&accessToken=${ accessToken }&sessionToken=${ sessionToken }&message=${ message }` )
            .then( function ( response ) {
              let answer = "";
              try {
                answer = response.data.answers[ 0 ].message;
              } catch ( e ) {
                // statements
                console.log( e );
              }
              // Si hay registros del bot en localStorage
              if ( localStorage.bot ) {
                localStorage.bot = `${ localStorage.bot }|${ answer }`;
              } else {
                // crea un registro con las respuestas del bot
                localStorage.bot = answer;
              }
              setBotArray();
              //console.log( 'response', response );
              // cambia la bandera de escribiendo
              setWriting( false );
            }, function () {
              alert( 'Ups, reload plis!' );
            } );
        } else {
          alert( 'Ups, reload plis!' );
        }
      },
      // agrega la informacion del localSotorage al state
      setBotArray: function () {
        this.bot = localStorage.bot.split("|");
      },
      // agrega la informacion del localstorage user al state
      setUserArray: function () {
        this.user = localStorage.user.split("|");
      },
      // Hace una solicitud a la api para configurar la conversacion
      setupConversation: function () {
        // obtinene el token de acceso que debe estar en localstorage
        const accessToken = localStorage.accessToken;
        if ( accessToken ) {
          return axios.get( `./controllers/sendData.php?action=setupConversation&accessToken=${ accessToken }` );
        } else {
          alert( 'Ups, reload plis!' );
        }
      },
      // cambia la bandera writing
      setWriting: function ( isWriting ) {
        this.isWriting = isWriting;
      }
    },
    // cuando se carga la pagina
    mounted: function () {
      if ( localStorage.prevMessage ) {
        this.prevMessage = localStorage.prevMessage;
      }
      this.setUserArray();
      this.setBotArray();
      // solicita el token de acceso
      this.getAccessToken();
    },
  } );
}