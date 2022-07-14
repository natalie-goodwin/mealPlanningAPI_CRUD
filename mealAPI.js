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


    addMeal(time, item) {
    this.meals.push(new Meal(time, item)); //pushes meals to above array
    }
}


//Class 2
class Meal {
    constructor(time, item) {// time is breakfast, lunch, dinner, etc.; item is what the user will consume at that meal
    this.time = time;
    this.item = item;
    }   
}

//Class 3
class DayPlanningService {
    static url = "https://62c90f400f32635590df8ece.mockapi.io/days"; 
    //root url for all the endpoints that call the API

    //methods for DayPlanningService Class
    static getAllDays() { //get all days and retrieve data for those days
        return $.get(this.url); //use the above url to retrieve the data
    }

    static getDay(id) { //has parameter of id because each day will have its own unique id
        return $.get(this.url + `/${id}`); // method for getting a specific day based on the id from the API
    }

    static createDay(day) {//creates an instance of a day and an array
        return $.post(this.url, day); //returns make it possible to reuse the methods and handle the promise coming back
    }

    static updateDay(day) { //updates a specific day
        return $.ajax({
            url: this.url + `/${day.id}`, //when updating a day, grab the id relative to that particular day
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
        DayPlanningService.getAllDays().then(days => this.render(days)); /*get all days from the DayPlanningService and render to 
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
            if (day.id == id) {
                day.meals.push(new Meal($(`#${day.id}-meal-time`).val(), $(`#${day.id}-meal-item`).val()));
                DayPlanningService.updateDay(day)
                .then(() => {
                    return DayPlanningService.getAllDays();
                })
                .then((days) => this.render(days));
            }
        }
    }

    static render(days) {
        this.days = days;
        $('#app').empty() /* the '#app' refers to the empty div id created on the HTML page where we build the other meal planning functions
        'empty' means it clears each time the DOM is re-rendered */

        for(let day of days) { /*appending allows each new days to attach to end of the previous in chronological order; here, I
        add html that will appear in the currently empty div where I am rendering the DOM; the green text is the HTML and inside
        are the bootstrap cards and buttons */      
           $('#app').append(
            `<div id="${day.id}" class="card border border-success mb-3">
                <div class="card-header">
                    <h1>${day.name}</h1>
                    <button class="btn btn-danger" onclick="DOMManager.deleteDay('${day.id}')">Delete Meal</button>
                    <h5> Note: clicking delete will delete day and all food for the day</h5>
                </div>               

                <div class="card-body">
                   <div class="card border border-success mb-3">
                    <div class="card">
                      <div class="row">
                        <div class="col-sm-6">
                            <input type="text" id="${day.id}-meal-time" class="form-control" placeholder="Is this breakfast, lunch, dinner, etc.?">
                        </div>
                        <div class="col-sm-6">
                            <input type="text" id="${day.id}-meal-item" class="form-control" placeholder="List all foods for your meal."> 
                        </div>
                    </div>
                        <button id="${day.id}-new-meal" onclick="DOMManager.addMeal('${day.id}')" class="btn btn-success form-control">Add Meal</button>
                        </div>
                     </div> 
                </div>
            </div> <br>`
           );   
           for (let meal of day.meals) {//here I am rendering each meal 
                $(`#${day.id}`).find('.card-body').append(
                    `<p>
                    <span id="time-${meal.id}"><strong>Meal Time:&nbsp; &nbsp;  </strong>${meal.time}</span> <br>
                    <span id="item-${meal.id}"><strong>Food:&nbsp; &nbsp; </strong> ${meal.item}</span>
                    `                
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


























       
          
   
 


    


