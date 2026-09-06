(function () {
  "use strict";

  var dialog = document.getElementById("contact-dialog");
  var inner = dialog ? dialog.querySelector(".contact-dialog__inner") : null;
  var openBtn = document.getElementById("contact-open");
  var closeBtn = document.getElementById("contact-close");
  var form = document.getElementById("contact-form");
  var submitBtn = document.getElementById("contact-submit");
  var status = document.getElementById("contact-status");

  if (!dialog || !inner || !openBtn || !form) return;

  // Get a free access key at https://web3forms.com/ — enter an email, they
  // send the key back instantly, no account/password needed. Paste it here.
  var WEB3FORMS_ACCESS_KEY = "af64a005-2280-434b-a3c4-9617ad8deab7";
  var FALLBACK_EMAIL = "support@ver93.com";

  function open() {
    if (typeof dialog.showModal !== "function") {
      window.location.href = "mailto:" + FALLBACK_EMAIL;
      return;
    }
    dialog.showModal();
    requestAnimationFrame(function () {
      dialog.classList.add("is-open");
    });
  }

  function close() {
    if (!dialog.open) return;
    dialog.classList.remove("is-open");
    var done = false;
    var finish = function () {
      if (done) return;
      done = true;
      inner.removeEventListener("transitionend", onTransitionEnd);
      if (dialog.open) dialog.close();
    };
    var onTransitionEnd = function (e) {
      if (e.target === inner) finish();
    };
    inner.addEventListener("transitionend", onTransitionEnd);
    setTimeout(finish, 400); // fallback if the transition never fires
  }

  function setStatus(state, text) {
    if (!status) return;
    status.textContent = text;
    if (state) status.setAttribute("data-state", state);
    else status.removeAttribute("data-state");
  }

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);

  // Click on the backdrop (the <dialog> element's own box, outside .contact-dialog__inner) closes it.
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) close();
  });

  // Esc triggers the native "cancel" event before closing — intercept it so
  // the close still animates instead of snapping shut.
  dialog.addEventListener("cancel", function (e) {
    e.preventDefault();
    close();
  });

  // Clear any stale success/error message each time the dialog reopens.
  dialog.addEventListener("close", function () {
    setStatus(null, "");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (typeof form.reportValidity === "function" && !form.reportValidity()) {
      return;
    }
    if (form.botcheck && form.botcheck.checked) return; // honeypot tripped

    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();

    if (
      !WEB3FORMS_ACCESS_KEY ||
      WEB3FORMS_ACCESS_KEY.indexOf("REPLACE_WITH") === 0
    ) {
      // No key configured yet — fall back to opening the visitor's email app
      // rather than silently failing.
      var subject = "New message from " + name + " via ver93.com";
      var body = message + "\n\n— " + name + " (" + email + ")";
      window.location.href =
        "mailto:" +
        FALLBACK_EMAIL +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    setStatus(null, "");

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: "New message from " + name + " via ver93.com",
        name: name,
        email: email,
        message: message,
      }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok && data.success, data: data };
        });
      })
      .then(function (result) {
        if (result.ok) {
          setStatus("success", "Thanks — we'll get back to you soon.");
          form.reset();
          setTimeout(close, 1500);
        } else {
          setStatus(
            "error",
            (result.data && result.data.message) ||
              "Something went wrong — please try again."
          );
        }
      })
      .catch(function () {
        setStatus(
          "error",
          "Network error — please try again, or email " + FALLBACK_EMAIL + " directly."
        );
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send message";
      });
  });
})();
