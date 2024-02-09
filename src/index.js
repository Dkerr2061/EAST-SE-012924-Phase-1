const restaurantMenu = document.getElementById('restaurant-menu')
let currentlyDisplayedFood;
let foodsArray;


fetch('http://localhost:3000/foods')
.then(response => response.json())
.then(foods => {
    foodsArray =foods
    displayFoodDetails(foods[0])

    foods.forEach(food => {
        addFoodImageToRestaurantMenu(food)
    })
})

function addFoodImageToRestaurantMenu(food){
    const imgElement = document.createElement('img')
    imgElement.src = food.image

    imgElement.addEventListener('mouseover', () => {
        displayFoodDetails(food)
    })

    //You're adding this event listener here because this is where the images are being rendered in the webpage
    imgElement.addEventListener('click', () => {
        //You're using string interpolation to specify the specific element that you want to remove.
        fetch(`http://localhost:3000/foods/${currentlyDisplayedFood.id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if(response.ok) {
                //You use the filter method to filter out the object that you want to remove. You use the not operator to pick the id of the items that you want to keep in the original array so if the id does not match the currentlyDisplayedFood id it stays in the array, else if it does match then it gets removed from the array.

                foodsArray = foodsArray.filter(food => {
                    if(food.id !== currentlyDisplayedFood.id) {
                        return true
                    } else {
                        return false
                    }
                })

                updateFoodsToRestaurantMenu()

            } else{
                alert('Cannot remove this food now, try again later.')
            }
        })
        .catch(error => {
            console.log(error)
        })
        
    })

    restaurantMenu.appendChild(imgElement)
}

function displayFoodDetails(food){
    currentlyDisplayedFood = food
    const foodDetailImageElement = document.getElementsByClassName('detail-image')[0]
    foodDetailImageElement.src = food.image
    const foodNameElement = document.getElementsByClassName('name')[0]
    foodNameElement.textContent = food.name
    const foodDescriptionDisplayElement = document.getElementById('description-display')
    foodDescriptionDisplayElement.textContent = food.description
    const numberInCartCountElement = document.getElementById('number-in-cart-count')
    numberInCartCountElement.textContent = food.number_in_cart
}

const newFoodForm = document.getElementById('new-food')
newFoodForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const newNameInputElement = document.getElementById('new-name')
    const newImageInputElement = document.getElementById('new-image')
    const newDescriptionInputElement = document.getElementById('new-description')

    const newFood = {
        name: newNameInputElement.value,
        image: newImageInputElement.value,
        description: newDescriptionInputElement.value
    }

    fetch('http://localhost:3000/foods', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        ///The spread operator is being used here to make a compy of the original array so it retains all the original keys in it and we pass the 2nd argument to specify what key we want to modify and set a default value to it. Since we're wanting to start fresh with a new cart we assign it the value of 0.
        body: JSON.stringify({...newFood, number_in_cart: 0})
    })
    .then(response => {
        if(response.ok){
            response.json().then(newFoodData => {
                // addFoodImageToRestaurantMenu(newFoodData)
                foodsArray.push(newFoodData)
                updateFoodsToRestaurantMenu()
            })
        }
        else{
            alert("Error: Unable to add new food!")
        }
    })

    newFoodForm.reset()
})

const addToCartForm = document.getElementById('add-to-cart-form')
addToCartForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const numberToAddInputElement = document.getElementById('number-to-add')
    const numberInCartCountElement = document.getElementById('number-in-cart-count')
    const sum = Number(numberInCartCountElement.textContent) + Number(numberToAddInputElement.value)
    
    // console.log(currentlyDisplayedFood) This is to confirm that the variable that you're passing through the fetch request is the correct object that you want to modify
    // console.log(foodsArray)

    

    fetch(`http://localhost:3000/foods/${currentlyDisplayedFood.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            number_in_cart: sum
        })
    })
    .then(response => {
        if(response.ok) {
            response.json().then(updatedFoods => {
                numberInCartCountElement.textContent = sum
                //This example of the code is if we were not using the .then() method after the fetch
            //You're using the spread operator to make a copy of the original array and passing in the key that you want to update as the second parameter. 
        // foodsArray = foodsArray.map(food => {
        //     if(food.id === currentlyDisplayedFood.id) {
        //         return {...food, number_in_cart: sum}
        //     } else {
        //         return food
        //     }
    
        //This is the better practice where youre making sure that the response is ok before doing the patch. This way you're not having to use the spread operator to make a copy of the original array.
        foodsArray = foodsArray.map(food => {
            if(food.id === updatedFoods.id) {
                return updatedFoods
            } else {
                return food
            }
            })
        })
        updateFoodsToRestaurantMenu()
        
        }
    })

    addToCartForm.reset()
})

function updateFoodsToRestaurantMenu() {
    restaurantMenu.innerHTML = ''
    
        //You're doing this to update the new information on the page. So you're able to immidiately see the changes on the page without delay.
        foodsArray.forEach(food => {
            addFoodImageToRestaurantMenu(food)
        })
}