(function () {
  function requirePlaceholder(el, msg) {
    if (el) el.setCustomValidity(el.value ? "" : msg);
  }
  function makeSwalDraggable(popup) {
    let down = false,
      sx = 0,
      sy = 0,
      ox = 0,
      oy = 0;
    const handle = popup.querySelector(".swal2-title") || popup;
    handle.style.cursor = "move";
    const md = (e) => {
      down = true;
      const r = popup.getBoundingClientRect();
      sx = e.clientX;
      sy = e.clientY;
      ox = r.left;
      oy = r.top;
      document.addEventListener("mousemove", mm);
      document.addEventListener("mouseup", mu);
    };
    const mm = (e) => {
      if (!down) return;
      popup.style.margin = "0";
      popup.style.position = "fixed";
      popup.style.left = ox + e.clientX - sx + "px";
      popup.style.top = oy + e.clientY - sy + "px";
    };
    const mu = () => {
      down = false;
      document.removeEventListener("mousemove", mm);
      document.removeEventListener("mouseup", mu);
    };
    handle.addEventListener("mousedown", md);
  }

  function main() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const age = document.getElementById("age");
    const country = document.getElementById("country");
    const roomName = document.getElementById("roomName");
    const roomDescription = document.getElementById("roomDescription");

    [age, country].forEach(
      (el) =>
        el &&
        el.addEventListener("change", () =>
          requirePlaceholder(el, "Wajib diisi.")
        )
    );
    [roomName, roomDescription].forEach(
      (el) => el && el.addEventListener("input", () => el.setCustomValidity(""))
    );

    form.addEventListener("submit", function (e) {
      requirePlaceholder(age, "Wajib diisi.");
      requirePlaceholder(country, "Wajib diisi.");

      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        form.classList.add("was-validated");
        return;
      }

      e.preventDefault(); // tampilkan Swal dulu
      if (typeof Swal === "undefined") {
        form.submit();
        return;
      } // fallback
      Swal.fire({
        title: "Berhasil!",
        text: "Room akan ditampilkan di Community Page.",
        icon: "success",
        confirmButtonText: "Lanjut",
        allowOutsideClick: false,
        willOpen: (p) => makeSwalDraggable(p),
      }).then(() => {
        const params = new URLSearchParams(new FormData(form));
        params.set("created", "1");
        // Simpan juga ke localStorage untuk backup
        localStorage.setItem(
          "lastRoom",
          JSON.stringify(Object.fromEntries(params.entries()))
        );
        const action = new URL(form.action, location.href);
        location.href = action.pathname + "?" + params.toString();
      });
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", main);
  else main();
})();
