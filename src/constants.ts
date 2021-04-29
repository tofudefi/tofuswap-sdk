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

// mainnet
export const FACTORY_ADDRESS = '0xc31f30448cb48d0822c0e94573b1fb7671883e09'

export const TOFU_FREEZER_ADDRESS = '0x4B51442c89d2A87480F29A5470FDc3f9619869E1'

// local tests
//export const INIT_CODE_HASH = '0x67362b6851b5759acb891575dad6796f51c77306b174ae6c6fd05882d9bd1bf3'
//mainnet
export const INIT_CODE_HASH = '0x9a276da79c5556bb068dcd272cffa5b6a813c757c1d161722caaf65234be463b'

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const _9970 = JSBI.BigInt(9970)
export const _9975 = JSBI.BigInt(9975)
export const _9980 = JSBI.BigInt(9980)
export const _9985 = JSBI.BigInt(9985)
export const _9990 = JSBI.BigInt(9990)
export const _10000 = JSBI.BigInt(10000)
export const _100000000 = JSBI.BigInt(100000000)
export const _1000000000 = JSBI.BigInt(1000000000)
export const _10000000000 = JSBI.BigInt(10000000000)
export const _100000000000 = JSBI.BigInt(100000000000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256'
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}
