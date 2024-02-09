const restaurantMenu = document.getElementById('restaurant-menu')

fetch('http://localhost:3000/foods')
.then(response => response.json())
.then(foods => {
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

    imgElement.addEventListener('click', () => {

        imgElement.remove()

        fetch(`http://localhost:3000/foods/${currentlyDisplayedFood.id}`, {
            method: "DELETE"
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
}

//Lecture code
// Here we fetched data from a public API, we got an object instead of an array so we had to use the . DOT notation to get access to the a array stored within the object so we could use array iterator methods to manipulate the data that we wanted. We started with a fetch() request, then we turned the response data into an JS object by using the .json() method on the first .then() method. Afterwards we used a second .then() method to manipulate the data that we retrieved. 

// Since we got an object back instead of an array we had to use the . DOT notation again to gain access to the array. That's why we used the .filter() method on cryptoCurrencyData.data instead of the cryptoCurrencyData.

// We used the .filter() method to filter out the first 10 objects because that was the amount of objects that we wanted to use for our webpage. Inside the filter method we returned Number(cryptoCurrency['rank']) >= 1 && Number(cryptoCurrency['rank']) <= 10. The reason why we used the Number constructor is because when we're comparaing data we should always compare data of the same type instead of leaving it to JS to convert it to whatever data type it wants to convert it to.

// After that we used a .forEach() method to manipulate each object that we got. In this case we wanted to create a list of the crypto currencies and put them up on our webpage with their name, symbol and rank. So we started by creating a li element so we could list them on the webpage. Then we set the content of the li elements with string interpolation since we wanted to pass multiple keys and their values. And finally we appended the liElement child to the cryptoCurrencyListULElement parent node so they would be displayed on the website.

const cryptoCurrencyListULElement = document.getElementById('cryptocurrency-list')

fetch('https://api.coincap.io/v2/assets')
.then(response => response.json())
.then(cryptoCurrencyData => {
    cryptoCurrencyData.data.filter(cryptoCurrency => {
        return Number(cryptoCurrency['rank']) >= 1 && Number(cryptoCurrency['rank']) <= 10
    })
    .forEach( cryptoCurrency => {
        const liElement = document.createElement('li')
        liElement.textContent = `${cryptoCurrency.name} (${cryptoCurrency.symbol}): Rank ${cryptoCurrency.rank}`
        cryptoCurrencyListULElement.appendChild(liElement)
    })
})