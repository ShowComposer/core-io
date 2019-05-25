import { Datalib } from "@showcomposer/datalib";

const data = new Datalib();
data.set("io.artnet.0.ip", "10.11.0.11", "STATIC");
data.set("io.artnet.0.universe", 1, "STATIC");
data.set("io.artnet.0.channel.1", 255);
data.set("io.artnet.0.channel.255", 255);
for (let i = 0; i < 512; i += 3) {
  data.set("io.artnet.0.channel." + i, 0);
    data.set("io.artnet.0.channel." + (i + 1), 0);
    data.set("io.artnet.0.channel." + (i + 2), 255);
}
