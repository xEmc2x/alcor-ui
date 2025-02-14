import axios from 'axios'

import { createClient } from 'redis'
import { getPools } from '../swapV2Service/utils'
import { Market, Match } from '../../models'


const redis = createClient()

export async function updateSystemPrice(network: Network) {
  if (!redis.isOpen) await redis.connect()

  try {
    const { data } = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: network.name,
          vs_currencies: 'usd',
        },
      }
    )

    const price = data[network.name].usd
    redis.set(`${network.name}_price`, String(price))
    console.log(`Updated ${network.name} price: `, price)
  } catch (e) {
    console.error('SYSTEM PRICE UPDATE FAILED!', network.name, e)
  }
}

// system token and their USD prices
export async function updateTokensPrices(network: Network) {
  if (!redis.isOpen) await redis.connect()
  const tokens = await makeAllTokensWithPrices(network)
  await redis.set(`${network.name}_token_prices`, JSON.stringify(tokens))
  console.log(network.name, 'token prices updated!')
}

export async function makeAllTokensWithPrices(network: Network) {
  if (!redis.isOpen) await redis.connect()
  // Based on swap only, right now
  const tokens = []
  const { baseToken } = network

  const system_token = (baseToken.symbol + '-' + baseToken.contract).toLowerCase()
  const systemPrice = parseFloat(await redis.get(`${network.name}_price`)) || 0

  const pools = await getPools(network.name)

  pools.map(p => {
    const { tokenA, tokenB } = p
    if (tokens.filter(t => t.id == tokenA.id).length == 0) tokens.push(tokenA)
    if (tokens.filter(t => t.id == tokenB.id).length == 0) tokens.push(tokenB)
  })

  for (const t of tokens) {
    if (t.id == system_token) {
      t.system_price = 1
      t.usd_price = systemPrice
      continue
    }

    // Get pool for fetch price sorted by number of ticks(means more liquidity)
    const pool = pools.sort((a, b) => b.tickDataProvider.ticks.length - a.tickDataProvider.ticks.length).find(p => (
      p.tokenA.id == (t.symbol + '-' + t.contract).toLowerCase() &&
      p.tokenB.id == system_token
    ) || (
      p.tokenB.id == (t.symbol + '-' + t.contract).toLowerCase() &&
      p.tokenA.id == system_token
    ))

    if (!pool) {
      t.usd_price = 0.0
      t.system_price = 0.0
    } else {
      t.system_price = parseFloat((pool.tokenA.id == system_token ? pool.tokenBPrice : pool.tokenAPrice)
        .toSignificant(6)
      )

      t.usd_price = t.system_price * systemPrice
    }

    t.usd_price = parseFloat(t.usd_price)
  }

  const market_tokens = []
  const markets = await Market.find({ chain: network.name })

  markets.forEach(m => {
    const { base_token, quote_token } = m
    if (!tokens.find(t => t.id == base_token.id) && !market_tokens.find(t => t[0].id == base_token.id)) market_tokens.push([base_token, m])
    if (!tokens.find(t => t.id == quote_token.id) && !market_tokens.find(t => t[0].id == quote_token.id)) market_tokens.push([quote_token, m])
  })

  // fetching prices
  for (const i of market_tokens) {
    const [token, market] = i

    const t = {
      contract: token.contract,
      decimals: token.symbol.precision,
      symbol: token.symbol.name,
      id: token.id,
      usd_price: 0.0,
      system_price: 0.0
    }

    if (market.base_token.id == system_token) {
      const last_deal = await Match.findOne({ chain: network.name, market: market.id }, {}, { sort: { time: -1 } })

      if (last_deal) {
        t.system_price = last_deal.unit_price
        t.usd_price = t.system_price * systemPrice
      }
    }

    tokens.push(t)
  }

  return tokens
}
