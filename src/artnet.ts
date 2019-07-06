// Import Utils
import { Logging } from "@hibas123/nodelogging";
// Import ShowComposer-Modules
import { Datalib } from "@showcomposer/datalib";
// Import i/o modules
import dmxlib = require("dmxnet");
const dmxnet = new dmxlib.dmxnet({ sName: "ShowComposer", lName: "ShowComposer IO module" });

const data = new Datalib();

export class IOArtnet {
  public dmxnetSender;
  public dmxnetIP;
  public dmxnetSubnet;
  public dmxnetUniverse;
  public dmxnetNet;
  public dmxnetPort;
  public channel;
  public anData;
  public instance;
  public channelEvent;
  // Constructor
  constructor(instance, anData) {
    this.instance = instance;
    const artnetEvent = data.subscribe("io.artnet." + this.instance);
    data.dump("io.artnet." + this.instance, () => {
    // Subscribe to ArtNet changes
    artnetEvent.on("data", (k, d) => {
      Logging.debug("Artnet " + this.instance + " updated!");
      this.anData = data.getLocal("io.artnet." + this.instance);
      this.dmxnetInit();
    });
    this.anData = anData;
    this.dmxnetInit();
  });
    }
  public dmxnetInit() {
    // Set DMXNET-Sender parameters
    this.dmxnetIP = this.anData.ip || "255.255.255.255";
    this.dmxnetSubnet = this.anData.subnet || 0;
    this.dmxnetUniverse = this.anData.universe || 0;
    this.dmxnetNet = this.anData.net || 0;
    this.dmxnetPort = this.anData.port || 6454;
    // Stop old sender
    if (this.dmxnetSender) {
      this.dmxnetSender.stop();
    }
    // Create new sender
    this.dmxnetSender = dmxnet.newSender({
      ip: this.dmxnetIP, net: this.dmxnetNet,
      port: this.dmxnetPort, subnet: this.dmxnetSubnet, universe: this.dmxnetUniverse,
    });
    Logging.log("New DMXNET sender to " + this.dmxnetIP + ":" +
      this.dmxnetPort + " N:" + this.dmxnetNet + " S:" + this.dmxnetSubnet + " U:" +
      this.dmxnetUniverse);
    if (!this.anData.source) {
        Logging.warn("ArtNet " + this.instance + ": Source not given, no output.");
      } else {
    this.subChannel(this.anData.source);
  }
  }
  public subChannel(src) {
    Logging.debug("Use " + src + " as source.");
    this.channelEvent = data.subscribe(src);
    this.channelEvent.on("data", () => {
      const srcobj = data.getLocal(src);
      if (srcobj.channel) {
        this.channel = srcobj.channel;
        this.send();
      }
    });
  }
  public send() {
    // Send channels
    if (this.channel) {
      Object.keys(this.channel).forEach((c) => {
        const ch = parseInt(c, 10);
        if (ch >= 0 && ch < 512) {
        this.dmxnetSender.prepChannel(c, parseInt(this.channel[c], 10));
        }
      });
      this.dmxnetSender.transmit();
      Logging.debug("Transmit ArtNet");
    }
  }
}
