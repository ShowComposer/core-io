import { Datalib } from "@showcomposer/datalib";
import dmxlib = require("dmxnet");

const data = new Datalib();
const dmxnet = new dmxlib.dmxnet({sName: "ShowComposer", lName: "ShowComposer IO module"});
const dmxnetSenders = {};

data.dump('io.artnet');
const artnetEvent = data.subscribe('io.artnet');
artnetEvent.on('data',()=>{
  handleArtNet();
});
function handleArtNet() {
  if(!data.data.io) {
    return;
  }
  const anData=data.data["io"]["artnet"];
  if(anData) {
    Object.keys(anData).forEach((s) => {
      if(!dmxnetSenders[s]) {
        dmxnetSenders[s]=dmxnet.newSender({});
        console.log("New Sender");
      }
      console.log(anData);
      if(anData[s].channel) {
        Object.keys(anData[s].channel).forEach((c) => {
        dmxnetSenders[s].prepChannel(c,parseInt(anData[s].channel[c],10));
        });
        dmxnetSenders[s].transmit();
      }
    });
  }
}
