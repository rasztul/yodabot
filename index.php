<!DOCTYPE html>
<html>

<head>
  <title>YodaBot</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.min.js"></script>
  <!-- development version, includes helpful console warnings -->
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="./js/app.js"></script>
</head>

<body>
  <form id="formYodaBot" @submit.prevent="onSubmit" action="#" method="post">
    <div class="container-fluid h-100">
      <div class="row justify-content-center h-100">
        <div class="col-md-8 col-xl-6 chat">
          <div class="card">
            <div class="card-header msg_head">
              <div class="d-flex bd-highlight">
                <div class="img_cont">
                  <img src="https://lacomparacion.com/wp-content/uploads/2020/02/Ahora-hay-un-Lego-Baby-Yoda.jpg" class="rounded-circle user_img_msg" width="50">
                  <span class="online_icon"></span>
                </div>
                <div class="user_info">
                  <span>Chat with YodaBot</span>
                </div>
              </div>
            </div>
            <div class="card-body msg_card_body">
              <ol>
                <li v-for="(messageUser, index) in user">
                  {{ user[ index ] }}
                  {{ bot[ index ] }}
                </li>
              </ol>
            </div>
            <div class="card-footer">
              <div v-if="isWriting">
                <span>writing…</span>
              </div>
              <div class="input-group">
                <div class="input-group-append">
                  <span class="input-group-text attach_btn"><i class="fas fa-paperclip"></i></span>
                </div>
                <span v-if="error">Ups, something is bad!</span>
                <input v-model="message" name="message" class="form-control type_msg" placeholder="Type your message..." type="text" required />
                <div class="input-group-append">
                  <button type="submit">
                    <span class="input-group-text send_btn"><i class="fas fa-location-arrow"></i></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</body>

</html>