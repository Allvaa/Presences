const iframe = new iFrame();

iframe.on("UpdateData", async () => {
  const video: HTMLVideoElement =
    document.querySelector(".vjs-tech")
    ?? document.querySelector(".jw-video")
    ?? document.querySelector("#video");

  if (video) {
    iframe.send({
      ready: video.readyState === 4,
      currentTime: video.currentTime,
      paused: video.paused,
      duration: video.duration
    });
  }
});
