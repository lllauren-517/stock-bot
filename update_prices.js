// update_prices.js
const { createClient } = require('@supabase/supabase-js');
const yahooFinance = require('yahoo-finance2').default;

// 這些環境變數稍後會在 GitHub 中設定
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);

const symbolsToUpdate = ['AAPL', 'TSLA', 'MSFT', 'NVDA']; // 你想追蹤的股票

async function updatePrices() {
  for (const symbol of symbolsToUpdate) {
    try {
      const quote = await yahooFinance.quote(symbol);
      const price = quote.regularMarketPrice;
      
      // 更新寫入 Supabase
      const { error } = await supabase
        .from('securities')
        .upsert({ symbol: symbol, price: price, updated_at: new Date() });
        
      if (error) console.error(`Error updating ${symbol}:`, error);
      else console.log(`Successfully updated ${symbol} to $${price}`);
      
    } catch (err) {
      console.error(`Failed to fetch ${symbol}`, err);
    }
  }
}

updatePrices();