// components/NutritionProgress.jsx

import { ProgressBar } from 'some-ui-library';

function NutritionProgress({ total, goal }) {
  return (
    <div>
      <h4>วันนี้คุณได้รับ</h4>
      <p>พลังงาน: {total.calories} / {goal.calories} kcal</p>
      <ProgressBar value={(total.calories / goal.calories) * 100} />

      <p>โปรตีน: {total.protein}g / {goal.protein}g</p>
      <ProgressBar value={(total.protein / goal.protein) * 100} />

      <p>ไขมัน: {total.fat}g / {goal.fat}g</p>
      <ProgressBar value={(total.fat / goal.fat) * 100} />

      <p>คาร์บ: {total.carbs}g / {goal.carbs}g</p>
      <ProgressBar value={(total.carbs / goal.carbs) * 100} />
    </div>
  );
}
