// import React, { useEffect } from "react";

// const AiChatbot = () => {
//   useEffect(() => {
//     const host = "https://labs.heygen.com";
//     const url =
//       host +
//       "/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiIzYmFlNWI5YjUxYmQ0ZjNmOWRhMWQ1NjMy%0D%0AMTI0MTM4YSIsInByZXZpZXdJbWciOiJodHRwczovL2ZpbGVzMi5oZXlnZW4uYWkvYXZhdGFyL3Yz%0D%0ALzNiYWU1YjliNTFiZDRmM2Y5ZGExZDU2MzIxMjQxMzhhL2Z1bGwvMi4yL3ByZXZpZXdfdGFyZ2V0%0D%0ALndlYnAiLCJuZWVkUmVtb3ZlQmFja2dyb3VuZCI6ZmFsc2UsImtub3dsZWRnZUJhc2VJZCI6ImY0%0D%0AODExODRiNGU2OTRjYTBhNzVjMTkyNTc5ZmNhODMyIiwidXNlcm5hbWUiOiI5ZjljODg3YzQzZTY0%0D%0AMzE1OWZlMWIxZjI3YWVhMTYxMCJ9&inIFrame=1";

//     const clientWidth = document.body.clientWidth;

//     const wrapDiv = document.createElement("div");
//     wrapDiv.id = "heygen-streaming-embed";

//     const container = document.createElement("div");
//     container.id = "heygen-streaming-container";

//     const stylesheet = document.createElement("style");
//     stylesheet.innerHTML = `
//       #heygen-streaming-embed {
//         z-index: 9999;
//         position: fixed;
//         left: 50%;
//         bottom: 30%;
//         width: 200px;
//         height: 200px;
//         border-radius: 50%;
//         border: 2px solid #fff;
//         box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);
//         transition: all linear 0.1s;
//         overflow: hidden;
//         opacity: 0;
//         visibility: hidden;
//       }
//       #heygen-streaming-embed.show {
//         opacity: 1;
//         visibility: visible;
//       }
//      #heygen-streaming-embed.expand {
//   ${
//     clientWidth < 540
//       ? `
//         height: 266px;
//         width: 96%;
//         top: 50%;
//         left: 60%;
//         transform: translate(-50%, -50%);
//       `
//       : `
//         height: 366px;
//         width: calc(366px * 16 / 9);
//         top: 50%;
//         left: 60%;
//         transform: translate(-50%, -50%);
//       `
//   }
//   position: fixed;
//   border: 0;
//   border-radius: 12px;
//   background: #000;
//   z-index: 9999;
// }
//       #heygen-streaming-container {
//         width: 100%;
//         height: 100%;
//       }
//       #heygen-streaming-container iframe {
//         width: 100%;
//         height: 100%;
//         border: 0;
//       }
//     `;

//     const iframe = document.createElement("iframe");
//     iframe.allowFullscreen = false;
//     iframe.title = "Streaming Embed";
//     iframe.role = "dialog";
//     iframe.allow = "microphone";
//     iframe.src = url;

//     let visible = false;
//     let initial = false;

//     const handleMessage = (e) => {
//       if (e.origin === host && e.data?.type === "streaming-embed") {
//         if (e.data.action === "init") {
//           initial = true;
//           wrapDiv.classList.toggle("show", initial);
//         } else if (e.data.action === "show") {
//           visible = true;
//           wrapDiv.classList.toggle("expand", visible);
//         } else if (e.data.action === "hide") {
//           visible = false;
//           wrapDiv.classList.toggle("expand", visible);
//         }
//       }
//     };

//     window.addEventListener("message", handleMessage);

//     container.appendChild(iframe);
//     wrapDiv.appendChild(stylesheet);
//     wrapDiv.appendChild(container);
//     document.body.appendChild(wrapDiv);

//     return () => {
//       window.removeEventListener("message", handleMessage);
//       document.body.removeChild(wrapDiv);
//     };
//   }, []);

//   return null;
// };

// export default AiChatbot;

import React, { useEffect } from "react";

const AiChatbot = () => {
  useEffect(() => {
    const host = "https://labs.heygen.com";
    const url =
      host +
      "/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiIzYmFlNWI5YjUxYmQ0ZjNmOWRhMWQ1NjMy%0D%0AMTI0MTM4YSIsInByZXZpZXdJbWciOiJodHRwczovL2ZpbGVzMi5oZXlnZW4uYWkvYXZhdGFyL3Yz%0D%0ALzNiYWU1YjliNTFiZDRmM2Y5ZGExZDU2MzIxMjQxMzhhL2Z1bGwvMi4yL3ByZXZpZXdfdGFyZ2V0%0D%0ALndlYnAiLCJuZWVkUmVtb3ZlQmFja2dyb3VuZCI6ZmFsc2UsImtub3dsZWRnZUJhc2VJZCI6ImY0%0D%0AODExODRiNGU2OTRjYTBhNzVjMTkyNTc5ZmNhODMyIiwidXNlcm5hbWUiOiI5ZjljODg3YzQzZTY0%0D%0AMzE1OWZlMWIxZjI3YWVhMTYxMCJ9&inIFrame=1";

    const clientWidth = document.body.clientWidth;

    const wrapDiv = document.createElement("div");
    wrapDiv.id = "heygen-streaming-embed";

    const container = document.createElement("div");
    container.id = "heygen-streaming-container";

    const loader = document.createElement("div");
    loader.id = "heygen-loader";
    loader.innerText = "Loading AI Assistant...";
    loader.style.cssText = `
      position: fixed;
      bottom: 250px;
      left: 60%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 12px 20px;
      border-radius: 10px;
      font-weight: bold;
      z-index: 9998;
      font-family: sans-serif;
    `;

    const stylesheet = document.createElement("style");
    stylesheet.innerHTML = `
      #heygen-streaming-embed {
        z-index: 9999;
        position: fixed;
        left: 50%;
        bottom: 30%;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);
        transition: all linear 0.1s;
        overflow: hidden;
        opacity: 0;
        visibility: hidden;
      }
      #heygen-streaming-embed.show {
        opacity: 1;
        visibility: visible;
      }
      #heygen-streaming-embed.expand {
        ${
          clientWidth < 540
            ? `
            height: 266px;
            width: 96%;
            top: 50%;
            left: 60%;
            transform: translate(-50%, -50%);
          `
            : `
            height: 366px;
            width: calc(366px * 16 / 9);
            top: 50%;
            left: 60%;
            transform: translate(-50%, -50%);
          `
        }
        position: fixed;
        border: 0;
        border-radius: 12px;
        background: #000;
        z-index: 9999;
      }
      #heygen-streaming-container {
        width: 100%;
        height: 100%;
      }
      #heygen-streaming-container iframe {
        width: 100%;
        height: 100%;
        border: 0;
        visibility: hidden;
      }
    `;

    const iframe = document.createElement("iframe");
    iframe.allowFullscreen = false;
    iframe.title = "Streaming Embed";
    iframe.role = "dialog";
    iframe.allow = "microphone";
    iframe.src = url;

    iframe.onload = () => {
      iframe.style.visibility = "visible";
      const l = document.getElementById("heygen-loader");
      if (l) l.remove();
    };

    let visible = false;
    let initial = false;

    const handleMessage = (e) => {
      if (e.origin === host && e.data?.type === "streaming-embed") {
        if (e.data.action === "init") {
          initial = true;
          wrapDiv.classList.toggle("show", initial);
        } else if (e.data.action === "show") {
          visible = true;
          wrapDiv.classList.toggle("expand", visible);
        } else if (e.data.action === "hide") {
          visible = false;
          wrapDiv.classList.toggle("expand", visible);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    container.appendChild(iframe);
    wrapDiv.appendChild(stylesheet);
    wrapDiv.appendChild(container);
    document.body.appendChild(loader); // loader first
    document.body.appendChild(wrapDiv); // then embed

    return () => {
      window.removeEventListener("message", handleMessage);
      document.body.removeChild(wrapDiv);
      const el = document.getElementById("heygen-loader");
      if (el) el.remove();
    };
  }, []);

  return null;
};``

export default AiChatbot;
