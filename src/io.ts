// Import Utils
import { Logging } from "@hibas123/nodelogging";
// Import ShowComposer-Modules
import { Datalib } from "@showcomposer/datalib";
// Import i/o modules
import dmxlib = require("dmxnet");

// Import Specifics
import { IOArtnet } from "./artnet";

// Initialize globals
// SC Data
const data = new Datalib();
// ArtNet
const artnetSenders = {};

// Get all existing artnet data
data.dump("io.artnet", () => {
  handleArtNet("io.artnet");
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
      if (!artnetSenders[s]) {
        artnetSenders[s] = new IOArtnet(s, anData[s]);
      }
    });
  }
}
