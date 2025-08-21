document.addEventListener("DOMContentLoaded", () => {
    console.log("Resulconfig Loaded SuccessFully",window.location.pathname)
    let ele = document.querySelectorAll("script[src$=sdk]");
    if (ele.length) {
      ele.forEach((item) => {
        item.remove();
      });
    }
    let script = document.createElement("script");
    script.setAttribute("defer", "defer");
    script.setAttribute("fcm_service_path", "firebase-messaging-sw.js");
    script.src ="https://sdk.smartdx.co/handlers/ce496e55043e4f7c97b1241f5ef5ba94.sdk";
    document.head.appendChild(script);
  });