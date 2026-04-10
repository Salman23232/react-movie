const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export default async function handler(req, res) {
  const data = req.body
  const status = data.status ? data.status.toLowerCase() : ''
  const pp_id = data.pp_id

  if (status === 'completed') {
    const clerkId = pp_id.split('_')[1]

    const expiry = new Date()
    expiry.setDate(expiry.getDate() + 30) // 30 Day Subscription

    // Update your existing table
    await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        expiry_date: expiry,
      })
      .eq('clerk_id', clerkId)
  }
  res.status(200).send('ok')
}
