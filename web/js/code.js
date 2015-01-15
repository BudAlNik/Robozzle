var WIDTH = 900;
var HEIGHT = 800;
var canvas = {};
var context = {};
var cell_width = 64;
var field = new Array();//[WIDTH / cell_width][HEIGHT / cell_height]; //-1 -- empty, 0 -- red, 1 -- green, 2 -- blue
var random_rotate = new Array();
var apple_random_rotate = new Array();
var number_of_level = 1;
var global_pos_of_hedgehog = [-1, -1];
var global_direction_of_hedgehog = -1;
var apples = new Array();//[WIDTH / cell_width][HEIGHT / cell_height];
var num_of_apples = 0;
var cell_image = [new Image(), new Image(), new Image()];
var textures_type = "cactus";
var hedgehog_image = new Image();
var apple_image = new Image();
var PI = 3.141592653589793;
var delta_x = 0;
var delta_y = 90;
var num_of_functions = 0;
var length_of_functions = new Array();
var dx = [-1, 0, 1, 0];
var dy = [0, 1, 0, -1];
var used = new Array();
var now_pos = [-1, -1];
var now_dir = -1;
var fps = 60;
var drawing;
var now_running = 0;
var now_coord = [0, 0];
var now_ang = 0;
var num_of_given_apples = 0;
var stack_of_functions = new Array();
var num_frames_trans = 0;
var max_frames_trans = 30;
var without_pause = 0;
var can_continue = 0;
var paused = 0;
var alerting;
var running;
var last_action;
var icons_action = ["icon-remove-sign", "icon-circle-arrow-left", "icon-circle-arrow-up", "icon-circle-arrow-right", "icon-square"];
var colors_button = ["default", "danger", "success", "primary"];
var gray = "#8B8B8B";
var dark_gray = "#5B5B5B";
var white = "#FFFFFF";
var purple = "#510051";
var setted_speed = 40;

function mousemove(e) {
    //x = Math.min(Math.max(e.pageX - canvas.offsetLeft, RME), WIDTH - RME);
    //y = Math.max(RME, Math.min(e.pageY - canvas.offsetTop, HEIGHT - RME));
}

function mouseclick(e){
    
}

function rebuild_field(data) {
    /*
    for (i = 0; data["top_nicks"][i]; ++i) {
        console.log(i);
        var tr = document.createElement('tr');
        table.appendChild(tr);
        var td = document.createElement('td');        
        td.appendChild(document.createTextNode(decodeURI(data["top_nicks"][i])));
        tr.appendChild(td);
        console.log(decodeURI(data["top_nicks"][i]));
        var td = document.createElement('td');        
        td.appendChild(document.createTextNode(data["top_scores"][i]));
        tr.appendChild(td);
        console.log(data["top_scores"][i]);
    }
    */
    
    length_of_functions = new Array();
    for (num_of_functions = 0; data["funcs"][num_of_functions]; ++num_of_functions) {
        length_of_functions[num_of_functions] = data["funcs"][num_of_functions];
    }
    
    
    global_direction_of_hedgehog = data["hedgehog"]["dir"];
    global_pos_of_hedgehog = data["hedgehog"]["pos"];
    //console.log(global_pos_of_hedgehog);
    now_pos[0] = global_pos_of_hedgehog[0];
    now_pos[1] = global_pos_of_hedgehog[1];
    now_dir = global_direction_of_hedgehog;
    calc_real_position();
    for (i = 0; i < WIDTH / cell_width; ++i) {
        for (j = 0; j < HEIGHT / cell_width; ++j) {
            field[i][j] = -1;
            apples[i][j] = 0;
        }
    }
    max_x = 0;
    max_y = 0;
    for (i = 0; i < data["cells"]["red"].length; ++i) {
        field[data["cells"]["red"][i][0]][data["cells"]["red"][i][1]] = 0;
        max_x = Math.max(max_x, data["cells"]["red"][i][1]);
        max_y = Math.max(max_y, data["cells"]["red"][i][0]);
    }
    for (i = 0; i < data["cells"]["green"].length; ++i) {
        field[data["cells"]["green"][i][0]][data["cells"]["green"][i][1]] = 1;
        max_x = Math.max(max_x, data["cells"]["green"][i][1]);
        max_y = Math.max(max_y, data["cells"]["green"][i][0]);
    }
    for (i = 0; i < data["cells"]["blue"].length; ++i) {
        field[data["cells"]["blue"][i][0]][data["cells"]["blue"][i][1]] = 2;
        max_x = Math.max(max_x, data["cells"]["blue"][i][1]);
        max_y = Math.max(max_y, data["cells"]["blue"][i][0]);
    }
    num_of_apples = 0;
    for (i = 0; i < data["apples"].length; ++i) {
        apples[data["apples"][i][0]][data["apples"][i][1]] = 1;
        ++num_of_apples;
    }    
    tmp_width = (max_x + 1) * cell_width + delta_y * 2;    
    canvas.setAttribute("width", tmp_width.toString() + "px");

    delta_x = (tmp_width - (max_x + 1) * cell_width) / 2;
    canvas.setAttribute("height", delta_y * 2 + cell_width * (max_y + 1));

    
    document.getElementById("controls").innerHTML = "";
    controls = document.getElementById("controls");
    for (i = 0; i < num_of_functions; ++i) {
        new_tmp_row = document.createElement("div");
        
        controls.appendChild(new_tmp_row);      
        //<span class="icon-remove-sign" style="font-size: 40px; color: rgb(139, 139, 139); vertical-align: middle; height = 100%"></span>

        function_icon = document.createElement("span");

        new_tmp_row.appendChild(function_icon);
        function_icon.classList.add(icons_action[4] + (i + 1).toString());
        $(function_icon).css("font-size", "60px");
        $(function_icon).css("color", dark_gray);
        $(function_icon).css("vertical-align", "middle");
        $(function_icon).css("height", "100%");
        //function_icon.innerText = " ";
        
        new_row = document.createElement("div");
        
        new_tmp_row.appendChild(new_row);
        new_row.classList.add("btn-group");
        $(new_row).css("padding-left", "15px");
        
        for (j = 0; j < length_of_functions[i]; ++j) {
            new_dropdown = document.createElement("div");
            
            new_row.appendChild(new_dropdown);
            new_dropdown.classList.add("btn-group");
            new_dropdown.setAttribute("id", "drp." + i.toString() + "." + j.toString());

            new_button = document.createElement("button");
            
            new_dropdown.appendChild(new_button);
            new_button.setAttribute("type", "button");
            new_button.setAttribute("id", "btn." + i.toString() + "." + j.toString());
            new_button.classList.add("btn");// = "btn btn-danger btn-xs";            
            new_button.classList.add("btn-xs");
            new_button.classList.add("dropdown-toggle");
            new_button.classList.add("btn-" + colors_button[0]);            
            new_button.setAttribute("data-toggle", "dropdown");
            new_button.setAttribute("type_action", "-1.-1");
            
            new_char = document.createElement("span");
            
            new_button.appendChild(new_char);                        
            $(new_char).css("font-size", "40px");
            $(new_char).css("color", gray);
            new_char.classList.add(icons_action[0]);
            console.log(new_char);
            console.log(new_button);            
            
            //<ul class="dropdown-menu" role="menu" style = "width: 250px">
            new_menu = document.createElement("ul");

            new_dropdown.appendChild(new_menu);
            new_menu.classList.add("dropdown-menu");
            new_menu.setAttribute("role", "menu");
            $(new_menu).css("width", (42 * (4 + num_of_functions) + 20).toString() + "px");
            
            new_menu_row = document.createElement("li");
                //<li align = "center">

            new_menu.appendChild(new_menu_row);
            new_menu_row.setAttribute("align", "right");

            
            new_action_button = document.createElement("button");
                    //<button type="button" id = "btn000" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown">

            new_menu_row.appendChild(new_action_button);
            new_action_button.setAttribute("type", "button");
            new_action_button.classList.add("btn");
            new_action_button.classList.add("btn-default");
            new_action_button.classList.add("btn-xs");
            new_menu_row.setAttribute("align", "center");

            second_new_char = document.createElement("span");

            new_action_button.appendChild(second_new_char);
            $(second_new_char).css("font-size", "30px");
            $(second_new_char).css("color", gray);
            //$(second_new_char).css("margin-right", "5%");

            second_new_char.classList.add(icons_action[0]);
            //second_new_char.setAttribute("onmouseover", "$(this).css('color', dark_gray)");
            //second_new_char.setAttribute("onmouseout", "$(this).css('color', gray)");
            new_action_button.setAttribute("type_action", "-1.-1");
            new_action_button.setAttribute("onclick", "set_action(this); update_output()");

            //align = "right" style = "margin-right: 5%; margin-top: -46px; margin-bottom: -16px"

            for (k = 0; k < 4; ++k) {
                new_menu_row = document.createElement("li");
                //<li align = "center">

                new_menu.appendChild(new_menu_row);
                new_menu_row.setAttribute("align", "center");
                
                new_btngrp = document.createElement("div");

                new_menu_row.appendChild(new_btngrp);
                new_btngrp.classList.add("btn-group");

                for (k2 = 1; k2 < 4; ++k2) {
                    new_action_button = document.createElement("button");
                    //<button type="button" id = "btn000" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown">

                    new_btngrp.appendChild(new_action_button);
                    new_action_button.setAttribute("type", "button");
                    new_action_button.classList.add("btn");
                    new_action_button.classList.add("btn-" + colors_button[k]);
                    new_action_button.classList.add("btn-xs");
                    new_action_button.setAttribute("type_action", (k - 1).toString() + "." + (k2 - 1).toString());
                    new_action_button.setAttribute("onclick", "set_action(this); update_output()");

                    second_new_char = document.createElement("span");

                    new_action_button.appendChild(second_new_char);
                    $(second_new_char).css("font-size", "30px");
                    if (k == 0) {
                        $(second_new_char).css("color", gray);
                    }
                    second_new_char.classList.add(icons_action[k2]);
                }
                for (k2 = 0; k2 < num_of_functions; ++k2) {
                    new_action_button = document.createElement("button");
                    //<button type="button" id = "btn000" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown">

                    new_btngrp.appendChild(new_action_button);
                    new_action_button.setAttribute("type", "button");
                    new_action_button.classList.add("btn");
                    new_action_button.classList.add("btn-" + colors_button[k]);
                    new_action_button.classList.add("btn-xs");
                    new_action_button.setAttribute("type_action", (k - 1).toString() + "." + (k2 + 3).toString());
                    new_action_button.setAttribute("onclick", "set_action(this); update_output()");

                    second_new_char = document.createElement("span");

                    new_action_button.appendChild(second_new_char);
                    $(second_new_char).css("font-size", "30px");
                    if (k == 0) {
                        $(second_new_char).css("color", gray);
                    }
                    second_new_char.classList.add(icons_action[4] + (k2 + 1).toString());
                }
            } 
        }
        if (i < num_of_functions - 1) {
            //controls.appendChild(document.createElement("br"));
            controls.appendChild(document.createElement("br"));
        }        
    }
    $(document.getElementById("main")).css("width", $(document.getElementById("left")).width() + $(document.getElementById("right")).width() + 15);         
    $(document.getElementById("output")).css("width", $(document.getElementById("right")).width() - "40");         
    update_output();
}

function update_alerts() {
    als = document.getElementById("alerts");
    while (als.childElementCount > 4) {
        als.firstChild.nextSibling.remove();
    }
    now = als.firstChild.nextSibling;
    //console.log(now);
    if (als.childElementCount > 1) {
        now.remove();
    } else if (als.childElementCount == 1) {
        if (now.getAttribute("som") == "true") {
            now.remove();
        } else {
            now.setAttribute("som", "true");
        }
    }
}

function add_alert(type, text) {
    //<div class="alert alert-success" role="alert">...</div>
    al = document.createElement("div");

    document.getElementById("alerts").appendChild(al);    
    //al.innerHTML = '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
    al.classList.add("alert");
    al.classList.add("alert-" + type);
    al.classList.add("alert-dismissible");
    al.setAttribute("role", "alert");
    //al.innerText = text;
    
    al.setAttribute("som", "false");
    al.setAttribute("align", "center");
    
    close = document.createElement("button");
    
    al.appendChild(close);
    close.setAttribute("type", "button");
    close.setAttribute("data-dismiss", "alert");
    close.classList.add("close");
    close.innerHTML = '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>';
    tmp = document.createElement("div");
    
    al.appendChild(tmp);
    console.log(text);
    tmp.innerHTML = text;    
}

function set_action(obj) {
    console.log(obj.getAttribute("type_action"));
    dropdown = obj;
    while (dropdown.getAttribute("id") == null) {
        dropdown = dropdown.parentNode;        
    }
    id = dropdown.getAttribute("id").split(".");
    id = "btn." + id[1] + "." + id[2];
    button = document.getElementById(id);
    
    action = obj.getAttribute("type_action").split(".");

    button.setAttribute("type_action", action[0] + "." + action[1]);

    color = parseInt(action[0]) + 1;
    button.classList.remove(button.classList[3]);
    button.classList.add("btn-" + colors_button[color]);
    if (color != 0) {
        $(button.firstChild).css("color", white);
        console.log("white");
    } else {
        $(button.firstChild).css("color", gray);
    }
    
    act = parseInt(action[1]) + 1;
    button.firstChild.classList.remove(button.firstChild.classList[0]);
    if (act < 4) {        
        button.firstChild.classList.add(icons_action[act]);
    } else {
        button.firstChild.classList.add(icons_action[4] + (act - 3).toString());
    }

    console.log(button);
}


function get_field(num_of_lvl) {
    if (typeof(num_of_lvl) == "number") {
        number_of_level = num_of_lvl;    
    }
    stop();
    $.get("/cgi-bin/robozzle/listener.py?" + number_of_level.toString(), function(data) {        
        console.log(data.toString());
        rebuild_field(data);        
    });    
}

function clear_navbar() {
    tab = document.getElementById("navbar").firstChild.nextSibling;
    console.log(tab);
    while (tab != null) {
        console.log(tab);
        tab.classList.remove("active");
        tab = tab.nextSibling;
    }
}

function create_navbar() {
    $.get("/cgi-bin/robozzle/listener.py?levels", function(data) {        
        navbar = document.getElementById("navbar");
        for (i = 0; i < data.length; ++i) {
            console.log(data[i]);
            
            // <li class="active"><a href="#">Home</a></li>
            new_tab = document.createElement("li");

            navbar.appendChild(new_tab);                        
            new_tab.setAttribute("onclick", "get_field(" + data[i] + ");clear_navbar();this.classList.add('active')");

            new_a = document.createElement("a");

            new_tab.appendChild(new_a);
            new_a.innerHTML = "<h3>" + data[i] + "</h3>";
            if (i == 0) {
                new_tab.classList.add("active");
            }
        }
    });
}

function calc_real_position() {
    now_coord = [now_pos[0] * cell_width, now_pos[1] * cell_width];
    now_ang = now_dir * 90;    
}

function stop() {
    stack_of_functions = new Array();
    console.log("stop");
    clearTimeout(running);
    now_pos[0] = global_pos_of_hedgehog[0];
    now_pos[1] = global_pos_of_hedgehog[1];
    now_dir = global_direction_of_hedgehog;
    calc_real_position();
    for (i = 0; i < WIDTH / cell_width; ++i) {
        for (j = 0; j < HEIGHT / cell_width; ++j) {
            used[i][j] = 0;
        }
    }
    num_of_given_apples = 0;
    paused = 0;
    can_continue = 0;
    now_running = 0;
    unblock_controls();
    for (i = 0; i < num_of_functions; ++i) {        
        for (j = 0; j < length_of_functions[i]; ++j) {
            now_button = document.getElementById("btn." + i.toString() + "." + j.toString());
            $(now_button.firstChild).css("color", white);
            if (now_button.getAttribute("type_action").split(".")[0] == "-1") {
                $(now_button.firstChild).css("color", gray);
            }   
        }
    }
    document.getElementById("next_step").disabled = false;
    document.getElementById("start").disabled = false;
    document.getElementById("pause").disabled = true;
    document.getElementById("stop").disabled = true;
}

function pause() {
    console.log("pause");
    clearTimeout(running);
    //calc_real_position();
    paused = 1;    
    now_running = 0;    
    document.getElementById("next_step").disabled = !can_continue;
    document.getElementById("start").disabled = !can_continue;
    document.getElementById("pause").disabled = true;
    document.getElementById("stop").disabled = false;
}

function run() {
    //console.log("run", num_frames_trans);
    if (num_frames_trans >= max_frames_trans) {        
        num_frames_trans = 0;
        max_frames_trans = setted_speed;
        now_fc = stack_of_functions.pop();
        now_button = document.getElementById("btn." + now_fc[0].toString() + "." + now_fc[1].toString());
        $(now_button.firstChild).css("color", white);
        if (now_button.getAttribute("type_action").split(".")[0] == "-1") {
            $(now_button.firstChild).css("color", gray);
        }
        last_action = now_fc;
        action = parseInt(functions[now_fc[0]][now_fc[1]][0]);
        console.log("next_step", now_fc);                    
        console.log("now_dir", now_dir);
        console.log("action", action);
        if (length_of_functions[now_fc[0]] > now_fc[1] + 1) {
            stack_of_functions.push([now_fc[0], now_fc[1] + 1]);
        }
        if (functions[now_fc[0]][now_fc[1]][1] == field[now_pos[0]][now_pos[1]] || functions[now_fc[0]][now_fc[1]][1] == -1) {
            console.log("there");
            if (action == 1) {
                now_pos[0] += dx[now_dir];
                now_pos[1] += dy[now_dir];
                console.log(now_pos, global_pos_of_hedgehog);
                //num_frames_trans = 0;
            } else if (0 <= action && action <= 2) {
                console.log("now_dir12341354", now_dir, action, (now_dir + action + 3) % 4, typeof(action), typeof(now_dir));
                now_dir = (now_dir + action + 3) % 4;
                console.log("now_dir", now_dir);
            } else {
                if (0 <= action - 3 && action - 3 < num_of_functions) {
                    console.log("Level down");
                    stack_of_functions.push([action - 3, 0]);
                    //num_frames_trans = max_frames_trans * 2 / 3;
                } else{
                    //num_frames_trans = max_frames_trans;
                }
            }
        } else {
            //num_frames_trans = max_frames_trans * 5 / 6;
        }        
        
        console.log("pos", now_pos, "dir", now_dir);

        if (now_pos[0] < 0 || now_pos[0] >= HEIGHT / cell_width || now_pos[1] < 0 || now_pos[1] >= WIDTH / cell_width || field[now_pos[0]][now_pos[1]] == -1) {
            console.log("Out");
            //alert("Вы вышли за пределы игрового поля");
            add_alert("danger", "Вы вышли за пределы игрового поля");
            can_continue = 0;
            pause();
            return;
        }
        
        if (apples[now_pos[0]][now_pos[1]] && !used[now_pos[0]][now_pos[1]]) {
            ++num_of_given_apples;
        }
        used[now_pos[0]][now_pos[1]] = 1;
        calc_real_position();
        
        
        if (num_of_given_apples == num_of_apples) {
            //alert("Вы всё собрали");
            add_alert("success", "Вы всё собрали!");
            can_continue = 0;
            pause();
            return;
        }        
        if (stack_of_functions.length == 0) {
            //alert("Алгоритм завершил исполнение");
            add_alert("info", "Алгоритм завершил исполнение");
            can_continue = 0;
            pause();
            return;
        }
        next_fc = stack_of_functions.pop();

        next_button = document.getElementById("btn." + next_fc[0].toString() + "." + next_fc[1].toString());
        $(next_button.firstChild).css("color", purple);
        //console.log(next_button.firstChild);

        console.log(next_fc, now_pos);
        stack_of_functions.push(next_fc);
        action = functions[next_fc[0]][next_fc[1]][0];
        if (functions[next_fc[0]][next_fc[1]][1] == field[now_pos[0]][now_pos[1]] || functions[next_fc[0]][next_fc[1]][1] == -1) {
            //console.log("there");            
            if (0 <= action - 3 && action - 3 < num_of_functions) {
                //console.log("Level down");
                //stack_of_functions.push([action - 3, 0]);
                num_frames_trans = max_frames_trans * 4 / 5;
            } else if (action < 0 || action > 2) {
                num_frames_trans = max_frames_trans * 5 / 6;
            }            
        } else {
            num_frames_trans = max_frames_trans * 5 / 6;
        }
        if (num_frames_trans != 0 && without_pause) {
            num_frames_trans = max_frames_trans;
        }
        num_frames_trans = Math.floor(num_frames_trans);
        console.log(num_frames_trans);
    } else {
        now_fc = stack_of_functions.pop();//last_action;
        stack_of_functions.push(now_fc);
        num_frames_trans++;
        action = functions[now_fc[0]][now_fc[1]][0];
        if (functions[now_fc[0]][now_fc[1]][1] == field[now_pos[0]][now_pos[1]] || functions[now_fc[0]][now_fc[1]][1] == -1) {
            //console.log("norm", now_fc, functions[now_fc[0]][now_fc[1]][1], field[now_pos[0]][now_pos[1]], action);
            if (action == 1) {
                now_coord[0] += dx[now_dir] * cell_width / max_frames_trans;
                now_coord[1] += dy[now_dir] * cell_width / max_frames_trans;                
                //num_frames_trans = 0;
            } else if (0 <= action && action <= 2) {
                now_ang += (action - 1) * 90 / max_frames_trans;                
            }
        }        
    }    
}

function block_controls() {
    for (i = 0; i < num_of_functions; ++i) {        
        for (j = 0; j < length_of_functions[i]; ++j) {
            document.getElementById("btn." + i.toString() + "." + j.toString()).disabled = true;            
        }
    }
}

function unblock_controls() {
    for (i = 0; i < num_of_functions; ++i) {        
        for (j = 0; j < length_of_functions[i]; ++j) {
            document.getElementById("btn." + i.toString() + "." + j.toString()).disabled = false;            
        }
    }
}

function update_output() {
    text = number_of_level.toString() + " ";

    for (i = 0; i < num_of_functions; ++i) {        
        colors = ""
        commands = ""
        for (j = 0; j < length_of_functions[i]; ++j) {
            type_action = document.getElementById("btn." + i.toString() + "." + j.toString()).getAttribute("type_action").split(".");
            if (type_action[0] == "-1") {
                colors += "#";
            } else if (type_action[0] == "0") {
                colors += "r";
            } else if (type_action[0] == "1") {
                colors += "g";
            } else if (type_action[0] == "2") {
                colors += "b";
            }
            if (type_action[1] == "-1") {
                commands += "n";   
            } else if (type_action[1] == "0") {
                commands += "l";   
            } else if (type_action[1] == "1") {
                commands += "s";   
            } else if (type_action[1] == "2") {
                commands += "r";   
            } else if (parseInt(type_action[1]) - 3 < num_of_functions) {
                commands += (parseInt(type_action[1]) - 3).toString();   
            }            
        }
        text += ":" + colors + "," + commands;        
    }

    answer = document.getElementById("output");                
    
    answer.setAttribute("value", text);
}

function start_run(without_animation) {
    if (now_running) {
        return;
    }
    if (paused && !can_continue) {
        stop();
    }
    if (!paused) {
        block_controls();
        functions = new Array();
                
        for (i = 0; i < num_of_functions; ++i) {
            functions[i] = new Array();
            for (j = 0; j < length_of_functions[i]; ++j) {
                type_action = document.getElementById("btn." + i.toString() + "." + j.toString()).getAttribute("type_action").split(".");                
                functions[i].push([type_action[1], type_action[0]]);
            }            
        }
        update_output();
    }
    console.log(functions);
    //used = new Array();
    /*
    for (i = 0; i < WIDTH / cell_width; ++i) {
        //used[i] = new Array();        
        for (j = 0; j < HEIGHT / cell_width; ++j) {
            used[i][j] = 0;
        }
    }
    */
    
    //num_of_given_apples = 0;
    //calc_real_position();
    if (!paused) {
        stack_of_functions = new Array();
        stack_of_functions.push([0, 0]);
        num_frames_trans = 0;
        max_frames_trans = setted_speed;
        if (without_animation) {
            num_frames_trans = max_frames_trans;
        }
        last_action = [0, 0];
        next_button = document.getElementById("btn.0.0");
        $(next_button.firstChild).css("color", purple);        
    }
    paused = 0;
    
    document.getElementById("next_step").disabled = false;
    document.getElementById("start").disabled = true;
    if (without_animation) {
        document.getElementById("start").disabled = false;
    }
    document.getElementById("pause").disabled = false;
    if (without_animation) {
        document.getElementById("pause").disabled = true;
    }
    document.getElementById("stop").disabled = false;
    if (without_animation) {
        now_running = 0;
        paused = 1;
        can_continue = 1;
    } else {
        now_running = 1;
    }
    if (without_animation) {
        run();
    } else {
        running = setInterval("run()", 1000 / 30);
    }
}

function load_textures() {
    cell_image[0].src = "images/textures/" + textures_type + "/red_cell.png";
    cell_image[1].src = "images/textures/" + textures_type + "/green_cell.png";
    cell_image[2].src = "images/textures/" + textures_type + "/blue_cell.png";
    hedgehog_image.src = "images/textures/" + textures_type + "/hedgehog.png";
    apple_image.src = "images/textures/" + textures_type + "/apple.png";
    //apple_image.context.rotate(90);    
}

function rotated_draw_image(image, x, y, angle) {
    cnt = context;
    x += delta_x;
    y += delta_y;
    angle = angle / 180 * PI;
    cnt.save();
    cnt.translate(x + image.width / 2, y + image.height / 2);
    cnt.rotate(angle);
    cnt.drawImage(image, -image.width / 2, -image.height / 2);
    //cnt.translate(-(x + image.width / 2), -(x + image.height / 2));
    //cnt.drawImage(image, x, y);
    cnt.restore();
}

function draw() {
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, WIDTH, HEIGHT);    
    //console.log("New frame");
    for (i = 0; i < WIDTH / cell_width; ++i) {
        for (j = 0; j < HEIGHT / cell_width; ++j) {
            //console.log(i, j, field[i][j]);
            if (field[i][j] != -1) {
                rotated_draw_image(cell_image[field[i][j]], j * cell_width, i * cell_width, random_rotate[i][j] * 90);
                //context.drawImage(cell_image[field[i][j]], j * cell_width, i * cell_width);
            }
            if (apples[i][j] && !used[i][j]) {
                rotated_draw_image(apple_image, j * cell_width, i * cell_width, 0);
                //context.drawImage(apple_image, j * cell_width, i * cell_width);
            }
        }
    }
    rotated_draw_image(hedgehog_image, now_coord[1] + cell_width / 2 - hedgehog_image.width / 2, now_coord[0] + cell_width / 2 - hedgehog_image.width / 2, now_ang);    
}

function main() {
    drawing = setInterval("draw()", 1000 / fps);
    alerting = setInterval("update_alerts()", 4000);
}

function start() {
    //imagecookie.src = "images/cookie.png";
    //maxscore = get_cookie("pacman");
    html = document.getElementById("html");
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    
    html.addEventListener("mousedown", mouseclick, false);    
    html.addEventListener("mousemove", mousemove, false); 
    
    //speed_slider = $(document.getElementById("slider")).slider().data("slider");  

    create_navbar();
    for (i = 0; i < WIDTH / cell_width; ++i) {
        field[i] = new Array();
        apples[i] = new Array();
        used[i] = new Array();
        random_rotate[i] = new Array();
        apple_random_rotate[i] = new Array();
        for (j = 0; j < HEIGHT / cell_width; ++j) {
            field[i][j] = -1;
            apples[i][j] = 0;
            used[i][j] = 0;           
            random_rotate[i][j] = Math.floor(Math.random() * 4);
            apple_random_rotate[i][j] = Math.floor(Math.random() * 360);
        }
    }    
    //$(document.getElementById("sl")).css("width", "200px");
    //$(document.getElementById("sl")).css("margin-right", "5px");
    load_textures();
    get_field();    
    main();
}