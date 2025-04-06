function createProgressSection(progress) {
    let progressImage = document.createElement('img');
    progressImage.src = progress.image;

    let progressWeight = document.createElement('span');
    progressWeight.textContent = progress.weight;

    let progressIcon = document.createElement('div');
    progressIcon.classList.add('item', 'progress-item');
    progressIcon.appendChild(progressImage);
    progressIcon.appendChild(progressWeight);

    let progressSection = document.createElement('div');
    progressSection.classList.add('progress-section');
    progressSection.appendChild(progressIcon);

    return progressSection;
}

function createMealItems(meals) {
    let mealItems = meals.map(meal => {
        let mealimage = document.createElement('img');
        mealimage.src = meal.image;

        let mealTime = document.createElement('span');
        mealTime.textContent = meal.time;

        let mealItem = document.createElement('div');
        mealItem.classList.add('item', 'meal-item');
        mealItem.appendChild(mealimage);
        mealItem.appendChild(mealTime);

        return mealItem;
    });

    return mealItems;
}

function createFoodSection(food) {
    let foodSection = document.createElement('div');
    foodSection.classList.add('food-section');

    let mealItems = createMealItems(food);
    for (let mealItem of mealItems) {
        foodSection.appendChild(mealItem);
    }

    return foodSection;
}

function createContentSection(day) {
    let contentSection = document.createElement('div');
    contentSection.classList.add('content-section');

    // let progressSection = createProgressSection(day.progress);
    // contentSection.appendChild(progressSection);

    let foodSection = createFoodSection(day.food);
    contentSection.appendChild(foodSection);

    return contentSection;
}

function createDaySection(day) {   
    let date = document.createElement('div');
    date.classList.add('date');
    date.textContent = day.date;
    
    let contentSection = createContentSection(day);
    
    let daySection = document.createElement('div');
    daySection.classList.add('day-section');
    daySection.appendChild(date);
    daySection.appendChild(contentSection);

    return daySection;
}

function populateProgress(data) {
    const container = document.getElementById('progress-container');
    if (!container) {
        console.error('Progress container not found');
        return;
    }

    for (let day of data) {
        let daySection = createDaySection(day);
        container.appendChild(daySection);
    }
}

// Call this function when the page loads
async function loadData() {
    const response = await fetch('./data.json');
    const data = await response.json();
    return data;
}

document.addEventListener('DOMContentLoaded', async () => {
    data = await loadData();
    populateProgress(data);
});
