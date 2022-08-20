
var todo = todo || {},
    data = JSON.parse(localStorage.getItem("todoData"));

data = data || {};

(function(todo, data, $) {

  var defaults = {
        todoTask: "todo-task",
        todoHeader: "task-header",
        todoTheater: "task-theater",
        todoDate: "task-date",
        todoInfo: "task-info",
        todoPrice: "task-price",
        taskId: "task-",
        formId: "todo-form",
        dataAttribute: "data",
        deleteDiv: "delete-div"
      },
      codes = {
        "1": "#nowshowing",
        "2": "#watched",
        "3": "#missed"
      };

//Create Space
  todo.init = function (options) {
    options = options || {};
    options = $.extend({}, defaults, options);
    $.each(data, function(index, params) {
      generateElement(params);
    });
  //Adding drop function to each category of task
    $.each(codes, function (index, value) {
      $(value).droppable({
        drop: function (event, ui) {
          var element = ui.helper,
              css_id = element.attr("id"),
              id = css_id.replace(options.taskId, ""),
              object = data[id];
        //Removing old element
          removeElement(object);
        //Changing object code
          object.code = index;
        //Generating new element
          generateElement(object);
        //Updating Local Storage
          data[id] = object;
          localStorage.setItem("todoData", JSON.stringify(data));
        //Hiding Delete Area
          $("#" + defaults.deleteDiv).hide();
        }
      });
    });
  //Adding drop function to delete div
    $("#" + options.deleteDiv).droppable({
      drop: function(event, ui) {
        var element = ui.helper,
            css_id = element.attr("id"),
            id = css_id.replace(options.taskId, ""),
            object = data[id];
      //Removing old element
        removeElement(object);
      //Updating local storage
        delete data[id];
        localStorage.setItem("todoData", JSON.stringify(data));
      //Hiding Delete Area
        $("#" + defaults.deleteDiv).hide();
      }
    })
  };

//Create a Task
  function generateElement(params){
    var parent = $(codes[params.code]),
        wrapper;
    wrapper = $("<div />", {
        "class": defaults.todoTask,
        "id": defaults.taskId + params.id,
        "data": params.id
      }).appendTo(parent);
    $("<div />", {"class": defaults.todoHeader, "text": params.title}).appendTo(wrapper);
    $("<div />", {"class": defaults.todoTheater, "text": "Theature: " + params.theater}).appendTo(wrapper);
    $("<div />", {"class": defaults.todoDate, "text": "Date: " + params.date}).appendTo(wrapper);
    $("<div />", {"class": defaults.todoInfo, "text": "Movie Info: " + params.info}).appendTo(wrapper);
    $("<div />", {"class": defaults.todoPrice, "text": "Price: $" + params.price}).appendTo(wrapper);
  //Show-Hide content of Task
    var data = $(wrapper).find("div");
    $(data[0]).click(function() {
      $(data[1]).toggle();
      $(data[2]).toggle();
      $(data[3]).toggle();
      $(data[4]).toggle();
    });
  //Draggable
    wrapper.draggable({
      start: function() {
        $("#" + defaults.deleteDiv).show();
      },
      stop: function() {
        $("#" + defaults.deleteDiv).hide();
      },
      revert: "invalid",
      revertDuration: 200
    });
  };

//Remove task
  var removeElement = function (params) {
    $("#" + defaults.taskId + params.id).remove();
  };

//Add new Task
  todo.add = function() {
    var inputs = $("#" + defaults.formId + " :input"),
        errorMessage = "Title can not be empty",
        id, title, theater, date, info, price, tempData;
    title = inputs[0].value;
    theater = inputs[1].value;
    date = inputs[2].value;
    info = inputs[3].value;
    price = inputs[4].value;
    if (!title) {
      alert(errorMessage);
      return;
    }
    id = new Date().getTime();
    tempData = {
      id: id,
      code: "1",
      title: title,
      theater: theater,
      date: date,
      info: info,
      price: price
    };
  //Saving element in local storage
    data[id] = tempData;
    localStorage.setItem("todoData", JSON.stringify(data));
  //Generate Todo Element
    generateElement(tempData);
  //Reset Form
    inputs[0].value = "";
    inputs[1].value = "";
    inputs[2].value = "";
    inputs[3].value = "";
    inputs[4].value = "";
  };

//Clear All Task
  todo.clear = function () {
    data = {};
    localStorage.setItem("todoData", JSON.stringify(data));
    $("." + defaults.todoTask).remove();
  };
  
})(todo, data, jQuery);
