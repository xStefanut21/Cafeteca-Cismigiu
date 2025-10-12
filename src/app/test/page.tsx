import { createClient } from '@/utils/supabase/server'

export default async function TestPage() {
  const supabase = await createClient()

  const { data: categories, error } = await supabase.from('categories').select('*')

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Connection Error</h1>
        <pre className="bg-red-100 p-4 rounded text-red-800">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Database Connection Test</h1>
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(categories, null, 2)}
      </pre>
    </div>
  )
}
