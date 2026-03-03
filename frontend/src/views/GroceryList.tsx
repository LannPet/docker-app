import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import axios from "axios"

type GroceryItem = {
  id: number
  name: string
  amount: number
}

export default function GroceryList() {
  const [nameInput, setNameInput] = useState("")
  const [amountInput, setAmountInput] = useState("")
  const [items, setItems] = useState<GroceryItem[]>([])

  const handleAddItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = nameInput.trim()
    const parsedAmount = Number(amountInput) == 0 ? 1 : Number(amountInput);

    if (!trimmedName) {
      return
    }
    try {
      const response = await axios.post<GroceryItem>(`/api/items`, {
        name: trimmedName,
        amount: parsedAmount,
      })
      setItems((prevItems) => [...prevItems, response.data])
      setNameInput("")
      setAmountInput("")
    } catch (error) {
      console.error("Error adding item:", error)
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    try {
      await axios.delete(`/api/items/${itemId}`)
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`/api/items`);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    getData();
  }, []);

  return (
    <div className="w-full max-w-xl h-[700px] flex flex-col relative rounded-3xl border border-emerald-100 bg-gradient-to-b from-teal-200 to-teal-100 p-6 shadow-xl sm:p-8">
      <section className="mb-6 border-b border-emerald-100 pb-6 text-center grow-0 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-emerald-900 sm:text-4xl">
          Grocery List
        </h1>
        <p className="mt-2 text-sm text-emerald-700">
          Add items below and remove them when done.
        </p>
      </section>

      <form className="mb-6 grid gap-3 sm:grid-cols-[1fr_140px_auto] grow-0 shrink-0" onSubmit={handleAddItem}>
        <input
          type="text"
          placeholder="Item name"
          className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          value={nameInput}
          onChange={(event) => setNameInput(event.target.value)}
        />
        <input
          type="number"
          min={1}
          placeholder="Amount"
          className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          value={amountInput}
          onChange={(event) => setAmountInput(event.target.value)}
        />
        <button
          type="submit"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Add
        </button>
      </form>

      <section className=" bg-gray-50 overflow-y-scroll flex-1 min-h-0 p-2 rounded-xl">
        {items && items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-emerald-200 bg-white p-5 text-center text-sm text-emerald-700">
            No items yet. Add your first grocery item above.
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-emerald-100 bg-white px-4 py-3 shadow-sm"
              >
                <div>
                  <p className="text-base font-medium text-emerald-900">{item.name}</p>
                  <p className="text-sm text-emerald-700">Amount: {item.amount}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  className="rounded-lg bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
