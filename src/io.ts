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
const dmxnet = new dmxlib.dmxnet({ sName: "ShowComposer", lName: "ShowComposer IO module" });
const dmxnetSenders = {};

// Get all existing artnet data
data.dump("io.artnet");
const artnetEvent = data.subscribe("io.artnet");
// Subscribe to ArtNet changes
artnetEvent.on("data", (k, d) => {
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
        // Set DMXNET-Sender parameters
        const dmxnetIP = anData[s].ip || "255.255.255.255";
        const dmxnetSubnet = anData[s].subnet || 0;
        const dmxnetUniverse = anData[s].universe || 0;
        const dmxnetNet = anData[s].net || 0;
        const dmxnetPort = anData[s].port || 6454;
        dmxnetSenders[s] = dmxnet.newSender({
          ip: dmxnetIP, net: dmxnetNet,
          port: dmxnetPort, subnet: dmxnetSubnet, universe: dmxnetUniverse,
        });
        Logging.log("New DMXNET sender to " + dmxnetIP + ":" +
          dmxnetPort + " N:" + dmxnetNet + " S:" + dmxnetSubnet + " U:" +
          dmxnetUniverse);
      }
      Logging.debug(anData);
      // Send channels
      if (anData[s].channel) {
        Object.keys(anData[s].channel).forEach((c) => {
          if (c >= 0 && c < 512) {
            dmxnetSenders[s].prepChannel(c, parseInt(anData[s].channel[c], 10));
          }
        });
        dmxnetSenders[s].transmit();
      }
    });
  }
}
