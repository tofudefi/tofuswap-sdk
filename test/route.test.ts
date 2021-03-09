import { Token, WTRX, ChainId, Pair, TokenAmount, Route, TRX } from '../src'

describe('Route', () => {
  const token0 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000001', 18, 't0')
  const token1 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000002', 18, 't1')
  const wtrx = WTRX[ChainId.MAINNET]
  const pair_0_1 = new Pair(new TokenAmount(token0, '100'), new TokenAmount(token1, '200'))
  const pair_0_wtrx = new Pair(new TokenAmount(token0, '100'), new TokenAmount(wtrx, '100'))
  const pair_1_wtrx = new Pair(new TokenAmount(token1, '175'), new TokenAmount(wtrx, '100'))

  it('constructs a path from the tokens', () => {
    const route = new Route([pair_0_1], token0)
    expect(route.pairs).toEqual([pair_0_1])
    expect(route.path).toEqual([token0, token1])
    expect(route.input).toEqual(token0)
    expect(route.output).toEqual(token1)
    expect(route.chainId).toEqual(ChainId.MAINNET)
  })

  it('can have a token as both input and output', () => {
    const route = new Route([pair_0_wtrx, pair_0_1, pair_1_wtrx], wtrx)
    expect(route.pairs).toEqual([pair_0_wtrx, pair_0_1, pair_1_wtrx])
    expect(route.input).toEqual(wtrx)
    expect(route.output).toEqual(wtrx)
  })

  it('supports trx input', () => {
    const route = new Route([pair_0_wtrx], TRX)
    expect(route.pairs).toEqual([pair_0_wtrx])
    expect(route.input).toEqual(TRX)
    expect(route.output).toEqual(token0)
  })

  it('supports trx output', () => {
    const route = new Route([pair_0_wtrx], token0, TRX)
    expect(route.pairs).toEqual([pair_0_wtrx])
    expect(route.input).toEqual(token0)
    expect(route.output).toEqual(TRX)
  })
})
