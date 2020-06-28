$(async function () {
  setTimeout(() => {
    const loader = $(".loadingio-spinner-eclipse-8hm10mdk5ci");
    loader.css("animation", "lowOpacity 1s");
    setTimeout(() => loader.remove(), 900);
  }, 250);

  let nickname = localStorage.getItem("nickname") || null;
  let socket;
  const $nicknameForm = $(".formNickname");
  const $messages = $(".allMesages");
  const $connections = $(".connections");

  const $form = $(".form");
  const $funcButtons = $(".functional");

  const $clear = $(".clear");
  const $exit = $(".exit");
  const $users = $(".users .arr");

  const $hiddenElForCsroll = $(".hiddenElementForScroll");

  $clear.on("click", () => $messages.empty().append($hiddenElForCsroll));

  if (nickname) {
    socket = io();
    $form.css("display", "flex");
    $nicknameForm.remove();
    $funcButtons.css("display", "flex");
    socket.emit("user connected", nickname);

    if (+$(".allMesages").length === +1) {
      $messages.append(`
      <div class="NotMsg">
        <h3>Сообщенйи пока нет!</h3>
      </div> `);
    }
  }

  await $nicknameForm.submit(async (e) => {
    e.preventDefault();
    e.target[1].disabled = true;
    const doneNick = e.target[0].value;

    if (!doneNick.length) {
      e.target[1].disabled = false;
      return alert(
        "Вы не ввели никнейм, для начала введите никнейм и нажмите кнопку войти!"
      );
    }

    nickname = doneNick;
    localStorage.setItem("userId", uuidv4());
    localStorage.setItem("nickname", doneNick);
    socket = io();
    $form.css("display", "flex");
    $funcButtons.css("display", "flex");

    socket.emit("user connected", nickname);

    $nicknameForm.remove();

    $messages.append($hiddenElForCsroll);

    return window.location.reload();
  });

  const _userId = localStorage.getItem("userId");

  if (!_userId || !nickname) {
    close();
  }

  function scrollMessagesAuto() {
    $hiddenElForCsroll[0].scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  }

  if (socket) {
    socket.on("user connected_client", ({ user, date, usersLength }) => {
      $connections.empty().append(usersLength.toString());

      $users.append(`
      <div class="alert alert-info" role="alert">
        <h6 class="alert-heading help-h5">
          <div class="username">Пользователь с ником "${user}" присоеденился!</div>
          
          <div class="time">${date}</div>
        </h6>
      </div> 
    `);
    });

    socket.on("user disconected", ({ user, date, usersLength }) => {
      $connections.empty().append(usersLength.toString());
      $users.append(`
      <div class="alert alert-danger" role="alert">
        <h6 class="alert-heading help-h5">
          <div class="username">Пользователь с ником "${user}" отсоеденился!</div>
          <div class="time">${date}</div>
        </h6>
      </div> 
    `);
    });

    socket.on("chat message", ({ nickname, date, message, userId }) => {
      $(".NotMsg").remove();
      if (userId === _userId) {
        $hiddenElForCsroll.before(`
        <div class="alert alert-success" role="alert">
          <h6 class="alert-heading">
            <div class="username">${"@" + nickname}</div>
            <div class="time">${date}</div>
          </h6><hr />
          <p class="msg-content">${message}</p>
        </div> 
      `);
        scrollMessagesAuto();
      } else {
        $hiddenElForCsroll.before(`
      <div class="alert alert-dark" role="alert">
        <h6 class="alert-heading">
          <div class="username">${"@" + nickname}</div>
          <div class="time">${date}</div>
        </h6><hr />
        <p class="msg-content">${message}</p>
      </div> 
    `);
        scrollMessagesAuto();
      }
    });
  }

  $form.submit((e) => {
    e.preventDefault();

    const contentMsg = $(".textField");

    if (!nickname) {
      return alert(
        "Вы не ввели никнейм, для начала введите никнейм и нажмите кнопку войти!"
      );
    } else {
      if (!contentMsg.val().length) {
        alert("Вы не ввели содержимое сообщения!");

        return false;
      } else {
        socket.emit("chat message", {
          nickname,
          message: contentMsg.val(),
          date: moment().format("LT"),
          userId: _userId,
        });
        scrollMessagesAuto();
        $(".NotMsg").remove();
        contentMsg.val("");
      }
    }
  });

  function close() {
    localStorage.removeItem("nickname");
    localStorage.removeItem("userId");

    socket.close();
    socket = null;

    $form.css("display", "none");
    $funcButtons.css("display", "none");

    $messages.empty().append($nicknameForm);

    return false;
  }

  $exit.on("click", close);
});
