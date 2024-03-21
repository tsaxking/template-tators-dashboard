import { FIRSTEvent } from '../../models/FIRST/event';

(async() => {
    // to pull
    const result = await FIRSTEvent.current?.getMatches();
    if (result && result.isOk()) {
    const matches = result.value; // FIRSTMatch[]
        for (const match of matches) {
        match.tba // here is the tba information in the exact structure listed above
        }
    }

    const video = document.createElement("video");
    video.setAttribute('controls', 'true');
    video.setAttribute('width', '250');

    const src1 = document.createElement('source');
    src1.src = "/media/cc0-videos/flower.webm";
    src1.type = 'video/webm';

    video.append(src1);

`
<video controls width="250">
  <source src="/media/cc0-videos/flower.webm" type="video/webm" />

  <source src="/media/cc0-videos/flower.mp4" type="video/mp4" />

  Download the
  <a href="/media/cc0-videos/flower.webm">WEBM</a>
  or
  <a href="/media/cc0-videos/flower.mp4">MP4</a>
  video.
</video>
`








})();