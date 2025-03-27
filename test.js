const {

  getAddress,
  isAddress,

  getIcapAddress,

  getContractAddress,
  getCreate2Address

} = require("@ethersproject/address");

async function main() {
  const futureAddress = getContractAddress({
    from: "0x8EF7d63150E027Bd31FD84dfeCe615E1a0bbd48a",
    nonce: 1
  })
  console.log(futureAddress)
}

main();
