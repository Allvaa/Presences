const presence = new Presence({
    clientId: "794916348761210920"
  }),
  presenceData: PresenceData = {
    largeImageKey: "logo"
  };

let videoData: VideoData;
interface VideoData {
  ready: boolean;
  currentTime: number;
  paused: boolean;
  duration: number;
}

presence.on("iFrameData", (data: VideoData) => {
  videoData = data;
});

presence.on("UpdateData", async () => {
  switch (
    document.location.pathname.endsWith("/") &&
    document.location.pathname.length > 1
      ? document.location.pathname.slice(
        0,
        document.location.pathname.length - 1
      )
      : document.location.pathname
  ) {
    case "/":
      presenceData.details = "Viewing homepage";
      break;
    case "/anime-list":
      presenceData.details = "Viewing anime list";
      break;
    case "/jadwal-rilis":
      presenceData.details = "Viewing release schedule";
      break;
    case "/ongoing-anime":
      presenceData.details = "Viewing ongoing anime list";
      break;
    case "/genre-list":
      presenceData.details = "Viewing anime genre list";
      break;
    default: {
      if (document.location.search.startsWith("?s")) {
        const params = document.location.search.substring(1),
          { s } = JSON.parse(
            `{"${ 
              decodeURI(params)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"') 
            }"}`
          );
        presenceData.details = "Searching for:";
        presenceData.state = s;
        presenceData.smallImageKey = "search";
      }
      if (document.location.pathname.startsWith("/anime")) {
        presenceData.details = "Viewing anime";
        presenceData.state = document
          .querySelector(".jdlrx > h1")
          .textContent.replace(/Subtitle Indonesia/gi, "");
        presenceData.buttons = [
          { label: "View anime", url: document.location.href }
        ];
      }
      const mirrorStream = document.querySelector(".mirrorstream");
      if (mirrorStream) {
        presenceData.details = "Watching anime";
        presenceData.state = document
          .querySelector(".posttl")
          .textContent.replace(/Subtitle Indonesia/gi, "");
        
        if (videoData?.ready) {
          const [, endTimestamp] = presence.getTimestamps(videoData.currentTime, videoData.duration);
          presenceData.endTimestamp = videoData.paused ? null : endTimestamp;
        }

        presenceData.buttons = [
          { label: "Watch Anime", url: document.location.href },
          {
            label: "View Anime",
            url: [...document.querySelectorAll("a")].find((x) =>
              /See All Episodes/gi.exec(x.textContent)
            ).href
          }
        ];
      }
      break;
    }
  }
  presence.setActivity(presenceData);
});
