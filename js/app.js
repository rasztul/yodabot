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
        if ( !this.isWriting && this.message && this.message.trim() !== "" ) {
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
          // agrega el mensaje del usuario al state del vue
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
        const validateNoAnswer = this.validateNoAnswer;
        const setBotMessageLocalStorage = this.setBotMessageLocalStorage;
        const validateForceMessage = this.validateForceMessage;
        // Si hay tokens en el localstorage
        if ( accessToken && sessionToken ) {
          // envia el mensaje a la API de inbenta
          axios.get( `./controllers/sendData.php?action=sendMessage&accessToken=${ accessToken }&sessionToken=${ sessionToken }&message=${ message }` )
            .then( function ( response ) {
              let answer = "";
              try {
                noAnswer = response.data.answers[ 0 ].flags.length;
                answer = response.data.answers[ 0 ].message;
                validateNoAnswer( noAnswer );
              } catch ( e ) {
                // statements
                console.log( e );
              }
              // valida la palabra force
              validateForceMessage( message );
              // agrega el mensaje al localstorage
              setBotMessageLocalStorage( answer );
              // agrega el mensaje al state de vuejs
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
      validateForceMessage: function ( message ) {
        // si la palabra force aparece en el mensaje del usuario
        if ( message.toLowerCase().includes( 'force' ) ) {
          // agrega la ista de peliculas
          this.getStarWarsFilms();
        }
      },
      setBotMessageLocalStorage: function ( msg ) {
        // Si hay registros del bot en localStorage
        if ( localStorage.bot ) {
          localStorage.bot = `${ localStorage.bot }|${ msg }`;
        } else {
          // crea un registro con las respuestas del bot
          localStorage.bot = msg;
        }
      },
      // agrega la informacion del localSotorage al state
      setBotArray: function () {
        this.bot = localStorage.bot ? localStorage.bot.split( "|" ) : [];
        this.scrollToEnd();
      },
      // agrega la informacion del localstorage user al state
      setUserArray: function () {
        this.user = localStorage.user ? localStorage.user.split( "|" ) : [];
        this.scrollToEnd();
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
      },
      scrollToEnd: function () {
        const container = this.$el.querySelector( "#bodyMessages" );
        container.scrollTop = container.scrollHeight;
      },
      validateNoAnswer: function ( noAnswer ) {
        // SI NO HAY RESPUESTA
        if ( 0 < noAnswer ) {
          // obtiene el index acumulado de no respuesta
          let prevNoAnswer = localStorage.noAnswerIndex;
          // suma el acumulado de no respuesta
          const noAnswerIndex = prevNoAnswer ? ( prevNoAnswer + noAnswer ) : noAnswer;
          // Si lleva al menos 2 sin respuesta
          if ( 1 < noAnswerIndex ) {
            // regresa el index sin respuesta a 0
            localStorage.noAnswerIndex = 0;
            // llama a la funcion de los personajes de star wars
            this.getStarWarsCharacters();
          } else {
            // agrega al localstorage el acumulado de no respuesta
            localStorage.noAnswerIndex = noAnswerIndex;
          }
        }
      },
      getStarWarsCharacters: function () {
        const setInLastMessageLocalStorageBot = this.setInLastMessageLocalStorageBot;
        //const setBotArray = this.setBotArray;
        axios.get( `https://swapi.dev/api/people/` )
          .then( async response => {
            const characters = response.data.results;
            let msg = '';
            for ( const index in characters ) {
              msg = `${ msg }${ characters[ index ].name } \n\r`;
            }
            // Agrega los personajes en la ultima respuesta del bot
            setInLastMessageLocalStorageBot( msg );
          } );
      },
      getStarWarsFilms: function () {
        const setInLastMessageLocalStorageBot = this.setInLastMessageLocalStorageBot;
        //const setBotArray = this.setBotArray;
        axios.get( `https://swapi.dev/api/films/` )
          .then( async response => {
            const films = response.data.results;
            let msg = '';
            for ( const index in films ) {
              msg = `${ msg }${ films[ index ].title } \n\r`;
            }
            // Agrega los personajes en la ultima respuesta del bot
            setInLastMessageLocalStorageBot( msg );
          } );
      },
      setInLastMessageLocalStorageBot: function ( message ) {
        const localstorageBot = localStorage.bot;
        // Si hay registros del bot en localStorage
        if ( localstorageBot ) {
          const lastIndexPipe = localstorageBot.lastIndexOf( "|" );
          const lastMessage = localstorageBot.substr( lastIndexPipe + 1 );
          const newLastMessage = `${ lastMessage } ...... ${ message }`;
          const newLocastorageBot = `${ localstorageBot.substr( 0, lastIndexPipe ) }|${ newLastMessage }`;
          localStorage.bot = newLocastorageBot;
          this.setBotArray();
        } else {
          // crea un registro con las respuestas del bot
          localStorage.bot = message;
        }
      }
    },
    // cuando se carga la pagina
    mounted: function () {
      if ( localStorage.prevMessage ) {
        this.prevMessage = localStorage.prevMessage;
      }
      this.setUserArray();
      this.setBotArray();
      this.scrollToEnd();
      // solicita el token de acceso
      this.getAccessToken();
    },
  } );
}