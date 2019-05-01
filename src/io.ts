import { Datalib } from "@showcomposer/datalib";
import dmxlib = require("dmxnet");

const data = new Datalib();
const dmxnet = new dmxlib.dmxnet({sName: "ShowComposer", lName: "ShowComposer IO module"});
const dmxnetSenders = {};

// Get all existing artnet data
data.dump("io.artnet");
const artnetEvent = data.subscribe("io.artnet");
// Subscribe to ArtNet changes
artnetEvent.on("data", (k) => {
  handleArtNet(k);
});
// Handle incoming artnet data
function handleArtNet(k) {
  if (!data.data.io) {
    return;
  }
  const anData = data.data.io.artnet;
  if (anData) {
    // Create sender instance if not existing
    Object.keys(anData).forEach((s) => {
      if (!dmxnetSenders[s]) {
        dmxnetSenders[s] = dmxnet.newSender({});
        console.log("New Sender");
      }
      console.log(anData);
      // Send channels
      if (anData[s].channel) {
        Object.keys(anData[s].channel).forEach((c) => {
        dmxnetSenders[s].prepChannel(c, parseInt(anData[s].channel[c], 10));
        });
        dmxnetSenders[s].transmit();
      }
    });
  }
}
