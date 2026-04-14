import { getSession } from "next-auth/react"

const Sidebar = async () => {
    const session = await getSession();
    const userType = session?.user?.user_type;
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">{userType} Dashboard</h2>
      {userType === "Agent" && (
        <nav className="space-y-2">
          <a href="/agent" className="block p-2 hover:bg-gray-700 rounded">Overview</a>
          <a href="/agent/properties" className="block p-2 hover:bg-gray-700 rounded">My Properties</a>
          <a href="/agent/inquiries" className="block p-2 hover:bg-gray-700 rounded">Inquiries</a>
        </nav>
      )}
      {userType === "Buyer" && (
        <nav className="space-y-2">
          <a href="/buyer" className="block p-2 hover:bg-gray-700 rounded">Overview</a>
          <a href="/buyer/properties" className="block p-2 hover:bg-gray-700 rounded">Favorites</a>
          <a href="/buyer/inquiries" className="block p-2 hover:bg-gray-700 rounded">My Inquiries</a>
        </nav>
      )}
    </aside>
  )
}

export default Sidebar