import invariant from 'tiny-invariant'
import { ChainId, CurrencyAmount, TRX, Pair, Percent, Route, Router, Token, TokenAmount, Trade, WTRX } from '../src'
import JSBI from 'jsbi'

function checkDeadline(deadline: string[] | string): void {
  expect(typeof deadline).toBe('string')
  invariant(typeof deadline === 'string')
  // less than 5 seconds on the deadline
  expect(new Date().getTime() / 1000 - parseInt(deadline)).toBeLessThanOrEqual(5)
}

describe('Router', () => {
  const token0 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000001', 18, 't0')
  const token1 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000002', 18, 't1')

  const pair_0_1 = new Pair(new TokenAmount(token0, JSBI.BigInt(1000)), new TokenAmount(token1, JSBI.BigInt(1000)))

  const pair_wtrx_0 = new Pair(new TokenAmount(WTRX[ChainId.MAINNET], '1000'), new TokenAmount(token0, '1000'))

  describe('#swapCallParameters', () => {
    describe('exact in', () => {
      it('trx to token1', () => {
        const result = Router.swapCallParameters(
          Trade.exactIn(new Route([pair_wtrx_0, pair_0_1], TRX, token1), CurrencyAmount.trx(JSBI.BigInt(100))),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100') }
        )
        expect(result.methodName).toEqual('swapExactTRXForTokens')
        expect(result.args.slice(0, -1)).toEqual([
          '0x51',
          [WTRX[ChainId.MAINNET].address, token0.address, token1.address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x64')
        checkDeadline(result.args[result.args.length - 1])
      })
      it('deadline specified', () => {
        const result = Router.swapCallParameters(
          Trade.exactIn(new Route([pair_wtrx_0, pair_0_1], TRX, token1), CurrencyAmount.trx(JSBI.BigInt(100))),
          {
            deadline: 50,
            recipient: '0x0000000000000000000000000000000000000004',
            allowedSlippage: new Percent('1', '100')
          }
        )
        expect(result.methodName).toEqual('swapExactTRXForTokens')
        expect(result.args).toEqual([
          '0x51',
          [WTRX[ChainId.MAINNET].address, token0.address, token1.address],
          '0x0000000000000000000000000000000000000004',
          '0x32'
        ])
        expect(result.value).toEqual('0x64')
      })

      it('token1 to trx', () => {
        const result = Router.swapCallParameters(
          Trade.exactIn(new Route([pair_0_1, pair_wtrx_0], token1, TRX), new TokenAmount(token1, JSBI.BigInt(100))),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100') }
        )
        expect(result.methodName).toEqual('swapExactTokensForTRX')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          '0x51',
          [token1.address, token0.address, WTRX[ChainId.MAINNET].address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x0')
        checkDeadline(result.args[result.args.length - 1])
      })
      it('token0 to token1', () => {
        const result = Router.swapCallParameters(
          Trade.exactIn(new Route([pair_0_1], token0, token1), new TokenAmount(token0, JSBI.BigInt(100))),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100') }
        )
        expect(result.methodName).toEqual('swapExactTokensForTokens')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          '0x59',
          [token0.address, token1.address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x0')
        checkDeadline(result.args[result.args.length - 1])
      })
    })
    describe('exact out', () => {
      it('trx to token1', () => {
        const result = Router.swapCallParameters(
          Trade.exactOut(new Route([pair_wtrx_0, pair_0_1], TRX, token1), new TokenAmount(token1, JSBI.BigInt(100))),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100') }
        )
        expect(result.methodName).toEqual('swapTRXForExactTokens')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          [WTRX[ChainId.MAINNET].address, token0.address, token1.address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x80')
        checkDeadline(result.args[result.args.length - 1])
      })
      it('token1 to trx', () => {
        const result = Router.swapCallParameters(
          Trade.exactOut(new Route([pair_0_1, pair_wtrx_0], token1, TRX), CurrencyAmount.trx(JSBI.BigInt(100))),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100') }
        )
        expect(result.methodName).toEqual('swapTokensForExactTRX')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          '0x80',
          [token1.address, token0.address, WTRX[ChainId.MAINNET].address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x0')
        checkDeadline(result.args[result.args.length - 1])
      })
      it('token0 to token1', () => {
        const result = Router.swapCallParameters(
          Trade.exactOut(new Route([pair_0_1], token0, token1), new TokenAmount(token1, JSBI.BigInt(100))),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100') }
        )
        expect(result.methodName).toEqual('swapTokensForExactTokens')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          '0x71',
          [token0.address, token1.address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x0')
        checkDeadline(result.args[result.args.length - 1])
      })
    })
    describe('supporting fee on transfer', () => {
      describe('exact in', () => {
        it('trx to token1', () => {
          const result = Router.swapCallParameters(
            Trade.exactIn(new Route([pair_wtrx_0, pair_0_1], TRX, token1), CurrencyAmount.trx(JSBI.BigInt(100))),
            {
              ttl: 50,
              recipient: '0x0000000000000000000000000000000000000004',
              allowedSlippage: new Percent('1', '100'),
              feeOnTransfer: true
            }
          )
          expect(result.methodName).toEqual('swapExactTRXForTokensSupportingFeeOnTransferTokens')
          expect(result.args.slice(0, -1)).toEqual([
            '0x51',
            [WTRX[ChainId.MAINNET].address, token0.address, token1.address],
            '0x0000000000000000000000000000000000000004'
          ])
          expect(result.value).toEqual('0x64')
          checkDeadline(result.args[result.args.length - 1])
        })
        it('token1 to trx', () => {
          const result = Router.swapCallParameters(
            Trade.exactIn(new Route([pair_0_1, pair_wtrx_0], token1, TRX), new TokenAmount(token1, JSBI.BigInt(100))),
            {
              ttl: 50,
              recipient: '0x0000000000000000000000000000000000000004',
              allowedSlippage: new Percent('1', '100'),
              feeOnTransfer: true
            }
          )
          expect(result.methodName).toEqual('swapExactTokensForTRXSupportingFeeOnTransferTokens')
          expect(result.args.slice(0, -1)).toEqual([
            '0x64',
            '0x51',
            [token1.address, token0.address, WTRX[ChainId.MAINNET].address],
            '0x0000000000000000000000000000000000000004'
          ])
          expect(result.value).toEqual('0x0')
          checkDeadline(result.args[result.args.length - 1])
        })
        it('token0 to token1', () => {
          const result = Router.swapCallParameters(
            Trade.exactIn(new Route([pair_0_1], token0, token1), new TokenAmount(token0, JSBI.BigInt(100))),
            {
              ttl: 50,
              recipient: '0x0000000000000000000000000000000000000004',
              allowedSlippage: new Percent('1', '100'),
              feeOnTransfer: true
            }
          )
          expect(result.methodName).toEqual('swapExactTokensForTokensSupportingFeeOnTransferTokens')
          expect(result.args.slice(0, -1)).toEqual([
            '0x64',
            '0x59',
            [token0.address, token1.address],
            '0x0000000000000000000000000000000000000004'
          ])
          expect(result.value).toEqual('0x0')
          checkDeadline(result.args[result.args.length - 1])
        })
      })
      describe('exact out', () => {
        it('trx to token1', () => {
          expect(() =>
            Router.swapCallParameters(
              Trade.exactOut(
                new Route([pair_wtrx_0, pair_0_1], TRX, token1),
                new TokenAmount(token1, JSBI.BigInt(100))
              ),
              {
                ttl: 50,
                recipient: '0x0000000000000000000000000000000000000004',
                allowedSlippage: new Percent('1', '100'),
                feeOnTransfer: true
              }
            )
          ).toThrow('EXACT_OUT_FOT')
        })
        it('token1 to trx', () => {
          expect(() =>
            Router.swapCallParameters(
              Trade.exactOut(new Route([pair_0_1, pair_wtrx_0], token1, TRX), CurrencyAmount.trx(JSBI.BigInt(100))),
              {
                ttl: 50,
                recipient: '0x0000000000000000000000000000000000000004',
                allowedSlippage: new Percent('1', '100'),
                feeOnTransfer: true
              }
            )
          ).toThrow('EXACT_OUT_FOT')
        })
        it('token0 to token1', () => {
          expect(() =>
            Router.swapCallParameters(
              Trade.exactOut(new Route([pair_0_1], token0, token1), new TokenAmount(token1, JSBI.BigInt(100))),
              {
                ttl: 50,
                recipient: '0x0000000000000000000000000000000000000004',
                allowedSlippage: new Percent('1', '100'),
                feeOnTransfer: true
              }
            )
          ).toThrow('EXACT_OUT_FOT')
        })
      })
    })
  })
})
