/**
 * Purpose: Supabase Edge Function to delete the calling user's auth account and all related data.
 * Responsibilities: Verify JWT, delete user rows from public tables, then delete auth user.
 * The auth.users row deletion cascades to profiles/devices/user_settings/entries/bookmarks/progress.
 * Inputs: POST request with Authorization: Bearer <jwt> header.
 * Outputs: JSON { success: true } or { error: string }.
 */
import { createClient } from 'npm:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const jwt = authHeader.replace('Bearer ', '')

  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(jwt)
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Explicitly clean up public tables before auth deletion (belt-and-suspenders).
  const tables = ['profiles', 'devices', 'user_settings', 'entries', 'bookmarks', 'progress']
  for (const table of tables) {
    const { error } = await supabaseAdmin.from(table).delete().eq('user_id', user.id)
    if (error) {
      console.error(`Failed to delete from ${table}:`, error)
    }
  }

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
