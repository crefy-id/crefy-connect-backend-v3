import StellarSdk, {Keypair} from "@stellar/stellar-sdk";

const privateKey = "SBBU3V25UG35OSAYC6HB4223STHW3A2QQXUSQYNOKBU5GZTVIBBLLJQ6"

const keypair = Keypair.fromSecret(privateKey)

console.log("Public Key: ", keypair.publicKey())
console.log("Secret Key: ", keypair.secret())

// 2. Connect to stellar network
const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org/")

async function LoadAccount() {
    try {
        const account = await server.loadAccount(keypair.publicKey())
        console.log("AccountID: ", account.account_id)
        console.log("Balances: ", account.balances)
        console.log("Operations", account.operations)
      
    } catch (error) {
        
        console.error("Error loading account: ", error)
    }
}

LoadAccount()

async function LoadTransactions() {
    try {
        server.transactions()
            .forAccount('GBHUQNRSICBJRSUKCZ2HOEPBEU23VJGPPPMYHIS6RV7MJJPBQI2SLJTI')
            .call().then(function(r: any){ console.log(r); });
    } catch (error) {
        console.error("Error loading account: ", error)
    }
}
// LoadTransactions()


async function FundWithFriendbot(){
    try {
        console.log("Funding account with Friendbot...");
        
        // Using fetch API since Stellar SDK's Friendbot might not be available
        const response = await fetch(
            `https://friendbot.stellar.org?addr=${encodeURIComponent(keypair.publicKey())}`
        );
        const result = await response.json();
        console.log("Friendbot response:", result);
        
        // Wait a moment for the transaction to be processed
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return true;
    } catch (error) {
        console.error("Error with Friendbot:", error);
        return false;
    }
}

// FundWithFriendbot()