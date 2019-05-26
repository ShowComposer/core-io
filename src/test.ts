import { Datalib } from "@showcomposer/datalib";

const data = new Datalib();
data.set("io.artnet.0.ip", "10.11.0.11", "STATIC");
data.set("io.artnet.0.universe", 1, "STATIC");
const channel = {};
for (let i = 0; i < 512; i += 3) {
  channel[i]=0;
  channel[i+1]=0;
  channel[i+2]=255;
}
data.assign("io.artnet.0.channel",channel);
