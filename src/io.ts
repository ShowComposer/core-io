// Import Utils
import { Logging } from "@hibas123/nodelogging";
// Import ShowComposer-Modules
import { Datalib } from "@showcomposer/datalib";
// Import i/o modules
import dmxlib = require("dmxnet");

// Initialize globals
// SC Data
const data = new Datalib();
// ArtNet
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
        Logging.log("New DMXNET sender");
      }
      Logging.debug(anData);
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
