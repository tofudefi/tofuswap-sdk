import JSBI from 'jsbi'

// exports for external consumption
export type BigintIsh = JSBI | bigint | string

export enum ChainId {
  MAINNET = 11111,
  NILE = 201910292,
  SHASTA = 1
}

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}

// TODO(tron): nile address is 0x41DA32Ec09Fb54aB5f5742F1eB730003caaC0BbF
export const FACTORY_ADDRESS = '0x040A3d84309784628290b9f3437874868beE30Af'

export const INIT_CODE_HASH = '0x278d8201610c32bb650c43e9c27bb9124680c6c6b82d65d58a4117c055f01573'

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const _997 = JSBI.BigInt(997)
export const _1000 = JSBI.BigInt(1000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256'
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}

// @TRON only
export const FACTORY_ADDRESSES = {
  [ChainId.NILE]: '0x41da32ec09fb54ab5f5742f1eb730003caac0bbf',
  [ChainId.MAINNET]: '0x040A3d84309784628290b9f3437874868beE30Af',
  [ChainId.SHASTA]: '0xtodo'
}

// TODO: build that data structure from a simple array of (tokenA, tokenB, pairAddress) to avoid human error when adding pairs...

interface PairAddresses {
  [token0Address: string]: { [token1Address: string]: string }
}

// @TRON
function buildPairAddresses(list: [string, string, string][]): PairAddresses {
  const res: PairAddresses = {}
  list.forEach(([tokenA, tokenB, pairAddress]) => {
    // deterministically sort addresses (prevents duplicates, e.g. (a, b) vs (b ,a))
    const [token0_, token1_] = tokenA.toLowerCase() < tokenB.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA]
    const token0 = token0_.toLowerCase()
    const token1 = token1_.toLowerCase()
    res[token0] = res[token0] || {}
    if (res[token0][token1]) {
      throw new Error(`duplicated pair ${tokenA}, ${tokenB}, ${pairAddress}`)
    }
    res[token0][token1] = pairAddress
  })
  return res
}

// format: token1, token2, pairAddress
export const PAIR_ADDRESSES: { [chainId: string]: PairAddresses } = {
  [ChainId.NILE]: buildPairAddresses([
    [
      // DTKN/WTRX
      '0x42c142500ff7068f326c01a8f1b3cd8ea7d9377f',
      '0x8f44113a985076431b77f6078f0929f949cb8836',
      '0x02a6a10E4C7750a7F8dC159b95936B574c211f0D'
    ]
  ]),
  [ChainId.MAINNET]: buildPairAddresses([
    [
      // USDT/TRX
      '0x891cdb91d149f23B1a45D9c5Ca78a88d0cB44C18', // WTRX
      '0xa614f803B6FD780986A42c78Ec9c7f77e6DeD13C', // USDT
      '0xC4488fa262236619425E19f6bA4A8639b8cA1973' // Pair
    ],
    [
      // sTRX/TRX
      '0x891cdb91d149f23B1a45D9c5Ca78a88d0cB44C18', // WTRX
      '0xA099cc498284ed6e25F3C99e6d55074e6ba42911', // sTRX
      // Pair address, as queried from
      // https://tronscan.org/#/contract/TFetSGMphMDu8MLwVPMd5s1QYYTLrTmPs8/code
      // getPair(41891cdb91d149f23B1a45D9c5Ca78a88d0cB44C18, 41A099cc498284ed6e25F3C99e6d55074e6ba42911)
      '0x6C872684e348EC3a5418Fb1E952556110550c924'
    ]
  ]),
  [ChainId.SHASTA]: {}
}
