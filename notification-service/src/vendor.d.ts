// vendor.d.ts — уявіть, що це node_modules, ви туди не лізете
declare namespace VendorSDK {
  interface Context {
    requestId: string;
  }
}
