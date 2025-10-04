// components/FoodLogger.jsx

function FoodLogger({ foodList, onAdd }) {
  const [selectedFood, setSelectedFood] = useState(null);
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    if (selectedFood) {
      onAdd({ ...selectedFood, qty });
    }
  };

  return (
    <div>
      <h3>เลือกอาหาร</h3>
      <select onChange={(e) => {
        const food = foodList.find(f => f.id === +e.target.value);
        setSelectedFood(food);
      }}>
        <option>เลือกอาหาร</option>
        {foodList.map(food => (
          <option key={food.id} value={food.id}>{food.name}</option>
        ))}
      </select>
      <input type="number" value={qty} onChange={(e) => setQty(+e.target.value)} />
      <button onClick={handleAdd}>เพิ่ม</button>
    </div>
  );
}
