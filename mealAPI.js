/* Creating 4 classes: 

    1] Day: where a user builds out the weeks's meals 
    2] Meal: where a user adds meal times and foods for that meal
    3] DayPlanningService: which sends http AJAX request to the API
    4] DOM Manager: will allow for adding, deleting, and repopulating the DOM 
*/ 

// Class 1
class Day {
    constructor(name) {//parameter name is day of week
    this.name = name; 
    this.meals = []; //array to hold meals
    }


    addMeal(name, food) {
    this.meals.push(new Meal(name, food)); //pushes meals to above array
    }
}


//Class 2
class Meal {
    constructor(name, food) {// mealtime is breakfast, lunch, dinner, etc.; food is what the user will consume at that meal
    this.name = name;
    this.food = food;
    }   
}

//Class 3
class DayPlanningService {
    static url = 'https://62c60707134fa108c261b8a1.mockapi.io/day'; 
    //root url for all the endpoints that call the API

    //methods for DayPlanningService Class
    static getAllDays() { //get all days and retrieve data for those days
        return $.get(this.url); //use the above url to retrieve the data
    }

    static getDay(id) { //has parameter of id because each day will have its own unique id
        return $.get(this.url + `/${id}`); // method for getting a specific day based on the id from the API
    }

    static createDay(day) {//creates an instance of a day and an array
        return $.post(this.url, day) //returns make it possible to reuse the methods and handle the promise coming back
    }

    static updateDay(day) { //updates a specific day
        return $.ajax({
            url: this.url + `/${day._id}`, //when updating a day, grab the id relative to that particular day
            dataType:'json', 
            data: JSON.stringify(day), //setting the payload, taking an object and converting to JSON string before sending to HTTP request
            contentType: 'application/json',
            type: 'PUT' //PUT verb is used for updates
        });
    }    
       
    static deleteDay(id){ //need id for the day to tell API this is the day to delete
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE' //DELETE verb used to delete
        });
    }
}

//Class 4

class DOMManager { //re-reander the DOM each time a user adds aor deletes the days and meals
    static days; //represents all days in the DOMManager  

    static getAllDays() {
        DayPlanningService.getAllDays().then(days =>this.render(days)); /*get all days from the DayPlanningService and render to 
        the DOM*/
    }

    static createDay(name) { /*this function makes it possible to create days with the add button in the render(days) function
    below */
        DayPlanningService.createDay(new Day(name))
        .then(() => { //create hosue then re-render with return below
            return DayPlanningService.getAllDays();
        })
        .then((days) => this.render(days));
    }

   static deleteDay(id) { /*this function makes it possible to delete days with the delete button created in the render(days) 
    function below */
        DayPlanningService.deleteDay(id)
        .then(() => { //delete the hosue then re-render with return below
            return DayPlanningService.getAllDays();
        })
        .then((days) => this.render(days));
    }

    static addMeal(id) { /*this function makes it possible to add mealtimes and foods with the add button created  in the render(days)
    function below*/
        for (let day of this.days) {
            if (day._id == id) {
                day.meals.push(new Meal($(`#${day._id}-meal-name`).val(), $(`#${day._id}-meal-food`).val()));
                DayPlanningService.updateDay(day)
                .then(() => {
                    return DayPlanningService.getAllDays();
                })
                .then((days) => this.render(days));
            }
        }
    }

   static deleteMeal(dayId, mealId) { /*this functions makes it possible to delete rooms with the delete button cereated in the 
    render(days) function below */
    for (let day of this.days) {
        if (day._id == dayId) {
            for (let meal of day.meals) {
                if (meal._id == mealId) {
                    day.meals.splice(day.meals.indexOf(meal), 1);
                    DayPlanningService.updateDay(day)
                    .then(() => {
                        return DayPlanningService.getAllDays();
                    })
                    .then((days) => this.render(days));
                }
            }
        }
    }
}

    static render(days) {
        this.days = days;
        $('#app').empty() /* the '#app' refers to the empty div id created on the HTML page where we build the other meal planning functions
        'empty' means it clears each time the DOM is re-rendered */

        for(let day of days) { /*appending allows each new days to attach to end end of the previous in chronological order; here, I
        add html that will appear in the currently empty div where I am rendering the DOM */      
           $('#app').prepend(
            `<div id="${day._id}" class="card>
                <div class="card-header">
                    <h2>${day.name}</h2>
8                    <button class="btn btn-danger" onclick="DOMManager.deleteDay('${day._id}')">Delete</button>
                </div>               

                <div class="card-body">
                    <div class="card">
                      <div class="row">
                        <div class="col-sm">
                            <input type="text" id="${day._id}-meal-name" class="form-control" placeholder= "breakfast, lunch, dinner, etc.">
                        </div>
                        <div class="col-sm">
                            <input type="text" id="${day._id}-meal-food" class="form-control" placeholder="list all foods for meal"> 
                        </div>
                    </div>
                        <button id="${day._id}-new-meal" onclick="DOMManager.addMeal('${day._id}')" class="btn btn-success form-control">Add Meal</button>
                     </div> 
                </div>
            </div> <br>`
           );   
           for (let meal of day.meals) {//here I am rendering each meal 
                $(`#${day._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${meal._id}"><strong>Meal Time:</strong> ${meal.name}</span>
                    <span id="food-${meal._id}"><strong>Food:</strong> ${meal.food}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteMeal('${day._id}', '${meal._id}')">Delete Meal</button>`
                );
            } //closing tag for second for loop (meal of day.meals)
        } //closing tag for first for loop (day of days)
    } //closing tag for static render(days)
} //closing tag for DOMManager class 
   

$('#create-new-day').click(() => {
    DOMManager.createDay($('#new-day-name').val());
    $('#new-day-name').val('');
});


DOMManager.getAllDays();//this calls on the DOM to render


























       
          
   
 


    


