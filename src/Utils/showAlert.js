import Swal from "sweetalert2";

export function showAlert(icon, title, timer) {
  Swal.fire({
    position: "center",
    icon: icon,
    title: title,
    showConfirmButton: false,
    timer: timer,
    background: "#181818",
    color: "#ffffff",
    iconColor: icon === "error" ? "#ff4d4d" : "#aeff46",
    customClass: {
      popup: "swal-wisp-popup",
      title: "swal-wisp-title",
      confirmButton: "swal-wisp-confirm",
    },
  });
}
