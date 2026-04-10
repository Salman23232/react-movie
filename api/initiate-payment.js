const axios = require('axios')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Use POST')

  const { clerkId } = req.body // Extracting from Clerk

  try {
    const pipraRes = await axios.post(
      'https://pay-lumihive.unaux.com/api/v3/charge',
      {
        amount: 99,
        currency: 'BDT',
        pp_id: `clerk_${clerkId}_${Date.now()}`,
        success_url: `https://${req.headers.host}/payment-success`,
        // This tells PipraPay where to send the "Completed" status
        webhook_url: `https://${req.headers.host}/api/verify-webhook`,
        customer_name: clerkId, // Using ID as reference
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PIPRAPAY_API_KEY}`,
          Accept: 'application/json',
        },
      }
    )

    // Use UPSERT: It inserts if new, or updates if the user already tried to pay before
    await supabase.from('subscriptions').upsert(
      {
        clerk_id: clerkId,
        status: 'pending',
        amount: 99,
      },
      { onConflict: 'clerk_id' }
    )

    res.status(200).json(pipraRes.data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
