var editing_task = -1, was_running;

// Begin editing a task's name
function edit_name(task) {
    try {
        if(editing_task === -1) {
            editing_task = task;
            
            // Disable the task's toggle button
            $('#task-'+ task +' button.toggle').attr('disabled', 'disabled');
            $('#task-'+ task +' img.toggle').addClass('disabled');
            
            // Replace the text with a text field and a save button
            $('#task-'+ task +' td.text').empty();
            $('#name-edit-template').clone().attr('id', 'name-edit-'+ task).appendTo('#task-'+ task +' td.text');
            
            // Set the current name and focus
            $('#name-edit-'+ task +' input').val(tasks[task].text).focus();
            
            // Set names & add events
            $('#name-edit-'+ task +' input').attr('name', task).keypress(function (e) {
                if(e.keyCode == 13) save_name(parseInt(this.name));
            });
            $('#name-edit-'+ task +' button.save').attr('name', task).click(function() {
                save_name(parseInt(this.name));
            });
            $('#name-edit-'+ task +' button.cancel').click(function() {
                cancel_edit();
            });
        } else {
            if(task != editing_task) alert(locale('finishEditing', tasks[editing_task].text));
        }
    } catch(e) {
        js_error(e);
    }
}

// Finish editing a task's name
function save_name(task) {
    try {
        if($('#name-edit-'+ task +' input').val() != '') {
            // Set the name
            tasks[task].text = $('#name-edit-'+ task +' input').val();
            
            // Finish editing
            rebuild_list();
            SaveTasks();
            editing_task = -1;
        } else {
            error('invalidName');
        }
    } catch(e) {
        js_error(e);
    }
}

// Begin editing a task's current time
function edit_current(task) {
    try {
        if(editing_task === -1) {
            editing_task = task;
            was_running = task_running[task];
            if(task_running[task]) toggle_task(task);
            
            $('#task-list tbody').addClass('editing-current');
            
            // Disable the task's toggle button
            $('#task-'+ task +' button.toggle').attr('disabled', 'disabled');
            $('#task-'+ task +' img.toggle').attr('src', 'style/images/control_play.png').addClass('disabled');
            
            // Replace the current text with inputs
            $('#task-'+ task +' td.current').empty();
            $('#current-edit-template').clone().attr('id', 'current-edit-'+ task).appendTo('#task-'+ task +' td.current');
            
            // Add events
            $('#current-edit-'+ task +' input').keypress(function (e) {
                if(e.keyCode == 13) save_current(editing_task);
            }).blur(function() {
                if($(this).val() == '' || parseInt($(this).val()) < 0) $(this).val('0');
            });
            $('#current-edit-'+ task +' .mins, #current-edit-'+ task +' .secs').blur(function() {
                if(parseInt($(this).val()) > 59) $(this).val('59');
            });
            
            $('#current-edit-'+ task +' button.save').attr('name', task).click(function() {
                save_current(parseInt(this.name));
            });
            $('#current-edit-'+ task +' button.cancel').click(function() {
                cancel_edit();
            });
            
            // Set the current goal and focus
            $('#current-edit-'+ task +' .hrs').val(tasks[task].current_hours).focus();
            $('#current-edit-'+ task +' .mins').val(tasks[task].current_mins);
            $('#current-edit-'+ task +' .secs').val(tasks[task].current_secs);
        } else {
            if(task != editing_task) alert(locale('finishEditing', tasks[editing_task].text));
        }
    } catch(e) {
        js_error(e);
    }
}

// Finish editing a task's current time
function save_current(task) {
    try {
        // Validate inputs
        if($('#current-edit-'+ task +' .hrs').val() == '' || parseInt($('#current-edit-'+ task +' .hrs').val()) < 0) $('#current-edit-'+ task +' .hrs').val('0');
        if($('#current-edit-'+ task +' .mins').val() == '' || parseInt($('#current-edit-'+ task +' .mins').val()) < 0) $('#current-edit-'+ task +' .mins').val('0');
        if($('#current-edit-'+ task +' .secs').val() == '' || parseInt($('#current-edit-'+ task +' .secs').val()) < 0) $('#current-edit-'+ task +' .secs').val('0');
        if(parseInt($('#current-edit-'+ task +' .mins').val()) > 59) $('#current-edit-'+ task +' .mins').val('59');
        if(parseInt($('#current-edit-'+ task +' .secs').val()) > 59) $('#current-edit-'+ task +' .secs').val('59');
        
        var hours = parseInt($('#current-edit-'+ task +' .hrs').val()), mins = parseInt($('#current-edit-'+ task +' .mins').val()), secs = parseInt($('#current-edit-'+ task +' .secs').val());
            
        // Set the goal
        tasks[task].current_hours = hours;
        tasks[task].current_mins = mins;
        tasks[task].current_secs = secs;
        
        // Reset the task's notified property
        tasks[task].notified = false;
        
        // Finish editing
        rebuild_list();
        SaveTasks();
        editing_task = -1;
        if(was_running) toggle_task(task);
    } catch(e) {
        js_error(e);
    }
}

// Begin editing a task's goal
function edit_goal(task) {
    try {
        if(editing_task === -1) {
            editing_task = task;
            was_running = task_running[task];
            if(task_running[task]) toggle_task(task);
            
            $('#task-list tbody').addClass('editing-goal');
            
            // Disable the task's toggle button
            $('#task-'+ task +' button.toggle').attr('disabled', 'disabled');
            $('#task-'+ task +' img.toggle').attr('src', 'style/images/control_play.png').addClass('disabled');
            
            // Replace the goal text with inputs
            $('#task-'+ task +' td.goal').empty();
            $('#goal-edit-template').clone().attr('id', 'goal-edit-'+ task).appendTo('#task-'+ task +' td.goal');
            
            // Add events
            $('#goal-edit-'+ task +' input').keypress(function (e) {
                if(e.keyCode == 13) save_goal(editing_task);
            }).blur(function() {
                if($(this).val() == '' || parseInt($(this).val()) < 0) $(this).val('0');
            });
            $('#goal-edit-'+ task +' .mins').blur(function() {
                if(parseInt($(this).val()) > 59) $(this).val('59');
            });
            
            $('#goal-edit-'+ task +' .indef').change(function() {
                if($(this).is(':checked')) {
                    $('#goal-edit-'+ editing_task +' .hrs, #goal-edit-'+ editing_task +' .mins').attr('disabled', 'disabled');
                } else {
                    $('#goal-edit-'+ editing_task +' .hrs, #goal-edit-'+ editing_task +' .mins').removeAttr('disabled');
                }
            });
            
            $('#goal-edit-'+ task +' button.save').attr('name', task).click(function() {
                save_goal(parseInt(this.name));
            });
            $('#goal-edit-'+ task +' button.cancel').click(function() {
                cancel_edit();
            });
            
            // Set the current goal and focus
            $('#goal-edit-'+ task +' .hrs').val(tasks[task].goal_hours).focus();
            $('#goal-edit-'+ task +' .mins').val(tasks[task].goal_mins);
            if(tasks[task].indefinite) {
                $('#goal-edit-'+ task +' .indef').attr('checked', 'checked').focus();
                $('#goal-edit-'+ task +' .hrs, #goal-edit-'+ task +' .mins').attr('disabled', 'disabled');
            }
        } else {
            if(task != editing_task) alert(locale('finishEditing', tasks[editing_task].text));
        }
    } catch(e) {
        js_error(e);
    }
}

// Finish editing a task's goal
function save_goal(task) {
    try {
        // Validate inputs
        if($('#goal-edit-'+ task +' .hrs').val() == ''  || parseInt($('#goal-edit-'+ task +' .hrs').val()) < 0) $('#goal-edit-'+ task +' .hrs').val('0');
        if($('#goal-edit-'+ task +' .mins').val() == ''  || parseInt($('#goal-edit-'+ task +' .mins').val()) < 0) $('#goal-edit-'+ task +' .mins').val('0');
        if(parseInt($('#goal-edit-'+ task +' .mins').val()) > 59) $('#goal-edit-'+ task +' .mins').val('59');
            
        var hours = parseInt($('#goal-edit-'+ task +' .hrs').val()), mins = parseInt($('#goal-edit-'+ task +' .mins').val()), indef = $('#goal-edit-'+ task +' .indef').is(':checked');
            
        if(hours > 0 || mins > 0 || indef) {
            // Set the goal
            tasks[task].goal_hours = hours;
            tasks[task].goal_mins = mins;
            tasks[task].indefinite = indef;
            
            // Reset the task's notified property
            tasks[task].notified = false;
            
            // Finish editing
            rebuild_list();
            SaveTasks();
            editing_task = -1;
            if(was_running) toggle_task(task);
        } else {
            error('invalidGoalTime');
        }
    } catch(e) {
        js_error(e);
    }
}

// Cancel editing
function cancel_edit() {
    try {
        editing_task = -1;
        rebuild_list();
    } catch(e) {
        js_error(e);
    }
}