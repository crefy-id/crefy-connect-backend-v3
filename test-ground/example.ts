import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { sep } from 'path'

export const client = createPublicClient({
  chain: sepolia,
  transport: http(),
})
 

// Local Account
const account = privateKeyToAccount("0x54a0a26f36ee42e8450420511174fe82f478f03257df27a179e7a4b1cd926b5d")

const balances = await client.getBalance({
  address: "0x9B9d79686dbd0DE8Df5a8FcA26CcC19Ac02E5333"
});

console.log(balances)