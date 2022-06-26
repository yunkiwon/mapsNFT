export class UserProvider {
    
    static async getOpenseaItems(address) {
      var requestOptions = {
        method: 'GET', 
      }
  
      const items = await fetch(
        `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTs/?owner=${address}`, 
        requestOptions
      )
        .then((res) => res.json())
        .then((res) => {
          return res.ownedNfts;
        })
        .catch((e) => {
          console.error(e);
          console.error('Could not retrieve NFTs from OpenSea');
          return null;
        });
  
  
      if (items === undefined || items?.length === 0) {
        return;
      }
  
      const filtered = items.filter(obj => {
        //filtering out ENS or errors 
        return (obj.contract.address !== '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85' && !obj.error)
    })
  
      return filtered;
    }
  }
  