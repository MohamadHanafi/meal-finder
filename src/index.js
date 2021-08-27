const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const singleMealEl = document.getElementById('single-meal');

//fetch from api
const fetchMeal = async (meal) => {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`
  );

  const data = await res.json();

  resultHeading.innerHTML = `<h2>Search results for '${meal}'</h2>`;
  mealsEl.innerHTML = data.meals
    .map(
      (meal) => `
  <div class='meal'>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
  <div class="meal-info" data-mealID="${meal.idMeal}">
  <h3>${meal.strMeal}</h3>
  </div>
  </div>
  `
    )
    .join('');
};

//search meal and fetch from api
const searchMeal = (e) => {
  e.preventDefault();

  singleMealEl.innerHTML = '';

  const term = search.value;

  if (term.trim()) {
    fetchMeal(term);
    search.value = '';
  } else {
    alert('please enter a search term');
  }
};

// fetch meal by id
const getMealById = async (mealId) => {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  const data = await res.json();

  const meal = data.meals[0];

  addMealToDOM(meal);
};

//fetchRandomMeal

const fetchRandomMeal = async () => {
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
  const data = await res.json();
  const meal = data.meals[0];
  addMealToDOM(meal);
};

// add meal to DOM
function addMealToDOM(meal) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMealEl.innerHTML = `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
    <div class="single-meal-info">
      ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
    </div>
    <div class="main">
      <p>${meal.strInstructions}</p>
      <h2>ingredients</h2>
      <ul>
        ${ingredients.map((ingredient) => `<li>${ingredient}</li>`).join('')}
      </ul>
    </div>
  </div>
  `;
}
// fetch meals on load

const fetchMealsOnLoad = () => {
  fetchMeal('chicken');
};

//event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', fetchRandomMeal);

mealsEl.addEventListener('click', (event) => {
  const mealInfo = event
    .composedPath()
    .find((item) => item.classList.contains('meal-info'));
  if (mealInfo) {
    const mealId = mealInfo.getAttribute('data-mealid');
    getMealById(mealId);
  }
});

fetchMealsOnLoad();
