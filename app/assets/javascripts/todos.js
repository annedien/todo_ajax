// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
function toggleDone() {
    $(this).parent().parent().toggleClass("success");
    updateCounters();
}

function updateCounters() {
    $("#total-count").html($(".todo").size());
    $("#completed-count").html($(".success").size());
    $("#todo-count").html($(".todo").size() - $(".success").size());
}



function createTodo(title) {
    var newTodo = { title: title, completed: false };

    $.ajax({
        type: "POST",
        url: "/todos.json",
        data: JSON.stringify({
            todo: newTodo
        }),
        contentType: "application/json",
        dataType: "json"
    })
        .done(function(data) {
            console.log(data);

            var checkboxId = data.id;

            var label = $('<label></label>')
                .attr('for', checkboxId)
                .html(title);

            var checkbox = $('<input type="checkbox" value="1" />')
                .attr('id', checkboxId)
                .bind('change', toggleDone);

            var tableRow = $('<tr class="todo"></td>')
                .attr('data-id', checkboxId)
                .append($('<td>').append(checkbox))
                .append($('<td>').append(label));

            $("#todoList").append(tableRow);

            updateCounters();
        })

        .fail(function(error) {
            console.log(error)
            error_message = error.responseJSON.title[0];
            showError(error_message);
        });
}

function submitTodo(event) {
    event.preventDefault();
    resetErrors();
    createTodo($("#todo_title").val());
    $("#todo_title").val(null);
    updateCounters();
}

function cleanUpDoneTodos(event) {
    event.preventDefault();
    $.when($(".success").remove())
        .then(updateCounters);
}

$(document).ready(function() {
    $("input[type=checkbox]").bind('change', toggleDone);
    $("form").bind('submit', submitTodo);
    $("#clean-up").bind('click', cleanUpDoneTodos);
    updateCounters();
});



// AJAX CALL
function createTodo(title) {
    // ...
    updateCounters();

    var newTodo = { title: title, completed: false };

    $.ajax({
        type: "POST",
        url: "/todos.json",
        data: JSON.stringify({
            todo: newTodo
        }),
        contentType: "application/json",
        dataType: "json"})

        .fail(function(error) {
            console.log(error);

            error_message = error.responseJSON.title[0];
            showError(error_message);
        });
}

function showError(message) {
    $("#todo_title").addClass("has-error");

    var errorElement = $("<small></small>")
        .attr('id', 'error_message')
        .addClass('has-error')
        .html(message);

    $(errorElement).appendTo('form .field');
}

function resetErrors() {
    $("#error_message").remove();
    $("#todo_title").removeClass("has-error");
}