// Helper Links
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers


const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/index.sw.js", {
        scope: "/",
      });
      if (registration.installing) console.log("SW:: installing");
      else if (registration.waiting) console.log("SW:: installed");
      else if (registration.active) console.log("SW:: activated");
    } catch (error) {
      console.error(`Registration failed:: ${error}`);
    }
  }
};

registerServiceWorker();