import { Datalib } from "@showcomposer/datalib";

const data = new Datalib();

data.set("io.artnet.0.channel.1", 255);
data.set("io.artnet.0.channel.255", 255);
setTimeout(()=> {
  data.set("io.artnet.0.channel.511", 255);
},1000);
