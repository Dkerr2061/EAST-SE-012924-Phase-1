// write your code here
const restaurantMenuElement = document.getElementById('restaurant-menu')
const detailImageElement = document.querySelector('.detail-image')
const nameElement = document.querySelector('.name')
const descriptionElement = document.getElementById('description-display')


fetch('http://localhost:3000/foods')
.then(response => response.json())
.then(foodData => {
  displayFoodDetails(foodData[0])
  addFoodImageToRestaurantMenu(foodData)
})

function addFoodImageToRestaurantMenu(foods) {
  return foods.forEach( food => {
    const img = document.createElement('img')
    img.src = food.image
    restaurantMenuElement.appendChild(img)
    img.addEventListener('click', () => {
      displayFoodDetails(food)
    } )
  })
}

function displayFoodDetails(foods) {
  detailImageElement.src = foods.image
  nameElement.textContent = foods.name
  descriptionElement.textContent = foods.description
}