import { ChainId, Token, Pair, TokenAmount, WTRX, Price, TOFU_FREEZER_ADDRESS } from '../src'
import JSBI from 'jsbi'

describe('Pair', () => {
  const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 18, 'USDC', 'USD Coin')
  const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')

  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => new Pair(new TokenAmount(USDC, '100'), new TokenAmount(WTRX[ChainId.NILE], '100'))).toThrow(
        'CHAIN_IDS'
      )
    })
  })

  describe('#getAddress', () => {
    it('returns the correct address', () => {
      //expect(Pair.getAddress(USDC, DAI)).toEqual('0xb5040Ada89569Fe2D8eaf615ab6D9401De86062f')
      expect(Pair.getAddress(USDC, DAI)).toEqual('0x6324A243BB6925FC1025485e901139203144B653')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).token0).toEqual(DAI)
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100')).token0).toEqual(DAI)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).token1).toEqual(USDC)
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100')).token1).toEqual(USDC)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '101')).reserve0).toEqual(
        new TokenAmount(DAI, '101')
      )
      expect(new Pair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100')).reserve0).toEqual(
        new TokenAmount(DAI, '101')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '101')).reserve1).toEqual(
        new TokenAmount(USDC, '100')
      )
      expect(new Pair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100')).reserve1).toEqual(
        new TokenAmount(USDC, '100')
      )
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new Pair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100')).token0Price).toEqual(
        new Price(DAI, USDC, '100', '101')
      )
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '101')).token0Price).toEqual(
        new Price(DAI, USDC, '100', '101')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new Pair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100')).token1Price).toEqual(
        new Price(USDC, DAI, '101', '100')
      )
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '101')).token1Price).toEqual(
        new Price(USDC, DAI, '101', '100')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(DAI)).toEqual(pair.token0Price)
      expect(pair.priceOf(USDC)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WTRX[ChainId.MAINNET])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '101')).reserveOf(USDC)).toEqual(
        new TokenAmount(USDC, '100')
      )
      expect(new Pair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100')).reserveOf(USDC)).toEqual(
        new TokenAmount(USDC, '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100')).reserveOf(WTRX[ChainId.MAINNET])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).chainId).toEqual(ChainId.MAINNET)
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100')).chainId).toEqual(ChainId.MAINNET)
    })
  })
  describe('#involvesToken', () => {
    expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).involvesToken(USDC)).toEqual(true)
    expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).involvesToken(DAI)).toEqual(true)
    expect(
      new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).involvesToken(WTRX[ChainId.MAINNET])
    ).toEqual(false)
  })
  describe('#freezerDiscount', () => {
    const pair = new Pair(new TokenAmount(USDC, '100000000000000000000'), new TokenAmount(DAI, '100000000000000000000'))
    const tofuFreezer = new Token(ChainId.MAINNET, TOFU_FREEZER_ADDRESS, 6, 'TofuFreezer')
    const tofuFreezed100 = new TokenAmount(tofuFreezer, JSBI.BigInt(100000000))
    const tofuFreezed1001 = new TokenAmount(tofuFreezer, JSBI.BigInt(1001000000))
    const tofuFreezed10002 = new TokenAmount(tofuFreezer, JSBI.BigInt(10002000000))
    const tofuFreezed100000 = new TokenAmount(tofuFreezer, JSBI.BigInt(100000000000))

    it('returns getOutputAmount with freeze', () => {
      const amount = new TokenAmount(USDC, JSBI.BigInt(1000000000000000000))
      expect(pair.getOutputAmount(amount, tofuFreezed100)[0].toFixed(18)).toEqual('0.987648209114086982')
      expect(pair.getOutputAmount(amount, tofuFreezed1001)[0].toFixed(18)).toEqual('0.988138378977801540')
      expect(pair.getOutputAmount(amount, tofuFreezed10002)[0].toFixed(18)).toEqual('0.988628543988277053')
      expect(pair.getOutputAmount(amount, tofuFreezed100000)[0].toFixed(18)).toEqual('0.989118704145585599')
    })
    it('returns getInputAmount with freeze', () => {
      const amount = new TokenAmount(USDC, JSBI.BigInt(1000000000000000000))
      expect(pair.getInputAmount(amount, tofuFreezed100)[0].toFixed(18)).toEqual(  '1.012632591579960002')
      expect(pair.getInputAmount(amount, tofuFreezed1001)[0].toFixed(18)).toEqual( '1.012125260622254611')
      expect(pair.getInputAmount(amount, tofuFreezed10002)[0].toFixed(18)).toEqual('1.011618437757646571')
    })
  })
})
